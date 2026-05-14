import React, { useState } from "react";

interface FileUploadBoxProps {
  onFileSelect?: (file: File) => void; // Callback when a file is selected
  placeholder?: string;
}

const FileUploadBox: React.FC<FileUploadBoxProps> = ({
  onFileSelect,
  placeholder = "Click to upload a file",
}) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (onFileSelect) onFileSelect(file); // Notify the parent component
    }
  };

  return (
    <div
      onClick={() => document.getElementById("file-upload-input")?.click()}
    >
      <input
        id="file-upload-input"
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <p>{fileName || placeholder}</p>
    </div>
  );
};

export default FileUploadBox;
