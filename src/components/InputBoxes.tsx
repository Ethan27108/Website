import React from "react";

interface InputBoxesProps {
  val: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string; // Add id as an optional prop
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; // Add onKeyDown as an optional prop
}

const InputBoxes: React.FC<InputBoxesProps> = ({ val, value, onChange, id, onKeyDown }) => {
  return (
    <div className="inputBoxContainer">
      <label htmlFor={val}>{val}</label>
      <input
        type={val === "Password" || val === "Confirm Password" ? "password" : "text"} /* Makes password hidden */
        name={val}
        id={id || val} // Use the provided id or fallback to val
        placeholder={val}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown} // Pass the onKeyDown prop
        className="inputBox"
      />
    </div>
  );
};

export default InputBoxes;