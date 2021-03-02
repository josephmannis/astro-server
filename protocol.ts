import { SystemState } from "./types";

export interface MessageBase<T extends string, P = undefined> {
  type: T;
  payload: P;
}

export function parseMessage(m: string): MessageBase<string, unknown> | null {
  try {
    const parsed = JSON.parse(m);
    if (parsed.hasOwnProperty("type")) {
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
export type Message = HelloMessage | GoodbyeMessage | SystemStateMessage | NewSpatialAnchorMessage | NewSpatialAnchorReceivedMessage | RequestActiveSpatialAnchorsMessage | ActiveSpatialAnchorsMessage;

export type HelloMessage = MessageBase<"HELLO">;
export function isHelloMessage(m: MessageBase<string, unknown>): m is HelloMessage {
  return m.type === "HELLO" && m.payload != null;
}

export type GoodbyeMessage = MessageBase<"GOODBYE">;
export function isGoodbyeMessage(m: MessageBase<string, unknown>): m is GoodbyeMessage {
  return m.type === "GOODBYE" && m.payload != null;
}

export type SystemStateMessage = MessageBase<"SYSTEM_STATE", SystemState>;
// export function isSystemStateMessage(m: MessageBase<string, unknown>): m is SystemStateMessage {
//   return m.type === "SYSTEM_STATE";
// }

export type NewSpatialAnchorMessage = MessageBase<"NEW_SPATIAL_ANCHOR", { anchorId: string; }>;
export function isNewSpatialAnchorMessage(m: MessageBase<string, unknown>): m is NewSpatialAnchorMessage {
  return m.type === "NEW_SPATIAL_ANCHOR" && m.payload != null;
}

export type NewSpatialAnchorReceivedMessage = MessageBase<"NEW_SPATIAL_ANCHOR_RECEIVED", { anchorId: string; }>;

export type RequestActiveSpatialAnchorsMessage = MessageBase<"REQUEST_ACTIVE_SPATIAL_ANCHORS">;
export function isRequestActiveSpatialAnchorsMessage(m: MessageBase<string, unknown>): m is RequestActiveSpatialAnchorsMessage {
  return m.type === "REQUEST_ACTIVE_SPATIAL_ANCHORS";
}

export type ActiveSpatialAnchorsMessage = MessageBase<"ACTIVE_SPATIAL_ANCHORS", { activeAnchorIds: string[] }>;