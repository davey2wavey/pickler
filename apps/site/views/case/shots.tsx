import Image from "next/image";
import { Label, cx } from "@pickler/ui";
import type { Project } from "@/data/project";

const frames = {
  phone: "aspect-[9/19.5] max-h-[640px] mx-auto",
  desktop: "aspect-[16/10]",
  none: "",
} as const;

/** Screenshots in their frames, or a labeled placeholder. Never a broken image. */
export function Shots({ project }: { project: Project }) {
  if (project.screenshots.length === 0) {
    return (
      <div
        role="img"
        aria-label={`${project.name}: screenshots to come`}
        className="flex aspect-video max-h-64 items-center justify-center border border-dashed border-line"
      >
        <Label text="screenshots to come" />
      </div>
    );
  }
  const phones = project.screenshots.every((shot) => shot.frame === "phone");
  return (
    <ul className={cx("grid gap-6", phones ? "grid-cols-2 md:grid-cols-4" : "md:grid-cols-2")}>
      {project.screenshots.map((shot) => (
        <li key={shot.src} data-frame={shot.frame} className="flex flex-col gap-2">
          <figure className="m-0 flex flex-col gap-2">
            <div className={cx("overflow-hidden border border-line bg-ground", frames[shot.frame])}>
              <Image
                src={shot.src}
                alt={shot.alt}
                width={1600}
                height={1000}
                className={cx("h-auto w-full", shot.frame !== "none" && "h-full object-cover")}
              />
            </div>
            <figcaption className="font-mono text-label uppercase tracking-label text-grey">
              {shot.alt}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
