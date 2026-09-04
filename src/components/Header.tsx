import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { ArrowUpRight, Menu } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";
export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const close = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);
  useEffect(() => {
    setOpen(false);
  }, [location]);
  return (
    <header className="header shell">
      <Link to="/" aria-label="Muhammed Agbaje home" className="wordmark">
        ma<span>↗</span>
      </Link>
      <p className="header-role">
        Frontend developer
        <br />
        Software engineer
      </p>
      <nav className="desktop-nav" aria-label="Main navigation">
        <Link to="/#work">
          Work <sup>04</sup>
        </Link>
        <Link to="/about">About</Link>
        <Link to="/contact">
          Contact <ArrowUpRight size={16} />
        </Link>
      </nav>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            className="mobile-menu"
            variant="ghost"
            aria-label="Open navigation"
          >
            <Menu size={23} />
          </Button>
        </SheetTrigger>
        <SheetContent className="mobile-sheet">
          <SheetTitle className="sheet-heading">Explore</SheetTitle>
          <SheetDescription>
            Work, background, and ways to get in touch.
          </SheetDescription>
          <nav aria-label="Mobile navigation">
            {[
              ["Work", "/#work"],
              ["About", "/about"],
              ["Contact", "/contact"],
            ].map(([label, to], i) => (
              <SheetClose asChild key={to}>
                <Link to={to}>
                  <span className="mono">0{i + 1}</span>
                  {label}
                  <ArrowUpRight />
                </Link>
              </SheetClose>
            ))}
          </nav>
          <a
            className="sheet-resume"
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
          >
            View résumé <ArrowUpRight size={20} />
          </a>
          <a className="sheet-email" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </SheetContent>
      </Sheet>
    </header>
  );
}
