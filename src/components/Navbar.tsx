"use client";

import Link from "next/link";
import { Menu, X, Globe } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <nav className={` bg-black text-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold">
              Truber
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="#" className="hover:bg-gray-700 px-3 py-2 rounded-md">
                Ride
              </Link>
              <Link href="#" className="hover:bg-gray-700 px-3 py-2 rounded-md">
                Drive
              </Link>
              <Link href="#" className="hover:bg-gray-700 px-3 py-2 rounded-md">
                Business
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button className="bg-gray-800 p-1 rounded-full hover:bg-gray-700">
              <Globe className="h-6 w-6" />
            </button>
            {session ? (
              <>
                <span className="text-sm">Welcome, {session.user?.email}</span>
                {session.user?.role === "admin" && (
                  <Button
                    asChild
                    variant="outline"
                    className="bg-gray-800 text-white hover:bg-gray-700"
                  >
                    <Link href="/admin">Admin Dashboard</Link>
                  </Button>
                )}
                {session.user?.role === "cabDriver" && (
                  <Button
                    asChild
                    variant="outline"
                    className="bg-gray-800 text-white hover:bg-gray-700"
                  >
                    <Link href="/driver">Driver Dashboard</Link>
                  </Button>
                )}
                <Button
                  onClick={() => signOut()}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="bg-gray-800 text-white hover:bg-gray-700"
                >
                  <Link href="/login">Log In</Link>
                </Button>
                <Button
                  asChild
                  className="bg-white text-black hover:bg-gray-200"
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="#"
              className="block hover:bg-gray-700 px-3 py-2 rounded-md"
            >
              Ride
            </Link>
            <Link
              href="#"
              className="block hover:bg-gray-700 px-3 py-2 rounded-md"
            >
              Drive
            </Link>
            <Link
              href="#"
              className="block hover:bg-gray-700 px-3 py-2 rounded-md"
            >
              Business
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex flex-col space-y-2 px-5">
              <button className="bg-gray-800 p-1 rounded-full hover:bg-gray-700 self-start">
                <Globe className="h-6 w-6" />
              </button>
              {session ? (
                <>
                  <span className="text-sm">Welcome, {session.user?.name}</span>
                  {session.user?.role === "admin" && (
                    <Button
                      asChild
                      variant="outline"
                      className="bg-gray-800 text-white hover:bg-gray-700 w-full"
                    >
                      <Link href="/admin">Admin Dashboard</Link>
                    </Button>
                  )}
                  {session.user?.role === "cabDriver" && (
                    <Button
                      asChild
                      variant="outline"
                      className="bg-gray-800 text-white hover:bg-gray-700 w-full"
                    >
                      <Link href="/driver">Driver Dashboard</Link>
                    </Button>
                  )}
                  <Button
                    onClick={() => signOut()}
                    className="bg-white text-black hover:bg-gray-200 w-full"
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    variant="outline"
                    className="bg-gray-800 text-white hover:bg-gray-700 w-full"
                  >
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-white text-black hover:bg-gray-200 w-full"
                  >
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
