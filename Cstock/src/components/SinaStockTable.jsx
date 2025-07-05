import React, { useEffect, useState } from "react";
import axios from "axios";
import stocks from "../data/china_stocks.json";

export default function SinaStockTable() {
  const [data, setData] = useState([]);

  const fetchPrices = async () => {
    const codes = stocks.map((s) => s.code).join(",");
    const res = await axios.get(`https://hq.sinajs.cn/list=${codes}`, {
      responseType: "text"
    });

    const lines = res.data.trim().split("\n");

    const parsed = lines.map((line, index) => {
      const raw = line.split('"')[1].split(",");
      const name = raw[0] || stocks[index].name;
      const last = parseFloat(raw[3]);
      const high = parseFloat(raw[4]);
      const low = parseFloat(raw[5]);
      const prevClose = parseFloat(raw[2]);
      const change = (last - prevClose).toFixed(2);
      const changePercent = (((last - prevClose) / prevClose) * 100).toFixed(2);
      const volume = (parseInt(raw[8]) / 1e6).toFixed(2);
      const time = `${raw[30]} ${raw[31]}`;

      return {
        name,
        code: stocks[index].code,
        last,
        high,
        low,
        change,
        changePercent,
        volume,
        time
      };
    });

    setData(parsed);
  };

  useEffect(() => {
    fetchPrices();
    const timer = setInterval(fetchPrices, 5000); // refresh every 5s
    return () => clearInterval(timer);
  }, []);

  return (
    <table
      style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}
    >
      <thead style={{ backgroundColor: "#f0f0f0" }}>
        <tr>
          <th>Name</th>
          <th>Last</th>
          <th>High / Low</th>
          <th>Change</th>
          <th>Change %</th>
          <th>Volume (M)</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {data.map((stock) => (
          <tr key={stock.code}>
            <td>{stock.name}</td>
            <td>{stock.last}</td>
            <td>
              {stock.high} / {stock.low}
            </td>
            <td style={{ color: stock.change >= 0 ? "green" : "red" }}>
              {stock.change}
            </td>
            <td style={{ color: stock.changePercent >= 0 ? "green" : "red" }}>
              {stock.changePercent}%
            </td>
            <td>{stock.volume}</td>
            <td>{stock.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
