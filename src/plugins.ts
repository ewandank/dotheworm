import type {Plugin } from "chart.js";

/**
 * Fill the canvas with white pixels for when it is copied as an image. 
 */
export const backgroundPlugin: Plugin = {
  id: "customCanvasBackgroundColor",
  beforeDraw: (chart) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
};


/**
 * Label the left half of the graph H1 and the right half H2.
 * Shade the left half grey. 
 */
export const labelPlugin: Plugin = {
  id: "textPlugin",
  beforeDraw: (chart) => {
    const ctx = chart.ctx;
    const chartArea = chart.chartArea;
    const width = chartArea.right - chartArea.left;
    const height = chartArea.bottom - chartArea.top;
    const fontSize = 8;
    const fontWeight = 800;

    ctx.save();
    ctx.font = `${fontWeight} ${fontSize}rem Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw grey rectangle on the left half of the chart area
    ctx.fillStyle = "#f7f7f9";
    ctx.fillRect(chartArea.left, chartArea.top, width / 2, height);

    // H1 and H2 centred within their respective areas. 
    ctx.fillStyle = "#e7e6e6";
    ctx.fillText(
      "H1",
      chartArea.left + width / 4,
      chart.height / 2 + fontSize * 2
    );

    // Draw H2
    ctx.fillStyle = "#e7e6e6";
    ctx.fillText(
      "H2",
      chartArea.left + (3 * width) / 4,
      chart.height / 2 + fontSize * 2
    );

    ctx.restore();
  },
};
