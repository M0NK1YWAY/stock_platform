import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import SinaStockTable from "./components/SinaStockTable";
import StockDetail from "./pages/StockDetail";

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();
  const showTitle = location.pathname === "/";

  return (
    <div style={{ padding: "1rem" }}>
      {showTitle && <h1>Live Chinese Stock Prices</h1>}
      <Routes>
        <Route path="/" element={<SinaStockTable />} />
        <Route path="/stock/:code" element={<StockDetail />} />
      </Routes>
    </div>
  );
}

export default App;
