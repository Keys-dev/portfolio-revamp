import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import type { Project } from "@/data/projects";
export default function Gallery({ project }: { project: Project }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);
  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: false, watchDrag: true, duration: reducedMotion ? 0 : 25 }}
      aria-label={`${project.title} screenshots`}
    >
      <CarouselContent>
        {project.screens.map((screen, i) => (
          <CarouselItem
            key={screen.file}
            aria-label={`${i + 1} of ${project.screens.length}`}
          >
            <figure>
              <img
                className="gallery-image"
                src={`/images/${screen.file}`}
                alt={screen.caption}
                loading={i === 0 ? "eager" : "lazy"}
                width="1365"
                height="681"
              />
              <figcaption className="gallery-caption">
                {screen.caption}
              </figcaption>
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="gallery-controls">
        <p className="mono" aria-live="polite">
          {String(selected + 1).padStart(2, "0")} /{" "}
          {String(project.screens.length).padStart(2, "0")}
        </p>
        <div className="gallery-buttons">
          <CarouselPrevious className="gallery-nav" />
          <CarouselNext className="gallery-nav" />
        </div>
        <Button asChild variant="ghost" className="text-action">
          <a
            href={`/images/${project.screens[selected].file}`}
            target="_blank"
            rel="noreferrer"
          >
            Full size <ArrowUpRight />
          </a>
        </Button>
      </div>
    </Carousel>
  );
}
