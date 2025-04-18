import { useState } from "react";

import Analysis from "../Analysis";
import Chart from "../Chart";

function preemptiveSJF(processesData) {
  const processes = Array.from(processesData.entries()).map(([id, data]) => ({
    processID: id,
    arrivalTime: data.arrivalTime,
    burstTime: data.burstTime,
    remainingTime: data.burstTime,
  }));

  let time = 0;
  const res = [];
  const readyQueue = [];

  while (processes.length > 0 || readyQueue.length > 0) {
    // Add newly arrived processes to the ready queue
    for (let i = 0; i < processes.length; ) {
      if (processes[i].arrivalTime <= time) {
        readyQueue.push(processes[i]);
        processes.splice(i, 1);
      } else {
        i++;
      }
    }

    // Sort ready queue by remaining time, then by process ID
    readyQueue.sort((a, b) => {
      if (a.remainingTime !== b.remainingTime) {
        return a.remainingTime - b.remainingTime;
      }
      return a.processID.localeCompare(b.processID);
    });

    if (readyQueue.length > 0) {
      const current = readyQueue[0];

      // Record this 1 unit of execution
      if (
        res.length === 0 ||
        res[res.length - 1].processID !== current.processID
      ) {
        res.push({
          processID: current.processID,
          start: time,
          finish: time + 1,
        });
      } else {
        res[res.length - 1].finish++;
      }

      current.remainingTime--;
      if (current.remainingTime === 0) {
        readyQueue.shift();
      }

      time++;
    } else {
      // Idle time
      time++;
    }
  }

  return res;
}

export default function PreemptiveSJF() {
  const [processesData, setProcessesData] = useState(new Map());

  function addProcess(formData) {
    const processId = formData.get("processId");
    const burstTime = parseInt(formData.get("burstTime"));
    const arrivalTime = parseInt(formData.get("arrivalTime"));

    setProcessesData((prev) =>
      new Map(prev).set(processId, { burstTime, arrivalTime }),
    );
  }

  const chartData = preemptiveSJF(processesData);

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
