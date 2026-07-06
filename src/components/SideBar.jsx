import { MdMessage } from "react-icons/md";
import "../styles/sideBar.css";

function SideBar() {
  return (
    <>
      <div className="sidebar-about">
        <span className="mono about-title">ABOUT THE BLOG</span>
        <span className="body about-content">
          Short essays on paying closer attention to ordinary things, with the
          occasional technical note on software engineering.
        </span>
        <span className="body about-content">
          © 2026 Blog, All Rights Reserved
        </span>
        <span className="body about-content">
          Developed by Sajjad Roohandeh with Love
        </span>
      </div>
      <div className="categories">
        <span className="mono categories-title">CATEGORIES</span>
        <span className="body categories-content">
          <div className="category">
            <div className="category-circle"></div>Attention
          </div>
          <div className="category">
            <div className="category-circle"></div>Objects
          </div>
          <div className="category">
            <div className="category-circle"></div>Season
          </div>
          <div className="category">
            <div className="category-circle"></div>Frontend
          </div>
          <div className="category">
            <div className="category-circle"></div>Backend
          </div>
          <div className="category">
            <div className="category-circle"></div>Design
          </div>
        </span>
      </div>
      <div className="newsletter">
        <span className="mono newsletter-title">
          <MdMessage />
          ONE LETTER A WEEK
        </span>
        <span className="body newsletter-content">
          No noise, no archive dump - just the newest post.
        </span>
        <input
          type="text"
          placeholder="you@gmail.com"
          className="newsletter-input body"
        />
        <button className="join-newsletter-btn">Join</button>
      </div>
    </>
  );
}

export default SideBar;
