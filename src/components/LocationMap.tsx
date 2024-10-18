import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LocationMap = () => {
  const [locations, setLocations] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    fetchLocations();
    fetchRoutes();
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  const handleResize = () => {
    if (containerRef.current) {
      const maxWidth = 800;
      const maxHeight = 600;
      const aspectRatio = 4 / 3;

      let width = containerRef.current.offsetWidth;
      width = Math.min(width, maxWidth);
      let height = width / aspectRatio;

      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }

      setDimensions({ width, height });
    }
  };

  const nodePositions = {
    A: { x: 15, y: 50 },
    B: { x: 38, y: 20 },
    C: { x: 38, y: 80 },
    D: { x: 62, y: 20 },
    E: { x: 62, y: 80 },
    F: { x: 85, y: 50 },
  };

  const calculateLabelPosition = (start, end, distanceFromStart = 15) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const ratio = distanceFromStart / distance;

    return {
      x: start.x + dx * ratio,
      y: start.y + dy * ratio,
    };
  };

  const getConnectedRoutes = (locationName) => {
    return routes.filter(
      (route) =>
        route.from.name === locationName || route.to.name === locationName
    );
  };

  return (
    <TooltipProvider>
      <div
        ref={containerRef}
        className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg max-w-4xl mx-auto"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
          Our Route Network
        </h2>
        <div
          style={{
            width: "100%",
            maxWidth: `${dimensions.width}px`,
            margin: "0 auto",
            position: "relative",
          }}
        >
          <svg
            viewBox="0 0 100 75"
            width={dimensions.width}
            height={dimensions.height}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="0"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#4B5563" />
              </marker>
            </defs>
            {routes.map((route, index) => {
              const start = nodePositions[route.from.name];
              const end = nodePositions[route.to.name];
              const labelPosition = calculateLabelPosition(start, end);
              return (
                <g key={index}>
                  <motion.line
                    x1={`${start.x}%`}
                    y1={`${start.y}%`}
                    x2={`${end.x}%`}
                    y2={`${end.y}%`}
                    stroke="#4B5563"
                    strokeWidth="0.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: index * 0.1 }}
                    markerEnd="url(#arrowhead)"
                  />
                  <motion.g
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.5 + index * 0.1 }}
                  >
                    <rect
                      x={`${labelPosition.x - 3}%`}
                      y={`${labelPosition.y - 2}%`}
                      width="6%"
                      height="4%"
                      rx="2"
                      ry="2"
                      fill="white"
                      stroke="#DC2626"
                      strokeWidth="0.3"
                    />
                    <text
                      x={`${labelPosition.x}%`}
                      y={`${labelPosition.y}%`}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="2"
                      fill="#DC2626"
                      fontWeight="bold"
                    >
                      {route.duration}m
                    </text>
                  </motion.g>
                </g>
              );
            })}
            {locations.map((location) => (
              <Tooltip key={location._id}>
                <TooltipTrigger asChild>
                  <g>
                    <motion.circle
                      cx={`${nodePositions[location.name].x}%`}
                      cy={`${nodePositions[location.name].y}%`}
                      r="4%"
                      fill={
                        hoveredLocation === location.name
                          ? "#60A5FA"
                          : "#93C5FD"
                      }
                      stroke="#2563EB"
                      strokeWidth="0.5"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      onMouseEnter={() => setHoveredLocation(location.name)}
                      onMouseLeave={() => setHoveredLocation(null)}
                      style={{ cursor: "pointer" }}
                    />
                    <text
                      x={`${nodePositions[location.name].x}%`}
                      y={`${nodePositions[location.name].y}%`}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="3"
                      fontWeight="bold"
                      fill="#1E3A8A"
                      style={{ pointerEvents: "none" }}
                    >
                      {location.name}
                    </text>
                  </g>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="p-2">
                    <h3 className="font-bold mb-2">
                      Routes from {location.name}:
                    </h3>
                    <ul>
                      {getConnectedRoutes(location.name).map((route, index) => (
                        <li key={index} className="text-sm">
                          {location.name === route.from.name ? (
                            <>
                              {route.from.name} → {route.to.name} ||{" "}
                              {route.duration} min
                            </>
                          ) : (
                            <>
                              {route.to.name} → {route.from.name} ||{" "}
                              {route.duration} min
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </svg>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default LocationMap;
