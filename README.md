# Traffic 🚦

Traffic is an OS scheduler simulator built with Electron and React. It helps visualize different CPU scheduling algorithms by generating Gantt charts and calculating important metrics like average waiting time and turnaround time.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Installation](#installation)
- [Development](#development)

## Demo

1. First Come First Serve (FCFS)
   ![FCFS user input](https://github.com/user-attachments/assets/d83001ae-3b9b-4765-b978-e95927a39d89)
   ![FCFS output](https://github.com/user-attachments/assets/fadd8436-9b71-4257-bf40-d5c7dc829344)

## Features

- Multiple CPU scheduling algorithms:
  - First Come First Serve (FCFS)
  - Shortest Job First (SJF)
  - Priority
  - Round Robin
- Interactive process input
- Real-time Gantt chart visualization
- Automatic calculation of:
  - Waiting time per process
  - Turnaround time per process
  - Average waiting time
  - Average turnaround time

## Installation

1. Go to the [Releases](https://github.com/KhalidAlansary/Traffic/releases) page
2. Download the latest installer for your operating system:
   - For Windows: `traffic-[version].Setup.exe`
3. Run the installer and enjoy!

> **Note**: The app is built with Electron, so it may take a few seconds to start up the first time.

> **Note**: For Windows users, the app is installed in the `C:\Users\<YourUsername>\AppData\Local\Programs\Traffic` directory.

## Development

To run the project locally:

```sh
# Install dependencies
npm install

# Start the development server
npm start
```
