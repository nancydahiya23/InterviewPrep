"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  // ✅ FETCH USER
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  // ✅ CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = () => setOpen(false);

    if (open) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  return (
    <header className="w-full bg-[#020617] border-b border-gray-800">
      <div className="h-20 px-14 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-semibold text-white tracking-wide">
            InterviewPrep
          </h1>

          <div className="h-6 w-[1px] bg-gray-700"></div>

          <span className="text-sm text-gray-400">
            Practice Dashboard
          </span>
        </div>

        {/* RIGHT NAV */}
        <nav className="flex items-center gap-3">

          <Link
            href="/interview"
            className={`px-5 py-2 rounded-lg text-sm transition ${
              pathname === "/interview"
                ? "bg-white text-black"
                : "bg-[#0b1220] text-gray-300 hover:bg-gray-800"
            }`}
          >
            Interview
          </Link>

          <Link
            href="/history"
            className={`px-5 py-2 rounded-lg text-sm transition ${
              pathname === "/history"
                ? "bg-white text-black"
                : "bg-[#0b1220] text-gray-300 hover:bg-gray-800"
            }`}
          >
            History
          </Link>

          {/* USER */}
          <div className="ml-4 relative">

            {/* PROFILE ICON */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
              className="w-10 h-10 rounded-lg bg-[#0b1220] flex items-center justify-center text-white text-sm border border-gray-700 font-semibold cursor-pointer"
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
            </div>

            {/* DROPDOWN */}
            {open && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-3 w-56 bg-[#0b1220] border border-gray-800 rounded-xl shadow-lg overflow-hidden z-50"
              >

                {/* USER INFO */}
                <div className="p-4 border-b border-gray-800">
                  <p className="text-white font-medium text-sm">
                    {user?.name || "User"}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {user?.email || "email"}
                  </p>
                </div>

                {/* OPTIONS */}
                <div className="flex flex-col text-sm">

                  <button className="px-4 py-3 text-left text-gray-300 hover:bg-[#020617]">
                    Profile
                  </button>

                  <button
                    onClick={async () => {
                      await fetch("/api/logout");
                      window.location.href = "/login";
                    }}
                    className="px-4 py-3 text-left text-red-400 hover:bg-[#020617]"
                  >
                    Logout
                  </button>

                </div>

              </div>
            )}

          </div>

        </nav>
      </div>
    </header>
  );
}