import { Ask } from "@/components/rooms/ask";
import { Dock } from "@/components/rooms/dock";
import type { DockItem } from "@/components/rooms/dock";
import { GlyphHero } from "@/components/rooms/glyph-hero";
import { Room } from "@/components/rooms/room";
import { Touch } from "@/components/rooms/touch";
import { glyphHero, rooms } from "@/content/site";
import { projects } from "@/data/projects";
import { groupByRoom, projectRooms } from "@/lib/rooms";

/** Home. The glyph grid as the front door, then rooms by platform on one scroll, and a dock that follows. */
export default function Home() {
  const groups = groupByRoom(projects);
  const dock: DockItem[] = [
    { id: "home", ...rooms.home, preview: [glyphHero.title] },
    ...projectRooms.map((room) => ({
      id: room,
      ...rooms[room],
      preview: groups[room].map((project) => project.name),
    })),
  ];
  return (
    <>
      <main className="pb-[calc(96px+env(safe-area-inset-bottom,0px))]">
        <section id="home" aria-label="Home">
          <GlyphHero projects={projects} />
        </section>
        {projectRooms.map((room) => (
          <Room key={room} id={room} projects={groups[room]} />
        ))}
        <Touch>
          <Ask />
        </Touch>
      </main>
      <Dock items={dock} cta={{ id: "touch", ...rooms.touch, preview: [] }} />
    </>
  );
}
