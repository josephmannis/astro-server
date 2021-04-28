#!/usr/bin/env node

import cmdr from "commander";
import inquirer from "inquirer";
import WebSocket from 'ws';
import { MissionState, SystemState, TaskState } from "./types";
import { isHelloMessage, isNewSpatialAnchorMessage, isRequestActiveSpatialAnchorsMessage, Message, parseMessage } from "./protocol";
import AstronautMockData from "./data";

class App {
    globalState = {
        comms: {
            voiceIndicators: [
                {
                    astronautName: "Ground",
                    active: true,
                    color: '#76B3EF',
                    activeToggleTime: new Date()
                },
                {
                    astronautName: "Cobb",
                    active: true,
                    color: '#76EF98',
                    activeToggleTime: new Date()
                },
                {
                    astronautName: "Stevens",
                    active: false,
                    color: '#76EF98',
                    activeToggleTime: new Date()
                }
            ]
        },
        missionStartTime: new Date(),
        totalMissionLength: 90*60, // 30 min
    }

    wss: WebSocket.Server

    cli() {
        this.wss = new WebSocket.Server({
            port: 5000
        });

        this.wss.on("connection", this.connection.bind(this))

        this.wss.on("listening", () => {
            cmdr
            .version("1.0.0")
            .action(options => {
                this.mainMenu();
            });

            cmdr.parse(process.argv);
        });
    }

    // connections

    connection(ws: WebSocket) {
        ws["mockData"] = new AstronautMockData();
        const mockData: AstronautMockData = ws["mockData"];

        // console.log("Connected");
        ws.on('message', data => this.onMessage.bind(this)(ws, data));

        // send periodic system updates (every 500ms)
        const sendPeriodicSystemUpdate = async () => {
            // console.log("Sending system update");
            await this.sendMessage(ws, {
                type: "SYSTEM_STATE",
                payload: this.getSystemState(ws)
            });

            setTimeout(() => {
                sendPeriodicSystemUpdate();
            }, 500);
        }

        sendPeriodicSystemUpdate();

        // send periodic task list update (every 3s)
        let taskUpdateCount = 0;
        const sendPeriodicTaskListUpdate = async () => {
            // console.log("Sending task list update");

            const newTasks: Array<TaskState> = [
                {
                    description: `Task from server 1 (${taskUpdateCount})`,
                    time: '00:00',
                    subtasks: ["Subtask 1"]
                },
                {
                    description: `Task from server 2 (${taskUpdateCount})`,
                    time: '00:00',
                    subtasks: []
                },
                {
                    description: `Task from server 3 (${taskUpdateCount})`,
                    time: '00:00',
                    subtasks: []
                }
            ];

            await this.sendMessage(ws, {
                type: "TASK_LIST",
                payload: {
                    tasks: newTasks
                }
            });

            taskUpdateCount++;
            setTimeout(() => {
                sendPeriodicTaskListUpdate();
            }, 3000);
        }

        sendPeriodicTaskListUpdate();

        // send periodic comms updates (every 500ms)
        const sendPeriodicCommsListUpdate = async () => {
            // console.log("Sending comms list update");
        
            await this.sendMessage(ws, {
                type: "COMMS_LIST",
                payload: {
                    voiceIndicators: [...this.globalState.comms.voiceIndicators].sort((a, b) => {
                        if (!a.active && b.active) {
                            return 1;
                          }
                          if (a.active && !b.active) {
                            return -1;
                          }
                          return 0;
                    })
                }
            });

            setTimeout(() => {
                sendPeriodicCommsListUpdate();
            }, 500);
        }
        
        sendPeriodicCommsListUpdate();
    }

    onMessage(ws: WebSocket, data: WebSocket.Data) {
        // console.log('received: %s', data);
        
        // console.log("Data");
        // console.log(data.toString("utf-8"));
        const message = parseMessage(data.toString("utf-8"));
        // console.log(message);
    
        if (message) {
            if (isHelloMessage(message)) {
                this.sendMessage(ws, {
                    type: "HELLO",
                    payload: undefined
                })
            }
    
            if (isNewSpatialAnchorMessage(message)) {
                this.sendMessage(ws, {
                    type: "NEW_SPATIAL_ANCHOR_RECEIVED",
                    payload: {
                        anchorId: message.payload.anchorId
                    }
                })
            }
    
            if (isRequestActiveSpatialAnchorsMessage(message)) {
                this.sendMessage(ws, {
                    type: "ACTIVE_SPATIAL_ANCHORS",
                    payload: {
                        activeAnchorIds: []
                    }
                });
            }
        }
    }

    sendMessage(socket: WebSocket, message: Message) {
        if (socket.readyState === WebSocket.OPEN) {
            return new Promise<void>((resolve, reject) => {
                socket.send(JSON.stringify(message), err => {
                    if (err) reject(err);
                    resolve();
                });
            });
        }
        return Promise.resolve();
    }

    broadcastMessage(message: Message) {
        return Promise.all([...this.wss.clients].map(client => this.sendMessage(client, message)));
    }

    // data

    getSystemState(ws: WebSocket): SystemState {
        const mockData: AstronautMockData = ws["mockData"];

        return {
            lifeSupportState: mockData.getLifeSupportState(),
            navigationState: mockData.getNavigationState(),
            missionState: this.getMissionState()
        };
    }

    getMissionState(): MissionState {
        return {
            totalMissionLength: this.globalState.totalMissionLength,
            missionTimeElapsed: Math.round(((new Date()).getTime() - this.globalState.missionStartTime.getTime())/1000)
        };
    }

    // menus

    async mainMenu(clear?: boolean) {
        this.clearScreen(clear);
        console.log("Main Menu")
        const { mode } = await inquirer.prompt([
            { type: 'list', name: 'mode', message: 'Mode', choices: ['Comms'] }
        ]);
    
        switch (mode) {
            case 'Comms': 
                this.commsMenu();
                break;
            default: this.mainMenu();
        }
    }
    
    async commsMenu(lastIndex: number = 0, clear?: boolean) {
        this.clearScreen(clear);
        console.log("Comms Menu")

        const choices = this.globalState.comms.voiceIndicators.map(indicatorState =>({
            name: `[${indicatorState.active ? 'x' : ' '}] ${indicatorState.astronautName}`,
            value: indicatorState.astronautName,
        }));

        const { toggledVoice } = await inquirer.prompt([
            { type: 'list', name: 'toggledVoice', message: 'Toggle Speaking', default: lastIndex, choices }
        ]) as { toggledVoice: string };

        const toggledVoiceIndex = choices.findIndex(c => c.value === toggledVoice);
    
        this.globalState.comms.voiceIndicators = this.globalState.comms.voiceIndicators.map(indicatorState => ({
            ...indicatorState,
            ...(toggledVoice === indicatorState.astronautName ? {
                active: !indicatorState.active,
                activeToggleTime: new Date()
            } : {})
        }));
    
        this.commsMenu(toggledVoiceIndex);
    }
    
    clearScreen(clear: boolean = true) {
        if (clear) {
            process.stdout.write('\u001Bc');
        }
    }
}


const app = new App();

app.cli();