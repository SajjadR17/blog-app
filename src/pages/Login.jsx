import { useEffect, useState } from "react";
import "../styles/login.css";
import { googleLogin, login } from "../lib/auth";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { sendEmailVerification, reload } from "firebase/auth";
import { auth } from "../../firebase";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {
  const [loginLoading, setLoginLoading] = useState(false);
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);
  const [passInputValue, setPassInputValue] = useState("");
  const [emailInputValue, setEmailInputValue] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");

  const [locallyVerified, setLocallyVerified] = useState(null);
  const [refreshingStatus, setRefreshingStatus] = useState(false);

  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  useEffect(() => {
    if (user) setLocallyVerified(user.emailVerified);
  }, [user]);

  const isVerified = locallyVerified ?? user?.emailVerified ?? false;

  function validateEmail(value) {
    if (value.trim().length === 0) return "Email is required.";
    if (!EMAIL_REGEX.test(value.trim())) return "Enter a valid email address.";
    return "";
  }

  function validatePassword(value) {
    if (value.length === 0) return "Password is required.";
    return "";
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
  }

  const loginHandler = async (e) => {
    e.preventDefault();

    const eErr = validateEmail(emailInputValue);
    const pErr = validatePassword(passInputValue);
    setEmailErr(eErr);
    setPassErr(pErr);

    if (eErr || pErr) {
      return;
    }

    setLoginLoading(true);
    try {
      await login(emailInputValue.trim(), passInputValue.trim());
    } catch (err) {
      if (err.toString().includes("network-request-failed")) {
        setError("Your internet is weak, please try again later");
      } else if (err.toString().includes("too-many-requests")) {
        setError("Too many attempts, please try again later");
      } else if (err.toString().includes("user-disabled")) {
        setError("Your account has been banned");
      } else if (
        err.toString().includes("invalid-credential") ||
        err.toString().includes("wrong-password") ||
        err.toString().includes("user-not-found")
      ) {
        setError("Invalid email or password");
      } else if (err.toString().includes("invalid-email")) {
        setError("Invalid email format");
      } else {
        setError("Something went wrong, please try again.");
      }
    } finally {
      setLoginLoading(false);
      setPassInputValue("");
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
        <div className="login">
          <form onSubmit={loginHandler} className="login-form" noValidate>
            <h1 className="login-title display">Login</h1>

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

            <div className="login-links">
              <p className="mono signup-link">
                <Link to={"/signup"}>Dont have an account ? SIGNUP</Link>
              </p>
            </div>

            <button
              className="login-btn"
              disabled={googleLoginLoading}
              type="submit"
            >
              {loginLoading ? <ClipLoader size={20} color="#fff" /> : "Login"}
            </button>
            <div className="or-line-container mono">
              <div className="or-line"></div>
              <span>OR</span>
              <div className="or-line"></div>
            </div>
            <button
              className="google-login-btn"
              type="button"
              disabled={loginLoading}
              onClick={googleLoginHandler}
            >
              {googleLoginLoading ? (
                <ClipLoader size={20} color="#fff" />
              ) : (
                "Login With Google"
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Login;
