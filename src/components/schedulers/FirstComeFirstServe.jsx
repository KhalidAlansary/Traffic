import { useState } from "react";

import Analysis from "../Analysis";
import Chart from "../Chart";

function fcfs(processesData) {
  const processesQueue = Array.from(processesData.entries()).sort(
    ([, a], [, b]) => b.arrivalTime - a.arrivalTime,
  );
  const res = [];
  let finish = 0;
  while (processesQueue.length > 0) {
    let [processID, { burstTime, arrivalTime }] = processesQueue.pop();
    const start = Math.max(finish, arrivalTime);
    finish = start + burstTime;
    res.push({
      processID,
      start,
      finish,
    });
  }
  return res;
}

export default function FirstComeFirstServe() {
  const [processesData, setProcessesData] = useState(new Map());

  function addProcess(formData) {
    const processId = formData.get("processId");
    const burstTime = parseInt(formData.get("burstTime"));
    const arrivalTime = parseInt(formData.get("arrivalTime"));

    setProcessesData((prev) =>
      new Map(prev).set(processId, { burstTime, arrivalTime }),
    );
  }

  return (
    <>
      <ul>
        {Array.from(processesData.entries()).map(([processId, val]) => (
          <li key={processId}>
            Process ID: {processId}, Burst Time: {val.burstTime}, Arrival Time:{" "}
            {val.arrivalTime}
          </li>
        ))}
      </ul>
      <form action={addProcess}>
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
          <input type="number" name="burstTime" required />
        </label>
        <label>
          Arrival Time:
          <input type="number" name="arrivalTime" defaultValue={0} required />
        </label>
        <input type="submit" value="Add Process" />
      </form>

      <Chart data={fcfs(processesData)} />

      <Analysis data={processesData} />
    </>
  );
}
