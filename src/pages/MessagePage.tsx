import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MessagePage = () => {
  const [username, setUsername] = useState<string>("");
  const [val, setVal] = useState<any[]>([]);  // ideally narrow this down later
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      Setup(storedUsername);
    }
  }, []);

  const Setup = async (user: string) => {
    try {
      const response = await fetch("http://localhost:5000/MessagePage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user }),
      });
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const data = await response.json();
      console.log("Data received:", data.message);
      setVal(data.message);
    } catch (error) {
      console.error("Error during setup:", error);
      alert("Failed to connect to the server.");
    }
  };

  const handleClick = (buttonName: any) => {
    navigate(`/SingleMessage?buttonName=${encodeURIComponent(buttonName)}&username=${encodeURIComponent(username)}`);
  };

  return (
    <div className="home-page">
      <div className="main-container">
        <div className="page-header">
          <h1>💬 Messages</h1>
          <button onClick={() => {navigate("/Home");}} className="secondaryButton">
            ← Back to Home
          </button>
        </div>

        <div className="messages-container">
          <div className="friends-list">
            <h3 style={{padding: '1rem', borderBottom: '1px solid var(--gray-200)'}}>
              Your Conversations
            </h3>
            {val.length > 0 ? (
              val.map((item, index) => (
                <div
                  key={index}
                  className="friend-item"
                  onClick={() => handleClick(item)}
                  style={{cursor: 'pointer'}}
                >
                  👤 {item}
                </div>
              ))
            ) : (
              <div className="friend-item" style={{color: 'var(--text-secondary)'}}>
                No conversations yet
              </div>
            )}
          </div>
          
          <div className="chat-window">
            <div style={{padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)'}}>
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
