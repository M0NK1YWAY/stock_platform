import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function StockDetail() {
  const { code } = useParams();
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState("1D");

  useEffect(() => {
    const fetchChartData = async () => {
      const secid = code.startsWith("6") ? `1.${code}` : `0.${code}`;

      const kltMap = {
        "1D": "1",
        "5D": "5",
        "1M": "101",
        "6M": "101",
        "1Y": "101"
      };

      const klt = kltMap[timeRange];
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");

      const begMap = {
        "1D": getDaysAgo(1),
        "5D": getDaysAgo(5),
        "1M": getDaysAgo(30),
        "6M": getDaysAgo(180),
        "1Y": getDaysAgo(365)
      };

      const beg = begMap[timeRange];

      const url = `https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=${secid}&fields1=f1,f2,f3,f4,f5,f6&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61&klt=${klt}&fqt=1&beg=${beg}&end=${today}`;

      try {
        const res = await axios.get(url);
        const klines = res.data?.data?.klines || [];
        const prevClose = parseFloat(res.data?.data?.preKPrice); // <-- yesterday's close

        const parsed = klines
          .map((entry) => {
            const parts = entry.split(",");
            const price = parseFloat(parts[2]);
            return {
              time: timeRange === "1D" ? parts[0].split(" ")[1] : parts[0], // show only HH:MM if intraday
              price,
              priceChange: (price - prevClose) / prevClose // <- add this line
            };
          })
          .filter((d) => timeRange !== "1D" || d.time); // optional cleanup

        setChartData(parsed);
      } catch (e) {
        console.error("Data fetch failed:", e);
      }
    };

    fetchChartData();
  }, [code, timeRange]);

  function getDaysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10).replace(/-/g, "");
  }

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        {["1D", "5D", "1M", "6M", "1Y"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            style={{
              marginRight: "8px",
              padding: "4px 12px",
              borderRadius: "4px",
              border:
                timeRange === range ? "2px solid #2c5393" : "1px solid #ccc",
              backgroundColor: timeRange === range ? "#eef3ff" : "#fff",
              color: "#2c5393",
              fontWeight: timeRange === range ? "bold" : "normal",
              cursor: "pointer"
            }}
          >
            {range}
          </button>
        ))}
      </div>

      <div style={{ padding: "1rem", width: "100%", overflowX: "auto" }}>
        <div style={{ width: "1400px", maxWidth: "100%" }}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />

              {/* Left Y-axis: price */}
              <YAxis
                yAxisId="left"
                domain={["auto", "auto"]}
                tick={{ fontSize: 12 }}
                orientation="left"
              />

              {/* Right Y-axis: % change */}
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[-0.05, 0.05]} // -5% to +5%
                tickFormatter={(value) => `${(value * 100).toFixed(2)}%`}
                tick={{ fontSize: 12 }}
              />

              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value, name) =>
                  name === "priceChange"
                    ? `${(value * 100).toFixed(2)}%`
                    : value
                }
              />

              {/* Price Line */}
              <Line
                yAxisId="left"
                type="linear"
                dataKey="price"
                stroke="#2c5393"
                strokeWidth={2}
                dot={false}
              />

              {/* % Change Line */}
              <Line
                yAxisId="right"
                type="linear"
                dataKey="priceChange"
                stroke="#c62828"
                strokeWidth={1}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
