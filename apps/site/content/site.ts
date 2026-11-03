// Every string on the home page that is not a project field. Rewrite here, not in components.

export const email = "picklerdavid@gmail.com";
export const github = "https://github.com/davey2wavey";
/** Set when there is a profile worth linking. Empty hides the link. */
export const linkedin = "";

export const site = {
  name: "David Pickler",
  url: "https://pickler-site.vercel.app",
  tagline: "// BUILDS TOOLS",
  location: "Orange County, CA",
  footer: "Built with the tools above",
} as const;

export const hero = {
  eyebrow: "Internal tools · dashboards · automations",
  title: "Working software for teams that need it",
  titleMono: "this month",
  lead: "I take a messy process, build the tool that runs it, and ship it alone, end to end. Pick a room, or go fishing.",
  primary: { label: "See the work ↓", href: "#web" },
  secondary: { label: "Get in touch", href: "#touch" },
} as const;

/** The system window in the hero: a clickable map of the rooms. */
export const roomMap = {
  title: "PICKLER · SYSTEMS",
  countLabel: "PROJECTS",
  countLine: "web, phone, desktop, background. One builder.",
  actions: [
    { label: "Go fishing", href: "#fish", glyph: "~" },
    { label: "Get in touch", href: "#touch", glyph: "@" },
  ],
} as const;

/** One entry per room, in page order. The dock reads label and glyph; sections read title and blurb. */
export const rooms = {
  home: { label: "Home", glyph: "⌂", title: "Home.", blurb: "" },
  web: {
    label: "Web",
    glyph: "▦",
    title: "Web.",
    blurb: "Tools that run in a browser. Click into the live ones.",
  },
  iphone: {
    label: "iPhone",
    glyph: "▯",
    title: "iPhone.",
    blurb: "Apps on my phone and on TestFlight. Screenshots here, App Store next.",
  },
  mac: {
    label: "Mac",
    glyph: "▭",
    title: "Mac.",
    blurb: "Native desktop. Video walkthrough until a demo makes sense.",
  },
  automation: {
    label: "Automation",
    glyph: "⟳",
    title: "Automation.",
    blurb: "Workers and pipelines. Things that run on a schedule without me.",
  },
  touch: {
    label: "Get in touch",
    glyph: "@",
    title: "Get in touch.",
    blurb: "Ask the site first, or skip it and email me. Reply within a day.",
  },
} as const;

export const block = {
  learnMore: "Learn more",
  role: "Role",
  year: "Year",
  stack: "Stack",
  selfDemo: "YOU ARE HERE",
} as const;

export const fishing = {
  eyebrow: "Side quest",
  title: "Go fishing. Catch a project.",
  lead: "Tap the water to cast. When something bites, tap again to reel. Each catch opens the project it belongs to.",
  scene: "Cast the line",
  status: {
    idle: "tap water to cast",
    cast: "casting…",
    wait: "waiting for a bite…",
    bite: "BITE — tap to reel!",
    reel: "reeling…",
    caught: "tap the card to open · tap water to cast",
    missed: "it got away. tap to cast again",
  },
  card: { caught: "caught:", open: "tap to open" },
  log: { caught: "caught", inWater: "in the water" },
  allCaught: "you found them all",
  reset: "reset log",
} as const;

export const ask = {
  intro: "Ask about the work, the stack, or whether I'm available.",
  from: "David's site",
  you: "You",
  placeholder: "Ask about my work…",
  send: "Send",
  tryOne: "Try one",
  suggestions: [
    "What did you build last week?",
    "What stack do you use?",
    "Are you available?",
    "How do you test?",
  ],
  /** First entry whose keyword appears in the question wins. Canned until there is an API. */
  canned: [
    {
      keywords: ["last week", "recently", "lately"],
      reply:
        "Shipped the rooms for this site, merged the home page with the waterline, and set the Vercel preview gate. Every PR green.",
    },
    {
      keywords: ["stack", "tech", "built with"],
      reply:
        "Next.js and TypeScript on Vercel, Postgres through Supabase, Tailwind over my own tokens, Vitest and Playwright on every PR. Swift for iPhone apps.",
    },
    {
      keywords: ["available", "hire", "hiring", "work with"],
      reply: "Yes. Remote, project-based or full-time. Email is below, reply within a day.",
    },
    {
      keywords: ["test", "ci", "quality"],
      reply:
        "Typecheck, lint, unit, and a browser smoke suite run on every pull request. Red cannot merge. You click the preview before I do.",
    },
  ],
  fallback:
    "Canned replies only for now, no API behind this box yet. Try one of the suggested questions, or email me below.",
} as const;

export const stack = {
  title: "Stack",
  blurb: "What I reach for.",
  items: [
    ["Web", "Next.js · TypeScript"],
    ["Style", "Tailwind · own tokens"],
    ["Data", "Postgres · Supabase"],
    ["Deploy", "Vercel · GitHub Actions"],
    ["Tests", "Vitest · Playwright"],
    ["Native", "Swift · SwiftUI"],
    ["Agents", "Claude Code · specs first"],
    ["Design", "Hand-drawn SVG · hard grid"],
  ],
} as const;
