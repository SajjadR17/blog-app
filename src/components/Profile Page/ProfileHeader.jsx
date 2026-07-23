import { BiCalendar, BiUser } from "react-icons/bi";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/profileHeader.css";
import { logout } from "../../lib/auth";
import { useEffect, useRef, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { getCroppedImg } from "../../utils/helpers";
import ImageCropper from "../ImageCropper";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

function ProfileHeader() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const date = userProfile?.createdAt?.toDate();
  const [username, setUsername] = useState(userProfile?.username || "");
  const [email, setEmail] = useState(userProfile?.email || "");
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [info, setInfo] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [cropPixels, setCropPixels] = useState(null);
  const [password, setPassword] = useState("");
  const formattedDate = date?.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userProfile) {
      setUsername(userProfile?.username || "");
      setEmail(userProfile?.email || "");
    }
  }, [userProfile]);

  const closeModal = () => {
    setModalOpen(false);
    setUsername(userProfile?.username);
    setEmail(userProfile?.email);
    setPassword("");
    setErrors({});
    setInfo("");
    setSelectedImage(null);
    setCropPixels(null);
  };

  const uploadAvatar = async (file) => {
    setErrors({});
    const formData = new FormData();

    formData.append("file", file);

    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    const data = await res.json();

    return data.secure_url;
  };

  const handleSelectImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, imageError: "Please select an image" }));

      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        imageError: "Image size must be less than 2MB",
      }));

      return;
    }

    setErrors({});

    const url = URL.createObjectURL(file);

    setSelectedImage(url);
  };

  const handleSaveCrop = async () => {
    try {
      setUploading(true);

      setErrors({});

      const croppedFile = await getCroppedImg(selectedImage, cropPixels);

      const url = await uploadAvatar(croppedFile);

      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        photoURL: url,
      });

      setSelectedImage(null);
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({ ...prev, imageError: "Upload failed" }));
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        photoURL: "",
      });
    } catch (error) {
      console.error("Remove error:", error);
    }
  };

  const reauthenticate = async (currentPassword) => {
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword,
    );
    await reauthenticateWithCredential(user, credential);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setInfo("");

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    const usernameChanged = trimmedUsername !== userProfile?.username;
    const emailChanged = trimmedEmail !== userProfile?.email;

    const userRef = doc(db, "users", user.uid);

    try {
      setIsSaving(true);

      if (usernameChanged) {
        await updateDoc(userRef, { username: trimmedUsername });
      }

      if (emailChanged) {
        await reauthenticate(password);
        await verifyBeforeUpdateEmail(user, trimmedEmail);
        setInfo(
          `A verification link was sent to ${trimmedEmail} Please check your inbox or spam to confirm the change.`,
        );
      }

      if (!emailChanged) {
        closeModal();
      } else {
        setPassword("");
      }
    } catch (err) {
      switch (err.code) {
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setErrors((prev) => ({ ...prev, passError: "Incorrect password." }));
          break;

        case "auth/email-already-in-use":
          setErrors((prev) => ({
            ...prev,
            emailError: "This email is already in use.",
          }));
          break;

        case "auth/invalid-new-email":
          setErrors((prev) => ({
            ...prev,
            emailError: "Invalid email address.",
          }));
          break;

        case "auth/requires-recent-login":
          setErrors((prev) => ({
            ...prev,
            authError: "Please sign in again.",
          }));
          break;

        default:
          setErrors((prev) => ({
            ...prev,
            generalError: "Something went wrong.",
          }));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisableBtn = () => {
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPass = password.trim();

    const emailChanged = trimmedEmail !== userProfile?.email;
    const usernameChanged = trimmedUsername !== userProfile?.username;

    const isEmpty = !trimmedUsername || !trimmedEmail;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailInvalid = !emailRegex.test(trimmedEmail);

    const passwordRequiredButMissing = emailChanged && !trimmedPass;

    const noChanges = !usernameChanged && !emailChanged;

    const isBusy = isSaving || uploading;

    return (
      isEmpty ||
      isEmailInvalid ||
      noChanges ||
      passwordRequiredButMissing ||
      isBusy
    );
  };

  const emailChanged = email.trim() !== userProfile?.email;

  return (
    <>
      {selectedImage && (
        <ImageCropper
          image={selectedImage}
          onCropComplete={setCropPixels}
          uploading={uploading}
          onCancel={() => {
            setSelectedImage(null);
          }}
          onSave={handleSaveCrop}
        />
      )}
      <div className="profile-header">
        <div className="user-profile-details">
          <div className="user-profile-card">
            {userProfile?.photoURL ? (
              <img
                src={userProfile?.photoURL}
                className="profile-avatar-img"
                alt="avatar"
              />
            ) : (
              <div className="profile-avatar mono">
                {userProfile?.shortName || "UR"}
              </div>
            )}
            <div className="profile-identity">
              <div className="profile-name">
                <h2 className="display">{userProfile?.username || "User"}</h2>
                <div className="profile-role mono">
                  {userProfile?.role || "User"}
                </div>
              </div>
              <div className="profile-meta mono">
                <span className="profile-user-email">
                  {userProfile?.email || "--------@example.com"}
                </span>
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
        <div className="profile-action-btns">
          <button
            className="edit-profile-btn body"
            onClick={() => setModalOpen(true)}
          >
            Edit Profile
          </button>
          <button
            className="logout-profile-btn body"
            onClick={() => {
              logout();
              navigate("/essays");
            }}
          >
            Logout
          </button>
        </div>
      </div>
      {modalOpen && (
        <div className="edit-profile-modal">
          <div className="epm-overlay" onClick={closeModal}></div>
          <form
            className="epm-modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <div className="epm-head">
              <h2 className="display">Edit Profile</h2>
              <button
                type="button"
                className="epm-close-btn"
                aria-label="Close"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>

            {(errors.generalError || errors.authError || errors.imageError) && (
              <p className="form-error mono">
                {errors.authError || errors.generalError || errors.imageError}
              </p>
            )}

            {info && <p className="form-succuss mono">{info}</p>}

            <div className="epm-avatar-row mono">
              <div className="epm-avatar">
                {userProfile?.photoURL ? (
                  <img
                    src={userProfile?.photoURL}
                    className="epm-avatar-img"
                    alt="avatar"
                  />
                ) : (
                  userProfile?.shortName
                )}
              </div>

              <div className="epm-avatar-btns">
                <button
                  type="button"
                  disabled={uploading}
                  className="epm-avatar-btn"
                  onClick={() => fileInputRef.current.click()}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>

                <button
                  type="button"
                  disabled={uploading}
                  className="epm-avatar-btn danger"
                  onClick={handleRemoveAvatar}
                >
                  Remove
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleSelectImage}
              />
            </div>

            <div className="epm-field">
              <label htmlFor="name" className="mono">
                Name
              </label>
              <input
                id="name"
                type="text"
                spellCheck={false}
                className="body"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.usernameError && (
                <p className="name-error mono">{errors.usernameError}</p>
              )}
            </div>

            <div className="epm-field">
              <label htmlFor="email" className="mono">
                Email
              </label>
              <input
                id="email"
                type="text"
                spellCheck={false}
                className="body"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.emailError && (
                <p className="email-error mono">{errors.emailError}</p>
              )}
            </div>

            {emailChanged && (
              <div className="epm-field">
                <label htmlFor="password" className="mono">
                  Current Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="body"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Confirm your password to change email"
                />
                {errors.passError && (
                  <p className="pass-error mono">{errors.passError}</p>
                )}
              </div>
            )}

            <div className="epm-footer">
              <button
                type="button"
                className="epm-cancel-btn"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={handleDisableBtn()}
                className="epm-save-btn"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default ProfileHeader;
