import type { Project, RoomTag } from "@/data/project";
import { roomTag } from "@/data/project";
import { byRoomOrder } from "@/data/select";

/** Every section the dock can land on, in page order. */
export const roomIds = ["home", "web", "iphone", "mac", "automation", "touch"] as const;
export type RoomId = (typeof roomIds)[number];

/** The rooms that hold projects, in page order. */
export const projectRooms: readonly RoomTag[] = roomTag.options;

export function isRoomId(value: string): value is RoomId {
  return (roomIds as readonly string[]).includes(value);
}

/** A project lives in the room of its first tag. */
export function roomOf(project: Project): RoomTag {
  const first = project.tags[0];
  if (!first) throw new Error(`${project.slug} has no tags`);
  return first;
}

/** Projects per room, each room in byRoomOrder. Every room is present, possibly empty. */
export function groupByRoom(projects: readonly Project[]): Record<RoomTag, Project[]> {
  const groups: Record<RoomTag, Project[]> = { web: [], iphone: [], mac: [], automation: [] };
  for (const project of projects) groups[roomOf(project)].push(project);
  for (const room of projectRooms) groups[room] = byRoomOrder(groups[room]);
  return groups;
}

/** "#iphone" or "iphone" to its room id; anything else is undefined. */
export function roomFromHash(hash: string): RoomId | undefined {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  return isRoomId(id) ? id : undefined;
}

export function hashFor(room: RoomId): `#${RoomId}` {
  return `#${room}`;
}

/** Share of the viewport a room's top must pass before the dock calls it active. */
export const ACTIVE_LINE = 0.4;

/**
 * The active room from each room's top, in px from the viewport top, in page order.
 * The last room that has crossed the active line wins; before any has, it is the first.
 */
export function activeRoomFor(
  tops: ReadonlyArray<readonly [RoomId, number]>,
  viewportHeight: number,
): RoomId {
  const line = viewportHeight * ACTIVE_LINE;
  let active: RoomId = tops[0]?.[0] ?? "home";
  for (const [room, top] of tops) if (top < line) active = room;
  return active;
}
