import { cn } from "@/lib/utils";

interface NavigationProps {
  activeView: "tree" | "graph";
  onViewChange: (view: "tree" | "graph") => void;
}

export default function Navigation({ activeView, onViewChange }: NavigationProps) {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex space-x-6">
          <button 
            onClick={() => onViewChange("tree")}
            className={cn(
              "py-3 px-2 border-b-2 transition-colors",
              activeView === "tree" 
                ? "border-blue-500 text-blue-600 font-medium" 
                : "border-transparent hover:text-blue-600"
            )}
          >
            Skillset Overview
          </button>
          <button 
            onClick={() => onViewChange("graph")}
            className={cn(
              "py-3 px-2 border-b-2 transition-colors",
              activeView === "graph" 
                ? "border-blue-500 text-blue-600 font-medium" 
                : "border-transparent hover:text-blue-600"
            )}
          >
            Technical Expertise
          </button>
        </div>
      </div>
    </nav>
  );
}
