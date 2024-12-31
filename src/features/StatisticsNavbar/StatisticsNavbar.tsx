import { useState } from "react";
import { RiMenuLine } from "react-icons/ri";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function StatisticsNavbar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const getLinkClassName = (path: string) => {
    const isActive = location.pathname.endsWith(path);
    return `hover:underline transition-colors ${
      isActive ? "text-blue-400 font-medium" : "text-white"
    }`;
  };

  return (
    <div className="flex h-full flex-row bg-[#1F1F1F]">
      <div className="mt-2 flex flex-col gap-4 rounded-tr-lg bg-slate-800 p-2">
        <div>
          <button onClick={() => setIsOpen((prev) => !prev)} className="size-6">
            <RiMenuLine className="size-6" />
          </button>
        </div>
        <div
          className={`flex flex-col gap-1 overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "w-28 max-w-28 opacity-100" : "max-w-0 opacity-0"
          }`}
        >
          <Link
            to="review-statistics-graph"
            className={getLinkClassName("review-statistics-graph")}
          >
            Review Graph
          </Link>
          <Link to="heat-map" className={getLinkClassName("heat-map")}>
            Heat Map
          </Link>
        </div>
      </div>
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}
