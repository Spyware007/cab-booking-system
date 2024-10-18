"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/Loader";
import DashboardLayout from "@/components/DashboardLayout";

interface Booking {
  _id: string;
  userEmail: string;
  source: { name: string };
  destination: { name: string };
  cab: { name: string };
  startTime: string;
  endTime: string;
  cost: number;
  status: string;
}

interface Cab {
  _id: string;
  name: string;
  pricePerMinute: number;
}

interface User {
  _id: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cabs, setCabs] = useState<Cab[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (session?.user?.role !== "admin" && status !== "loading")
    ) {
      router.push("/");
    } else if (status === "authenticated") {
      fetchBookings();
      fetchCabs();
      fetchUsers();
    }
  }, [session, status]);

  const fetchBookings = async () => {
    const res = await fetch("/api/admin/bookings");
    const data = await res.json();
    if (data.success) {
      setBookings(data.data);
    }
  };

  const fetchCabs = async () => {
    const res = await fetch("/api/admin/cabs");
    const data = await res.json();
    if (data.success) {
      setCabs(data.data);
    }
  };

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (data.success) {
      setUsers(data.data);
    }
  };

  if (status === "loading") {
    return <Loader />;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{bookings.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Cabs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{cabs.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{users.length}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="cabs">Cabs</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>List of all bookings</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User Email</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Cab</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking._id}>
                          <TableCell>{booking.userEmail}</TableCell>
                          <TableCell>{booking.source.name}</TableCell>
                          <TableCell>{booking.destination.name}</TableCell>
                          <TableCell>{booking.cab.name}</TableCell>
                          <TableCell>
                            {new Date(booking.startTime).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {new Date(booking.endTime).toLocaleString()}
                          </TableCell>
                          <TableCell>${booking.cost.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                booking.status === "completed"
                                  ? "success"
                                  : "default"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="cabs">
            <Card>
              <CardHeader>
                <CardTitle>All Cabs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>List of all cabs</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Price Per Minute</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cabs.map((cab) => (
                        <TableRow key={cab._id}>
                          <TableCell>{cab.name}</TableCell>
                          <TableCell>
                            ${cab.pricePerMinute.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>List of all users</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.role === "admin"
                                  ? "destructive"
                                  : "outline"
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
