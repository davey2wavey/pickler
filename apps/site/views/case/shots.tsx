import Image from "next/image";
import { Label } from "@pickler/ui";
import type { Project } from "@/data/project";

/** Screenshots, or a labeled placeholder. Never a broken image. */
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
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {project.screenshots.map((shot) => (
        <li key={shot.src} className="border border-line">
          <Image
            src={shot.src}
            alt={shot.alt}
            width={1600}
            height={1000}
            className="h-auto w-full"
          />
        </li>
      ))}
    </ul>
  );
}
