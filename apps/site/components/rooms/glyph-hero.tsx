import type { CSSProperties } from "react";
import type { Project } from "@/data/project";
import { glyphHero } from "@/content/site";
import { Column } from "@/components/home/column";
import { AppGlyph } from "./app-art";
import styles from "./glyph-hero.module.css";

/**
 * The front door: every branded project as its icon in a grid. Tap one to jump to its band.
 * Dark like the bands, system font, one line of copy. Replaces the hero and the fishing game.
 */
export function GlyphHero({ projects }: { projects: readonly Project[] }) {
  const branded = projects.filter((p) => p.brand);
  return (
    <header className={styles.top} aria-labelledby="hero-title">
      <Column className={styles.who ?? ""}>
        <b>{glyphHero.name}</b>
        <span>{glyphHero.eyebrow}</span>
      </Column>
      <div className={styles.gridwrap}>
        <nav className={styles.tiles} aria-label={glyphHero.navLabel}>
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
        </nav>
      </div>
      <Column className={styles.line ?? ""}>
        <h1 id="hero-title">{glyphHero.title}</h1>
        <p>{glyphHero.cue}</p>
      </Column>
    </header>
  );
}
