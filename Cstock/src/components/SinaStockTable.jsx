// import React, { useEffect, useState } from "react";
// import axios from "axios";
import React from "react";
import { useState } from "react";

import stocks from "../data/china_stocks.json";

export default function SinaStockTable() {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "none"
  });

  const sortedStocks = [...stocks].sort((a, b) => {
    if (!sortConfig.key || sortConfig.direction === "none") return 0;

    const aVal = parseFloat(a[sortConfig.key]);
    const bVal = parseFloat(b[sortConfig.key]);

    if (sortConfig.direction === "asc") return aVal - bVal;
    if (sortConfig.direction === "desc") return bVal - aVal;
    return 0;
  });

  const toggleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        // Cycle through: none -> asc -> desc -> none
        const next =
          prev.direction === "none"
            ? "asc"
            : prev.direction === "asc"
            ? "desc"
            : "none";
        return { key, direction: next };
      }
      return { key, direction: "asc" };
    });
  };

  const renderArrow = (key) => {
    const sortableKeys = ["change", "changePercent", "volume"];
    if (!sortableKeys.includes(key)) return null;

    if (sortConfig.key !== key) return <span style={arrowStyle}>&#9660;</span>; // ▼ dim by default
    if (sortConfig.direction === "asc")
      return <span style={{ ...arrowStyle, color: "#000" }}>&#9650;</span>; // ▲
    if (sortConfig.direction === "desc")
      return <span style={{ ...arrowStyle, color: "#000" }}>&#9660;</span>; // ▼
    return <span style={arrowStyle}>&#9660;</span>; // ▼ default
  };
  const thStyle = {
    fontWeight: "bold",
    padding: "12px 16px",
    backgroundColor: "#f9f9f9",
    textAlign: "left",
    fontSize: "15px",
    cursor: "pointer"
  };

  const tdStyle = {
    padding: "12px 16px", // uniform spacing
    fontSize: "15px",
    lineHeight: "1.8"
  };
  const nameStyle = {
    padding: "12px 16px",
    fontWeight: "600",
    fontSize: "14px",
    minWidth: "200px",
    maxWidth: "220px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  };

  const arrowStyle = {
    color: "#999",
    fontSize: "0.75rem",
    marginLeft: "4px"
  };

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <thead>
        <tr>
          <th style={thStyle} onClick={() => toggleSort("name")}>
            Name {renderArrow("name")}
          </th>
          <th style={thStyle} onClick={() => toggleSort("last")}>
            Last {renderArrow("last")}
          </th>
          <th style={thStyle} onClick={() => toggleSort("high")}>
            High {renderArrow("high")}
          </th>
          <th style={thStyle} onClick={() => toggleSort("low")}>
            Low {renderArrow("low")}
          </th>
          <th style={thStyle} onClick={() => toggleSort("change")}>
            Chg. {renderArrow("change")}
          </th>
          <th style={thStyle} onClick={() => toggleSort("changePercent")}>
            Chg. % {renderArrow("changePercent")}
          </th>
          <th style={thStyle} onClick={() => toggleSort("volume")}>
            Vol. {renderArrow("volume")}
          </th>
          <th style={thStyle}>Time</th>
        </tr>
      </thead>
      <tbody>
        {sortedStocks.map((stock) => {
          const change = parseFloat(stock.change);
          const changePercent = parseFloat(stock.changePercent);

          return (
            <tr key={stock.code}>
              <td style={nameStyle}>{stock.name}</td>
              <td style={tdStyle}>{stock.last}</td>
              <td style={tdStyle}>{stock.high}</td>
              <td style={tdStyle}>{stock.low}</td>
              <td
                style={{
                  ...tdStyle,
                  color:
                    change > 0 ? "#1aa928" : change < 0 ? "#d93026" : "#000"
                }}
              >
                {change > 0 ? "+" : ""}
                {stock.change}
              </td>
              <td
                style={{
                  ...tdStyle,
                  color:
                    changePercent > 0
                      ? "#1aa928"
                      : changePercent < 0
                      ? "#d93026"
                      : "#000"
                }}
              >
                {changePercent > 0 ? "+" : ""}
                {stock.changePercent}%
              </td>
              <td style={tdStyle}>{stock.volume}</td>
              <td style={tdStyle}>{stock.time}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
