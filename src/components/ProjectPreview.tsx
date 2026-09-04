import { lazy, Suspense, useState } from "react";
import { Expand } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Project } from "@/data/projects";
const Gallery = lazy(() => import("./Gallery"));
export default function ProjectPreview({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={`project-stage ${project.theme}`}
          aria-label={`Preview ${project.title} screenshots`}
        >
          <span className="stage-top">
            <span>{project.title}</span>
            <span className="stage-hint">
              View screens <Expand size={16} />
            </span>
          </span>
          <img
            src={`/images/${project.cover}`}
            alt={`${project.title}: ${project.screens[0].caption}`}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            width="1365"
            height="681"
          />
          <span className="stage-bottom mono">
            {project.category}
            <span>{project.screens.length} screens</span>
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="project-dialog">
        <DialogTitle className="dialog-title">{project.title}</DialogTitle>
        <DialogDescription>
          Use the arrows or swipe to explore the interface.
        </DialogDescription>
        {open && (
          <Suspense
            fallback={
              <p role="status" className="gallery-loading">
                Loading screenshots…
              </p>
            }
          >
            <Gallery project={project} />
          </Suspense>
        )}
      </DialogContent>
    </Dialog>
  );
}
