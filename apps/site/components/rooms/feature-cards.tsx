import type { CSSProperties } from "react";
import type { Feature } from "@/data/project";

/** Up to four cells under a block: glyph, title, one line, optional mono metric. Nothing when empty. */
export function FeatureCards({ features, name }: { features: readonly Feature[]; name: string }) {
  if (features.length === 0) return null;
  const style = { "--n": features.length } as CSSProperties;
  return (
    <ul
      aria-label={`${name} features`}
      style={style}
      className="grid grid-cols-2 border-t border-line md:grid-cols-[repeat(var(--n),minmax(0,1fr))]"
    >
      {features.map((feature) => (
        <li
          key={feature.title}
          className="min-w-0 border-r border-line px-5 py-4 max-md:nth-[2n]:border-r-0 max-md:nth-[-n+2]:border-b md:last:border-r-0"
        >
          <span aria-hidden className="mb-2.5 block font-mono text-[1.1rem] text-acc">
            {feature.glyph}
          </span>
          <h4 className="mb-1 text-[0.95rem] font-semibold">{feature.title}</h4>
          <p className="text-small text-grey">{feature.text}</p>
          {feature.metric ? (
            <span className="mt-2 block font-mono text-label text-acc">{feature.metric}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
