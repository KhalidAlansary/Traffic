import { useState } from "react";

import Chart from "./components/Chart";
import schedulers from "./components/schedulers";

export default function App() {
  const [scheduler, setScheduler] = useState(schedulers.keys().next().value);
  const [res, setRes] = useState(null);

  const SchedulerComponent = schedulers.get(scheduler);

  return (
    <>
      <label>
        Scheduler type:
        <select
          value={scheduler}
          onChange={(e) => {
            setScheduler(e.target.value);
          }}
        >
          {Array.from(schedulers.keys()).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </label>

      <SchedulerComponent setRes={setRes} />

      {res && <Chart data={res} />}
    </>
  );
}
