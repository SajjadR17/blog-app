import { useState } from "react";
import { BiCalendar, BiUser } from "react-icons/bi";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/profileHeader.css";
import { logout } from "../../lib/auth";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "./EditProfileModal";

function ProfileHeader() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);

  const date = userProfile?.createdAt?.toDate();

  const formattedDate = date?.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <div className="profile-header">
        <div className="user-profile-details">
          <div className="user-profile-card">
            {userProfile?.photoURL ? (
              <img
                src={userProfile.photoURL}
                className="profile-avatar-img"
                alt="avatar"
              />
            ) : (
              <div className="profile-avatar mono">
                {userProfile?.shortName}
              </div>
            )}

            <div className="profile-identity">
              <div className="profile-name">
                <h2 className="display">{userProfile?.username}</h2>

                <div className="profile-role mono">{userProfile?.role}</div>
              </div>

              <div className="profile-meta mono">
                <span>{userProfile?.email}</span>

                <p className="devider">·</p>

                <span>Member since {formattedDate}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mobile-profile-details">
          <span className="mobile-profile-user-acc-createdAt">
            <BiCalendar />
            Member since {formattedDate}
          </span>

          <span className="mobile-profile-user-role">
            <BiUser />
            {userProfile?.role}
          </span>
        </div>

        <div className="profile-action-btns">
          <button
            className="edit-profile-btn body"
            onClick={() => setModalOpen(true)}
          >
            Edit Profile
          </button>

          <button
            className="logout-profile-btn body"
            onClick={async () => {
              await logout();
              navigate("/essays");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <EditProfileModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

export default ProfileHeader;
