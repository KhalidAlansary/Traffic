import { useState } from "react";

import Analysis from "../Analysis";
import Chart from "../Chart";

function rr(processesData, timeQuantum) {
  const queue = [];
  const result = [];
  const processes = new Map(processesData);
  let time = 0;

  const arrivalQueue = Array.from(processes.entries()).sort(
    ([idA, a], [idB, b]) => {
      const arrivalComparison = a.arrivalTime - b.arrivalTime;
      return arrivalComparison ? arrivalComparison : idA.localeCompare(idB);
    },
  );

  while (arrivalQueue.length || queue.length) {
    while (arrivalQueue.length > 0 && arrivalQueue[0][1].arrivalTime <= time) {
      const [pid, info] = arrivalQueue.shift();
      queue.push({ processID: pid, ...info, remainingTime: info.burstTime });
    }

    if (queue.length === 0) {
      time = arrivalQueue[0][1].arrivalTime;
      continue;
    }

    const current = queue.shift();
    const execTime = Math.min(timeQuantum, current.remainingTime);
    const start = time;
    const finish = time + execTime;

    result.push({
      processID: current.processID,
      start,
      finish,
    });

    time = finish;
    current.remainingTime -= execTime;

    while (arrivalQueue.length > 0 && arrivalQueue[0][1].arrivalTime <= time) {
      const [pid, info] = arrivalQueue.shift();
      queue.push({ processID: pid, ...info, remainingTime: info.burstTime });
    }

    if (current.remainingTime > 0) {
      queue.push(current);
    }
  }

  return result;
}

export default function RoundRobin() {
  const [processesData, setProcessesData] = useState(new Map());
  const [quantum, setQuantum] = useState(1);

  function addProcess(formData) {
    const processId = formData.get("processId");
    const burstTime = parseInt(formData.get("burstTime"));
    const arrivalTime = parseInt(formData.get("arrivalTime"));

    setProcessesData((prev) =>
      new Map(prev).set(processId, { burstTime, arrivalTime }),
    );
  }

  function handleQuantumForm(formData) {
    const newQuantum = parseInt(formData.get("quantum"));
    setQuantum(newQuantum);
  }

  const chartData = rr(processesData, quantum);

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
      <form action={handleQuantumForm}>
        <label>
          Quantum:
          <input type="number" name="quantum" defaultValue={quantum} min="1" />
        </label>
        <input type="submit" value="Set Quantum" />
      </form>
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
