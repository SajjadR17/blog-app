import { useEffect, useState } from "react";
import "../styles/auth.css";
import { googleLogin, signup } from "../lib/auth";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { sendEmailVerification, reload } from "firebase/auth";
import { auth } from "../../firebase";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Signup() {
  const [loginLoading, setLoginLoading] = useState(false);
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);
  const [passInputValue, setPassInputValue] = useState("");
  const [repeatPassInputValue, setRepeatPassInputValue] = useState("");
  const [emailInputValue, setEmailInputValue] = useState("");
  const [usernameInputValue, setUsernameInputValue] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const [usernameErr, setUsernameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");
  const [repeatPassErr, setRepeatPassErr] = useState("");

  const [locallyVerified, setLocallyVerified] = useState(null);
  const [refreshingStatus, setRefreshingStatus] = useState(false);

  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  useEffect(() => {
    if (user) setLocallyVerified(user.emailVerified);
  }, [user]);

  const isVerified = locallyVerified ?? user?.emailVerified ?? false;

  function validateUsername(value) {
    if (value.trim().length === 0) return "Name is required.";
    if (value.trim().length < 2) return "Name must be at least 2 characters.";
    const regex = /^[a-zA-Z\s]+$/;
    if (!regex.test(value.trim())) {
      return "Name can only contain letters and spaces.";
    }
    return "";
  }

  function validateEmail(value) {
    if (value.trim().length === 0) return "Email is required.";
    if (!EMAIL_REGEX.test(value.trim())) return "Enter a valid email address.";
    return "";
  }

  function validatePassword(value) {
    if (value.length === 0) return "Password is required.";
    if (value.length < 6 || value.length > 32)
      return "Password must be between 6-32 characters.";
    return "";
  }

  function validateRepeatPassword(value, passwordValue) {
    if (value.length === 0) return "Please repeat your password.";
    if (value !== passwordValue) return "Passwords do not match.";
    return "";
  }

  function handleUsernameChange(e) {
    const value = e.target.value;
    setUsernameInputValue(value);
    setUsernameErr(validateUsername(value));
  }

  function handleEmailChange(e) {
    const value = e.target.value;
    setEmailInputValue(value);
    setEmailErr(validateEmail(value));
  }

  function handlePasswordChange(e) {
    const value = e.target.value;
    setPassInputValue(value);
    setPassErr(validatePassword(value));
    setRepeatPassErr(validateRepeatPassword(repeatPassInputValue, value));
  }

  function handleRepeatPasswordChange(e) {
    const value = e.target.value;
    setRepeatPassInputValue(value);
    setRepeatPassErr(validateRepeatPassword(value, passInputValue));
  }

  const signupHandler = async (e) => {
    e.preventDefault();
    setError("");

    const uErr = validateUsername(usernameInputValue);
    const eErr = validateEmail(emailInputValue);
    const pErr = validatePassword(passInputValue);
    const rErr = validateRepeatPassword(repeatPassInputValue, passInputValue);

    setUsernameErr(uErr);
    setEmailErr(eErr);
    setPassErr(pErr);
    setRepeatPassErr(rErr);

    if (uErr || eErr || pErr || rErr) {
      return;
    }

    setLoginLoading(true);
    let createdUser = null;
    try {
      createdUser = await signup(
        emailInputValue.trim(),
        passInputValue.trim(),
        usernameInputValue.trim(),
      );
    } catch (err) {
      switch (err.code) {
        case "auth/network-request-failed":
          setError("Your internet connection is unavailable.");
          break;

        case "auth/email-already-in-use":
          setError("An account with this email already exists.");
          break;

        case "auth/invalid-email":
          setError("Invalid email address.");
          break;

        case "auth/weak-password":
          setError("Password should be at least 6 characters.");
          break;

        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;

        case "auth/user-disabled":
          setError("This account has been disabled.");
          break;

        default:
          setError("Something went wrong. Please try again.");
      }
      setLoginLoading(false);
      return;
    }

    try {
      await sendEmailVerification(createdUser);
    } catch (err) {
      console.log(err);
      setError(
        "Account created, but we couldn't send the verification email. You can resend it from the next screen.",
      );
    } finally {
      setLoginLoading(false);
      setUsernameInputValue("");
      setPassInputValue("");
      setRepeatPassInputValue("");
      setEmailInputValue("");
    }
  };

  const googleLoginHandler = async () => {
    setError("");
    setGoogleLoginLoading(true);
    try {
      await googleLogin();
    } catch (err) {
      switch (err.code) {
        case "auth/network-request-failed":
          setError("Your internet connection is unavailable.");
          break;

        case "auth/popup-blocked":
          setError("Popup was blocked by your browser.");
          break;

        case "auth/popup-closed-by-user":
          setError("Google sign in was cancelled.");
          break;

        case "auth/operation-not-allowed":
          setError("Google sign in is not enabled.");
          break;

        default:
          setError("Something went wrong. Please try again.");
      }
    } finally {
      setGoogleLoginLoading(false);
    }
  };

  async function handleResendVerification() {
    setResendLoading(true);
    try {
      await sendEmailVerification(auth.currentUser);
      setResendSent(true);
    } catch (err) {
      if (err.code === "auth/too-many-requests") {
        setError("Please wait a bit before requesting another email.");
      } else {
        setError("Couldn't resend the email. Please try again in a moment.");
      }
    } finally {
      setResendLoading(false);
    }
  }

  async function handleCheckVerification() {
    setRefreshingStatus(true);
    try {
      await reload(auth.currentUser);
      setLocallyVerified(auth.currentUser.emailVerified);
      if (!auth.currentUser.emailVerified) {
        setError("Still not verified — check your inbox and try again.");
      }
    } catch (err) {
      console.log(err);
      setError("Couldn't check verification status. Please try again.");
    } finally {
      setRefreshingStatus(false);
    }
  }

  useEffect(() => {
    if (error) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [error]);

  return (
    <>
      {error && (
        <div className="error-modal">
          <span className="error-text">{error}</span>
          <button className="error-modal-ok-btn" onClick={() => setError("")}>
            Ok
          </button>
        </div>
      )}
      <div className={`overlay ${error.length > 0 ? "active" : null}`}></div>
      {user ? (
        <div className="sign-in-message">
          <h2 className="display sign-in-title">You're In</h2>
          {isVerified ? (
            <span className="body sign-in-lead">
              Your account has been verified.
            </span>
          ) : (
            <>
              <span className="body sign-in-lead">
                We've sent you a verification link. Please verify your email.
              </span>

              <div className="sign-in-note">
                <span className="mono sign-in-note-title">WHY VERIFY?</span>
                <span className="body sign-in-note-text">
                  If you sign in with Google using this same email before
                  verifying it, your account will switch over to Google sign-in
                  only — your email and password will stop working. Verifying
                  now keeps both options available, permanently.
                </span>
              </div>
            </>
          )}

          <button className="continue-btn" onClick={() => navigate("/essays")}>
            Continue To Essays
          </button>

          {!isVerified && (
            <>
              <button
                className="send-email-verification-btn"
                onClick={handleResendVerification}
                disabled={resendLoading || resendSent}
              >
                {resendLoading ? (
                  <ClipLoader size={16} color="#fff" />
                ) : resendSent ? (
                  "Email Sent ✓"
                ) : (
                  "Resend Verification Email"
                )}
              </button>
              <button
                className="check-verification-btn"
                onClick={handleCheckVerification}
                disabled={refreshingStatus}
              >
                {refreshingStatus ? (
                  <ClipLoader size={16} color="#fff" />
                ) : (
                  "I've Verified My Email"
                )}
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="auth">
          <form onSubmit={signupHandler} className="auth-form" noValidate>
            <h1 className="auth-title display">Signup</h1>

            <div className="input-container">
              <input
                type="text"
                className="username-input"
                value={usernameInputValue}
                placeholder="Name"
                onChange={handleUsernameChange}
              />
              <span className="input-err mono">{usernameErr}</span>
            </div>

            <div className="input-container">
              <input
                type="text"
                className="email-input"
                value={emailInputValue}
                placeholder="Email"
                onChange={handleEmailChange}
              />
              <span className="input-err mono">{emailErr}</span>
            </div>

            <div className="input-container">
              <input
                type="password"
                className="pass-input"
                value={passInputValue}
                placeholder="Password"
                onChange={handlePasswordChange}
              />
              <span className="input-err mono">{passErr}</span>
            </div>

            <div className="input-container">
              <input
                type="password"
                className="repeat-pass-input"
                value={repeatPassInputValue}
                placeholder="Repeat Password"
                onChange={handleRepeatPasswordChange}
              />
              <span className="input-err mono">{repeatPassErr}</span>
            </div>

            <div className="auth-links">
              <p className="mono login-link">
                <Link to={"/login"}>Have an account ? LOGIN</Link>
              </p>
            </div>

            <button
              className="auth-btn"
              disabled={googleLoginLoading}
              type="submit"
            >
              {loginLoading ? <ClipLoader size={20} color="#fff" /> : "Signup"}
            </button>
            <div className="or-line-container mono">
              <div className="or-line"></div>
              <span>OR</span>
              <div className="or-line"></div>
            </div>
            <button
              className="google-login-btn"
              type="button"
              onClick={googleLoginHandler}
              disabled={loginLoading}
            >
              {googleLoginLoading ? (
                <ClipLoader size={20} color="#fff" />
              ) : (
                "Signup With Google"
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Signup;
