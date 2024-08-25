type Half = "1st-half" | "2nd-half";

/**
 *
 * @param period first or second half
 * @returns an array of valid rows, 
 * i.e Scoring events (not fouls) or separator rows
 */
const getValidRows = (period: Half) => {
  const rows = document.querySelector(
    `[data-testid="period-${period}"]`
  )?.childNodes;
  return Array.from(rows)
    .map((row) => row.firstChild?.childNodes)
    .filter(
      (row) =>
        row &&
        row.length >= 3 &&
        row[1] &&
        (row[1]?.firstChild as HTMLElement)?.innerText !== "Foul"
    );
};

/**
 * A helper function to parse a row of into our data object.
 * a row might look like:
 * `12:00 2pts 10-5`
 * as such, parse the first part into seconds and the last part into a delta,
 * ignoring the middle gunk
 * @param row
 * @param halfOffset
 * @retuns an object with x and y values.
 */
const processRow = (row: any, halfOffset = 0) => {
  const [minutes, seconds] = row[0].innerText.split(":");
  const time = 2400 - ((Number(minutes) + halfOffset) * 60 + Number(seconds));
  const [teamA, teamB] = row[2].innerText.split(" - ");
  return { x: time, y: Number(teamA) - Number(teamB) };
};

/**
 * Porccess all valid rows from a a half into a {x: time, y: delta} format
 * @param period first or second half
 * @returns an array of objects with a delta and time in seconds
 */
const processHalf = (period: Half) => {
  const halfOffset = period === "1st-half" ? 20 : 0;
  return getValidRows(period).map((row) => processRow(row, halfOffset));
};

/**
 * Process the first and second half, sort the results,
 * and add a start and end score so the worm is filled out.
 */
export const getData = () => {
  const allResults  = [
    { x: 0, y: 0 },
    ...processHalf("1st-half"),
    ...processHalf("2nd-half"),
  ].sort((a, b) => a.x - b.x);
  allResults.push({ x: 2400, y: allResults[allResults.length - 1].y });
  return allResults;
};
