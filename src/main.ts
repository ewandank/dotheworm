// This is super annoying to type. I can't be stuffed.
import { backgroundPlugin, labelPlugin } from "./plugins";
import { getData } from "./data";
const data = getData();

/**
 * Get the largest absolute value, round it to be even and pad it by 2.
 */
const graphSize =
  Math.round(data.reduce((max, { y }) => Math.max(max, Math.abs(y)), 0) / 2) *
    2 +
  2;
const title = document.title.split(",")[0].split(" v ");
const teamA = title[0];
const teamB = title[1];
let isFlipped = false;
// IIFE to create and render the chart.
(() => {
  const firstHalfSection = document.querySelector(
    `[data-testid="period-1st-half"]`
  );
  if (!firstHalfSection) return;
  const canvas = document.createElement("canvas");
  // Chart is now available on the window object, idk how to scope it properly.
  import("https://unpkg.com/chart.js@4.4.4/dist/chart.umd.js").then(() => {

    canvas.style.userSelect = "none";
    canvas.style.webkitUserSelect = "none";
    firstHalfSection.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            normalized: true,
            data,
            fill: false,
            backgroundColor: "blue",
            stepped: true,
            borderColor: "blue",
            borderWidth: 2,
            pointRadius: 0, // No markers
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: isFlipped ? `${teamB} vs ${teamA}` : `${teamA} vs ${teamB}`,
            fullSize: false,
            font: { size: 30 },
          },
          legend: { display: false },
        },
        scales: {
          x: {
            type: "linear",
            grid: {
              display: false,
            },
            min: 0,
            max: 2400,
            ticks: { display: false },
          },
          y: {
            min: -graphSize,
            max: graphSize,
            beginAtZero: true,
            reverse: false,
            border: {
              dash: ({ tick }) => (tick.value === 0 ? [0, 0] : [5, 5]),
            },
            grid: {
              drawTicks: false,
            },
            ticks: {
              stepSize: graphSize < 20 ? 1 : 2,
              callback: (value) => Math.abs(value as number).toString(),
            },
          },
        },
      },

      plugins: [backgroundPlugin, labelPlugin],
    });
    ctx.save();
    ctx.beginPath();
    ctx.stroke();
    ctx.restore();

    // Create and append button to copy chart as image
    const copyButton = document.createElement("button");
    copyButton.innerText = "Copy Chart as Image";
    firstHalfSection.appendChild(copyButton);

    copyButton.addEventListener("click", async () => {
      const blob : Blob | null =await  (new Promise((res) => canvas.toBlob(res)));

      if (
        navigator.canShare &&
        navigator.canShare({ files: [new File([], "")] }) && 
        blob !== null
      ){
        try {
          const file = new File([blob], "image.png", { type: "image/png" });

          await navigator.share({
            title: "Check out this image!",
            text: "This is an awesome image.",
            files: [file],
          });
          console.log("Image shared successfully!");
        } catch (error) {
          console.error("Error sharing the image:", error);
        }
      } else {
        alert("Your browser does not support image sharing.");
      }
    });

    // append a button to flip over y and flip the title.
    const flipButton = document.createElement("button");
    flipButton.innerText = "Flip over x axis";
    flipButton.onclick = () => {
      const dataset = chart.data.datasets?.[0];

      if (dataset) {
        dataset.data = dataset.data.map((point) => {
          return { ...point, y: -point.y };
        });

        isFlipped = !isFlipped;
        chart!.options!.plugins!.title!.text = isFlipped
          ? `${teamB} vs ${teamA}`
          : `${teamA} vs ${teamB}`;

        chart.update();
      }
    };
    firstHalfSection.appendChild(flipButton);
  });
  canvas.style.width = "1200px";
  canvas.style.height = "600px";
})();
