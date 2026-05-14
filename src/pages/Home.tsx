import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ImageData {
  id: number;
  imageUrl: string;
  description: string;  // Add description to the interface
  username: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<ImageData[]>([]); 
  const [loading, setLoading] = useState<boolean>(false); 
  const [page, setPage] = useState<number>(1); 
  const [comments, setComments] = useState<{ [photoId: number]: { who: string, comment: string }[] }>({});

  const handleChangeToUpload = () => {
    navigate("/UploadingPhotos");
  }

  const handleChangeToDelete = () => {
    navigate("/Delete");
  }

  const handleChangeToMessages = () => {
    navigate("/MessagePage");
  }

  const handleChangeToFriends = () => {
    navigate("/Friends");
  }

  const fetchImages = async (page: number) => {
    setLoading(true);
    try {
      const usernameParam = 'null'
      // Pass the page number to the backend
      const response = await fetch(`http://localhost:5000/GettingImage?page=${page}&username=${usernameParam}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch images, status: ${response.status}`);
      }

      const data = await response.json();
      // Assuming the backend sends back a list of image URLs and descriptions
      setImages((prevImages) => [
        ...prevImages,
        ...data.images.map((image: { url: string, description: string, username: string }, index: number) => ({
          id: prevImages.length + index + 1,
          imageUrl: image.url,
          description: image.description,
          username: image.username,
        }))
      ]);
    } catch (error: any) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const fetchComments = async (photoId: number) => {
  try {
    const response = await fetch("http://localhost:5000/Comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoid: photoId }),
    });
    if (!response.ok) throw new Error(`Status: ${response.status}`);
    const data = await response.json();
    // Assuming data.comments is an array of { who, comment }
    setComments(prev => ({ ...prev, [photoId]: data.comments }));
  } catch (error) {
    console.error("Failed to fetch comments:", error);
  }
};

  const handleAddComment = async (photoId: number,comment: string) => {
  try {
    const username = localStorage.getItem("username");
    const response = await fetch("http://localhost:5000/AddComments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoid: photoId, comment: comment, username: username }),
    });
    
    
    if (!response.ok) throw new Error(`Status: ${response.status}`);
    const data = await response.json();
    alert(data.message || "Comment request sent!");
    fetchComments(photoId);
  } catch (error) {
    alert("Failed to send comment request.");
    console.error(error);
  }
};
  useEffect(() => {
    fetchImages(page); 
  }, [page]);

  useEffect(() => {
  images.forEach(image => {
    if (!comments[image.id]) {
      fetchComments(image.id);
    }
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [images]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll); 
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="home-page">
      <div className="main-container">
        <div className="page-header">
          <h1>Photo Feed</h1>
          <div className="button-group">
            <button onClick={handleChangeToUpload}>📤 Upload</button> 
            <button onClick={handleChangeToDelete}>🗑️ Delete</button>
            <button onClick={handleChangeToMessages}>💬 Messages</button>
            <button onClick={handleChangeToFriends}>👥 Friends</button>
            <button onClick={() => {navigate("/Settings");}}>⚙️ Settings</button>
            <button onClick={() => {localStorage.clear(); navigate("/loginPage");}} className="logoutButton">
              🚪 Logout
            </button>
          </div>
        </div>

        <div className="image-gallery">
          {images.map((image) => (
            <div key={image.id} className="image-card">
              <img 
                src={image.imageUrl} 
                alt={`Image ${image.id}`}
              />
              <div className="image-card-content">
                <div className="image-card-header">
                  <h3>{image.username}</h3>
                </div>
                <p className="image-card-description">{image.description}</p>
                
                <div className="comments-section">
                  <div className="comment-input">
                    <input 
                      type="text" 
                      placeholder="Add a comment..." 
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddComment(image.id, e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }} 
                    />
                  </div>
                  
                  <div className="comments-list">
                    {(comments[image.id] || []).map((c, idx) => (
                      <div key={idx} className="comment-item">
                        <strong>{c.who}</strong>
                        <p>{c.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {loading && <div className="loading">Loading more images</div>}
      </div>
    </div>
  );
};

export default Home;
