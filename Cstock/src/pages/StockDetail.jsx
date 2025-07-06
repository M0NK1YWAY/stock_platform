import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import StockChart from "../components/StockChart";

export default function StockDetail({ setLoading }) {
  const { code } = useParams();
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState("1D");
  const [chartType, setChartType] = useState("line");
  const [candleData, setCandleData] = useState([]);
  const [stockName, setStockName] = useState(code);
  const [prevClose, setPrevClose] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
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

        const res = await axios.get(url);
        const klines = res.data?.data?.klines || [];
        const stockName = res.data?.data?.name || code;
        setStockName(stockName);

        const prevClose = parseFloat(res.data?.data?.preKPrice);
        setPrevClose(prevClose);

        const candleParsed = klines.map((entry) => {
          const parts = entry.split(",");
          return {
            time: parts[0],
            open: parseFloat(parts[1]),
            close: parseFloat(parts[2]),
            high: parseFloat(parts[3]),
            low: parseFloat(parts[4]),
            volume: parseInt(parts[5])
          };
        });
        setCandleData(candleParsed);

        const parsed = klines.map((entry) => {
          const parts = entry.split(",");
          const price = parseFloat(parts[2]);
          return {
            time: timeRange === "1D" ? parts[0].split(" ")[1] : parts[0],
            price,
            open: parseFloat(parts[1]),
            high: parseFloat(parts[3]),
            low: parseFloat(parts[4]),
            close: parseFloat(parts[2]),
            priceChange: (price - prevClose) / prevClose
          };
        });
        setChartData(parsed);
      } catch (e) {
        console.error("Data fetch failed:", e);
      } finally {
        setLoading(false); // mark loading complete globally
      }
    };

    fetchChartData();
  }, [code, timeRange, setLoading]);

  function getDaysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10).replace(/-/g, "");
  }

  return (
    <>
      <div style={{ marginBottom: "0.5rem" }}>
        <div style={{ fontSize: "20px", fontWeight: "bold" }}>
          {stockName} ({code})
        </div>
        {chartData.length > 0 &&
          prevClose &&
          (() => {
            const latest = chartData[chartData.length - 1];
            const change = latest.price - prevClose;
            const changeStr = `${change >= 0 ? "+" : "-"}${Math.abs(
              change
            ).toFixed(3)}`;
            const changePctStr = `(${((change / prevClose) * 100).toFixed(
              2
            )}%)`;

            return (
              <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                <span>{latest.price.toFixed(3)}</span>
                <span
                  style={{
                    marginLeft: "12px",
                    color: change >= 0 ? "#1aa928" : "#d93026"
                  }}
                >
                  {changeStr}
                  {changePctStr}
                </span>
              </div>
            );
          })()}
      </div>

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

        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          style={{ marginLeft: "16px", padding: "4px 8px" }}
        >
          <option value="line">Line</option>
          <option value="candle">Candle</option>
        </select>
      </div>

      <div style={{ padding: "1rem", width: "100%", overflowX: "auto" }}>
        <div style={{ width: "1400px", maxWidth: "100%" }}>
          <StockChart
            data={chartData}
            candleData={candleData}
            chartType={chartType}
          />
        </div>
      </div>
    </>
  );
}
