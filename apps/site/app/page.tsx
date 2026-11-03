import { Waterline } from "@/components/home/waterline";
import styles from "@/components/home/home.module.css";
import { Dock } from "@/components/rooms/dock";
import type { DockItem } from "@/components/rooms/dock";
import { Hero } from "@/components/rooms/hero";
import { Room } from "@/components/rooms/room";
import { Touch } from "@/components/rooms/touch";
import { fishing, hero, rooms } from "@/content/site";
import { projects } from "@/data/projects";
import { groupByRoom, projectRooms } from "@/lib/rooms";

/** Home. Rooms by platform on one scroll, a dock that follows, and the water underneath. */
export default function Home() {
  const groups = groupByRoom(projects);
  const dock: DockItem[] = [
    { id: "home", ...rooms.home, preview: [hero.eyebrow, fishing.title] },
    ...projectRooms.map((room) => ({
      id: room,
      ...rooms[room],
      preview: groups[room].map((project) => project.name),
    })),
  ];
  return (
    <>
      <Waterline className="pb-[calc(96px+env(safe-area-inset-bottom,0px))]">
        <section id="home" aria-label="Home">
          <Hero groups={groups} />
        </section>
        <div className={styles.below}>
          {projectRooms.map((room) => (
            <Room key={room} id={room} projects={groups[room]} />
          ))}
          <Touch />
        </div>
      </Waterline>
      <Dock items={dock} cta={{ id: "touch", ...rooms.touch, preview: [] }} />
    </>
  );
}
