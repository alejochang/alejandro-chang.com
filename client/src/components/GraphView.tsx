import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Skill } from '@/lib/types';

interface GraphViewProps {
  skillsData: any;
  onNodeSelect: (skill: Skill) => void;
  activeFilters: string[];
}

export default function GraphView({ 
  skillsData, 
  onNodeSelect,
  activeFilters
}: GraphViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<any>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Initialize graph on component mount
  useEffect(() => {
    if (!containerRef.current || !skillsData) return;
    
    // Dynamically import Cytoscape
    const loadCytoscape = async () => {
      try {
        console.log("Loading Cytoscape...");
        const cytoscapeModule = await import('cytoscape');
        const cytoscape = cytoscapeModule.default;
        console.log("Cytoscape loaded successfully:", !!cytoscape);
        
        // Convert skills data to cytoscape format
        const elements = convertSkillsToGraphElements(skillsData);
        console.log("Graph elements:", elements);
        
        // Initialize cytoscape with improved configuration
        cyRef.current = cytoscape({
          container: containerRef.current,
          elements: elements,
          style: [
            {
              selector: 'node',
              style: {
                'background-color': '#e0f7fa',
                'border-color': '#233536',
                'border-width': 1,
                'label': 'data(label)',
                'color': '#233536',
                'text-valign': 'center',
                'text-halign': 'center',
                'font-size': '12px',
                'font-weight': 'bold',
                'text-wrap': 'wrap',
                'text-max-width': '100px',
                'text-outline-width': 2,
                'text-outline-color': 'white',
                'shape': 'round-rectangle',
                'width': 150,
                'height': 40,
                'padding': '10px',
                'text-opacity': showLabels ? 1 : 0
              }
            },
            {
              selector: 'node[category="core"]',
              style: {
                'background-color': '#e0f7fa',
                'border-color': '#006064'
              }
            },
            {
              selector: 'node[category="frontend"]',
              style: {
                'background-color': '#e8f5e9',
                'border-color': '#1b5e20'
              }
            },
            {
              selector: 'node[category="backend"]',
              style: {
                'background-color': '#fff3e0',
                'border-color': '#e65100'
              }
            },
            {
              selector: 'node[category="data"]',
              style: {
                'background-color': '#f3e5f5',
                'border-color': '#4a148c'
              }
            },
            {
              selector: 'node[category="infra"]',
              style: {
                'background-color': '#fbe9e7',
                'border-color': '#bf360c'
              }
            },
            {
              selector: 'node[category="security"]',
              style: {
                'background-color': '#ffebee',
                'border-color': '#b71c1c'
              }
            },
            {
              selector: 'node[category="practices"]',
              style: {
                'background-color': '#f1f8e9',
                'border-color': '#33691e'
              }
            },
            {
              selector: 'edge',
              style: {
                'width': 2,
                'line-color': '#90a4ae',
                'curve-style': 'bezier',
                'control-point-step-size': 40,
                'line-opacity': 0.7,
                'target-arrow-shape': 'triangle',
                'target-arrow-color': '#90a4ae',
                'arrow-scale': 0.8
              }
            },
            {
              selector: 'node:selected',
              style: {
                'border-width': 3,
                'border-color': '#ffc107'
              }
            }
          ],
          layout: {
            name: 'cose',
            fit: true,
            padding: 50,
            randomize: false,
            componentSpacing: 100,
            nodeRepulsion: function() { return 400000; },
            nodeOverlap: 20,
            gravity: 80,
            edgeElasticity: function() { return 100; },
            nestingFactor: 5,
            idealEdgeLength: function() { return 100; }
          },
          wheelSensitivity: 0.3,
          minZoom: 0.5,
          maxZoom: 2.0
        });
        
        // Add interactive behavior
        cyRef.current.on('tap', 'node', (event: any) => {
          const nodeData = event.target.data();
          if (nodeData.skillId) {
            // Find the skill in skillsData and pass to callback
            const skill = findSkillById(skillsData, nodeData.skillId);
            if (skill) {
              onNodeSelect(skill);
            }
          }
        });

        // Visual feedback on hover
        cyRef.current.on('mouseover', 'node', (event: any) => {
          event.target.style({
            'border-width': 2,
            'shadow-blur': 10,
            'shadow-color': '#B3C8B7',
            'shadow-opacity': 0.8
          });
        });

        cyRef.current.on('mouseout', 'node', (event: any) => {
          event.target.style({
            'border-width': 1,
            'shadow-blur': 0
          });
        });

        // Apply the layout after initial render to ensure proper positioning
        setTimeout(() => {
          if (cyRef.current) {
            cyRef.current.fit();
            cyRef.current.center();
          }
        }, 500);

      } catch (error) {
        console.error("Error loading Cytoscape:", error);
        // Add a visible error message for debugging
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div style="padding: 20px; color: red; text-align: center;">
              <h3>Error loading graph visualization</h3>
              <p>${error instanceof Error ? error.message : String(error)}</p>
            </div>
          `;
        }
      }
    };
    
    // Call the async function
    loadCytoscape();
    
    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, [skillsData, showLabels]);
  
  // Update graph when filters change
  useEffect(() => {
    if (!cyRef.current) return;
    
    cyRef.current.nodes().forEach((node: any) => {
      const nodeCategory = node.data('category');
      if (categoryFilter === 'all' || categoryFilter === nodeCategory) {
        if (activeFilters.includes(nodeCategory)) {
          node.style('display', 'element');
        } else {
          node.style('display', 'none');
        }
      } else {
        node.style('display', 'none');
      }
    });
    
    cyRef.current.edges().forEach((edge: any) => {
      const sourceVisible = edge.source().style('display') === 'element';
      const targetVisible = edge.target().style('display') === 'element';
      edge.style('display', (sourceVisible && targetVisible) ? 'element' : 'none');
    });
    
  }, [activeFilters, categoryFilter]);
  
  // Update label visibility
  useEffect(() => {
    if (!cyRef.current) return;
    
    cyRef.current.style()
      .selector('node')
      .style({
        'text-opacity': showLabels ? 1 : 0
      })
      .update();
      
  }, [showLabels]);
  
  const resetView = () => {
    if (cyRef.current) {
      cyRef.current.fit();
      cyRef.current.center();
    }
  };
  
  const toggleLabels = () => {
    setShowLabels(!showLabels);
  };
  
  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
  };
  
  const convertSkillsToGraphElements = (skills: any): any[] => {
    if (!skills || !skills.children) return [];
    
    const elements: any[] = [];
    const processedNodes = new Set<number>();
    
    // Function to recursively traverse the skill tree and create graph elements
    const traverseSkills = (node: any, parentId: number | null = null) => {
      if (!node || processedNodes.has(node.id)) return;
      
      // Add this node
      processedNodes.add(node.id);
      elements.push({
        group: 'nodes',
        data: {
          id: `skill-${node.id}`,
          label: node.name,
          category: node.category,
          skillId: node.id
        }
      });
      
      // Add edge from parent to this node if parent exists
      if (parentId !== null) {
        elements.push({
          group: 'edges',
          data: {
            id: `edge-${parentId}-${node.id}`,
            source: `skill-${parentId}`,
            target: `skill-${node.id}`
          }
        });
      }
      
      // Process children recursively
      if (node.children && node.children.length > 0) {
        node.children.forEach((child: any) => {
          traverseSkills(child, node.id);
        });
      }
    };
    
    // Start from top-level skills
    skills.children.forEach((skill: any) => {
      traverseSkills(skill);
    });
    
    return elements;
  };
  
  const findSkillById = (skills: any, id: number): Skill | null => {
    if (!skills) return null;
    
    // Function to recursively search for a skill by ID
    const findSkill = (node: any): Skill | null => {
      if (node.id === id) return node;
      
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          const found = findSkill(child);
          if (found) return found;
        }
      }
      
      return null;
    };
    
    // Search in all top-level skills
    if (skills.children && skills.children.length > 0) {
      for (const skill of skills.children) {
        const found = findSkill(skill);
        if (found) return found;
      }
    }
    
    return null;
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <Button 
            onClick={resetView} 
            className="bg-[#233536] text-white hover:bg-[#59635D]"
          >
            Reset View
          </Button>
          <Button 
            onClick={toggleLabels} 
            variant="outline"
            className="border-[#233536] text-[#233536] hover:bg-[#B3C8B7] hover:text-[#233536] hover:opacity-90"
          >
            Toggle Labels
          </Button>
        </div>
        
        <div>
          <Select defaultValue="all" onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px] border-[#8BA08F]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="core">Core Development</SelectItem>
              <SelectItem value="frontend">Frontend</SelectItem>
              <SelectItem value="backend">Backend</SelectItem>
              <SelectItem value="data">Data</SelectItem>
              <SelectItem value="infra">Infrastructure</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="practices">Practices</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex-1 relative">
        {/* Knowledge Graph Background */}
        <div className="absolute inset-0 bg-[#e0f7fa] bg-opacity-40 rounded-lg"></div>
        
        {/* Knowledge Graph Container */}
        <div 
          ref={containerRef} 
          className="w-full h-full relative z-10" 
          aria-label="Interactive knowledge graph of software engineering skills"
        >
          {/* Fallback message if graph doesn't load */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg text-center max-w-md">
              <h3 className="text-[#233536] font-semibold text-lg mb-2">Software Engineering Knowledge Graph</h3>
              <p className="text-[#59635D] text-sm mb-4">
                Explore the relationships between different software engineering skills and domains.
                Use the controls above to filter by category.
              </p>
              <p className="text-[#59635D] text-xs">
                If the graph visualization is not visible, try refreshing the page or clicking "Reset View".
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <Card className="absolute bottom-4 right-4 p-3 shadow-md border border-[#8BA08F]">
          <h4 className="font-medium text-sm text-[#233536] mb-2">Skill Categories</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#e0f7fa] border border-[#006064] rounded mr-2"></div>
              <span className="text-xs text-[#233536]">Core</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#e8f5e9] border border-[#1b5e20] rounded mr-2"></div>
              <span className="text-xs text-[#233536]">Frontend</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#fff3e0] border border-[#e65100] rounded mr-2"></div>
              <span className="text-xs text-[#233536]">Backend</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#f3e5f5] border border-[#4a148c] rounded mr-2"></div>
              <span className="text-xs text-[#233536]">Data</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#fbe9e7] border border-[#bf360c] rounded mr-2"></div>
              <span className="text-xs text-[#233536]">Infrastructure</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#ffebee] border border-[#b71c1c] rounded mr-2"></div>
              <span className="text-xs text-[#233536]">Security</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#f1f8e9] border border-[#33691e] rounded mr-2"></div>
              <span className="text-xs text-[#233536]">Practices</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}