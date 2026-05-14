import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginInput from "../components/InputBoxes";

const Settings: React.FC = () => {
  const navigate = useNavigate();

  // Separate state for Username, Email, and Password
  const [username, setUsername] = useState("");
  const [oldusername, setOldUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [oldemail, setOldEmail] = useState("");
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
        setOldUsername(storedUsername);
        setUsername(storedUsername);
        fetchUserDetails(storedUsername);
    }
  }, []);

  const fetchUserDetails = async (username: string) => {
    try {
      const response = await fetch(`http://localhost:5000/getUserDetails?username=${username}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user details, status: ${response.status}`);
      }
      const data = await response.json();
      setEmail(data.email);
      setOldEmail(data.email);
      setPassword(data.password);
    } catch (error: any) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  // Function to handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Function to handle password input change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    
      try {
        const response = await fetch("http://localhost:5000/ChangeSettings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "username": username, "email": email, "password": password, "oldUsername": oldusername, "oldEmail": oldemail }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
            localStorage.clear();
            localStorage.setItem('username', data.message);
            navigate("/Home");
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

 return (
  <div className="home-page">
    <div className="main-container">
      <div className="settings-container">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <h1>⚙️ Account Settings</h1>
          <button onClick={() => {navigate("/Home");}} className="secondaryButton">
            ← Back to Home
          </button>
        </div>

        <div className="settings-section">
          <h2>Edit Profile</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <LoginInput
              val="Username"
              value={username}
              onChange={handleUsernameChange}
              id="usernameInput"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const emailInput = document.getElementById("emailInput") as HTMLInputElement;
                  emailInput?.focus();
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
                  passwordInput?.focus();
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
                  // Let the form submit naturally
                }
              }}
            />
            <button type="submit" className="submitButton loginButton">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
);
};

export default Settings;