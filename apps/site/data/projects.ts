import { parseProjects } from "./project";
import raw from "./projects.json";

/** Every project, validated once at import. Views render this; nothing reads the JSON directly. */
export const projects = parseProjects(raw);
