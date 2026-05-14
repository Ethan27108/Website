import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginInput from "../components/InputBoxes";

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordCheck(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== passwordCheck) {
      alert("Passwords don't match. Please try again.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message); // Success: Account created
        navigate("/LoginPage");
      } else if (response.status === 400) {
        alert(data.error || "Invalid input.");
      } else if (response.status === 409) {
        alert(data.error || "Conflict: Username or email already in use.");
      } else {
        alert("An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Failed to connect to the server. Please try again.");
    }
  };

  const handleLoginPageClick = () => {
    navigate("/LoginPage");
  };

  return (
    <div className="signup-page">
      <div className="auth-container">
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <LoginInput
            val="Username"
            value={username}
            onChange={handleUsernameChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const emailInput = document.getElementById("emailInput") as HTMLInputElement;
                emailInput.focus();
              }
            }}
          />
          <LoginInput
            val="Email"
            value={email}
            onChange={handleEmailChange}
            id="emailInput"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const passwordInput = document.getElementById("passwordInput") as HTMLInputElement;
                passwordInput.focus();
              }
            }}
          />
          <LoginInput
            val="Password"
            value={password}
            onChange={handlePasswordChange}
            id="passwordInput"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const confirmPasswordInput = document.getElementById("confirmPasswordInput") as HTMLInputElement;
                confirmPasswordInput.focus();
              }
            }}
          />
          <LoginInput
            val="Confirm Password"
            value={passwordCheck}
            onChange={handlePasswordCheckChange}
            id="confirmPasswordInput"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const form = document.querySelector("form") as HTMLFormElement;
                form.requestSubmit();
              }
            }}
          />
          <button type="submit" className="submitButton loginButton">
            Create Account
          </button>
        </form>
        <div className="form-divider">or</div>
        <button onClick={handleLoginPageClick} className="secondaryButton" style={{width: '100%'}}>
          Back To Login
        </button>
      </div>
    </div>
  );
};

export default SignUp;