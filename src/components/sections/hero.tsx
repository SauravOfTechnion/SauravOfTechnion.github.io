import { FlowField } from "@/components/flow-field";
import { profile } from "@/data/profile";

export function Hero() {
  return (
    <section id="top" className="hero landscape-hero" aria-labelledby="hero-name">
      <FlowField />
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-intro"><span className="intro-line" aria-hidden="true" />{profile.name}</p>
          <h1 id="hero-name">Give intelligence<br />a world to move.</h1>
          <p className="hero-tagline">Aerospace engineering. Physical intelligence.<br />I build systems that learn from the world,<br />and act within it.</p>
          <div className="hero-cta"><a className="btn btn-primary" href="#projects">Explore my work <svg width="17" height="17" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v14m-5-5 5 5 5-5" /></svg></a><a className="hero-contact" href="#contact">Let’s connect</a></div>
          <div className="hero-affiliation"><span className="affiliation-mark" aria-hidden="true">⌘</span><p>Next chapter: Technion<span>Incoming M.Sc. · Mechanical Engineering</span></p></div>
        </div>
      </div>
      <div className="hero-floor"><p>A study in motion, perception, and possibility.</p><a href="#interests">Enter the field <span aria-hidden="true">↓</span></a></div>
    </section>
  );
}
