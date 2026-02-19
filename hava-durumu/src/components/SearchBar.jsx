import { useState } from "react";

const SearchBar = ({ onSearch, disabled }) => {
  const [inputDegeri, setInputDegeri] = useState("");

  const handleAra = () => {
    if (inputDegeri.trim() !== "" && !disabled) {
      onSearch(inputDegeri);
      setInputDegeri(""); 
    }
  };

  return (
    <div className="search-container">
      <input 
        type="text" 
        placeholder="Şehir ismini yazın..." 
        className="search-input"
        value={inputDegeri}
        onChange={(e) => setInputDegeri(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleAra()}
        disabled={disabled}
      />
      <button className="search-button" onClick={handleAra} disabled={disabled}>
        {disabled ? "..." : "Ara 🔍"}
      </button>
    </div>
  );
};

export default SearchBar;