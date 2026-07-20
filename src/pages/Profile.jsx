import React, { useState } from "react";
import ProfileHeader from "../components/ProfileHeader";
import ProfileStats from "../components/ProfileStats";
import "../styles/profile.css";
import LikedTab from "../components/LikedTab";

function Profile() {
  const [openTab, setOpenTab] = useState("liked");
  return (
    <>
      <ProfileHeader />
      <ProfileStats />
      <div className="profile-tabs">
        <div
          className={`profile-tab mono ${openTab === "liked" ? "active" : null}`}
          onClick={() => setOpenTab("liked")}
        >
          LIKED
        </div>
        <div
          className={`profile-tab mono ${openTab === "bookmarked" ? "active" : null}`}
          onClick={() => setOpenTab("bookmarked")}
        >
          BOOKMARKED
        </div>
      </div>
      {openTab === "liked" ? <LikedTab /> : null}
    </>
  );
}

export default Profile;
