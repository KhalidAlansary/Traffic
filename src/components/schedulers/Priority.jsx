import { useState } from "react";
import Analysis from "../Analysis";
import Chart from "../Chart";

function priorityScheduling(processesData) {
  let processesQueue = Array.from(processesData.entries());
  const res = [];
  let finish = 0;

  while (processesQueue.length > 0) {
    let ready = processesQueue.filter(
      ([, process]) => process.arrivalTime <= finish,
    );

    if (ready.length === 0) {
      processesQueue.sort((a, b) => a[1].arrivalTime - b[1].arrivalTime);
      const [processID, process] = processesQueue.shift();
      const start = Math.max(finish, process.arrivalTime);
      finish = start + process.burstTime;
      res.push({
        processID,
        start,
        finish,
      });
    } else {
      ready.sort((a, b) => a[1].priority - b[1].priority);
      const processID = ready[0][0];
      const process = ready[0][1];

      const index = processesQueue.findIndex(([id]) => id === processID);
      processesQueue.splice(index, 1);

      const start = finish;
      finish = start + process.burstTime;
      res.push({
        processID,
        start,
        finish,
      });
    }
  }
  return res;
}

export default function PriorityScheduler() {
  const [processesData, setProcessesData] = useState(new Map());

  function addProcess(formData) {
    const processId = formData.get("processId");
    const burstTime = parseInt(formData.get("burstTime"));
    const arrivalTime = parseInt(formData.get("arrivalTime"));
    const priority = parseInt(formData.get("priority"));

    setProcessesData((prev) =>
      new Map(prev).set(processId, { burstTime, arrivalTime, priority }),
    );
  }

  const chartData = priorityScheduling(processesData);

  return (
    <>
      <ul>
        {Array.from(processesData.entries()).map(([processId, val]) => (
          <li key={processId}>
            Process ID: {processId}, Burst Time: {val.burstTime}, Arrival Time:{" "}
            {val.arrivalTime}, Priority: {val.priority}
          </li>
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addProcess(new FormData(e.target));
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
        <label>
          Priority:
          <input type="number" name="priority" min="1" required />
        </label>
        <input type="submit" value="Add Process" />
      </form>

      <Chart chartData={chartData} />
      <Analysis chartData={chartData} processesData={processesData} />
    </>
  );
}
