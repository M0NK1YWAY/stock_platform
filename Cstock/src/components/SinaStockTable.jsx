import axios from "axios";
import { useEffect, useState } from "react";
import stockList from "../data/china_stocks.json"; // local code+name list

import {
  thStyle,
  tdStyle,
  nameStyle,
  arrowStyle,
  paginationButtonStyle
} from "../styles/SinaStockTableStyles";

export default function SinaStockTable() {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "none"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [liveData, setLiveData] = useState([]);
  const [jumpPage, setJumpPage] = useState("");

  const sortedStocks = [...liveData].sort((a, b) => {
    if (!sortConfig.key || sortConfig.direction === "none") return 0;

    const aVal = parseFloat(a[sortConfig.key]);
    const bVal = parseFloat(b[sortConfig.key]);

    if (sortConfig.direction === "asc") return aVal - bVal;
    if (sortConfig.direction === "desc") return bVal - aVal;
    return 0;
  });
  const totalPages = Math.ceil(sortedStocks.length / itemsPerPage);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const batches = [];
        const step = 50; // safe batch size
        for (let i = 0; i < stockList.length; i += step) {
          const codes = stockList
            .slice(i, i + step)
            .map((s) =>
              s.code.startsWith("6") ? `sh${s.code}` : `sz${s.code}`
            )
            .join(",");
          const res = await axios.get(`https://qt.gtimg.cn/q=${codes}`, {
            responseType: "text"
          });
          batches.push(...res.data.trim().split("\n"));
        }

        const parsed = batches.map((line) => {
          const fields = line.split("~");
          return {
            code: fields[2],
            name: fields[1],
            last: fields[3],
            high: fields[33],
            low: fields[34],
            change: (parseFloat(fields[3]) - parseFloat(fields[4])).toFixed(2),
            changePercent: (
              ((parseFloat(fields[3]) - parseFloat(fields[4])) /
                parseFloat(fields[4])) *
              100
            ).toFixed(2),
            volume: (parseFloat(fields[6]) / 1e6).toFixed(2),
            time: fields[30] || ""
          };
        });

        setLiveData(parsed);
      } catch (err) {
        console.error("Failed to fetch Tencent data:", err);
      }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 10000); // every 10 sec
    return () => clearInterval(interval);
  }, []);

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
  const handleJump = () => {
    const targetPage = parseInt(jumpPage);
    if (!isNaN(targetPage) && targetPage >= 1 && targetPage <= totalPages) {
      setCurrentPage(targetPage);
      setJumpPage(""); // Clear input after jump
    }
  };

  return (
    <>
      {" "}
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
          {sortedStocks
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((stock) => {
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
      <div style={{ marginTop: "16px", textAlign: "center" }}>
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          style={{ ...paginationButtonStyle, marginRight: "8px" }}
        >
          Prev
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={{ ...paginationButtonStyle, marginLeft: "8px" }}
        >
          Next
        </button>

        <span style={{ marginLeft: "16px", marginRight: "8px" }}>Page</span>

        <input
          type="text"
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          style={{ width: "40px", textAlign: "center", marginRight: "4px" }}
        />

        <button onClick={handleJump} style={paginationButtonStyle}>
          GO
        </button>
      </div>
    </>
  );
}
