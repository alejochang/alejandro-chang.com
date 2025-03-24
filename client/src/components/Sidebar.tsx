import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skill } from "@/lib/types";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  activeFilters: string[];
  onFilterChange: (category: string) => void;
  skillsData: any;
  onSkillSelect: (skill: Skill) => void;
  selectedSkill: Skill | null;
}

export default function Sidebar({
  isOpen,
  searchTerm,
  onSearchChange,
  activeFilters,
  onFilterChange,
  skillsData,
  onSkillSelect,
  selectedSkill
}: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  const toggleItem = (itemId: string) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(itemId)) {
      newExpandedItems.delete(itemId);
    } else {
      newExpandedItems.add(itemId);
    }
    setExpandedItems(newExpandedItems);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };
  
  const renderTreeItem = (item: any, level: number = 0, path: string = '') => {
    const itemId = `${path}-${item.id}`;
    const isExpanded = expandedItems.has(itemId);
    const isSelected = selectedSkill?.id === item.id;
    const isLeaf = !item.children || item.children.length === 0;
    const isVisible = activeFilters.includes(item.category);
    
    // Don't render if filtered out
    if (!isVisible) return null;
    
    // If searching, only show matching items and their parents
    if (searchTerm) {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const hasMatchingChildren = item.children?.some((child: any) => 
        child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.children?.some((grandchild: any) => 
          grandchild.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      
      if (!matchesSearch && !hasMatchingChildren) {
        return null;
      }
      
      // If we have a search term and this matches, expand this node
      if (matchesSearch && !isExpanded) {
        // We should auto-expand if this is part of search results
        setExpandedItems(prev => new Set([...prev, itemId]));
      }
    }
    
    // Get category-specific styling using website color palette
    const getCategoryClasses = (category: string) => {
      switch(category) {
        case 'core':
          return 'bg-[#B3C8B7] border-l-4 border-[#233536]';
        case 'frontend':
          return 'bg-[#D1CBC0] border-l-4 border-[#59635D]';
        case 'backend':
          return 'bg-[#A9A396] border-l-4 border-[#233536]';
        case 'data':
          return 'bg-[#B3C8B7] bg-opacity-70 border-l-4 border-[#8BA08F]';
        case 'infra':
          return 'bg-[#D1CBC0] bg-opacity-70 border-l-4 border-[#59635D]';
        case 'security':
          return 'bg-[#A9A396] bg-opacity-70 border-l-4 border-[#233536]';
        case 'practices':
          return 'bg-[#B3C8B7] bg-opacity-50 border-l-4 border-[#8BA08F]';
        default:
          return 'bg-[#D1CBC0] border-l-4 border-[#59635D]';
      }
    };
    
    return (
      <li 
        key={itemId} 
        className="tree-item my-1"
        data-category={item.category}
        role="treeitem"
        aria-expanded={isExpanded}
      >
        <div 
          className={`
            item-content p-2 rounded flex items-center 
            ${level === 0 ? getCategoryClasses(item.category) : 'hover:bg-gray-100'}
            ${isSelected ? 'bg-blue-100' : ''}
          `}
          onClick={() => {
            if (isLeaf) {
              onSkillSelect(item);
            } else {
              toggleItem(itemId);
            }
          }}
        >
          {!isLeaf ? (
            <span className={`inline-block w-4 h-4 mr-2 transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </span>
          ) : (
            <span className={`w-2 h-2 rounded-full mr-2 ${item.category === 'core' ? 'bg-[#233536]' : 
              item.category === 'frontend' ? 'bg-[#59635D]' : 
              item.category === 'backend' ? 'bg-[#233536]' : 
              item.category === 'data' ? 'bg-[#8BA08F]' : 
              item.category === 'infra' ? 'bg-[#59635D]' : 
              item.category === 'security' ? 'bg-[#233536]' : 
              item.category === 'practices' ? 'bg-[#8BA08F]' : 'bg-[#A9A396]'}`}>
            </span>
          )}
          <span className={`${level === 0 ? 'font-medium' : ''}`}>{item.name}</span>
        </div>
        
        {item.children && item.children.length > 0 && (
          <ul 
            className={`ml-4 pl-2 border-l border-gray-200 transition-all duration-300 ${isExpanded ? 'block' : 'hidden'}`}
            role="group"
          >
            {item.children.map((child: any) => 
              renderTreeItem(child, level + 1, itemId)
            )}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Tree navigation */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <ul className="tree-menu" role="tree" aria-label="Software Engineering Skills Tree">
            {skillsData?.children?.map((item: any) => 
              renderTreeItem(item)
            )}
          </ul>
          
          {(!skillsData?.children || skillsData.children.length === 0) && (
            <div className="p-4 text-center text-[var(--medium-gray)]">
              No skills data available
            </div>
          )}
          
          {searchTerm && skillsData?.children && skillsData.children.length > 0 && (
            <div className="text-sm text-[var(--medium-gray)] mt-2 p-2">
              Showing results for "{searchTerm}"
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
