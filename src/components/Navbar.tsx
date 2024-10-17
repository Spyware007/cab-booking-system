"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-100 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Cab Booking
        </Link>
        <div className="space-x-4">
          {session ? (
            <>
              <span>Welcome, {session.user?.name}</span>
              {session.user?.role === "admin" && (
                <Button asChild variant="outline">
                  <Link href="/admin">Admin Dashboard</Link>
                </Button>
              )}
              {session.user?.role === "cabDriver" && (
                <Button asChild variant="outline">
                  <Link href="/driver">Driver Dashboard</Link>
                </Button>
              )}
              <Button onClick={() => signOut()}>Log Out</Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
