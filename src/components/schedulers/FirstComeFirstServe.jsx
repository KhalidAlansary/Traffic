import { useState } from "react";
import PropTypes from "prop-types";

function fcfs(burstTimes) {
  return Array.from(burstTimes.entries()).flatMap(([key, value]) => ({
    processID: key,
    duration: value,
  }));
}

export default function FirstComeFirstServe({ setRes }) {
  const [burstTimes, setBurstTimes] = useState(new Map());

  function addProcess(formData) {
    const processId = formData.get("processId");
    const burstTime = parseInt(formData.get("burstTime"));

    if (processId && burstTime) {
      setBurstTimes((prev) => new Map(prev).set(processId, burstTime));
    }
  }

  return (
    <>
      <p>Insert processes in the order of arrival</p>
      <ul>
        {Array.from(burstTimes.entries()).map(([processId, burstTime]) => (
          <li key={processId}>
            Process ID: {processId}, Burst Time: {burstTime}
          </li>
        ))}
      </ul>
      <form action={addProcess}>
        <label>
          Process ID:
          <input
            type="text"
            name="processId"
            defaultValue={`P${burstTimes.size}`}
            required
          />
        </label>
        <label>
          Burst Time:
          <input type="number" name="burstTime" required />
        </label>
        <input type="submit" value="Add Process" />
      </form>
      <button
        type="button"
        onClick={() => {
          setRes(fcfs(burstTimes));
        }}
      >
        Draw Gantt Chart
      </button>
    </>
  );
}

FirstComeFirstServe.propTypes = {
  setRes: PropTypes.func.isRequired,
};
