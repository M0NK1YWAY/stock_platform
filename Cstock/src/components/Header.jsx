// src/components/Header.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import stockList from "../data/china_stocks.json";
import { FaSearch } from "react-icons/fa";
import { useLoading } from "../context/LoadingContext";

export default function Header() {
  const { setLoading } = useLoading(); // global loading setter

  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (search.trim() === "") {
      setFiltered([]);
      return;
    }
    const keyword = search.toLowerCase();
    const result = stockList.filter(
      (s) => s.name.toLowerCase().includes(keyword) || s.code.includes(keyword)
    );
    setFiltered(result.slice(0, 10)); // limit suggestions
  }, [search]);

  const handleSelect = (code) => {
    navigate(`/stock/${code}`);
    setSearch("");
    setShowDropdown(false);
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        borderBottom: "1px solid #ddd",
        backgroundColor: "#fff",
        zIndex: 1000
      }}
    >
      <button
        onClick={() => {
          setLoading(true); // trigger loading overlay
          navigate("/");
        }}
        style={{
          margin: 0,
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#2c3e50",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          outline: "none"
        }}
      >
        CN Stocks
      </button>

      <div
        style={{
          display: "flex",
          borderRadius: "2rem",
          overflow: "hidden",
          backgroundColor: "#f1f4f6"
        }}
      >
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          placeholder="Search by name or code"
          style={{
            flex: 1,
            padding: "10px 16px",
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            fontSize: "1rem"
          }}
        />
        <button
          onClick={() => {
            if (filtered.length > 0) handleSelect(filtered[0].code);
          }}
          style={{
            padding: "0 20px",
            backgroundColor: "#3c7d6f",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white"
          }}
        >
          <FaSearch />
        </button>
      </div>

      {showDropdown && filtered.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderTop: "none",
            maxHeight: "300px",
            overflowY: "auto",
            zIndex: 100
          }}
        >
          {filtered.map((stock) => (
            <div
              key={stock.code}
              onClick={() => handleSelect(stock.code)}
              style={{
                padding: "8px 10px",
                cursor: "pointer",
                borderBottom: "1px solid #eee"
              }}
            >
              <strong>{stock.name}</strong> ({stock.code})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
