import { GlyphHero } from "@/components/rooms/glyph-hero";
import { Intro } from "@/components/rooms/intro";
import { Room } from "@/components/rooms/room";
import { Touch } from "@/components/rooms/touch";
import { projects } from "@/data/projects";
import { groupByRoom, projectRooms } from "@/lib/rooms";

/** Home. Two lines, the glyph grid, then every room as bands, then Connect. */
export default function Home() {
  const groups = groupByRoom(projects);
  return (
    <main id="top">
      <Intro />
      <GlyphHero projects={projects} />
      {projectRooms.map((room) => (
        <Room key={room} id={room} projects={groups[room]} />
      ))}
      <Touch />
    </main>
  );
}
