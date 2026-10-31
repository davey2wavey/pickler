import Image from "next/image";
import { Label } from "@pickler/ui";
import type { Project } from "@/data/project";
import { AppWindow } from "./app-window";

export type DemoKind = "iframe" | "video" | "screenshot" | "placeholder";

/** Which demo a project gets. Web apps embed only once they are usable; native apps show video or a shot. */
export function demoKindFor(project: Project): DemoKind {
  const usable = project.status === "live" || project.status === "beta";
  if (project.kind === "web" && project.links.live && usable) return "iframe";
  if (project.kind === "mac" || project.kind === "ios") {
    if (project.links.video) return "video";
    if (project.screenshots[0]) return "screenshot";
  }
  return "placeholder";
}

const frameClass = {
  phone: "aspect-[9/19.5] max-h-[520px]",
  desktop: "aspect-[16/10]",
  none: "",
} as const;

/** The demo inside window chrome: iframe, video, first screenshot, or a labeled "demo coming" panel. */
export function DemoSlot({ project, title }: { project: Project; title?: string }) {
  const kind = demoKindFor(project);
  const shot = project.screenshots[0];
  const heading = title ?? project.name.toUpperCase();

  if (kind === "iframe" && project.links.live) {
    return (
      <AppWindow title={heading}>
        <iframe
          src={project.links.live}
          title={`${project.name} demo`}
          loading="lazy"
          className="block aspect-[16/10] w-full bg-bg"
        />
        <a
          href={project.links.live}
          rel="noreferrer"
          target="_blank"
          className="flex justify-between border-t border-line px-4 py-3 font-mono text-label uppercase tracking-label hover:bg-fg hover:text-bg"
        >
          Open full screen <span aria-hidden>↗</span>
        </a>
      </AppWindow>
    );
  }

  if (kind === "video" && project.links.video) {
    return (
      <AppWindow title={heading}>
        <video
          controls
          preload="none"
          playsInline
          poster={shot?.src}
          aria-label={`${project.name} walkthrough`}
          className="block aspect-[16/10] w-full bg-ground"
        >
          <source src={project.links.video} />
        </video>
      </AppWindow>
    );
  }

  if (kind === "screenshot" && shot) {
    return (
      <AppWindow title={heading}>
        <div className={`mx-auto ${frameClass[shot.frame]}`}>
          <Image
            src={shot.src}
            alt={shot.alt}
            width={1600}
            height={1000}
            className="h-auto w-full"
          />
        </div>
      </AppWindow>
    );
  }

  return (
    <AppWindow title={heading}>
      <div
        role="img"
        aria-label={`${project.name}: demo coming`}
        className="grid aspect-[16/10] place-items-center bg-ground"
      >
        <Label text="demo coming" dot="warn" />
      </div>
    </AppWindow>
  );
}
