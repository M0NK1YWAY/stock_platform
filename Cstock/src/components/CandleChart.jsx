import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function CandleChart({ data }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth || 800,
      height: 400,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#333"
      },
      grid: {
        vertLines: { color: "#eee" },
        horzLines: { color: "#eee" }
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false
      }
    });

    // Create separate price scales
    const candleSeries = chart.addCandlestickSeries({
      priceScaleId: 'candles'
    });

    const volumeSeries = chart.addHistogramSeries({
      priceScaleId: 'volume',
      priceFormat: { type: 'volume' },
      color: '#e0e0e0', // light gray
      scaleMargins: {
        top: 0.85,  // candlestick occupies top 85%
        bottom: 0
      }
    });

    chart.priceScale('candles').applyOptions({
      scaleMargins: {
        top: 0.1,
        bottom: 0.3   // leave room for volume
      }
    });

    chart.priceScale('volume').applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0
      }
    });

    // Format data
    const candleData = [];
    const volumeData = [];

    for (let d of data) {
      const timeVal = d.time.includes(" ")
        ? Math.floor(new Date(d.time).getTime() / 1000)
        : d.time;

      candleData.push({
        time: timeVal,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close
      });

      volumeData.push({
        time: timeVal,
        value: d.volume,
        color: '#e0e0e0'  // consistent light gray
      });
    }

    candleSeries.setData(candleData);
    volumeSeries.setData(volumeData);

    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({
        width: chartRef.current.clientWidth || 800
      });
    });

    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [data]);

  return <div ref={chartRef} style={{ width: "100%", height: "400px" }} />;
}
