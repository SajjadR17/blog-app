import { BiMenu, BiMoon, BiSearch, BiSun } from "react-icons/bi";
import { Link, NavLink } from "react-router-dom";
import "../styles//header.css";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { logout } from "../lib/auth";
import { useTheme } from "../contexts/ThemeContext";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, userProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <header>
        <nav className={`sajjad-nav body ${searchOpen ? "search-open" : null}`}>
          <span className={`logo ${searchOpen ? "search-open" : null}`}>
            ✦ <span>Ink & Field</span>
          </span>
          <div className="quick-links">
            <NavLink to={"/essays"} className="quick-link">
              ESSAYS
            </NavLink>
            <NavLink to={"/journal"} className="quick-link">
              JOURNAL
            </NavLink>
            <NavLink to={"/about"} className="quick-link">
              ABOUT
            </NavLink>
            {!user && (
              <NavLink to={"/login"} className="quick-link">
                LOGIN
              </NavLink>
            )}
            {user && userProfile.role === "admin" && (
              <NavLink to={"/add-blog"} className="quick-link">
                NEW POST
              </NavLink>
            )}
            {user && (
              <button onClick={() => logout()} className="quick-link">
                LOGOUT
              </button>
            )}
          </div>
          <div className="nav-right">
            {searchOpen ? (
              <div className="search-input-container">
                <BiSearch size={20} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search a blog title"
                />
                <span
                  onClick={() => setSearchOpen(false)}
                  className="close-search-input"
                >
                  ✖
                </span>
              </div>
            ) : (
              <>
                {theme === "light" ? (
                  <BiMoon
                    size={20}
                    cursor={"pointer"}
                    onClick={toggleTheme}
                    className="theme-icon"
                  />
                ) : (
                  <BiSun
                    size={20}
                    cursor={"pointer"}
                    onClick={toggleTheme}
                    className="theme-icon"
                  />
                )}
                <BiSearch
                  className="search-icon"
                  size={20}
                  cursor={"pointer"}
                  onClick={() => setSearchOpen(true)}
                />
                <BiMenu
                  onClick={() => setMenuOpen(true)}
                  className="menu-icon"
                  size={25}
                  cursor={"pointer"}
                />
              </>
            )}
          </div>
        </nav>
      </header>
      <div
        onClick={() => setMenuOpen(false)}
        className={`overlay ${menuOpen ? "active" : null}`}
      ></div>
      <div className={`mobile-menu body ${menuOpen ? "active" : null}`}>
        <div className="menu-header">
          <span>Menu</span>
          <span className="close-menu-btn" onClick={() => setMenuOpen(false)}>
            ✖
          </span>
        </div>
        <div className="menu">
          <div className="menu-links">
            <Link
              to={"/essays"}
              onClick={() => setMenuOpen(false)}
              className="menu-link"
            >
              ESSAYS
            </Link>
            <Link
              to={"/journal"}
              onClick={() => setMenuOpen(false)}
              className="menu-link"
            >
              JOURNAL
            </Link>
            <Link
              to={"/about"}
              onClick={() => setMenuOpen(false)}
              className="menu-link"
            >
              ABOUT
            </Link>
            {!user && (
              <Link
                to={"/login"}
                onClick={() => setMenuOpen(false)}
                className="menu-link"
              >
                LOGIN
              </Link>
            )}
            {user && userProfile.role === "admin" && (
              <Link
                to={"/add-blog"}
                onClick={() => setMenuOpen(false)}
                className="menu-link"
              >
                NEW POST
              </Link>
            )}
            {user && (
              <Link
                to={"/essay"}
                onClick={() => logout()}
                className="menu-link"
              >
                LOGOUT
              </Link>
            )}
          </div>
          {user && (
            <div className="menu-profile-card">
              <div className="profile-img">{userProfile.shortName}</div>
              <div className="profile-info">
                <span className="username">{userProfile.username}</span>
                <span className="userRole">{userProfile.role}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Header;
