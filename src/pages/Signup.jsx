import { useEffect, useState } from "react";
import "../styles/signup.css";
import { signup } from "../lib/auth";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Signup() {
  const [loading, setLoading] = useState(false);
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

  const [usernameTouched, setUsernameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passTouched, setPassTouched] = useState(false);
  const [repeatPassTouched, setRepeatPassTouched] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/essays");
    }
  }, [user, navigate]);

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
    if (usernameTouched) setUsernameErr(validateUsername(value));
  }

  function handleEmailChange(e) {
    const value = e.target.value;
    setEmailInputValue(value);
    if (emailTouched) setEmailErr(validateEmail(value));
  }

  function handlePasswordChange(e) {
    const value = e.target.value;
    setPassInputValue(value);
    if (passTouched) setPassErr(validatePassword(value));
    if (repeatPassTouched) {
      setRepeatPassErr(validateRepeatPassword(repeatPassInputValue, value));
    }
  }

  function handleRepeatPasswordChange(e) {
    const value = e.target.value;
    setRepeatPassInputValue(value);
    if (repeatPassTouched) {
      setRepeatPassErr(validateRepeatPassword(value, passInputValue));
    }
  }

  function handleUsernameBlur() {
    setUsernameTouched(true);
    setUsernameErr(validateUsername(usernameInputValue));
  }

  function handleEmailBlur() {
    setEmailTouched(true);
    setEmailErr(validateEmail(emailInputValue));
  }

  function handlePasswordBlur() {
    setPassTouched(true);
    setPassErr(validatePassword(passInputValue));
  }

  function handleRepeatPasswordBlur() {
    setRepeatPassTouched(true);
    setRepeatPassErr(
      validateRepeatPassword(repeatPassInputValue, passInputValue),
    );
  }

  const signupHandler = async (e) => {
    e.preventDefault();

    const uErr = validateUsername(usernameInputValue);
    const eErr = validateEmail(emailInputValue);
    const pErr = validatePassword(passInputValue);
    const rErr = validateRepeatPassword(repeatPassInputValue, passInputValue);

    setUsernameTouched(true);
    setEmailTouched(true);
    setPassTouched(true);
    setRepeatPassTouched(true);
    setUsernameErr(uErr);
    setEmailErr(eErr);
    setPassErr(pErr);
    setRepeatPassErr(rErr);

    if (uErr || eErr || pErr || rErr) {
      return;
    }

    setLoading(true);
    try {
      await signup(
        emailInputValue.trim(),
        passInputValue.trim(),
        usernameInputValue.trim(),
      );
    } catch (err) {
      if (err.toString().includes("network-request-failed")) {
        setError("Your internet is weak, please try again later");
      } else if (err.toString().includes("too-many-requests")) {
        setError("Too many attempts, please try again later");
      } else if (err.toString().includes("user-disabled")) {
        setError("Your account has been banned");
      } else if (err.toString().includes("email-already-in-use")) {
        setError("An account with this email already exists");
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
      setLoading(false);
    }
  };

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
      <div className="signup">
        <form onSubmit={signupHandler} className="signup-form" noValidate>
          <h1 className="signup-title display">Signup</h1>

          <div className="input-container">
            <input
              type="text"
              className="username-input"
              value={usernameInputValue}
              placeholder="Name"
              onChange={handleUsernameChange}
              onBlur={handleUsernameBlur}
            />
            <span className="input-err mono">
              {usernameTouched && usernameErr}
            </span>
          </div>

          <div className="input-container">
            <input
              type="text"
              className="email-input"
              value={emailInputValue}
              placeholder="Email"
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
            />
            <span className="input-err mono">{emailTouched && emailErr}</span>
          </div>

          <div className="input-container">
            <input
              type="password"
              className="pass-input"
              value={passInputValue}
              placeholder="Password"
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
            />
            <span className="input-err mono">{passTouched && passErr}</span>
          </div>

          <div className="input-container">
            <input
              type="password"
              className="repeat-pass-input"
              value={repeatPassInputValue}
              placeholder="Repeat Password"
              onChange={handleRepeatPasswordChange}
              onBlur={handleRepeatPasswordBlur}
            />
            <span className="input-err mono">
              {repeatPassTouched && repeatPassErr}
            </span>
          </div>

          <div className="signup-links">
            <p className="mono login-link">
              <Link to={"/login"}>Have an account ? LOGIN</Link>
            </p>
          </div>

          <button className="signup-btn" type="submit">
            {loading ? <ClipLoader size={20} color="#fff" /> : "Signup"}
          </button>
        </form>
      </div>
    </>
  );
}

export default Signup;
