import { useEffect, lazy, Suspense } from "react";
import { Link, Routes, Route, useLocation, useParams } from "react-router";
import { ArrowUpRight, ArrowDown, ArrowLeft } from "lucide-react";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import AboutContent from "@/components/AboutContent";
import ContactBlock from "@/components/ContactBlock";
import ProjectPreview from "@/components/ProjectPreview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { projects, findProject } from "@/data/projects";
import { profile } from "@/data/profile";
const Gallery = lazy(() => import("@/components/Gallery"));
function PageEffects() {
  const location = useLocation();
  useEffect(() => {
    const project = location.pathname.startsWith("/projects/")
      ? findProject(location.pathname.split("/")[2])
      : null;
    const pageTitle =
      location.pathname === "/"
        ? `${profile.name} — Frontend Developer & Software Engineer`
        : location.pathname === "/about"
          ? `About — ${profile.name}`
          : location.pathname === "/contact"
            ? `Contact — ${profile.name}`
            : project
              ? `${project.title} — ${profile.name}`
              : `Page not found — ${profile.name}`;
    document.title = pageTitle;
    const id = location.hash.slice(1);
    const frame = requestAnimationFrame(() => {
      if (id) {
        const target = document.getElementById(id);
        target?.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "instant"
              : "smooth",
          });
        target?.focus({ preventScroll: true });
      } else {
        window.scrollTo(0, 0);
        document.getElementById("main")?.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [location]);
  return null;
}
function Home() {
  return (
    <>
      <section className="hero shell">
        <div className="hero-top">
          <span className="mono">SELECTED WORK / 2024–2026</span>
          <span>{profile.location}</span>
        </div>
        <div className="hero-grid">
          <h1>
            <span>Muhammed</span>
            <span className="surname">
              Agbaje<span className="name-dot">.</span>
            </span>
          </h1>
          <div className="hero-aside">
            <p className="hero-hello">Hello, I’m Muhammed.</p>
            <p>
              I build interfaces for the web and software that solves everyday
              problems.
            </p>
            <div className="hero-actions">
              <Button asChild className="hero-button">
                <Link to="/#work">
                  See my work <ArrowDown size={18} />
                </Link>
              </Button>
              <a
                href={profile.resume}
                className="resume-link"
                target="_blank"
                rel="noreferrer"
              >
                Résumé <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="hero-note">
              <span className="note-rule" />
              <span>
                Currently exploring
                <br />
                healthcare, productivity & tools.
              </span>
            </div>
          </div>
        </div>
        <div className="hero-bottom">
          <span>Code, with an eye for design.</span>
          <span className="mono">
            SCROLL TO EXPLORE <ArrowDown size={14} />
          </span>
        </div>
      </section>
      <section
        id="work"
        tabIndex={-1}
        className="work-section shell"
        aria-labelledby="work-heading"
      >
        <div className="work-intro">
          <h2 id="work-heading">
            Selected work<span> (04)</span>
          </h2>
          <p>
            A few things I’ve built,
            <br />
            and the problems behind them.
          </p>
        </div>
        <div className="project-grid">
          {projects.map((project, i) => (
            <article
              className={`work-project project-${i + 1}`}
              key={project.id}
            >
              <div className="project-heading">
                <div>
                  <span className="mono project-meta">
                    0{i + 1} / {project.category}
                  </span>
                  <h3>
                    <Link to={`/projects/${project.slug}`}>
                      {project.title}
                    </Link>
                  </h3>
                </div>
                <Link
                  className="project-link-circle"
                  to={`/projects/${project.slug}`}
                  aria-label={`Explore ${project.title}`}
                >
                  <ArrowUpRight strokeWidth={1.3} />
                </Link>
              </div>
              <ProjectPreview project={project} priority={i === 0} />
              <div className="project-description">
                <p>{project.summary}</p>
                <Link
                  className="underlined-link"
                  to={`/projects/${project.slug}`}
                >
                  Explore project <ArrowUpRight size={17} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <AboutContent />
      <ContactBlock />
    </>
  );
}
function ProjectPage() {
  const { slug } = useParams();
  const project = findProject(slug);
  if (!project) return <NotFound />;
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <>
      <section className="project-page shell">
        <Link className="back-link" to="/#work">
          <ArrowLeft size={17} /> All projects
        </Link>
        <div className="detail-heading">
          <div>
            <p className="mono">
              {project.category} / {project.year}
            </p>
            <h1>
              {project.title}
              <span>.</span>
            </h1>
          </div>
          <div>
            <p>{project.summary}</p>
            <Button asChild className="hero-button">
              <a href={project.link} target="_blank" rel="noreferrer">
                View live project <ArrowUpRight size={18} />
              </a>
            </Button>
          </div>
        </div>
        <div className={`detail-gallery ${project.theme}`}>
          <Suspense
            fallback={
              <p role="status" className="gallery-loading">
                Loading screenshots…
              </p>
            }
          >
            <Gallery key={project.id} project={project} />
          </Suspense>
        </div>
        <div className="project-overview">
          <h2>The project</h2>
          <div>
            <p>{project.description}</p>
            <div className="tags">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="project-tag">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <Link className="next-project" to={`/projects/${next.slug}`}>
          <span className="mono">NEXT PROJECT</span>
          <span>{next.title}</span>
          <ArrowUpRight />
        </Link>
      </section>
      <ContactBlock />
    </>
  );
}
function NotFound() {
  return (
    <section className="shell not-found">
      <p className="mono">404 / NOT FOUND</p>
      <h1>
        Nothing here.
        <br />
        Plenty to explore.
      </h1>
      <Button asChild className="hero-button">
        <Link to="/#work">
          Back to my work <ArrowUpRight />
        </Link>
      </Button>
    </section>
  );
}
export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <PageEffects />
      <Header />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/about"
            element={
              <>
                <div className="page-label shell mono">ABOUT MUHAMMED</div>
                <AboutContent />
                <ContactBlock />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <div className="contact-page">
                <ContactBlock />
              </div>
            }
          />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer shell">
        <span>© {new Date().getFullYear()} Muhammed Agbaje</span>
        <span>Made with React. Refined with care.</span>
        <a href="#main">Back to top ↑</a>
      </footer>
      <Toaster position="bottom-right" richColors closeButton />
    </>
  );
}
