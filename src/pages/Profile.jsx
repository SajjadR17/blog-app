import React, { useState } from "react";
import ProfileHeader from "../components/Profile Page/ProfileHeader";
import ProfileStats from "../components/Profile Page/ProfileStats";
import "../styles/profile.css";
import LikedTab from "../components/Profile Page/LikedTab";
import BookmarkedTab from "../components/Profile Page/BookmarkedTab";
import { useAuth } from "../contexts/AuthContext";
import { BiSad } from "react-icons/bi";

function Profile() {
  const [openTab, setOpenTab] = useState("liked");
  const { user, userProfile } = useAuth();

  if (!user || !userProfile) {
    return (
      <div className="app-empty-profile">
        <BiSad size={40} color="var(--text-secondary)" />
        <span className="mono" style={{ color: "var(--text-secondary)" }}>
          ERROR LOADING PROFILE
        </span>
      </div>
    );
  }

  return (
    <>
      <ProfileHeader />
      <ProfileStats />
      <div className="profile-tabs">
        <div
          className={`profile-tab mono ${openTab === "liked" ? "active" : null}`}
          onClick={() => setOpenTab("liked")}
        >
          LIKES
        </div>
        <div
          className={`profile-tab mono ${openTab === "bookmarked" ? "active" : null}`}
          onClick={() => setOpenTab("bookmarked")}
        >
          BOOKMARKES
        </div>
      </div>
      {openTab === "liked" ? <LikedTab /> : <BookmarkedTab />}
    </>
  );
}

export default Profile;
