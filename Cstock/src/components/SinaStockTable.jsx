// import React, { useEffect, useState } from "react";
// import axios from "axios";
import React from "react";
import stocks from "../data/china_stocks.json";

// export default function SinaStockTable() {
//   const [data, setData] = useState([]);

//   const fetchPrices = async () => {
//     const codes = stocks.map((s) => s.code).join(",");
//     const res = await axios.get(`https://hq.sinajs.cn/list=${codes}`, {
//       responseType: "text"
//     });

//     const lines = res.data.trim().split("\n");

//     const parsed = lines.map((line, index) => {
//       const raw = line.split('"')[1].split(",");
//       const name = raw[0] || stocks[index].name;
//       const last = parseFloat(raw[3]);
//       const high = parseFloat(raw[4]);
//       const low = parseFloat(raw[5]);
//       const prevClose = parseFloat(raw[2]);
//       const change = (last - prevClose).toFixed(2);
//       const changePercent = (((last - prevClose) / prevClose) * 100).toFixed(2);
//       const volume = (parseInt(raw[8]) / 1e6).toFixed(2);
//       const time = `${raw[30]} ${raw[31]}`;

//       return {
//         name,
//         code: stocks[index].code,
//         last,
//         high,
//         low,
//         change,
//         changePercent,
//         volume,
//         time
//       };
//     });

//     setData(parsed);
//   };

//   useEffect(() => {
//     fetchPrices();
//     const timer = setInterval(fetchPrices, 5000); // refresh every 5s
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <table
//       style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}
//     >
//       <thead style={{ backgroundColor: "#f0f0f0" }}>
//         <tr>
//           <th>Name</th>
//           <th>Last</th>
//           <th>High / Low</th>
//           <th>Change</th>
//           <th>Change %</th>
//           <th>Volume (M)</th>
//           <th>Time</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((stock) => (
//           <tr key={stock.code}>
//             <td>{stock.name}</td>
//             <td>{stock.last}</td>
//             <td>
//               {stock.high} / {stock.low}
//             </td>
//             <td style={{ color: stock.change >= 0 ? "green" : "red" }}>
//               {stock.change}
//             </td>
//             <td style={{ color: stock.changePercent >= 0 ? "green" : "red" }}>
//               {stock.changePercent}%
//             </td>
//             <td>{stock.volume}</td>
//             <td>{stock.time}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

export default function SinaStockTable() {
  const thStyle = {
    fontWeight: "bold",
    padding: "8px 12px",
    backgroundColor: "#f9f9f9",
    textAlign: "left",
    fontSize: "14px"
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
          <th style={thStyle}>
            Name <span style={arrowStyle}>&#9660;</span>
          </th>
          <th style={thStyle}>Last</th>
          <th style={thStyle}>High</th>
          <th style={thStyle}>Low</th>
          <th style={thStyle}>
            Chg. <span style={arrowStyle}>&#9660;</span>
          </th>
          <th style={thStyle}>
            Chg. % <span style={arrowStyle}>&#9660;</span>
          </th>
          <th style={thStyle}>
            Vol. <span style={arrowStyle}>&#9650;</span>
          </th>
          <th style={thStyle}>Time</th>
        </tr>
      </thead>
      <tbody>
        {stocks.map((stock) => {
          const change = parseFloat(stock.change);
          const changePercent = parseFloat(stock.changePercent);

          return (
            <tr key={stock.code}>
              <td style={{ padding: "6px 12px" }}>cn {stock.name}</td>
              <td style={{ padding: "6px 12px" }}>{stock.last}</td>
              <td style={{ padding: "6px 12px" }}>{stock.high}</td>
              <td style={{ padding: "6px 12px" }}>{stock.low}</td>

              <td
                style={{
                  padding: "6px 12px",
                  color:
                    change > 0 ? "#1aa928" : change < 0 ? "#d93026" : "#000"
                }}
              >
                {change > 0 ? "+" : ""}
                {stock.change}
              </td>
              <td
                style={{
                  padding: "6px 12px",
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
              <td style={{ padding: "6px 12px" }}>{stock.volume}</td>
              <td style={{ padding: "6px 12px" }}>{stock.time}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
