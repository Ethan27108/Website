import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Friends = () => {
  const [val, setVal] = useState<any[]>([]);  // ideally narrow this down later
  const username = localStorage.getItem("username") || "NoUsername"
  const navigate = useNavigate();
  const handleFriendSend = async (fr: string) => {
    try {
      const response = await fetch("http://localhost:5000/FriendSearch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friend: fr, user: username}), // Pass both username and buttonname
      });
      if (!response.ok) throw new Error(`Status: ${response.status}`);
        const data = await response.json();
        setVal(data.friend);
    } catch (error) {
      console.error("Error during setup:", error);
      alert("Failed to connect to the server.");
    }
  };

  const handleClick = async (fr: any) => {
    try {
        const response = await fetch("http://localhost:5000/FriendAdd", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          
          body: JSON.stringify({ friend: fr, user: username}), // Pass both username and buttonname
        });
        if (!response.ok) throw new Error(`Status: ${response.status}`);
          navigate("/Home")
      } catch (error) {
        console.error("Error during setup:", error);
        alert("Failed to connect to the server.");
      }
  };

  return (
    <div className="home-page">
      <div className="main-container">
        <div className="page-header">
          <h1>👥 Add Friends</h1>
          <button onClick={() => {navigate("/Home");}} className="secondaryButton">
            ← Back to Home
          </button>
        </div>

        <div className="friends-page-container">
          <div className="add-friends-section">
            <h2>Search Friends</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const friendInput = document.getElementById("friendInput") as HTMLInputElement;
                const friendName = friendInput.value;
                if (friendName.trim()) {
                  handleFriendSend(friendName);
                  friendInput.value = "";
                }
              }}
              className="search-input-container"
            >
              <input 
                type="text" 
                placeholder="Search for a friend..." 
                id="friendInput"
              />
              <button type="submit" className="submitButton" style={{padding: '0.75rem 1.5rem'}}>
                Search
              </button>
            </form>

            <div className="search-results">
              {val.length > 0 ? (
                val.map((item, index) => (
                  <div key={index} className="search-result-item">
                    <span>👤 {item}</span>
                    <button
                      onClick={() => handleClick(item)}
                      className="submitButton"
                      style={{padding: '0.5rem 1rem', fontSize: '0.9rem'}}
                    >
                      Add Friend
                    </button>
                  </div>
                ))
              ) : (
                <p style={{color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem'}}>
                  Search for friends to get started
                </p>
              )}
            </div>
          </div>

          <div className="friends-section">
            <h2>Your Friends</h2>
            <p style={{color: 'var(--text-secondary)'}}>
              Friends will be listed here after you add them
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;