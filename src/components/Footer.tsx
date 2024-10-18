"use client";
import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  return (
    <footer
      className={`${
        pathname !== "/login" && pathname !== "/signup" ? "block" : "hidden"
      } bg-black text-white py-12`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-gray-300">
                  About us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  Our offerings
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  Newsroom
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  Investors
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-gray-300">
                  Ride
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  Drive
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  Deliver
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  Uber for Business
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Global citizenship</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-gray-300">
                  Safety
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-300">
                  Diversity and Inclusion
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow us</h3>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-gray-300">
                <Facebook />
              </Link>
              <Link href="#" className="hover:text-gray-300">
                <Twitter />
              </Link>
              <Link href="#" className="hover:text-gray-300">
                <Instagram />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2024 Uber Technologies Inc.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-gray-300">
              Privacy
            </Link>
            <Link href="#" className="hover:text-gray-300">
              Accessibility
            </Link>
            <Link href="#" className="hover:text-gray-300">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
