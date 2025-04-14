import FirstComeFirstServe from "./FirstComeFirstServe";
// TODO: Implement the rest of the schedulers
import ShortestJobFirst from "./SJF";
// import Priority from "./Priority";
// import RoundRobin from "./RoundRobin";

export default new Map([
  ["First Come First Serve (FCFS)", FirstComeFirstServe],
  // TODO: Uncomment the following schedulers when implemented
  ["Shortest Job First (SJF)", ShortestJobFirst],
  // ["Priority", Priority],
  // ["Round Robin (RR)", RoundRobin],
]);
