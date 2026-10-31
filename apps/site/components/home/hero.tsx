import { buttonClasses } from "@pickler/ui";
import type { Project } from "@/data/project";
import { Column } from "./column";
import { HeroDoodles } from "./doodles";
import { DrawOn } from "./draw-on";
import styles from "./home.module.css";
import { SystemWindow } from "./system-window";
import { WaterlineAnchor } from "./waterline";

/** Eyebrow, headline, one paragraph, two buttons, then the system window with doodles behind it. */
export function Hero({ projects }: { projects: readonly Project[] }) {
  const first = projects[0];
  return (
    <section id="top" className="px-6 pt-[72px] text-center">
      <Column>
        <p className="inline-flex items-center gap-2 font-mono text-label uppercase tracking-label">
          <span aria-hidden className={`size-[7px] bg-acc ${styles.blink}`} />
          Internal tools · dashboards · automations
        </p>
        <h1 className="mx-auto my-4 max-w-[14ch] text-balance text-[clamp(2.4rem,6vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
          Working software for teams that need it{" "}
          <span className="font-mono font-medium tracking-[-0.02em]">this month</span>
        </h1>
        <p className="mx-auto mb-6 max-w-[52ch] text-lead text-grey">
          I take a messy process, build the tool that runs it, and ship it alone, end to end. Three
          of them are live below. Click in and use them.
        </p>
        <div className="mb-14 flex flex-wrap justify-center gap-2.5">
          <a href={first ? `#${first.slug}` : "#how"} className={buttonClasses("primary")}>
            See the work ↓
          </a>
          <a href="#contact" className={buttonClasses("secondary")}>
            Get in touch
          </a>
        </div>

        <DrawOn parallax className="relative pb-10">
          <HeroDoodles />
          <div className="relative z-10">
            <SystemWindow projects={projects} />
          </div>
        </DrawOn>
        <WaterlineAnchor />
      </Column>
    </section>
  );
}
