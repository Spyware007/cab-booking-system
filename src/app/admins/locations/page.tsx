"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminLocations() {
  const [locations, setLocations] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [editingLocation, setEditingLocation] = useState(null);
  const [editingRoute, setEditingRoute] = useState(null);
  const [newLocation, setNewLocation] = useState({ name: "" });
  const [newRoute, setNewRoute] = useState({ from: "", to: "", duration: "" });

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

  const handleAddLocation = async (e) => {
    e.preventDefault();
    await fetch("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLocation),
    });
    setNewLocation({ name: "" });
    fetchLocations();
  };

  const handleEditLocation = async (e) => {
    e.preventDefault();
    await fetch("/api/locations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingLocation._id,
        name: editingLocation.name,
      }),
    });
    setEditingLocation(null);
    fetchLocations();
  };

  const handleDeleteLocation = async (id) => {
    await fetch("/api/locations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchLocations();
  };

  const handleAddRoute = async (e) => {
    e.preventDefault();
    await fetch("/api/routes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRoute),
    });
    setNewRoute({ from: "", to: "", duration: "" });
    fetchRoutes();
  };

  const handleEditRoute = async (e) => {
    e.preventDefault();
    await fetch("/api/routes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingRoute._id,
        from: editingRoute.from._id,
        to: editingRoute.to._id,
        duration: editingRoute.duration,
      }),
    });
    setEditingRoute(null);
    fetchRoutes();
  };

  const handleDeleteRoute = async (id) => {
    await fetch("/api/routes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchRoutes();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Locations and Routes</h1>

      {/* Location Management */}
      <h2 className="text-xl font-semibold mb-2">Locations</h2>
      <form onSubmit={handleAddLocation} className="mb-4 flex gap-2">
        <Input
          type="text"
          placeholder="Location Name"
          value={newLocation.name}
          onChange={(e) =>
            setNewLocation({ ...newLocation, name: e.target.value })
          }
          required
        />
        <Button type="submit">Add Location</Button>
      </form>
      <Table>
        <TableCaption>List of available locations</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.map((location) => (
            <TableRow key={location._id}>
              <TableCell>
                {editingLocation && editingLocation._id === location._id ? (
                  <Input
                    value={editingLocation.name}
                    onChange={(e) =>
                      setEditingLocation({
                        ...editingLocation,
                        name: e.target.value,
                      })
                    }
                  />
                ) : (
                  location.name
                )}
              </TableCell>
              <TableCell>
                {editingLocation && editingLocation._id === location._id ? (
                  <Button onClick={handleEditLocation}>Save</Button>
                ) : (
                  <>
                    <Button
                      onClick={() => setEditingLocation(location)}
                      className="mr-2"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteLocation(location._id)}
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Route Management */}
      <h2 className="text-xl font-semibold mb-2 mt-8">Routes</h2>
      <form onSubmit={handleAddRoute} className="mb-4 flex gap-2">
        <Select
          onValueChange={(value) => setNewRoute({ ...newRoute, from: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="From" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem key={loc._id} value={loc._id}>
                {loc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => setNewRoute({ ...newRoute, to: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="To" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem key={loc._id} value={loc._id}>
                {loc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Duration (minutes)"
          value={newRoute.duration}
          onChange={(e) =>
            setNewRoute({ ...newRoute, duration: e.target.value })
          }
          required
        />
        <Button type="submit">Add Route</Button>
      </form>
      <Table>
        <TableCaption>List of routes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Duration (minutes)</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {routes.map((route) => (
            <TableRow key={route._id}>
              <TableCell>{route.from.name}</TableCell>
              <TableCell>{route.to.name}</TableCell>
              <TableCell>
                {editingRoute && editingRoute._id === route._id ? (
                  <Input
                    type="number"
                    value={editingRoute.duration}
                    onChange={(e) =>
                      setEditingRoute({
                        ...editingRoute,
                        duration: e.target.value,
                      })
                    }
                  />
                ) : (
                  route.duration
                )}
              </TableCell>
              <TableCell>
                {editingRoute && editingRoute._id === route._id ? (
                  <Button onClick={handleEditRoute}>Save</Button>
                ) : (
                  <>
                    <Button
                      onClick={() => setEditingRoute(route)}
                      className="mr-2"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteRoute(route._id)}
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
