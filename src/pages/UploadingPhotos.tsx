import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputBoxes from "../components/InputBoxes";
import FileUploadBox from "../components/FileUploadBox";

const UploadingPhotos = () => {
  const navigate = useNavigate();
  const maxChars = 300;
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null); // State for the uploaded file

  const handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxChars) {
      setDescription(e.target.value);
    } else {
      alert("That's more than 300 characters. Any extra characters will not be used.");
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile); // Set the selected file
  };

  const handleSubmitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!file) {
      alert("Please upload a photo before submitting.");
      return;
    }
    const username = localStorage.getItem("username") || "NoUsername";  // Get the username from local storage
    const formData = new FormData();
    formData.append("username", username);  // Ensure 'description' is a string
    formData.append("description", description);  // Ensure 'description' is a string
    formData.append("file", file);  // Ensure 'file' is a file object
  
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);  // Debug the token here
  
    try {
      const response = await fetch("http://localhost:5000/UploadingPhotos", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      console.log("Response from backend:", data);  // Log the backend response
  
      if (response.ok) {
        alert(data.message);
        navigate("/Home");
      } else if (response.status === 401) {
        alert("Your session has expired. Please log in again.");
        navigate("/login");  // or the appropriate login route
      } else {
        alert(data.error || "Photo didn't upload.");
      }
    } catch (error) {
      console.error("Error during upload:", error);
      alert("Failed to connect to the server. Please try again.");
    }
  };
  

  return (
    <div className="home-page">
      <div className="main-container">
        <div className="upload-container">
          <button onClick={() => {navigate("/Home");}} className="secondaryButton" style={{marginBottom: '1.5rem'}}>
            ← Back to Home
          </button>
          
          <h1>📸 Upload Photo</h1>
          
          <form onSubmit={handleSubmitPost} className="upload-form">
            <div>
              <FileUploadBox
                placeholder="Drag and drop or click to upload"
                onFileSelect={handleFileSelect}
              />
            </div>
            
            <div>
              <InputBoxes
                val="Caption (Max 300 characters)"
                value={description}
                onChange={handleChangeDescription}
              />
              <small style={{color: 'var(--text-secondary)'}}>{description.length} / {maxChars}</small>
            </div>
            
            <button type="submit" className="submitButton loginButton">
              Upload Photo
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadingPhotos;
