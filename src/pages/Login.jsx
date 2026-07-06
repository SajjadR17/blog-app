import { useState } from "react";
import "../styles/login.css";
import { login } from "../lib/auth";
import { ClipLoader } from "react-spinners";

function Login() {
  const [loading, setLoading] = useState(false);
  const [passInputValue, setPassInputValue] = useState("");
  const [emailInputValue, setEmailInputValue] = useState("");
  const [error, setError] = useState("");

  const loginHandler = async (e) => {
    e.preventDefault();
    if (passInputValue.length === 0 || emailInputValue.length === 0) {
      return;
    }
    setLoading(true);
    try {
      const result = await login(emailInputValue, passInputValue);
      const user = result.user;
      console.log(user);
    } catch (err) {
      if (err.toString().includes("network-request-faild")) {
        setError("Your internet is weak, please try again later");
      } else if (err.toString().includes("too-many-request")) {
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
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <form onSubmit={loginHandler} className="login-form">
        <h1 className="login-title display">Login</h1>
        <input
          type="text"
          className="email-input"
          value={emailInputValue}
          placeholder="Email"
          onChange={(e) => setEmailInputValue(e.target.value.trim())}
        />
        <input
          type="text"
          className="pass-input"
          value={passInputValue}
          placeholder="Password"
          onChange={(e) => setPassInputValue(e.target.value.trim())}
        />
        <button className="login-btn" type="submit">
          {loading ? <ClipLoader size={20} color="#fff" /> : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
