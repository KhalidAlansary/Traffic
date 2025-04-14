import { useState } from "react";

import Analysis from "../Analysis";
import Chart from "../Chart";

function sjf(processesData) {
  const processesQueue = Array.from(processesData.entries()).sort(
    ([, a], [, b]) => a.burstTime - b.burstTime, // Sort only by burst time
  );

  const res = [];
  let finish = 0;
  while (processesQueue.length > 0) {
    const [processID, { burstTime }] = processesQueue.shift();
    const start = finish;
    finish = start + burstTime;
    res.push({
      processID,
      start,
      finish,
    });
  }
  return res;
}

export default function ShortestJobFirst() {
  const [processesData, setProcessesData] = useState(new Map());

  function addProcess(formData) {
    const processId = formData.get("processId");
    const burstTime = parseInt(formData.get("burstTime"));

    if (!isNaN(burstTime) && processId) {
      setProcessesData((prev) => new Map(prev).set(processId, { burstTime }));
    }
  }

  const chartData = sjf(processesData);

  return (
    <>
      <ul>
        {Array.from(processesData.entries()).map(([processId, val]) => (
          <li key={processId}>
            Process ID: {processId}, Burst Time: {val.burstTime}
          </li>
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          addProcess(formData);
          e.target.reset();
        }}
      >
        <label>
          Process ID:
          <input
            type="text"
            name="processId"
            defaultValue={`P${processesData.size}`}
            required
          />
        </label>
        <label>
          Burst Time:
          <input type="number" name="burstTime" min="1" required />
        </label>
        <input type="submit" value="Add Process" />
      </form>

      <Chart chartData={chartData} />

      <Analysis chartData={chartData} processesData={processesData} />
    </>
  );
}
