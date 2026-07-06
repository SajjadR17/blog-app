import "../styles/about.css";

function About() {
  return (
    <>
      <h1 className="about-page-title">About</h1>
      <div className="about body">
        <span>
          Ink & Field started as a place to slow down and look twice at ordinary
          things — a doorknob, a walk with no destination, the particular
          silence of a July afternoon. Most weeks it's an essay like that. Some
          weeks it's a shorter note on something closer to the desk: databases,
          state management, the small decisions that make software easier or
          harder to live with later.
        </span>
        <span>
          There's no comments section here on purpose. Not because disagreement
          is unwelcome, but because a piece of writing deserves to exist for a
          moment before it's argued with.
        </span>
        <span>Written by Sajjad Roohandeh</span>
        <span>Email: Roohandehsredi6@gmail.com</span>
        <span>
          Portfolio: <a href="sajjadroohandeh.com">sajjadroohandeh.com</a>
        </span>
      </div>
    </>
  );
}

export default About;
