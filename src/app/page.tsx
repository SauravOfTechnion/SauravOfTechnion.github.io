import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Interests } from "@/components/sections/interests";
import { Projects } from "@/components/sections/projects";
import { Publications } from "@/components/sections/publications";
import { Skills } from "@/components/sections/skills";
import { getEnrichedProjects } from "@/lib/github";

export default async function Home() {
  const projects = await getEnrichedProjects();

  return (
    <>
      <Hero />
      <Interests />
      <About />
      <Experience />
      <Projects projects={projects} />
      <Publications />
      <Skills />
      <Contact />
    </>
  );
}
