type Half = "1st-half" | "2nd-half";

/**
 *
 * @param period
 * @returns
 */
const getValidRows = (period: Half) => {
  const rows = document.querySelector(
    `[data-testid="period-${period}"]`
  )?.childNodes;
  if (rows === null || rows === undefined) {
    return [];
  }
  return Array.from(rows)
    .map((row) => row.firstChild?.childNodes)
    .filter(
      (row) =>
        row &&
        row.length >= 3 &&
        row[1] &&
        (row[1]?.firstChild as HTMLElement | undefined)?.innerText !== "Foul"
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
 * @returns
 */
const processRow = (row: any, halfOffset = 0) => {
  const [minutes, seconds] = row[0].innerText.split(":");
  const time = 2400 - ((Number(minutes) + halfOffset) * 60 + Number(seconds));
  const [teamA, teamB] = row[2].innerText.split(" - ");
  console.log({
    ms: `${Number(minutes) + halfOffset}:${Number(seconds)}`,
    time,
    delta: Number(teamA) - Number(teamB),
  });
  return { time, delta: Number(teamA) - Number(teamB) };
};

/**
 * Process both halves and combine results
 * @param period first or second half
 * @returns an array of objects with a delta and time in seconds
 */
export const processHalf = (period: Half) => {
  const halfOffset = period === "1st-half" ? 20 : 0;
  return getValidRows(period).map((row) => processRow(row, halfOffset));
};