import FirstComeFirstServe from "./FirstComeFirstServe";
// TODO: Implement the rest of the schedulers
import ShortestJobFirst from "./SJF";
import ShortestRemainingTimeFirst from "./ShortestRemainingTimeFirst";
import Priority from "./Priority";
// import PreemptivePriority from "./PreemptivePriority";
// import RoundRobin from "./RoundRobin";

export default new Map([
  ["First Come First Serve (FCFS)", FirstComeFirstServe],
  // TODO: Uncomment the following schedulers when implemented
  ["Shortest Job First (SJF)", ShortestJobFirst],
  ["Shortest Remaining Time First", ShortestRemainingTimeFirst],
  ["Priority", Priority],
  // ["Preemptive Priority", PreemptivePriority],
  // ["Round Robin (RR)", RoundRobin],
]);
