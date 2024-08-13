() => {
  // theres a chance this selector is undefined, i don't care.
  document.querySelector('[data-testid="tab-play-by-play"]').click();

  const second_half = [
    ...document.querySelector('[data-testid="period-2nd-half"]').childNodes,
  ].map((containerNode) => containerNode.firstChild?.childNodes);

  const first_half = [
    ...document.querySelector('[data-testid="period-1st-half"]').childNodes,
  ].map((containerNode) => containerNode.firstChild?.childNodes);

  const deltas = [];
  const times = [];
  for (const row of first_half) {
    // ignore the header
    if (row.length < 3) {
      continue;
    }
    if (row[1].firstChild.innerText === "Foul") {
      continue;
    }
    const [minutes, seconds] = row[0].innerText.split(":");
    times.push((Number(minutes)+20) * 60 + Number(seconds));
    // this index is probably a little dodgy.
    const [teamA, teamB] = row[2].innerText.split(" - ");
    deltas.push(Number(teamA) - Number(teamB));
  }
  for (const row of second_half) {
    // ignore the header
    if (row.length < 3) {
      continue;
    }
    if (row[1].firstChild.innerText === "Foul") {
      continue;
    }
    const [minutes, seconds] = row[0].innerText.split(":");
    times.push((Number(minutes)) * 60 + Number(seconds));
    // this index is probably a little dodgy.
    const [teamA, teamB] = row[2].innerText.split(" - ");
    deltas.push(Number(teamA) - Number(teamB));
  }
  console.log(times);
  console.log(deltas);

  //   let first_half = [
  //     ...document.querySelector('[data-testid="period-1st-half"]').childNodes,
  //   ];

  //   first_half.map(
  //     (containerNode) => containerNode.firstChild.firstChild.childNodes
  //   );
};
