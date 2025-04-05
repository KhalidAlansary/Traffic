import { useEffect, useState } from "react";
import mermaid from "mermaid";
import PropTypes from "prop-types";

export default function Chart({ data }) {
  const [ganttChart, setGanttChart] = useState();

  let graphDefinition = `
gantt
    title CPU Scheduling
    dateFormat  x
    axisFormat %L
    section Processes
`;

  let lastFinishedTime = 0;
  for (const { processID, duration } of data) {
    graphDefinition += `    ${processID} : ${lastFinishedTime}, ${lastFinishedTime + duration}\n`;
    lastFinishedTime += duration;
  }

  async function drawChart() {
    const { svg } = await mermaid.render("ganttChart", graphDefinition);
    setGanttChart(svg);
  }

  useEffect(() => {
    drawChart();
  }, [data]);

  if (!ganttChart) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h2>Gantt Chart</h2>
      <div
        className="mermaid"
        dangerouslySetInnerHTML={{ __html: ganttChart }}
      />
    </div>
  );
}

Chart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      processID: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
    }),
  ).isRequired,
};
