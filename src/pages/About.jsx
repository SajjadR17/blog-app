import { BiEnvelope, BiGlobe, BiLogoGithub } from "react-icons/bi";
import "../styles/about.css";

function About() {
  return (
    <>
      <h1 className="about-page-title display">About</h1>
      <div className="about-social">
        <a
          href="mailto:Roohandehsredi6@gmail.com"
          aria-label="Email"
          className="social-icon"
        >
          <BiEnvelope size={18} />
        </a>
        <a
          href="https://sajjadroohandeh.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Portfolio"
          className="social-icon"
        >
          <BiGlobe size={18} />
        </a>
        <a
          href="https://github.com/SajjadR17"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="social-icon"
        >
          <BiLogoGithub size={18} />
        </a>
      </div>
      <div className="about body">
        <span>
          Ink & Field started as a place to slow down and look twice at ordinary
          things — a doorknob, a walk with no destination, the particular
          silence of a July afternoon. Most weeks it's an essay like that. Some
          weeks it's a shorter note on something closer to the desk: databases,
          state management, the small decisions that make software easier or
          harder to live with later.
        </span>
        <span>Written by Sajjad Roohandeh</span>
      </div>
    </>
  );
}

export default About;
