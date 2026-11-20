import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { clearFavoriteHomiesCache } from "../utils/streamFavorites";
import "./login.css";

export default function Login() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const signingIn = mode === "signin";

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      clearFavoriteHomiesCache();
      localStorage.setItem("token", token);
      navigate("/store");
    }
  }, [navigate]);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setStep(1);
    setOtp("");
    setMessage(null);
    setShowPassword(false);
  };

  const sendCode = async () => {
    const response = await axios.post("/users/send-otp", { email });
    if (!response.data.success) throw new Error(response.data.message || "Could not send the code. Please try again.");
    setStep(2);
    setMessage({ type: "success", text: response.data.message || "Verification code sent." });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      if (signingIn) {
        const response = await axios.post("/users/login", { email, password });
        if (!response.data.success) throw new Error(response.data.message || "Could not sign in. Please try again.");
        clearFavoriteHomiesCache();
        localStorage.setItem("token", response.data.token);
        navigate("/store");
      } else if (step === 1) {
        await sendCode();
      } else {
        const response = await axios.post("/users/verify-otp", { email, otp, name, password });
        if (!response.data.success) throw new Error(response.data.message || "Invalid code. Please try again.");
        clearFavoriteHomiesCache();
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      }
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || error.message || "Something went wrong. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  const resendCode = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await sendCode();
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || error.message || "Could not send the code. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = () => {
    const server = import.meta.env.VITE_SERVER_ORIGIN || "http://localhost:5000";
    window.location.href = `${server}/api/auth/google`;
  };

  return (
    <main className={`auth-page ${signingIn ? "" : "auth-page--signup"}`}>
      <div className="auth-art" aria-hidden="true">
        <img className="auth-art-signin" src="/LoginPage/character.png" alt="" />
        <img className="auth-art-signup" src="/LoginPage/character2.png" alt="" />
      </div>
      <section className="auth-panel" aria-labelledby="auth-heading">
        <div className="auth-content" key={mode}>
          <img className="auth-logo" src="/New%20Assets/LOGO.svg" alt="Xplode" />
          <div className="auth-intro">
            <h1 id="auth-heading">{signingIn ? "Welcome back." : step === 2 ? "Check your email." : "Create account."}</h1>
            <p>{signingIn ? "Sign in to continue to Xplode." : step === 2 ? `Enter the verification code sent to ${email}.` : "Your games and your people, all in one place."}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {!signingIn && step === 1 && (
              <label className="auth-field">Name
                <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter your name" autoComplete="name" required />
              </label>
            )}
            {(signingIn || step === 1) && (
              <>
                <label className="auth-field">Email
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" autoComplete="email" required />
                </label>
                <label className="auth-field">Password
                  <span className="auth-password">
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete={signingIn ? "current-password" : "new-password"} required />
                    <button type="button" className="auth-password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </span>
                </label>
              </>
            )}
            {!signingIn && step === 2 && (
              <label className="auth-field">Verification code
                <input value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="Enter your code" inputMode="numeric" autoComplete="one-time-code" required />
              </label>
            )}
            {message && <p className={`auth-message auth-message--${message.type}`} role={message.type === "error" ? "alert" : "status"}>{message.text}</p>}
            <button className="auth-primary" type="submit" disabled={busy}>
              {busy ? "Please wait..." : signingIn ? "Sign in" : step === 2 ? "Verify and create account" : "Send verification code"}
            </button>
          </form>

          {!signingIn && step === 2 ? (
            <div className="auth-code-actions">
              <button type="button" disabled={busy} onClick={resendCode}>Resend code</button>
              <button type="button" disabled={busy} onClick={() => { setStep(1); setOtp(""); setMessage(null); }}>Change email</button>
            </div>
          ) : (
            <>
              <div className="auth-divider"><span>or</span></div>
              <button className="auth-google" type="button" onClick={handleGoogle} disabled={busy}>
                <img src="/LoginPage/google.png" alt="" /> Continue with Google
              </button>
            </>
          )}
          <p className="auth-switch">
            {signingIn ? "New to Xplode?" : "Already have an account?"}{" "}
            <button type="button" disabled={busy} onClick={() => switchMode(signingIn ? "signup" : "signin")}>
              {signingIn ? "Create account" : "Sign in"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
