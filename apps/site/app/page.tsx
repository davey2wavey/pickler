import { Contact } from "@/components/home/contact";
import { Hero } from "@/components/home/hero";
import { HowIWork } from "@/components/home/how-i-work";
import { Nav } from "@/components/home/nav";
import styles from "@/components/home/home.module.css";
import { ProjectBand } from "@/components/home/project-band";
import { ProofStrip } from "@/components/home/proof-strip";
import { Waterline } from "@/components/home/waterline";
import { projects } from "@/data/projects";
import { featured } from "@/data/select";

/** Home. A hero, one band per featured project with its demo inside, how I work, contact. */
export default function Home() {
  const bands = featured(projects);
  return (
    <Waterline>
      <Nav projects={bands} />
      <Hero projects={bands} />
      <div className={styles.below}>
        <ProofStrip projects={projects} today={new Date()} />
        {bands.map((project, index) => (
          <ProjectBand key={project.slug} project={project} index={index} />
        ))}
        <HowIWork />
        <Contact />
      </div>
    </Waterline>
  );
}
