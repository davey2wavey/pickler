import type { CSSProperties } from "react";
import type { Project } from "@/data/project";
import { glyphHero } from "@/content/site";
import { AppGlyph } from "./app-art";
import styles from "./glyph-hero.module.css";

/** Every branded project as its icon in a grid. Tap one to jump to its band. */
export function GlyphHero({ projects }: { projects: readonly Project[] }) {
  const branded = projects.filter((p) => p.brand);
  return (
    <nav className={styles.top ?? ""} aria-label={glyphHero.navLabel}>
      <div className={styles.tiles ?? ""}>
        {branded.map((project) => {
          const brand = project.brand!;
          const vars = { "--ground": brand.ground, "--accent": brand.accent } as CSSProperties;
          return (
            <a
              key={project.slug}
              href={`#${project.slug}`}
              className={styles.tile ?? ""}
              style={vars}
              data-testid="hero-tile"
            >
              <AppGlyph slug={project.slug} className={styles.glyph ?? undefined} />
              <span>{project.name}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
