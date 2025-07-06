import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import SinaStockTable from "./components/SinaStockTable";
import StockDetail from "./pages/StockDetail";
import Header from "./components/Header";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      {/* Show loading overlay globally */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            zIndex: 9999
          }}
        >
          Loading stock data...
        </div>
      )}

      {/* Always render routes */}
      <Header />
      <div style={{ padding: "1rem" }}>
        <Routes>
          <Route
            path="/"
            element={<SinaStockTable setLoading={setLoading} />}
          />
          <Route
            path="/stock/:code"
            element={<StockDetail setLoading={setLoading} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
