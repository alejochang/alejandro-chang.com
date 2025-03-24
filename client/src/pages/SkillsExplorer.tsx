import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import TreeView from "@/components/TreeView";
import GraphView from "@/components/GraphView";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skill, SkillNode } from "@/lib/types";
import skillsData from "@/data/skillsData.json";

export default function SkillsExplorer() {
  const [activeView, setActiveView] = useState<"tree" | "graph">("tree");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([
    "core", "frontend", "backend", "data", "infra", "security", "practices"
  ]);
  const [breadcrumbs, setBreadcrumbs] = useState<Skill[]>([]);
  
  const isMobile = useIsMobile();
  
  // Data is now imported statically
  const isLoading = false;
  const error = null;

  // Close sidebar on mobile when view changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [activeView, isMobile]);

  // Update breadcrumbs when selected skill changes
  useEffect(() => {
    if (selectedSkill && skillsData) {
      const newBreadcrumbs = generateBreadcrumbs(skillsData, selectedSkill.id);
      setBreadcrumbs(newBreadcrumbs);
    } else {
      setBreadcrumbs([]);
    }
  }, [selectedSkill, skillsData]);

  const generateBreadcrumbs = (skills: any, skillId: number): Skill[] => {
    // Create a simple path array
    const result: Skill[] = [];
    
    // Function to traverse the tree and find the path to the skill
    const findPath = (node: Skill, targetId: number, path: Skill[] = []): boolean => {
      // Add current node to the path
      path.push(node);
      
      // If this is the skill we're looking for, we found the path
      if (node.id === targetId) {
        // Copy the path to our result
        result.push(...path);
        return true;
      }
      
      // If this node has children, search them
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          if (findPath(child, targetId, [...path])) {
            return true;
          }
        }
      }
      
      // If we get here, the skill wasn't found in this branch
      return false;
    };
    
    // Start search from the top level categories
    if (skills && skills.children) {
      skills.children.forEach((child: Skill) => {
        if (result.length === 0) { // Only continue if we haven't found the path yet
          findPath(child, skillId, []);
        }
      });
    }
    
    return result;
  };

  const handleSkillSelect = (skill: Skill) => {
    setSelectedSkill(skill);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleFilterChange = (category: string) => {
    if (activeFilters.includes(category)) {
      setActiveFilters(activeFilters.filter(cat => cat !== category));
    } else {
      setActiveFilters([...activeFilters, category]);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center">Error loading skills data</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-1">Software Engineering Skills Platform</h1>
          <p className="text-sm opacity-80">Interactive exploration of skills, technologies, and concepts</p>
        </div>
      </header>

      {/* Navigation */}
      <Navigation 
        activeView={activeView} 
        onViewChange={setActiveView} 
      />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          skillsData={skillsData}
          onSkillSelect={handleSkillSelect}
          selectedSkill={selectedSkill}
        />

        {/* Main content area */}
        <main className="flex-1 overflow-hidden flex flex-col relative">
          {activeView === "tree" ? (
            <TreeView 
              skillsData={skillsData}
              selectedSkill={selectedSkill}
              breadcrumbs={breadcrumbs}
            />
          ) : (
            <GraphView 
              skillsData={skillsData}
              onNodeSelect={handleSkillSelect}
              activeFilters={activeFilters}
            />
          )}

          {/* Mobile toggle sidebar button */}
          {isMobile && (
            <Button 
              variant="default" 
              size="icon" 
              onClick={toggleSidebar}
              className="fixed bottom-4 left-4 w-12 h-12 rounded-full shadow-lg z-50 bg-blue-600 hover:bg-blue-700"
            >
              <Menu className="h-6 w-6" />
            </Button>
          )}
        </main>
      </div>
    </div>
  );
}
