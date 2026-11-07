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

/** The glyph grid hero: name, every app icon, one line. */
export const glyphHero = {
  navLabel: "Apps",
} as const;

/** The two lines the page opens on. Scroll crossfades the first into the second. */
export const intro = {
  first: "Hi, I'm David.",
  second: "I make apps.",
} as const;

/**
 * One entry per room, in page order. A divider band before each room: the word in the
 * room's accent on its own tinted ground, then that room's icons.
 */
export const rooms = {
  web: { title: "Web", ground: "#0C1F2A", accent: "#7FD1F2" },
  iphone: { title: "iPhone", ground: "#1A1016", accent: "#FF6FA8" },
  mac: { title: "Mac", ground: "#161228", accent: "#C9A5FF" },
  automation: { title: "Automation", ground: "#221607", accent: "#FFB347" },
} as const;

/** The last band. One word, one line, the address. */
export const connect = {
  eyebrow: "Get in touch",
  title: "Connect.",
  lead: "Hiring, a project, or just want to talk about one of these. Reply within a day.",
  email: "Email me",
  github: "GitHub",
  top: "↑ top",
} as const;

export const block = {
  learnMore: "Learn more",
  role: "Role",
  year: "Year",
  stack: "Stack",
  selfDemo: "YOU ARE HERE",
} as const;

/** Status line on an app band. Keyed by project status; the rest fall back to the status itself. */
export const bandStatus = {
  live: "On the App Store",
  beta: "On TestFlight",
  "in-progress": "Building",
} as const;
