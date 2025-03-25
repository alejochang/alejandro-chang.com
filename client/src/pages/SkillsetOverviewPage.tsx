import { useState, useEffect, useRef } from "react";
import TreeView from "@/components/TreeView";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Skill } from "@/lib/types";
import skillsData from "@/data/skillsData.json";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, Menu, Search, ChevronRight, Filter } from "lucide-react";

export default function SkillsetOverviewPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  // Categories IDs for active filters
  const [activeFilters, setActiveFilters] = useState<string[]>([
    "core", "frontend", "backend", "data", "infra", "security", "practices"
  ]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Skill[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isNarrowView, setIsNarrowView] = useState<boolean>(window.innerWidth < 1024);

  // Use local skills data from JSON
  const { skillTree, categories, emptyStateContent } = skillsData;

  // Track window size changes
  useEffect(() => {
    const handleResize = () => {
      setIsNarrowView(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Reset selected skill when filters change
    setSelectedSkill(null);
    setBreadcrumbs([]);
  }, [activeFilters]);

  // Handle filter change
  const handleFilterChange = (category: string) => {
    if (activeFilters.includes(category)) {
      setActiveFilters(activeFilters.filter(f => f !== category));
    } else {
      setActiveFilters([...activeFilters, category]);
    }
  };

  // Handle skill selection
  const handleSkillSelect = (skill: Skill) => {
    setSelectedSkill(skill);

    // Build breadcrumbs
    const findPath = (node: Skill, targetId: number, path: Skill[] = []): boolean => {
      // Check if current node is the target
      if (node.id === targetId) {
        path.push(node);
        return true;
      }

      // Check children if they exist
      if (node.children) {
        for (const child of node.children) {
          // Create a new path array including the current node
          const newPath = [...path, node];

          // Recursive call to check this child
          if (findPath(child, targetId, newPath)) {
            setBreadcrumbs(newPath);
            return true;
          }
        }
      }

      return false;
    };

    // Start search from root
    findPath(skillTree as unknown as Skill, skill.id, []);
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
      <div className="flex flex-col min-h-screen bg-[var(--background-color)] text-[var(--text-color)]">
        {/* Unified header with appropriate currentPage */}
        <Header currentPage="skills" />

        {/* Main content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left sidebar with search and filters */}
            <div className="col-span-1 lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                {/* Mobile/Tablet view - Collapsible menu showing only selected section */}
                {isNarrowView ? (
                    <div>
                      {/* Selected section display with toggle button */}
                      <div
                          className="flex items-center justify-between mb-2 cursor-pointer"
                          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      >
                        <div className="flex items-center">
                          <Filter className="h-5 w-5 text-[var(--medium-gray)] mr-3" />
                          <span className="text-[var(--text-color)] font-medium">
                        {selectedSkill ? selectedSkill.name : "Browse Skills"}
                      </span>
                        </div>
                        {isMobileMenuOpen ? (
                            <ChevronDown className="h-5 w-5 text-[var(--medium-gray)]" />
                        ) : (
                            <Menu className="h-5 w-5 text-[var(--medium-gray)]" />
                        )}
                      </div>

                      {/* Collapsible menu */}
                      {isMobileMenuOpen && (
                          <div className="mt-2 bg-[var(--backgroundLight)] rounded-md p-3">
                            {/* Search box */}
                            <div className="relative mb-4">
                              <input
                                  type="text"
                                  placeholder="Search skills..."
                                  className="w-full px-4 py-2 border border-[var(--light-gray)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  aria-label="Search skills and technologies"
                              />
                              <Search className="absolute right-3 top-2.5 h-4 w-4 text-[var(--medium-gray)]" />
                            </div>

                            {/* Category filters */}
                            <div className="mb-4">
                              <h3 className="font-semibold mb-2 text-sm uppercase text-[var(--secondary-color)]">Filter by category</h3>
                              <div className="flex flex-wrap gap-2">
                                {categories.map((category: any) => (
                                    <span
                                        key={category.id}
                                        onClick={() => handleFilterChange(category.id)}
                                        className={`px-3 py-1 text-xs rounded-md cursor-pointer transition-colors ${
                                            activeFilters.includes(category.id)
                                                ? 'bg-[var(--primary-color)] text-white'
                                                : 'bg-[var(--light-gray)] bg-opacity-40 text-[var(--text-color)]'
                                        }`}
                                    >
                              {category.label}
                            </span>
                                ))}
                              </div>
                            </div>

                            {/* Sidebar component with tree navigation */}
                            <div className="sidebar-container" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                              <Sidebar
                                  isOpen={true}
                                  searchTerm={searchTerm}
                                  onSearchChange={setSearchTerm}
                                  activeFilters={activeFilters}
                                  onFilterChange={handleFilterChange}
                                  skillsData={skillTree}
                                  onSkillSelect={(skill) => {
                                    handleSkillSelect(skill);
                                    setIsMobileMenuOpen(false); // Close menu after selection on mobile
                                  }}
                                  selectedSkill={selectedSkill}
                              />
                            </div>
                          </div>
                      )}
                    </div>
                ) : (
                    /* Desktop view - Regular expanded menu */
                    <>
                      {/* Search box */}
                      <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Search skills and technologies..."
                            className="w-full px-4 py-2 border border-[var(--light-gray)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            aria-label="Search skills and technologies"
                        />
                        <Search className="absolute right-3 top-2.5 h-4 w-4 text-[var(--medium-gray)]" />
                      </div>

                      {/* Category filters */}
                      <div className="mb-4">
                        <h3 className="font-semibold mb-2 text-sm uppercase text-[var(--secondary-color)]">Filter by category</h3>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((category: any) => (
                              <span
                                  key={category.id}
                                  onClick={() => handleFilterChange(category.id)}
                                  className={`px-3 py-1 text-xs rounded-md cursor-pointer transition-colors ${
                                      activeFilters.includes(category.id)
                                          ? 'bg-[var(--primary-color)] text-white'
                                          : 'bg-[var(--light-gray)] bg-opacity-40 text-[var(--text-color)]'
                                  }`}
                              >
                          {category.label}
                        </span>
                          ))}
                        </div>
                      </div>

                      {/* Sidebar component with tree navigation */}
                      <div className="sidebar-container" style={{ height: 'calc(80vh - 160px)' }}>
                        <Sidebar
                            isOpen={true}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            activeFilters={activeFilters}
                            onFilterChange={handleFilterChange}
                            skillsData={skillTree}
                            onSkillSelect={handleSkillSelect}
                            selectedSkill={selectedSkill}
                        />
                      </div>
                    </>
                )}
              </div>
            </div>

            {/* Main content area */}
            <div className="col-span-1 lg:col-span-9">
              <div className="bg-white rounded-lg shadow-md overflow-auto h-[80vh]">
                <TreeView
                    skillsData={skillTree}
                    selectedSkill={selectedSkill}
                    breadcrumbs={breadcrumbs}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-[var(--secondary-color)] text-[var(--text-light)] py-6 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p>© {new Date().getFullYear()} - Alejandro Chang - All Rights Reserved</p>
          </div>
        </footer>
      </div>
  );
}