import { projects } from "@/data/projects";
import { Grid } from "@/views/grid/grid";

export default function Page() {
  return <Grid projects={projects} />;
}
