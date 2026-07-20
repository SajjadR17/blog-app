import React from "react";
import "../styles/profileStats.css";
import { useAuth } from "../contexts/AuthContext";

function ProfileStats() {
  const { userProfile } = useAuth();

  return (
    <div className="profile-stats">
      <div className="profile-state">
        <span className="state-value">{userProfile.likes.length}</span>
        <span className="state-key mono">Likes</span>
      </div>
      <div className="profile-state">
        <span className="state-value">{userProfile.bookmarks.length}</span>
        <span className="state-key mono">Bookmarks</span>
      </div>
      <div className="profile-state">
        <span className="state-value">{userProfile.followings.length}</span>
        <span className="state-key mono">Followings</span>
      </div>
      <div className="profile-state">
        <span className="state-value">{userProfile.followers.length}</span>
        <span className="state-key mono">Followers</span>
      </div>
    </div>
  );
}

export default ProfileStats;
