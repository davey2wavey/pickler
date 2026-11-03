import type { Project, RoomTag } from "@/data/project";
import { roomMap, rooms } from "@/content/site";
import { projectRooms, hashFor } from "@/lib/rooms";
import { AppWindow } from "@/components/home/app-window";

const node =
  "grid h-10 grid-cols-[28px_1fr_auto] items-center border border-line bg-panel text-fg hover:bg-ground";
const nodeIcon =
  "grid h-full place-items-center border-r border-line bg-acc font-mono text-label text-acc-ink";
const nodeName = "px-2.5 font-mono text-label uppercase tracking-label";
const nodeValue =
  "grid h-full place-items-center border-l border-line px-3 font-mono text-label tabular-nums";

/** The hero window as a map: four rooms with their counts, the total, and two ways out. */
export function RoomMap({ groups }: { groups: Record<RoomTag, Project[]> }) {
  const total = projectRooms.reduce((sum, room) => sum + groups[room].length, 0);
  return (
    <AppWindow title={roomMap.title} size="lg" className="mx-auto max-w-[960px] text-left">
      <div className="grid min-h-[300px] bg-[linear-gradient(var(--line-soft)_1px,transparent_1px),linear-gradient(90deg,var(--line-soft)_1px,transparent_1px)] bg-[size:24px_24px] md:grid-cols-[1fr_1.2fr_1fr]">
        <nav aria-label="Rooms map" className="flex flex-col justify-center gap-2.5 p-4">
          {projectRooms.map((room) => (
            <a key={room} href={hashFor(room)} className={node}>
              <span aria-hidden className={nodeIcon}>
                {rooms[room].glyph}
              </span>
              <span className={nodeName}>{rooms[room].label}</span>
              <span className={nodeValue} data-testid={`map-count-${room}`}>
                {groups[room].length}
              </span>
            </a>
          ))}
        </nav>

        <div className="grid place-items-center p-4">
          <div className="grid w-full max-w-[240px] grid-rows-[auto_1fr_auto] border border-line bg-fg text-bg md:aspect-[1.3]">
            <div className="border-b border-grey px-2.5 py-2 font-mono text-label tracking-[0.1em] text-acc">
              {`//${roomMap.countLabel}//`}
            </div>
            <div className="grid place-items-center py-6 text-center font-mono">
              <span
                data-testid="map-total"
                className="text-[2.4rem] leading-none tabular-nums tracking-tight"
              >
                {total}
              </span>
              <span className="mt-1 block max-w-[22ch] text-label uppercase tracking-[0.1em] text-grey">
                {roomMap.countLine}
              </span>
            </div>
            <div className="mx-2.5 mb-2.5 h-2 bg-grey">
              <div className="h-full w-[62%] bg-acc" />
            </div>
          </div>
        </div>

        <nav aria-label="Shortcuts" className="flex flex-col justify-center gap-2.5 p-4">
          {roomMap.actions.map((action) => (
            <a key={action.href} href={action.href} className={node}>
              <span aria-hidden className={nodeIcon}>
                {action.glyph}
              </span>
              <span className={nodeName}>{action.label}</span>
              <span aria-hidden className={nodeValue}>
                →
              </span>
            </a>
          ))}
        </nav>
      </div>
    </AppWindow>
  );
}
