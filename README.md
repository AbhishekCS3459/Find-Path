
# Pathfinder

## Overview

Pathfinder is a comprehensive web application designed to assist users in finding optimal paths or routes between cities using different modes of transportation (plane and bus). The application utilizes the `vis-network` library for graph visualization and implements various pathfinding algorithms, including Dijkstra's algorithm and the A* search algorithm, to calculate the most efficient routes. With a user-friendly interface, Pathfinder allows users to manage cities and their connections dynamically.

## Key Features

- **Interactive Graph Visualization**: Users can view cities as nodes and connections as edges with customizable attributes.
- **Dynamic City and Connection Management**: Add new cities and connections between them, specifying the distance and transport type.
- **Shortest Path Calculation**: Calculate the shortest path between two selected cities, displaying the route and total distance.
- **Visual Representation**: The project includes graphical representation capabilities to visually depict the graph, nodes, and paths, enhancing user understanding of the pathfinding process.
- **Confetti Animation**: Celebrate successful pathfinding with an engaging confetti animation.

## Technologies Used

- **Frontend**: React, TypeScript, `vis-network`, `vis-data`
- **Styling**: Custom UI components
- **Animation**: Canvas confetti for visual feedback

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/download/) (v14 or higher)
- [npm](https://www.npmjs.com/get-npm) (Node Package Manager)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AbhishekCS3459/Find-Path
   ```

2. **Navigate into the project directory:**
   ```bash
   cd pathfinder
   ```

3. **Install the dependencies:**
   ```bash
   npm install
   ```

### Running the Application

To start the development server, run:

```bash
npm run dev
```

This will start the application at `http://localhost:3000`. Open your browser and navigate to this URL to view the app.

## Usage

1. **Add Cities**: Enter a city name in the input field and click the "Add City" button to include it in the graph.
2. **Create Connections**: Select two cities, enter the distance, and choose the transport type (bus or plane) to create a connection between them.
3. **Find Shortest Path**: Select a starting city and an ending city, then click the "Find Path" button to calculate and visualize the shortest route.
4. **Visual Feedback**: Enjoy the animated path visualization and confetti celebration upon successful pathfinding.

## Contributing

We welcome contributions from the community! To contribute to Pathfinder, please follow these steps:

1. **Fork the repository**.
2. **Create a new branch**:
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. **Make your changes** and commit them:
   ```bash
   git commit -m "Add some feature"
   ```
4. **Push to the branch**:
   ```bash
   git push origin feature/YourFeatureName
   ```
5. **Open a pull request** with a description of your changes.

## Live Demo

Check out the live version of the application here: [Pathfinder Live](https://find-path.vercel.app/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by Dijkstra's algorithm and A* search algorithm for pathfinding.
