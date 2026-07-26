import { useEffect, useRef, useState } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { BiTrash } from "react-icons/bi";
import { CgArrowRight } from "react-icons/cg";

import { db } from "../../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { getCroppedImg } from "../../utils/helpers";
import ImageCropper from "../ImageCropper";

function EditProfileModal({ open, onClose }) {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState(userProfile?.username || "");
  const [email, setEmail] = useState(userProfile?.email || "");
  const [password, setPassword] = useState("");

  const [info, setInfo] = useState("");
  const [errors, setErrors] = useState({});

  const [selectedImage, setSelectedImage] = useState(null);
  const [cropPixels, setCropPixels] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userProfile) {
      setUsername(userProfile.username || "");
      setEmail(userProfile.email || "");
    }
  }, [userProfile, open]);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const closeModal = () => {
    setUsername(userProfile?.username || "");
    setEmail(userProfile?.email || "");
    setPassword("");

    setErrors({});
    setInfo("");

    setSelectedImage(null);
    setCropPixels(null);

    onClose();
  };

  const uploadAvatar = async (file) => {
    setErrors({});
    setInfo("");

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
      setErrors((prev) => ({
        ...prev,
        imageError: "Please select an image",
      }));
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

      await updateDoc(doc(db, "users", user.uid), {
        photoURL: url,
      });

      setSelectedImage(null);
    } catch (err) {
      console.error(err);

      setErrors((prev) => ({
        ...prev,
        imageError: "Upload failed",
      }));
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setErrors({});
    setInfo("");

    try {
      await updateDoc(doc(db, "users", user.uid), {
        photoURL: "",
      });
    } catch (err) {
      console.error(err);
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
        await updateDoc(userRef, {
          username: trimmedUsername,
        });
      }

      if (emailChanged) {
        await reauthenticate(password);

        await verifyBeforeUpdateEmail(user, trimmedEmail);

        setInfo(
          `A verification link was sent to ${trimmedEmail}. Please check your inbox or spam to confirm the change.`,
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
          setErrors((prev) => ({
            ...prev,
            passError: "Incorrect password.",
          }));
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

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      setErrors((prev) => ({
        ...prev,
        passError: "Password required for account delete.",
      }));
      return;
    }

    setDeleting(true);
    setErrors({});
    setInfo("");

    try {
      await reauthenticate(password);

      await deleteUser(user);

      await deleteDoc(doc(db, "users", user.uid));

      navigate("/essays");
    } catch (err) {
      switch (err.code) {
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setErrors((prev) => ({
            ...prev,
            passError: "Incorrect password.",
          }));
          break;

        default:
          setErrors((prev) => ({
            ...prev,
            generalError: "Something went wrong.",
          }));
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;

    setEmail(value);

    setErrors((prev) => ({
      ...prev,
      passError: "",
      emailError: "",
    }));

    if (value.trim() !== userProfile.email && password.trim().length === 0) {
      setErrors((prev) => ({
        ...prev,
        passError: "Password required for email change.",
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;

    setPassword(value);

    setErrors((prev) => ({
      ...prev,
      passError: "",
    }));

    if (email.trim() !== userProfile.email && value.trim().length === 0) {
      setErrors((prev) => ({
        ...prev,
        passError: "Password required for email change.",
      }));
    }
  };

  const handleDisableBtn = () => {
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const usernameChanged = trimmedUsername !== userProfile?.username;

    const emailChanged = trimmedEmail !== userProfile?.email;

    const isEmpty = !trimmedUsername || !trimmedEmail;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const invalidEmail = !emailRegex.test(trimmedEmail);

    const passwordRequired = emailChanged && !trimmedPassword;

    const noChanges = !usernameChanged && !emailChanged;

    const isBusy = uploading || isSaving || deleting;

    return isEmpty || invalidEmail || passwordRequired || noChanges || isBusy;
  };

  return (
    <>
      {selectedImage && (
        <ImageCropper
          image={selectedImage}
          onCropComplete={setCropPixels}
          uploading={uploading}
          onCancel={() => setSelectedImage(null)}
          onSave={handleSaveCrop}
        />
      )}

      <div className="edit-profile-modal">
        <div className="epm-overlay" onClick={closeModal} />

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
                  src={userProfile.photoURL}
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
              onChange={handleEmailChange}
            />

            {errors.emailError && (
              <p className="email-error mono">{errors.emailError}</p>
            )}
          </div>
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
              onChange={handlePasswordChange}
            />

            {errors.passError && (
              <p className="pass-error mono">{errors.passError}</p>
            )}
          </div>

          <div className="delete-acc-container" onClick={handleDeleteAccount}>
            <div className="delete-acc-container-left">
              <BiTrash size={17} color="var(--accent2)" />

              <span>{deleting ? "Deleting..." : "Delete Account"}</span>
            </div>

            <CgArrowRight size={17} color="var(--accent2)" />
          </div>

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
    </>
  );
}

export default EditProfileModal;
