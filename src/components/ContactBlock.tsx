import { Copy, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";
export default function ContactBlock() {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      toast.success("Email copied");
    } catch {
      toast.error(
        "Could not copy. Select the address below, or use the email link.",
      );
    }
  };
  return (
    <section
      className="contact-block"
      id="contact"
      tabIndex={-1}
      aria-labelledby="contact-heading"
    >
      <div className="shell">
        <div className="section-kicker">
          <span className="mono">LET’S TALK</span>
          <span>{profile.location} · UTC+1</span>
        </div>
        <div className="contact-heading-row">
          <h2 id="contact-heading">
            Have something
            <br />
            in mind?
          </h2>
          <a
            href={`mailto:${profile.email}`}
            className="contact-circle"
            aria-label="Email Muhammed"
          >
            <ArrowUpRight strokeWidth={1} aria-hidden="true" />
          </a>
        </div>
        <div className="contact-bottom">
          <a href={`mailto:${profile.email}`} className="email-link">
            {profile.email}
          </a>
          <Button variant="ghost" className="copy-button" onClick={copy}>
            <Copy size={16} />
            Copy email
          </Button>
          <div className="socials">
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight size={15} />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
