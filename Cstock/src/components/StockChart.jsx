import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import CandleChart from "./CandleChart";

export default function StockChart({ data, candleData, chartType }) {
  const showData = chartType === "candle" ? candleData : data;

  if (!showData || showData.length === 0) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading chart data...</div>;
  }

  return (
    <div style={{ width: "100%", height: "400px" }}>
      {chartType === "line" ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
            <YAxis
              yAxisId="left"
              domain={["auto", "auto"]}
              tick={{ fontSize: 12 }}
              orientation="left"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[-0.05, 0.05]}
              tickFormatter={(v) => `${(v * 100).toFixed(2)}%`}
              tick={{ fontSize: 12 }}
            />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value, name) =>
                name === "priceChange" ? `${(value * 100).toFixed(2)}%` : value
              }
            />
            <Line
              yAxisId="left"
              type="linear"
              dataKey="price"
              stroke="#2c5393"
              strokeWidth={2}
              dot={false}
            />
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
      ) : (
        <CandleChart data={candleData} />
      )}
    </div>
  );
}
