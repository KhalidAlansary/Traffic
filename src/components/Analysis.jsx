import PropTypes from "prop-types";

export default function Analysis({ chartData, processesData }) {
  const analysis = [];

  for (const [processId, { burstTime, arrivalTime }] of processesData) {
    const { finish } = chartData.findLast(
      (process) => process.processID === processId,
    );
    const waitingTime = finish - arrivalTime - burstTime;
    const turnAroundTime = finish - arrivalTime;
    analysis.push({
      processId,
      waitingTime,
      turnAroundTime,
    });
  }

  const averageWaitingTime =
    analysis.reduce((acc, { waitingTime }) => acc + waitingTime, 0) /
    analysis.length;
  const averageTurnAroundTime =
    analysis.reduce((acc, { turnAroundTime }) => acc + turnAroundTime, 0) /
    analysis.length;

  return (
    <div className="analysis">
      <h2>Analysis</h2>
      <table>
        <thead>
          <tr>
            <th>Process ID</th>
            <th>Waiting Time</th>
            <th>Turn Around Time</th>
          </tr>
        </thead>
        <tbody>
          {analysis.map(({ processId, waitingTime, turnAroundTime }) => (
            <tr key={processId}>
              <td>{processId}</td>
              <td>{waitingTime}</td>
              <td>{turnAroundTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="averages">
        <p>Average Waiting Time: {averageWaitingTime}</p>
        <p>Average Turn Around Time: {averageTurnAroundTime}</p>
      </div>
    </div>
  );
}

Analysis.propTypes = {
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      processID: PropTypes.string.isRequired,
      start: PropTypes.number.isRequired,
      finish: PropTypes.number.isRequired,
    }),
  ).isRequired,
  processesData: PropTypes.instanceOf(Map).isRequired,
};
