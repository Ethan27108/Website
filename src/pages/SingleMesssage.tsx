import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const SingleMessage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [val, setVal] = useState<any[]>([]);  // ideally narrow this down later
  const [val2, setVal2] = useState<any[]>([]);  // ideally narrow this down later
  const [val3, setVal3] = useState<any[]>([]);  // ideally narrow this down later
  const [buttonName, setButtonName] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const buttonNameParam = queryParams.get("buttonName");
    const usernameParam = queryParams.get("username");

    if (buttonNameParam) setButtonName(buttonNameParam);
    if (usernameParam) setUsername(usernameParam);
  }, [location]);

  useEffect(() => {
    if (username && buttonName) {
      Setup(username, buttonName);
    }
  }, [username, buttonName]);

  const Setup = async (user: string, button: string) => {
    console.log("Setup function called with user:", user, "and button:", button);
    try {
      const response = await fetch("http://localhost:5000/SingleMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, buttonname: button }), // Pass both username and buttonname
      });
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const data = await response.json();
      console.log("Data received:", data.message);
      setVal(data.message);
      setVal2(data.who);
      setVal3(data.time);
      console.log(val2)
      console.log(val3)
      
    } catch (error) {
      console.error("Error during setup:", error);
      alert("Failed to connect to the server.");
    }
  };

  const handleMessageSend = async (mes: string, user: string, button: string) => {
    try {
      const response = await fetch("http://localhost:5000/MessageSent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: mes, username: user, buttonname: button,  }), // Pass both username and buttonname
      });
      if (!response.ok) throw new Error(`Status: ${response.status}`);
        Setup(username, buttonName); // Refresh the messages after sending
    } catch (error) {
      console.error("Error during setup:", error);
      alert("Failed to connect to the server.");
    }
  };

  return (
    <div className="home-page">
      <div className="main-container">
        <div className="page-header">
          <h1>💬 Chat with {buttonName}</h1>
          <button onClick={() => {navigate("/MessagePage");}} className="secondaryButton">
            ← Back to Messages
          </button>
        </div>

        <div className="chat-window">
          <div className="chat-messages">
            {val.length > 0 ? (
              val.map((item, index) => {
                const isMe = val2[index] === username;
                return (
                  <div
                    key={index}
                    className={isMe ? "message-right" : "message-left"}
                  >
                    <strong style={{fontSize: '0.85rem', opacity: 0.8}}>
                      {val2[index]}
                    </strong>
                    <p style={{marginTop: '0.25rem'}}>{item}</p>
                    <span style={{fontSize: '0.75rem', opacity: 0.7}}>
                      {val3[index]}
                    </span>
                  </div>
                );
              })
            ) : (
              <div style={{textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)'}}>
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
          </div>

          <div className="chat-input-area">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const messageInput = document.getElementById("messageInput") as HTMLInputElement;
                const message = messageInput.value;
                if (message.trim()) {
                  handleMessageSend(message, username, buttonName);
                  messageInput.value = "";
                }
              }}
              style={{display: 'flex', gap: '0.75rem', width: '100%'}}
            >
              <input 
                type="text" 
                placeholder="Type your message..." 
                id="messageInput"
              />
              <button type="submit" className="submitButton" style={{padding: '0.75rem 1.5rem'}}>
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleMessage;