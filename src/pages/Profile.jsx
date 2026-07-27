import React, { useEffect, useState } from "react";
import ProfileHeader from "../components/Profile Page/ProfileHeader";
import ProfileStats from "../components/Profile Page/ProfileStats";
import "../styles/profile.css";
import LikedTab from "../components/Profile Page/LikedTab";
import BookmarkedTab from "../components/Profile Page/BookmarkedTab";
import PostsTab from "../components/Profile Page/PostsTab";
import { useAuth } from "../contexts/AuthContext";
import { BiSad, BiTrash } from "react-icons/bi";
import { FiDelete } from "react-icons/fi";
import { CgArrowRight } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [openTab, setOpenTab] = useState("liked");
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !userProfile) {
      navigate("/essays");
    }
  }, [user, userProfile, navigate]);

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
        {userProfile?.role === "admin" && (
          <div
            className={`profile-tab mono ${openTab === "posts" ? "active" : null}`}
            onClick={() => setOpenTab("posts")}
          >
            POSTS
          </div>
        )}
      </div>
      {openTab === "liked" && <LikedTab />}
      {openTab === "bookmarked" && <BookmarkedTab />}
      {openTab === "posts" && userProfile.role === "admin" && <PostsTab />}
    </>
  );
}

export default Profile;
