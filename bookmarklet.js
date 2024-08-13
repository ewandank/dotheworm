() => {
  // theres a chance this selector is undefined, i don't care.
  document.querySelector('[data-testid="tab-play-by-play"]').click();

// Helper function to get and filter rows
const getValidRows = (period) => {
  const rows = document.querySelector(`[data-testid="period-${period}"]`).childNodes;
  return Array.from(rows).map(row => row.firstChild?.childNodes)
    .filter(row => row && row.length >= 3 && row[1].firstChild.innerText !== "Foul");
};

// Helper function to process a valid row and extract time and delta
const processRow = (row, halfOffset = 0) => {
  const [minutes, seconds] = row[0].innerText.split(":");
  const time = (Number(minutes) + halfOffset) * 60 + Number(seconds);
  const [teamA, teamB] = row[2].innerText.split(" - ");
  return { time, delta: Number(teamA) - Number(teamB) };
};

// Process both halves and combine results
const processHalf = (period, halfOffset) => {
  return getValidRows(period).map(row => processRow(row, halfOffset));
};

// Combine first and second half results
const firstHalfResults = processHalf("1st-half", 20);
const secondHalfResults = processHalf("2nd-half", 0);

// Flatten times and deltas into separate arrays
const times = [...firstHalfResults, ...secondHalfResults].map(result => result.time);
const deltas = [...firstHalfResults, ...secondHalfResults].map(result => result.delta);

console.log(times);
console.log(deltas);


  //   let first_half = [
  //     ...document.querySelector('[data-testid="period-1st-half"]').childNodes,
  //   ];

  //   first_half.map(
  //     (containerNode) => containerNode.firstChild.firstChild.childNodes
  //   );
};
