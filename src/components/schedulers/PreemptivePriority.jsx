import { useState } from "react";

import Analysis from "../Analysis";
import Chart from "../Chart";

function pp(processesData) {
  const processes = Array.from(processesData.entries())
    .map(([id, data]) => ({
      id,
      ...data,
    }))
    .sort((a, b) => b.arrivalTime - a.arrivalTime);

  const res = [];
  const readyQueue = [];
  let time = processes.at(-1)?.arrivalTime;
  let currentProcess = null;

  while (
    currentProcess !== null ||
    processes.length > 0 ||
    readyQueue.length > 0
  ) {
    // Add processes to the ready queue
    while (processes.length > 0 && processes.at(-1).arrivalTime <= time) {
      readyQueue.push(processes.pop());
    }
    readyQueue.sort((a, b) => {
      const priorityDiff = b.priority - a.priority;
      const arrivalDiff = b.arrivalTime - a.arrivalTime;
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      if (arrivalDiff !== 0) {
        return arrivalDiff;
      }
      return b.id.localeCompare(a.id);
    });

    // Decide what the current process should be
    if (readyQueue.length > 0) {
      if (currentProcess === null) {
        currentProcess = readyQueue.pop();
        currentProcess.start = time;
      } else if (readyQueue.at(-1).priority < currentProcess.priority) {
        const newProcess = readyQueue.pop();
        readyQueue.push(currentProcess);
        res.push({
          processID: currentProcess.id,
          start: currentProcess.start,
          finish: time,
        });
        currentProcess = newProcess;
        currentProcess.start = time;
      }
    }

    // Process spends 1 time unit
    time++;
    if (currentProcess !== null) {
      currentProcess.burstTime--;
      if (currentProcess.burstTime === 0) {
        res.push({
          processID: currentProcess.id,
          start: currentProcess.start,
          finish: time,
        });
        currentProcess = null;
      }
    }
  }

  return res;
}

export default function PreemptivePriority() {
  const [processesData, setProcessesData] = useState(new Map());

  function addProcess(formData) {
    const processId = formData.get("processId");
    const burstTime = parseInt(formData.get("burstTime"));
    const arrivalTime = parseInt(formData.get("arrivalTime"));
    const priority = parseInt(formData.get("priority"));

    setProcessesData((prev) =>
      new Map(prev).set(processId, {
        burstTime,
        arrivalTime,
        priority,
        start: null,
      }),
    );
  }

  const chartData = pp(processesData);

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
        <label>
          Priority:
          <input
            type="number"
            name="priority"
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
