import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputBoxes from "../components/InputBoxes";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  // Separate state for Username and Password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle username input change
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  // Function to handle password input change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.clear();
    try {
      const response = await fetch("http://localhost:5000/loginpage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem("username", data.username); 
        navigate("/Home"); 
      }
      else if (response.status === 400) {
        alert(data.error || "Password or username is incorrect.");
      } else {
        alert("An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Failed to connect to the server. Please try again.");
    }
  };

  const handleSignUpClick = () => {
    navigate("/SignUp");
  };

  return (
    <div className="login-page">
      <div className="auth-container">
        <h1>Welcome Back</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <InputBoxes
            val="Username Or Email"
            value={username}
            onChange={handleUsernameChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const passwordInput = document.getElementById("passwordInput") as HTMLInputElement;
                passwordInput.focus();
              }
            }}
          />
          <InputBoxes
            val="Password"
            value={password}
            onChange={handlePasswordChange}
            id="passwordInput"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
              }
            }}
          />
          <button type="submit" className="submitButton loginButton">
            Login
          </button>
        </form>
        <div className="form-divider">or</div>
        <button onClick={handleSignUpClick} className="secondaryButton signupButton" style={{width: '100%'}}>
          Create New Account
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
