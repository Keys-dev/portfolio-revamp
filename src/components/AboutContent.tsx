import { ArrowUpRight } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { profile } from "@/data/profile";
export default function AboutContent() {
  return (
    <section className="about-section shell" aria-labelledby="about-heading">
      <div className="about-intro">
        <p className="mono section-number">A LITTLE ABOUT ME</p>
        <h2 id="about-heading">
          I like making
          <br />
          things <em>work.</em>
        </h2>
        <p>
          I’m Muhammed, a developer in Osun, Nigeria. I build web and mobile
          applications, and I enjoy figuring out how the interface and the
          software behind it fit together.
        </p>
        <p>
          My projects explore healthcare, productivity, and everyday tools. I
          care about useful features and the details people notice when they use
          them.
        </p>
        <a
          href={profile.resume}
          className="underlined-link"
          target="_blank"
          rel="noreferrer"
        >
          View my résumé <ArrowUpRight size={19} />
        </a>
      </div>
      <div className="skills">
        <p className="mono section-number">WHAT I WORK WITH</p>
        <Accordion type="single" collapsible defaultValue="web">
          {[
            {
              id: "web",
              title: "Web development",
              text: "React, TypeScript, JavaScript, HTML, and CSS. Tailwind CSS for styling.",
            },
            {
              id: "mobile",
              title: "Mobile development",
              text: "React Native and Expo for mobile projects. Pokédex is one example in my selected work.",
            },
            {
              id: "workflow",
              title: "Tools & workflow",
              text: "Git and GitHub for version control and keeping project changes organised.",
            },
          ].map((item, i) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="skill-trigger">
                <span className="mono skill-index">0{i + 1}</span>
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="skill-content">
                {item.text}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p className="skill-note">
          Different tools. The same attention to how it feels to use.
        </p>
      </div>
    </section>
  );
}
