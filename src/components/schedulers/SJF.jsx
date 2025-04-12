import { useState } from "react";

import Analysis from "../Analysis";
import Chart from "../Chart";

function sjf(processesData) {
    const processesQueue = Array.from(processesData.entries()).sort(
      ([, a], [, b]) => { // Remove idA and idB
        const arrivalComparison = a.arrivalTime - b.arrivalTime;
        return arrivalComparison !== 0 ? arrivalComparison : a.burstTime - b.burstTime;
      }
    );
  
    const res = [];
    let finish = 0;
    while (processesQueue.length > 0) {
      const [processID, { burstTime, arrivalTime }] = processesQueue.shift();
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


export default function ShortestJobFirst() {
  const [processesData, setProcessesData] = useState(new Map());

  function addProcess(formData) {
    const processId = formData.get("processId");
    const burstTime = parseInt(formData.get("burstTime"));
    const arrivalTime = parseInt(formData.get("arrivalTime"));

    if (!isNaN(burstTime) && !isNaN(arrivalTime) && processId) {
      setProcessesData((prev) =>
        new Map(prev).set(processId, { burstTime, arrivalTime })
      );
    }
  }

  const chartData = sjf(processesData);

  return (
    <>
      {processesData.size === 0 ? (
        <p>No processes added yet. Please add processes to visualize the schedule.</p>
      ) : (
        <ul>
          {Array.from(processesData.entries()).map(([processId, val]) => (
            <li key={processId}>
              Process ID: {processId}, Burst Time: {val.burstTime}, Arrival Time:{" "}
              {val.arrivalTime}
            </li>
          ))}
        </ul>
      )}
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
        <label>
          Arrival Time:
          <input
            type="number"
            name="arrivalTime"
            defaultValue="0"
            min="0"
            required
          />
        </label>
        <input type="submit" value="Add Process" />
      </form>

      <Chart chartData={chartData} />

      <Analysis chartData={chartData} processesData={processesData} />
    </>
  );
}