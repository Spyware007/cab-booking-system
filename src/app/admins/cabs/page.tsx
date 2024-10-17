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

export default function AdminCabs() {
  const [cabs, setCabs] = useState([]);
  const [editingCab, setEditingCab] = useState(null);
  const [newCab, setNewCab] = useState({ name: "", pricePerMinute: "" });

  useEffect(() => {
    fetchCabs();
  }, []);

  const fetchCabs = async () => {
    const res = await fetch("/api/cabs");
    const data = await res.json();
    setCabs(data.data);
  };

  const handleAddCab = async (e) => {
    e.preventDefault();
    await fetch("/api/cabs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCab),
    });
    setNewCab({ name: "", pricePerMinute: "" });
    fetchCabs();
  };

  const handleEditCab = async (e) => {
    e.preventDefault();
    await fetch("/api/cabs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingCab._id,
        name: editingCab.name,
        pricePerMinute: editingCab.pricePerMinute,
      }),
    });
    setEditingCab(null);
    fetchCabs();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Cabs</h1>
      <form onSubmit={handleAddCab} className="mb-4 flex gap-2">
        <Input
          type="text"
          placeholder="Cab Name"
          value={newCab.name}
          onChange={(e) => setNewCab({ ...newCab, name: e.target.value })}
          required
        />
        <Input
          type="number"
          placeholder="Price per Minute"
          value={newCab.pricePerMinute}
          onChange={(e) =>
            setNewCab({ ...newCab, pricePerMinute: e.target.value })
          }
          required
        />
        <Button type="submit">Add Cab</Button>
      </form>
      <Table>
        <TableCaption>List of available cabs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price per Minute</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cabs.map((cab) => (
            <TableRow key={cab._id}>
              <TableCell>
                {editingCab && editingCab._id === cab._id ? (
                  <Input
                    value={editingCab.name}
                    onChange={(e) =>
                      setEditingCab({ ...editingCab, name: e.target.value })
                    }
                  />
                ) : (
                  cab.name
                )}
              </TableCell>
              <TableCell>
                {editingCab && editingCab._id === cab._id ? (
                  <Input
                    value={editingCab.pricePerMinute}
                    onChange={(e) =>
                      setEditingCab({
                        ...editingCab,
                        pricePerMinute: e.target.value,
                      })
                    }
                  />
                ) : (
                  `$${cab.pricePerMinute}`
                )}
              </TableCell>
              <TableCell>
                {editingCab && editingCab._id === cab._id ? (
                  <Button onClick={handleEditCab}>Save</Button>
                ) : (
                  <Button onClick={() => setEditingCab(cab)}>Edit</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
