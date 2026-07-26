import { BiMenu, BiMoon, BiSearch, BiSun, BiUser } from "react-icons/bi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../styles/header.css";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { logout } from "../lib/auth";
import {
  LuBadgeCheck,
  LuBookOpen,
  LuCircleUser,
  LuFileText,
  LuLogIn,
  LuLogOut,
  LuSquarePen,
  LuUser,
  LuX,
} from "react-icons/lu";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <header>
        <nav className="nav body">
          <Link to={"/essays"} className="logo">
            ✦ <span>Ink & Field</span>
          </Link>
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
            {user && userProfile?.role === "admin" && (
              <NavLink to={"/add-blog"} className="quick-link">
                NEW POST
              </NavLink>
            )}
          </div>
          <div className="nav-right">
            <>
              <BiUser
                className="user-icon"
                onClick={
                  user ? () => navigate("/profile") : () => navigate("/login")
                }
                size={20}
                cursor={"pointer"}
              />
              <BiMenu
                onClick={() => setMenuOpen(true)}
                className="menu-icon"
                size={25}
                cursor={"pointer"}
              />
            </>
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
            <LuX />
          </span>
        </div>
        <div className="menu">
          <div className="menu-links">
            <NavLink
              to={"/essays"}
              onClick={() => setMenuOpen(false)}
              className="menu-link"
            >
              <LuFileText size={20} />
              ESSAYS
            </NavLink>
            <NavLink
              to={"/journal"}
              onClick={() => setMenuOpen(false)}
              className="menu-link"
            >
              <LuBookOpen size={20} />
              JOURNAL
            </NavLink>
            <NavLink
              to={"/about"}
              onClick={() => setMenuOpen(false)}
              className="menu-link"
            >
              <LuUser size={20} />
              ABOUT
            </NavLink>
            {!user && (
              <NavLink
                to={"/login"}
                onClick={() => setMenuOpen(false)}
                className="menu-link"
              >
                <LuLogIn size={20} />
                LOGIN
              </NavLink>
            )}
            {user && userProfile?.role === "admin" && (
              <NavLink
                to={"/add-blog"}
                onClick={() => setMenuOpen(false)}
                className="menu-link"
              >
                <LuSquarePen size={20} />
                NEW POST
              </NavLink>
            )}
            {user && userProfile && (
              <Link
                to={"/essays"}
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="menu-link"
              >
                <LuLogOut size={20} />
                LOGOUT
              </Link>
            )}
          </div>
          {user && userProfile && (
            <div
              className="menu-profile-card"
              onClick={() => {
                navigate("/profile");
                setMenuOpen(false);
              }}
            >
              <div className="menu-profile-avatar">
                {userProfile?.photoURL ? (
                  <img
                    src={`${userProfile?.photoURL}`}
                    className="menu-profile-img"
                  />
                ) : (
                  userProfile?.shortName
                )}
              </div>
              <div className="profile-info">
                <span className="username">{userProfile?.username}</span>
                <span className="userRole">{userProfile?.role}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Header;
