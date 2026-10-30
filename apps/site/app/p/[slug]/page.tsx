import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { findProject } from "@/data/select";
import { Case } from "@/views/case/case";

type Props = { params: Promise<{ slug: string }> };

// Every project page is built at build time. Anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = findProject(projects, (await params).slug);
  return project ? { title: project.name, description: project.oneLiner } : {};
}

export default async function ProjectPage({ params }: Props) {
  const project = findProject(projects, (await params).slug);
  if (!project) notFound();
  return <Case project={project} />;
}
