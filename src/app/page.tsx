import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Education } from "@/components/education";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Shell } from "@/components/shell";
import { Stack } from "@/components/stack";

export default function Home() {
  return (
    <Shell>
      <About />
      <Experience />
      <Projects />
      <Stack />
      <Education />
      <Contact />
    </Shell>
  );
}
