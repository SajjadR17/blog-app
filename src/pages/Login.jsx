import { useEffect, useState } from "react";
import "../styles/login.css";
import { login } from "../lib/auth";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [loading, setLoading] = useState(false);
  const [passInputValue, setPassInputValue] = useState("");
  const [emailInputValue, setEmailInputValue] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/essays");
    }
  }, [user, navigate]);

  const loginHandler = async (e) => {
    e.preventDefault();
    if (passInputValue.length === 0 || emailInputValue.length === 0) {
      return;
    }
    setLoading(true);
    try {
      const result = await login(emailInputValue.trim(), passInputValue.trim());
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
        <form onSubmit={loginHandler} className="login-form">
          <h1 className="login-title display">Login</h1>
          <input
            type="text"
            className="email-input"
            value={emailInputValue}
            placeholder="Email"
            onChange={(e) => setEmailInputValue(e.target.value)}
          />
          <input
            type="password"
            className="pass-input"
            value={passInputValue}
            placeholder="Password"
            onChange={(e) => setPassInputValue(e.target.value)}
          />
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
