import React, { useState } from "react";

const AddForm = ({ onAddCollage }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = () => {
    submitInputValue();
  };

  const handleInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      submitInputValue();
    }
  };

  const submitInputValue = () => {
    onAddCollage(inputValue);
    setInputValue("");
  };

  return (
    <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
      <input
        className="input py-2 px-3 border-1 w-25"
        type="text"
        placeholder="Add Collage"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleInputKeyPress}
      />
      <button
        className="rounded-2 px-2 py-1 btn btn-primary"
        onClick={handleButtonClick}
      >
        Add
      </button>
    </div>
  );
};

export default AddForm;
