import { projects } from "@/data/projects";
import { ActiveView } from "@/views/active-view";

export default function Page() {
  return <ActiveView projects={projects} />;
}
