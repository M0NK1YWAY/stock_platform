import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SinaStockTable from "./components/SinaStockTable";
import StockDetail from "./components/StockDetail";

function App() {
  return (
    <Router>
      <div style={{ padding: "1rem" }}>
        <h1>Live Chinese Stock Prices</h1>
        <Routes>
          <Route path="/" element={<SinaStockTable />} />
          <Route path="/stock/:code" element={<StockDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
