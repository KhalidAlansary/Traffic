import { useEffect, useState } from "react";
import mermaid from "mermaid";
import PropTypes from "prop-types";

export default function Chart({ chartData }) {
  const [ganttChart, setGanttChart] = useState();

  useEffect(() => {
    if (chartData && chartData.length > 0) {
      drawChart();
    }
  }, [chartData]);

  if (!chartData || chartData.length === 0) {
    return <h2>Add processes to see the Gantt chart</h2>;
  }

  let graphDefinition = `
gantt
    title CPU Scheduling
    dateFormat  x
    axisFormat %L
    section Processes
`;

  for (const { processID, start, finish } of chartData) {
    graphDefinition += `    ${processID} : ${start}, ${finish}\n`;
  }

  async function drawChart() {
    const { svg } = await mermaid.render("ganttChart", graphDefinition);
    setGanttChart(svg);
  }

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
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      processID: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
    }),
  ).isRequired,
};
