import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import SkillCard from "@/components/SkillCard";
import { Skill } from "@/lib/types";

interface TreeViewProps {
  skillsData: any;
  selectedSkill: Skill | null;
  breadcrumbs: Skill[];
}

export default function TreeView({ 
  skillsData, 
  selectedSkill, 
  breadcrumbs 
}: TreeViewProps) {
  const [cardVisible, setCardVisible] = useState(false);

  // Add animation effect when skill is selected
  useEffect(() => {
    if (selectedSkill) {
      setCardVisible(false);
      const timer = setTimeout(() => {
        setCardVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedSkill]);

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Breadcrumb navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-2">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      
      {/* Skill detail content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white">
        {selectedSkill ? (
          <div className={`transition-all duration-300 ${cardVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
            <SkillCard skill={selectedSkill} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-xl mb-4 text-[#233536] font-medium">Select a skill from the tree to view details</p>
            <p className="text-sm max-w-md text-center text-[#59635D] mb-8">
              Browse through the categories in the sidebar and click on any skill to see detailed information.
            </p>
            
            <div className="mt-4 max-w-xl mx-auto w-full">
              <div className="p-6 bg-[#B3C8B7] bg-opacity-20 rounded-lg border border-[#8BA08F] text-[#233536]">
                <h4 className="text-lg font-bold mb-2">How to use the Skills Tree</h4>
                <ul className="list-disc pl-5 space-y-2 text-left">
                  <li>Use the <b>left sidebar</b> to browse through skill categories</li>
                  <li>Click on any skill to view detailed information</li>
                  <li>Filter skills by category using the checkboxes</li>
                  <li>Use the search box to find specific skills</li>
                  <li>Follow breadcrumbs to navigate back up the tree hierarchy</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
