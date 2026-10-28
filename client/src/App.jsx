
import { useState } from "react";
import "./App.css";

function App() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    function switchMode() {
        setIsLogin((previousMode) => !previousMode);
        setEmail("");
        setPassword("");
        setMessage("");
        setMessageType("");
        setShowPassword(false);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setMessage("");
        setMessageType("");

        if (!email.trim() || !password) {
            setMessage("Please fill in all fields.");
            setMessageType("error");
            return;
        }

        if (!isLogin && password.length < 8) {
            setMessage("Password must be at least 8 characters.");
            setMessageType("error");
            return;
        }

        setLoading(true);

        try {
            const endpoint = isLogin ? "login" : "signup";

            const response = await fetch(
                `http://localhost:5000/api/${endpoint}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Something went wrong."
                );
            }

            setMessage(
                data.message ||
                (isLogin
                    ? "Login successful!"
                    : "Account created successfully!")
            );

            setMessageType("success");

            if (isLogin) {
                setPassword("");
            } else {
                setEmail("");
                setPassword("");
            }

        } catch (error) {
            setMessage(
                error.message === "Failed to fetch"
                    ? "Cannot connect to the server. Check that your backend is running."
                    : error.message
            );

            setMessageType("error");

        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="page-container">
            <section className="signup-card">

                <div className="brand-icon" aria-hidden="true">
                    ✦
                </div>

                <h1>
                    {isLogin ? "Welcome Back" : "Create Account"}
                </h1>

                <p className="subtitle">
                    {isLogin
                        ? "Log in to your account to continue."
                        : "Join us today and get started."}
                </p>

                <p className="login-text">
                    {isLogin
                        ? "Don't have an account? "
                        : "Already a member? "}

                    <a
                        href={isLogin ? "#signup" : "#login"}
                        onClick={(event) => {
                            event.preventDefault();
                            switchMode();
                        }}
                    >
                        {isLogin ? "Sign Up" : "Log In"}
                    </a>
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">
                            Email address
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="password-wrapper">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder={
                                    isLogin
                                        ? "Enter your password"
                                        : "At least 8 characters"
                                }
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                autoComplete={
                                    isLogin
                                        ? "current-password"
                                        : "new-password"
                                }
                                minLength={isLogin ? undefined : 8}
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword((previous) => !previous)
                                }
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {message && (
                        <p
                            className={`message ${messageType}`}
                            role="status"
                        >
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="signup-button"
                        disabled={loading}
                    >
                        {loading
                            ? (isLogin ? "Logging in..." : "Signing up...")
                            : (isLogin ? "Log In" : "Sign Up")}
                    </button>
                </form>

                <p className="terms">
                    {isLogin
                        ? "Welcome back! Please enter your registered details."
                        : (
                            <>
                                By signing up, you agree to our{" "}
                                <span>Terms of Service</span>.
                            </>
                        )}
                </p>

            </section>
        </main>
    );
}

export default App;
