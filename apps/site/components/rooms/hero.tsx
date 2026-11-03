import { buttonClasses } from "@pickler/ui";
import type { Project, RoomTag } from "@/data/project";
import { hero } from "@/content/site";
import { Column } from "@/components/home/column";
import { HeroDoodles } from "@/components/home/doodles";
import { DrawOn } from "@/components/home/draw-on";
import styles from "@/components/home/home.module.css";
import { WaterlineAnchor } from "@/components/home/waterline";
import { RoomMap } from "./room-map";

/** Eyebrow, headline, one paragraph, two buttons, then the room map with doodles behind it. */
export function Hero({ groups }: { groups: Record<RoomTag, Project[]> }) {
  return (
    <div className="px-6 pt-[110px] text-center">
      <Column>
        <p className="inline-flex items-center gap-2 font-mono text-label uppercase tracking-label">
          <span aria-hidden className={`size-[7px] bg-acc ${styles.blink}`} />
          {hero.eyebrow}
        </p>
        <h1 className="mx-auto my-4 max-w-[14ch] text-balance text-[clamp(2.4rem,6vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
          {hero.title}{" "}
          <span className="font-mono font-medium tracking-[-0.02em]">{hero.titleMono}</span>
        </h1>
        <p className="mx-auto mb-6 max-w-[52ch] text-lead text-grey">{hero.lead}</p>
        <div className="mb-14 flex flex-wrap justify-center gap-2.5">
          <a href={hero.primary.href} className={buttonClasses("primary")}>
            {hero.primary.label}
          </a>
          <a href={hero.secondary.href} className={buttonClasses("secondary")}>
            {hero.secondary.label}
          </a>
        </div>

        <DrawOn parallax className="relative pb-10">
          <HeroDoodles />
          <div className="relative z-10">
            <RoomMap groups={groups} />
          </div>
        </DrawOn>
        <WaterlineAnchor />
      </Column>
    </div>
  );
}
