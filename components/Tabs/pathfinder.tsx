"use client";

import React, { useEffect, useRef, useState } from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plane, Bus, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
type ConnectionType = "plane" | "bus";

interface Node {
  id?: number;
  label: string;
}
interface Edge {
  id?: number;
  from: number;
  to: number;
  label: string;
  color: {
    color: string;
    highlight: string;
    hover: string;
  };
  originalColor?: {
    color: string;
    highlight: string;
    hover: string;
  };
  width: number;
  font: {
    size: number;
  };
  smooth: {
    enabled: boolean;
    type: string;
    forceDirection?: string | boolean;
    roundness: number;
  };
  transportType: string;
}

interface PathEdge {
  from: string;
  to: string;
}

interface Solution {
  path: string[];
  distance: number;
}
const initialCities: string[] = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Kolkata",
  "Chennai",
];
const initialConnections = [
  { from: "Delhi", to: "Mumbai", distance: 1148, type: "plane" },
  { from: "Mumbai", to: "Bangalore", distance: 842, type: "plane" },
  { from: "Bangalore", to: "Chennai", distance: 290, type: "bus" },
  { from: "Chennai", to: "Kolkata", distance: 1366, type: "plane" },
  { from: "Kolkata", to: "Delhi", distance: 1305, type: "plane" },
  { from: "Delhi", to: "Bangalore", distance: 1740, type: "plane" },
];

