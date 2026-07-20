import { BiCalendar, BiUser } from "react-icons/bi";
import { useAuth } from "../contexts/AuthContext";
import "../styles/profileHeader.css";

function ProfileHeader() {
  const { userProfile } = useAuth();
  const date = userProfile?.createdAt?.toDate();
  const formattedDate = date?.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="profile-header">
      <div className="user-profile-details">
        <div className="user-profile-card">
          <div className="profile-avatar mono">{userProfile?.shortName || "UR"}</div>
          <div className="profile-identity">
            <div className="profile-name">
              <h2 className="display">{userProfile?.username || "User"}</h2>
              <div className="profile-role mono">{userProfile?.role || "User"}</div>
            </div>
            <div className="profile-meta mono">
              <span className="profile-user-email">{userProfile?.email||"--------@example.com"}</span>
              <p className="devider">·</p>
              <span className="profile-user-account-createdAt">
                Member since {formattedDate || "------"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mobile-profile-details">
        <span className="mobile-profile-user-acc-createdAt">
          <BiCalendar /> Member since {formattedDate || "------"}
        </span>
        <span className="mobile-profile-user-role">
          <BiUser />
          {userProfile?.role || "User"}
        </span>
      </div>
      <button className="edit-profile-btn body">Edit Profile</button>
    </div>
  );
}

export default ProfileHeader;
