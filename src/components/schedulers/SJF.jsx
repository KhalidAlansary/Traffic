import { useState } from "react";
import Analysis from "../Analysis";
import Chart from "../Chart";

function sjf(processesData) {
  let processes = Array.from(processesData.entries())
    .map(([id, data]) => ({
      id,
      ...data,
    }))
    .sort((a, b) => a.arrivalTime - b.arrivalTime);

  const res = [];
  let currentTime = processes.length > 0 ? processes[0].arrivalTime : 0;

  while (processes.length > 0) {
    const readyQueue = processes.filter(
      (process) => process.arrivalTime <= currentTime,
    );
    let selectedProcess;

    if (readyQueue.length > 0) {
      selectedProcess = readyQueue.reduce((prev, curr) =>
        curr.burstTime < prev.burstTime ? curr : prev,
      );
    } else {
      selectedProcess = processes[0];
      currentTime = selectedProcess.arrivalTime;
    }

    const start = currentTime;
    currentTime = start + selectedProcess.burstTime;
    res.push({
      processID: selectedProcess.id,
      start,
      finish: currentTime,
      arrivalTime: selectedProcess.arrivalTime,
    });

    processes = processes.filter(
      (process) => process.id !== selectedProcess.id,
    );
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
        new Map(prev).set(processId, { burstTime, arrivalTime }),
      );
    }
  }

  const chartData = sjf(processesData);

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
            min="0"
            defaultValue="0"
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