export default function Pathfinder() {
  const [network, setNetwork] = useState<Network | null>(null);
  const [nodes, setNodes] = useState<DataSet<Node>>(new DataSet([]));
  const [edges, setEdges] = useState<DataSet<Edge>>(new DataSet([]));
  const [cityName, setCityName] = useState<string>("");
  const [fromCity, setFromCity] = useState<string>("");
  const [toCity, setToCity] = useState<string>("");
  const [distance, setDistance] = useState<string>("");
  const [transportType, setTransportType] = useState<ConnectionType>("bus");
  const [startCity, setStartCity] = useState<string>("");
  const [endCity, setEndCity] = useState<string>("");
  const [solution, setSolution] = useState<Solution | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [animationInProgress, setAnimationInProgress] =
    useState<boolean>(false);

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      const options = {
        edges: {
          labelHighlightBold: true,
          font: { size: 12 },
          smooth: {
            enabled: true,
            type: "cubicBezier",
            forceDirection: "none",
            roundness: 0.5,
          },
        },

        nodes: {
          font: {
            face: "Roboto, Arial, sans-serif",
            size: 16,
            color: "#000000",
            bold: "bold",
          },
          scaling: { label: true },
          shape: "dot",
          size: 12,
          color: {
            border: "#000000",
            background: "#FFFFFF",
            highlight: {
              border: "#000000",
              background: "#CCCCCC",
            },
            hover: {
              border: "#000000",
              background: "#EEEEEE",
            },
          },
        },
        physics: {
          enabled: true,
          solver: "repulsion",
          barnesHut: {
            gravitationalConstant: -2000,
            centralGravity: 0.3,
            springLength: 200,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 0.1,
          },
          stabilization: {
            iterations: 250,
            fit: true,
          },
        },
        interaction: {
          hover: true,
          tooltipDelay: 200,
        },
      };

      const network = new Network(container.current, { nodes, edges }, options);
      setNetwork(network);
      network.on("stabilizationIterationsDone", function () {
        network.fit();
      });
    }
  }, [nodes, edges]);

  useEffect(() => {
    // Initialize with example data
    const initialNodes = new DataSet(
      initialCities.map((city, index) => ({ id: index + 1, label: city }))
    );
    setNodes(initialNodes);

    const initialEdges = new DataSet(
      initialConnections
        .map((conn, index) => {
          const fromNode = initialNodes
            .get()
            .find((node) => node.label === conn.from);
          const toNode = initialNodes
            .get()
            .find((node) => node.label === conn.to);
          if (fromNode && toNode) {
            return {
              id: index + 1,
              from: fromNode.id,
              to: toNode.id,
              label: conn.distance.toString(),
              color:
                conn.type === "bus"
                  ? { color: "#ED8936", highlight: "#DD6B20", hover: "#DD6B20" }
                  : {
                      color: "#38A169",
                      highlight: "#2F855A",
                      hover: "#2F855A",
                    },
              width: 2,
              font: { size: 12 },
              smooth: { type: "cubicBezier" },
              transportType: conn.type,
            };
          }
          return null;
        })
        .filter((edge) => edge !== null)
    );
    setEdges(initialEdges as DataSet<Edge>);
  }, []);

  const addCity = () => {
    if (cityName) {
      const newId = nodes.length + 1;
      nodes.add({ id: newId, label: cityName });
      setCityName("");
    }
  };

  const addConnection = () => {
    if (fromCity && toCity && distance) {
      const from = nodes.get().find((node) => node.label === fromCity);
      const to = nodes.get().find((node) => node.label === toCity);
      if (from && to) {
        edges.add({
          from: from.id,
          to: to.id,
          label: distance,
          color:
            transportType === "bus"
              ? { color: "#ED8936", highlight: "#DD6B20", hover: "#DD6B20" }
              : { color: "#38A169", highlight: "#2F855A", hover: "#2F855A" },
          width: 2,
          font: { size: 12 },
          smooth: {
            enabled: true,
            roundness: 0.5,
            type: "cubicBezier",
          },
          transportType: transportType,
        });
        setFromCity("");
        setToCity("");
        setDistance("");
        setTransportType("bus");
      } else {
        setError("One or both cities not found. Please check your input.");
      }
    } else {
      setError("Please fill in all fields for the connection.");
    }
  };

  const solveShortestPath = () => {
    setError(null);
    if (!startCity || !endCity) {
      setError("Please select both start and end cities.");
      return;
    }

    const graph: {
      [key: string]: { [key: string]: { distance: number; type: string } };
    } = {};
    nodes.get().forEach((node) => {
      graph[node.id] = {};
    });
    edges.get().forEach((edge) => {
      if (
        typeof edge.from === "number" &&
        typeof edge.to === "number" &&
        typeof edge.label === "string"
      ) {
        graph[edge.from][edge.to] = {
          distance: parseInt(edge.label),
          type: edge.transportType,
        };
        graph[edge.to][edge.from] = {
          distance: parseInt(edge.label),
          type: edge.transportType,
        };
      }
    });

    const dijkstra = (start: string, end: string) => {
      const distances: { [key: string]: number } = {};
      const previous: { [key: string]: string | null } = {};
      const unvisited = new Set(Object.keys(graph));

      Object.keys(graph).forEach((node) => {
        distances[node] = Infinity;
        previous[node] = null;
      });
      distances[start] = 0;

      while (unvisited.size > 0) {
        const current = Array.from(unvisited).reduce((a, b) =>
          distances[a] < distances[b] ? a : b
        );
        unvisited.delete(current);

        if (current === end) break;

        for (const neighbor in graph[current]) {
          const alt = distances[current] + graph[current][neighbor].distance;
          if (alt < distances[neighbor]) {
            distances[neighbor] = alt;
            previous[neighbor] = current;
          }
        }
      }

      const path = [];
      let current: string | null = end;
      while (current) {
        const node = nodes.get(current);
        if (node && node.label) {
          path.unshift(node.label);
        }
        current = previous[current];
      }

      return { path, distance: distances[end], previous };
    };

    const startNode = nodes.get().find((node) => node.label === startCity);
    const endNode = nodes.get().find((node) => node.label === endCity);
    if (startNode && endNode) {
      const result = dijkstra(startNode.id.toString(), endNode.id.toString());
      setSolution(result);

      // Highlight the shortest path
      const pathEdges = [];
      let current = endNode.id.toString();
      while (result.previous[current]) {
        const prev = result.previous[current];
        pathEdges.push({ from: prev, to: current });
        current = prev || "";
      }

      // Reset all edges to their original color
      edges.update(
        edges.get().map((edge) => ({
          ...edge,
          color: edge.originalColor || edge.color,
          width: 2,
        }))
      );

      // Highlight the path edges
      pathEdges.forEach((edge) => {
        const existingEdge = edges
          .get()
          .find(
            (e) =>
              (e.from === parseInt(edge.from as string) &&
                e.to === parseInt(edge.to)) ||
              (e.from === parseInt(edge.to) &&
                e.to === parseInt(edge.from as string))
          );
        if (existingEdge) {
          edges.update({
            id: existingEdge.id,
            color: { color: "#E53E3E", highlight: "#C53030", hover: "#C53030" },
            width: 5,
            originalColor: existingEdge.color,
          });
        }
      });

      // Animate the path
      animatePath(pathEdges as PathEdge[]);

      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#000000", "#FFFFFF", "#666666"],
      });
    } else {
      setError("Start or end city not found in the network.");
    }
  };

  const animatePath = (pathEdges: { from: string; to: string }[]) => {
    if (!network) return;

    setAnimationInProgress(true);

    const animateStep = (index: number) => {
      if (index >= pathEdges.length) {
        setAnimationInProgress(false);
        return;
      }

      const edge = pathEdges[index];
      const edgeData = edges
        .get()
        .find(
          (e) =>
            (e.from === parseInt(edge.from) && e.to === parseInt(edge.to)) ||
            (e.from === parseInt(edge.to) && e.to === parseInt(edge.from))
        );

      if (edgeData) {
        const fromPos = network.getPositions([parseInt(edge.from)])[
          parseInt(edge.from)
        ];
        const toPos = network.getPositions([parseInt(edge.to)])[
          parseInt(edge.to)
        ];

        const duration = 1000; // Animation duration in milliseconds

        let start: number | null = null;
        const step = (timestamp: number) => {
          if (!start) start = timestamp;
          const progress = (timestamp - start) / duration;

          if (progress < 1) {
            const x = fromPos.x + (toPos.x - fromPos.x) * progress;
            const y = fromPos.y + (toPos.y - fromPos.y) * progress;

            network.canvasToDOM({ x, y });
            requestAnimationFrame(step);
          } else {
            animateStep(index + 1);
          }
        };

        requestAnimationFrame(step);
      } else {
        animateStep(index + 1);
      }
    };

    animateStep(0);
  };

  return (
    <div className="min-h-screen  bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl mx-auto shadow-lg transition-all duration-500 ease-in-out transform hover:scale-[1.02] animate-fade-in">
        <CardHeader className="bg-black text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold">Path Finder </CardTitle>
          <CardDescription className="text-gray-300">
            Discover the shortest routes with style
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label
                  htmlFor="cityName"
                  className="text-lg font-semibold text-gray-700"
                >
                  Add City
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="cityName"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    placeholder="Enter city name"
                    className="flex-grow"
                  />
                  <Button
                    onClick={addCity}
                    className="bg-black text-white hover:bg-gray-800 transition-colors duration-300"
                  >
                    Add
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-700">
                  Add Connection
                </Label>
                <div className="flex flex-col gap-3">
                  <Select value={fromCity} onValueChange={setFromCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="From City" />
                    </SelectTrigger>
                    <SelectContent>
                      {nodes.get().map((node) => (
                        <SelectItem key={node.id} value={node.label}>
                          {node.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={toCity} onValueChange={setToCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="To City" />
                    </SelectTrigger>
                    <SelectContent>
                      {nodes.get().map((node) => (
                        <SelectItem key={node.id} value={node.label}>
                          {node.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="Distance"
                    type="number"
                  />
                  <Select
                    value={transportType}
                    onValueChange={(value: string) =>
                      setTransportType(value as ConnectionType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Transport Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bus">Bus</SelectItem>
                      <SelectItem value="plane">Plane</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={addConnection}
                    className="bg-black text-white hover:bg-gray-800 transition-colors duration-300"
                  >
                    Add Connection
                  </Button>
                </div>
              </div>
            </div>
            <div
              ref={container}
              className="h-[400px] border border-gray-300 rounded-lg shadow-inner bg-white"
            ></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={startCity} onValueChange={setStartCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Start City" />
                </SelectTrigger>
                <SelectContent>
                  {nodes.get().map((node) => (
                    <SelectItem key={node.id} value={node.label}>
                      {node.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={endCity} onValueChange={setEndCity}>
                <SelectTrigger>
                  <SelectValue placeholder="End City" />
                </SelectTrigger>
                <SelectContent>
                  {nodes.get().map((node) => (
                    <SelectItem key={node.id} value={node.label}>
                      {node.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={solveShortestPath}
                disabled={animationInProgress}
                className={`bg-black text-white hover:bg-gray-800 transition-all duration-300 ${
                  animationInProgress ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {animationInProgress ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Animating...
                  </>
                ) : (
                  "Find Shortest Path"
                )}
              </Button>
            </div>
            {error && (
              <div className="text-red-500 font-semibold bg-red-100 border border-red-300 rounded-md p-3 animate-shake">
                {error}
              </div>
            )}
            {solution && (
              <div className="bg-gray-100 border border-gray-300 rounded-md p-4 space-y-2 animate-fade-in">
                <h3 className="font-semibold text-gray-800">Shortest Path:</h3>
                <p className="text-gray-700">{solution.path.join(" → ")}</p>
                <h3 className="font-semibold text-gray-800 mt-2">
                  Total Distance:
                </h3>
                <p className="text-gray-700">{solution.distance} units</p>
              </div>
            )}
            <div className="flex justify-center gap-6 text-sm">
              <span className="flex items-center gap-1">
                <Bus className="text-orange-500" /> Bus travel
              </span>
              <span className="flex items-center gap-1">
                <Plane className="text-green-500" /> Flight travel
              </span>
              <span className="flex items-center gap-1">
                <div className="w-4 h-1 bg-red-500"></div> Shortest path
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
