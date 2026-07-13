import { useEffect, useState } from "react";
import "../styles/login.css";
import { login } from "../lib/auth";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {
  const [loading, setLoading] = useState(false);
  const [passInputValue, setPassInputValue] = useState("");
  const [emailInputValue, setEmailInputValue] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");

  const [emailTouched, setEmailTouched] = useState(false);
  const [passTouched, setPassTouched] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/essays");
    }
  }, [user, navigate]);

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
    if (emailTouched) setEmailErr(validateEmail(value));
  }

  function handlePasswordChange(e) {
    const value = e.target.value;
    setPassInputValue(value);
    if (passTouched) setPassErr(validatePassword(value));
  }

  function handleEmailBlur() {
    setEmailTouched(true);
    setEmailErr(validateEmail(emailInputValue));
  }

  function handlePasswordBlur() {
    setPassTouched(true);
    setPassErr(validatePassword(passInputValue));
  }

  const loginHandler = async (e) => {
    e.preventDefault();

    const eErr = validateEmail(emailInputValue);
    const pErr = validatePassword(passInputValue);

    setEmailTouched(true);
    setPassTouched(true);
    setEmailErr(eErr);
    setPassErr(pErr);

    if (eErr || pErr) {
      return;
    }

    setLoading(true);
    try {
      const result = await login(
        emailInputValue.trim(),
        passInputValue.trim(),
      );
      const user = result.user;
      console.log(user);
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

          <div className="login-links">
            <p className="mono signup-link">
              <Link to={"/signup"}>Dont have an account ? SIGNUP</Link>
            </p>
          </div>

          <button className="login-btn" type="submit">
            {loading ? <ClipLoader size={20} color="#fff" /> : "Login"}
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;