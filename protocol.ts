import { SystemState } from "./types";

export interface MessageBase<T extends string, P> {
  type: T;
  payload: P;
}

export type Message = SystemStateMessage;

export function parseMessage(m: string): MessageBase<string, unknown> | null {
  try {
    const parsed = JSON.parse(m);
    if (parsed.hasOwnProperty("type") && parsed.hasOwnProperty("payload")) {
      return parsed;
    } else {
      return null;
    }
  } catch (e) {
    console.warn(e);
    return null;
  }
}


// messages

export type SystemStateMessage = MessageBase<"SYSTEM_STATE", SystemState>;
// export function isSystemStateMessage(m: MessageBase<string, unknown>): m is SystemStateMessage {
//   return m.type === "SYSTEM_STATE";
// }