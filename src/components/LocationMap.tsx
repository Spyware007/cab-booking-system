"use client";

import { useState, useEffect } from "react";

const LocationMap = () => {
  const [locations, setLocations] = useState([]);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    fetchLocations();
    fetchRoutes();
  }, []);

  const fetchLocations = async () => {
    const res = await fetch("/api/locations");
    const data = await res.json();
    setLocations(data.data);
  };

  const fetchRoutes = async () => {
    const res = await fetch("/api/routes");
    const data = await res.json();
    setRoutes(data.data);
  };

  const nodePositions = {
    A: { x: 50, y: 200 },
    B: { x: 150, y: 100 },
    C: { x: 150, y: 300 },
    D: { x: 250, y: 100 },
    E: { x: 250, y: 300 },
    F: { x: 350, y: 200 },
  };

  return (
    <svg width="400" height="400">
      {routes.map((route, index) => (
        <line
          key={index}
          x1={nodePositions[route.from.name].x}
          y1={nodePositions[route.from.name].y}
          x2={nodePositions[route.to.name].x}
          y2={nodePositions[route.to.name].y}
          stroke="black"
          strokeWidth="2"
        />
      ))}
      {locations.map((location) => (
        <g key={location._id}>
          <circle
            cx={nodePositions[location.name].x}
            cy={nodePositions[location.name].y}
            r={20}
            fill="lightblue"
            stroke="black"
          />
          <text
            x={nodePositions[location.name].x}
            y={nodePositions[location.name].y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="14"
          >
            {location.name}
          </text>
        </g>
      ))}
      {routes.map((route, index) => (
        <text
          key={`label-${index}`}
          x={
            (nodePositions[route.from.name].x +
              nodePositions[route.to.name].x) /
            2
          }
          y={
            (nodePositions[route.from.name].y +
              nodePositions[route.to.name].y) /
            2
          }
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="12"
          fill="red"
        >
          {route.duration} min
        </text>
      ))}
    </svg>
  );
};

export default LocationMap;
