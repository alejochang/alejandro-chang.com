import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import knowledgeGraphData from "@/data/knowledgeGraphData.json";
import { Link } from "wouter";
import { ArrowLeft, ChevronDown, Menu, Filter, ChevronRight } from "lucide-react";

// Import Cytoscape type definition for TypeScript support
type Cytoscape = any;
type CytoscapeInstance = any;

export default function TechnicalExpertisePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<CytoscapeInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const breadcrumbRef = useRef<HTMLDivElement>(null);
  const levelInfoRef = useRef<HTMLDivElement>(null);
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(false);
  const [isNodeInfoOpen, setIsNodeInfoOpen] = useState<boolean>(false);
  const [isNarrowView, setIsNarrowView] = useState<boolean>(window.innerWidth < 1024);

  // Navigation state
  const [navigationStack, setNavigationStack] = useState<string[]>(['root']);
  const [currentLevel, setCurrentLevel] = useState<string>('root');

  // Track window size changes
  useEffect(() => {
    const handleResize = () => {
      setIsNarrowView(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Convert the JSON data to the format expected by Cytoscape
  const allNodes = knowledgeGraphData.nodes.map(node => ({
    data: {
      id: node.id,
      label: node.label,
      category: node.category,
      parent: node.parent,
      description: node.description
    }
  }));

  const allEdges = knowledgeGraphData.edges.map(edge => ({
    data: {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label
    }
  }));

  // Initialize Cytoscape
  useEffect(() => {
    const loadCytoscape = async () => {
      try {
        console.log("Loading Cytoscape...");
        const cytoscapeModule = await import('cytoscape');
        const cytoscape = cytoscapeModule.default;
        console.log("Cytoscape loaded successfully:", !!cytoscape);

        if (!containerRef.current) return;

        cyRef.current = cytoscape({
          container: containerRef.current,
          style: [
            {
              selector: 'node',
              style: {
                'label': 'data(label)',
                'text-valign': 'center',
                'text-halign': 'center',
                'text-wrap': 'wrap',
                'text-max-width': '120px',
                'font-size': '12px',
                'background-color': '#fff',
                'border-width': '2px',
                'border-color': '#ccc',
                'shape': 'roundrectangle',
                'width': 'label',
                'height': 'label',
                'padding': '15px'
              }
            },
            {
              selector: 'edge',
              style: {
                'width': 2,
                'line-color': '#ccc',
                'target-arrow-color': '#ccc',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier',
                'opacity': 0.7
              }
            },
            {
              selector: 'node[category="core"]',
              style: {
                'background-color': '#B3C8B7',
                'border-color': '#233536',
                'border-width': '2px'
              }
            },
            {
              selector: 'node[category="frontend"]',
              style: {
                'background-color': '#D1CBC0',
                'border-color': '#59635D',
                'border-width': '2px'
              }
            },
            {
              selector: 'node[category="backend"]',
              style: {
                'background-color': '#A9A396',
                'border-color': '#233536',
                'border-width': '2px'
              }
            },
            {
              selector: 'node[category="data"]',
              style: {
                'background-color': 'rgba(179, 200, 183, 0.7)',
                'border-color': '#8BA08F',
                'border-width': '2px'
              }
            },
            {
              selector: 'node[category="infra"]',
              style: {
                'background-color': 'rgba(209, 203, 192, 0.7)',
                'border-color': '#59635D',
                'border-width': '2px'
              }
            },
            {
              selector: 'node[category="security"]',
              style: {
                'background-color': 'rgba(169, 163, 150, 0.7)',
                'border-color': '#233536',
                'border-width': '2px'
              }
            },
            {
              selector: 'node[category="practices"]',
              style: {
                'background-color': 'rgba(179, 200, 183, 0.5)',
                'border-color': '#8BA08F',
                'border-width': '2px'
              }
            },
            {
              selector: 'node.highlighted',
              style: {
                'border-width': '3px',
                'border-color': '#3498db'
              }
            },
            {
              selector: 'edge.highlighted',
              style: {
                'width': 3,
                'line-color': '#3498db',
                'target-arrow-color': '#3498db'
              }
            },
            {
              selector: 'edge[label]',
              style: {
                'label': 'data(label)',
                'font-size': '10px',
                'text-rotation': 'autorotate',
                'text-background-color': 'white',
                'text-background-opacity': 0.8,
                'text-background-padding': '2px'
              }
            }
          ],
          layout: {
            name: 'concentric',
            concentric: function(node: any) {
              // Root node in center
              return node.id() === currentLevel ? 2 : 1;
            },
            levelWidth: function() { return 1; },
            minNodeSpacing: 50,
            animate: false
          },
          wheelSensitivity: 0.3
        });

        // Event handler for node clicks
        cyRef.current.on('tap', 'node', function(event: any) {
          const node = event.target;
          const nodeId = node.id();

          // Only navigate if this node has children
          const hasChildren = allNodes.some(n => n.data.parent === nodeId);
          if (hasChildren) {
            navigateToLevel(nodeId);
          } else {
            // For leaf nodes, just highlight them
            highlightNode(node);
          }
        });

        // Make the graph responsive
        window.addEventListener('resize', function() {
          if (cyRef.current) {
            cyRef.current.resize();
            cyRef.current.fit();
          }
        });

        // Show initial level
        showLevel('root');
      } catch (error) {
        console.error("Error initializing Cytoscape:", error);
      }
    };

    loadCytoscape();

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, []);

  // Function to show a specific level
  const showLevel = (levelId: string) => {
    if (!cyRef.current) return;

    // Get the current level node
    const levelNode = allNodes.find(n => n.data.id === levelId);
    if (!levelNode) return;

    // Find all immediate children of this level
    const childNodes = allNodes.filter(n => n.data.parent === levelId);

    // Find relevant edges
    const visibleEdges: typeof allEdges = [];
    const nodeIds = [levelId, ...childNodes.map(n => n.data.id)];

    allEdges.forEach(edge => {
      if (
          nodeIds.includes(edge.data.source) &&
          nodeIds.includes(edge.data.target)
      ) {
        visibleEdges.push(edge);
      }
    });

    // Update Cytoscape with these nodes
    cyRef.current.elements().remove();
    cyRef.current.add([levelNode, ...childNodes, ...visibleEdges]);

    // Update layout
    cyRef.current.layout({
      name: 'concentric',
      concentric: function(node: any) {
        return node.id() === levelId ? 2 : 1;
      },
      levelWidth: function() { return 1; },
      minNodeSpacing: 100,
      animate: false
    }).run();

    // Fit to view all elements
    setTimeout(() => {
      if (cyRef.current) {
        cyRef.current.fit();
      }
    }, 50);

    // Update level info
    updateLevelInfo(levelNode.data);

    setCurrentLevel(levelId);
  };

  // Function to navigate to a new level
  const navigateToLevel = (levelId: string, fromBreadcrumb = false) => {
    setNavigationStack(prev => {
      let newStack = [...prev];

      if (!fromBreadcrumb) {
        // If not coming from breadcrumb, update navigation stack
        if (newStack[newStack.length - 1] !== levelId) {
          newStack.push(levelId);
        }
      } else {
        // If coming from breadcrumb, truncate stack
        const index = newStack.indexOf(levelId);
        if (index !== -1) {
          newStack = newStack.slice(0, index + 1);
        }
      }

      return newStack;
    });

    // Show the new level
    showLevel(levelId);

    // Update breadcrumb will happen via useEffect
  };

  // Function to go back to previous level
  const goBack = () => {
    if (navigationStack.length > 1) {
      setNavigationStack(prev => {
        const newStack = [...prev];
        newStack.pop(); // Remove current level
        return newStack;
      });
    }
  };

  // Update breadcrumb when navigation stack changes
  useEffect(() => {
    updateBreadcrumb();
  }, [navigationStack]);

  // Show the previous level when navigation stack changes
  useEffect(() => {
    if (navigationStack.length > 0) {
      const previousLevel = navigationStack[navigationStack.length - 1];
      showLevel(previousLevel);
    }
  }, [navigationStack]);

  // Update breadcrumb display
  const updateBreadcrumb = () => {
    if (!breadcrumbRef.current) return;

    breadcrumbRef.current.innerHTML = '';

    navigationStack.forEach((levelId) => {
      const node = allNodes.find(n => n.data.id === levelId);
      if (node) {
        const item = document.createElement('div');
        item.className = 'breadcrumb-item';
        item.setAttribute('data-id', levelId);
        item.textContent = node.data.label;
        item.addEventListener('click', () => {
          navigateToLevel(levelId, true);
        });
        breadcrumbRef.current?.appendChild(item);
      }
    });
  };

  // Update level info display
  const updateLevelInfo = (levelData: any) => {
    if (!levelInfoRef.current) return;

    const title = levelInfoRef.current.querySelector('.level-title');
    const description = levelInfoRef.current.querySelector('.level-description');

    if (title && description) {
      title.textContent = levelData.label;
      description.textContent = levelData.description || 'No description available';
    }
  };

  // Highlight a node and its connections
  const highlightNode = (node: any) => {
    if (!cyRef.current) return;

    cyRef.current.elements().removeClass('highlighted');
    node.addClass('highlighted');
    node.neighborhood().addClass('highlighted');

    // Update selected node info
    const nodeData = node.data();
    setSelectedNode(nodeData);

    // Open the node info section in mobile view when a node is selected
    if (isNarrowView) {
      setIsNodeInfoOpen(true);
    }
  };

  // Handle reset view button click
  const handleResetView = () => {
    if (!cyRef.current) return;

    cyRef.current.fit();
    cyRef.current.elements().removeClass('highlighted');
    setSelectedNode(null);

    // Reset mobile menu states
    setIsNodeInfoOpen(false);
  };

  return (
      <div className="flex flex-col min-h-screen bg-[#f7f9fc]">
        {/* Unified header with appropriate currentPage */}
        <Header currentPage="graph" />

        {/* Main content */}
        <div className="flex-1 bg-white flex flex-col">
          <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
            <header className="text-center mb-6">
              <h1 className="text-3xl font-bold text-[#233536] mb-2">Software Engineering Knowledge Graph</h1>
              <p className="text-[#59635D] mb-4">An interactive visualization of software engineering skills and their relationships</p>
            </header>

            <div
                ref={breadcrumbRef}
                className="breadcrumb flex flex-wrap mb-4 p-2.5 bg-white rounded-lg shadow-sm border border-[#B3C8B7]"
            ></div>

            <div
                ref={levelInfoRef}
                className="level-info p-2.5 mb-4 bg-white rounded-lg shadow-sm border border-[#B3C8B7]"
            >
              <div className="level-title text-lg font-bold mb-1 text-[#233536]">Modern Software Engineering</div>
              <div className="level-description text-[#59635D] text-sm">The root level of software engineering knowledge categories</div>
            </div>

            <div
                ref={containerRef}
                className="flex-1 border border-[#8BA08F] rounded-lg shadow-md overflow-hidden bg-white min-h-[500px]"
                style={{ height: '70vh' }}
                aria-label="Interactive knowledge graph of software engineering skills"
            ></div>

            <div className="controls flex justify-center gap-4 mt-4">
              <Button
                  onClick={goBack}
                  disabled={navigationStack.length <= 1}
                  className="bg-[#233536] hover:bg-[#59635D] text-white"
              >
                Go Back
              </Button>
              <Button
                  onClick={handleResetView}
                  className="bg-[#233536] hover:bg-[#59635D] text-white"
              >
                Reset View
              </Button>
            </div>

            {/* Legend section */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-[#B3C8B7]">
              {/* Mobile/Tablet view - Collapsible legend */}
              {isNarrowView ? (
                  <div className="p-3">
                    {/* Selected section display with toggle button */}
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setIsLegendOpen(!isLegendOpen)}
                    >
                      <div className="flex items-center">
                        <Filter className="h-5 w-5 text-[#233536] mr-3" />
                        <span className="text-[#233536] font-medium">Knowledge Graph Legend</span>
                      </div>
                      {isLegendOpen ? (
                          <ChevronDown className="h-5 w-5 text-[#59635D]" />
                      ) : (
                          <Menu className="h-5 w-5 text-[#59635D]" />
                      )}
                    </div>

                    {/* Collapsible content */}
                    {isLegendOpen && (
                        <div className="mt-3 pt-3 border-t border-[#B3C8B7]">
                          <div className="flex flex-wrap gap-4">
                            <div className="legend-item flex items-center">
                              <div className="legend-color core-color w-4 h-4 rounded mr-2 bg-[#B3C8B7] border border-[#233536]"></div>
                              <span className="text-sm text-[#233536]">Core Development</span>
                            </div>
                            <div className="legend-item flex items-center">
                              <div className="legend-color frontend-color w-4 h-4 rounded mr-2 bg-[#D1CBC0] border border-[#59635D]"></div>
                              <span className="text-sm text-[#233536]">Frontend</span>
                            </div>
                            <div className="legend-item flex items-center">
                              <div className="legend-color backend-color w-4 h-4 rounded mr-2 bg-[#A9A396] border border-[#233536]"></div>
                              <span className="text-sm text-[#233536]">Backend</span>
                            </div>
                            <div className="legend-item flex items-center">
                              <div className="legend-color data-color w-4 h-4 rounded mr-2 bg-[#B3C8B7] bg-opacity-70 border border-[#8BA08F]"></div>
                              <span className="text-sm text-[#233536]">Data Management</span>
                            </div>
                            <div className="legend-item flex items-center">
                              <div className="legend-color infra-color w-4 h-4 rounded mr-2 bg-[#D1CBC0] bg-opacity-70 border border-[#59635D]"></div>
                              <span className="text-sm text-[#233536]">Infrastructure</span>
                            </div>
                            <div className="legend-item flex items-center">
                              <div className="legend-color security-color w-4 h-4 rounded mr-2 bg-[#A9A396] bg-opacity-70 border border-[#233536]"></div>
                              <span className="text-sm text-[#233536]">Security</span>
                            </div>
                            <div className="legend-item flex items-center">
                              <div className="legend-color practices-color w-4 h-4 rounded mr-2 bg-[#B3C8B7] bg-opacity-50 border border-[#8BA08F]"></div>
                              <span className="text-sm text-[#233536]">Best Practices</span>
                            </div>
                          </div>
                        </div>
                    )}
                  </div>
              ) : (
                  /* Desktop view - Always expanded legend */
                  <div className="flex flex-wrap justify-center gap-4 p-4">
                    <div className="legend-item flex items-center">
                      <div className="legend-color core-color w-4 h-4 rounded mr-2 bg-[#B3C8B7] border border-[#233536]"></div>
                      <span className="text-sm text-[#233536]">Core Development</span>
                    </div>
                    <div className="legend-item flex items-center">
                      <div className="legend-color frontend-color w-4 h-4 rounded mr-2 bg-[#D1CBC0] border border-[#59635D]"></div>
                      <span className="text-sm text-[#233536]">Frontend</span>
                    </div>
                    <div className="legend-item flex items-center">
                      <div className="legend-color backend-color w-4 h-4 rounded mr-2 bg-[#A9A396] border border-[#233536]"></div>
                      <span className="text-sm text-[#233536]">Backend</span>
                    </div>
                    <div className="legend-item flex items-center">
                      <div className="legend-color data-color w-4 h-4 rounded mr-2 bg-[#B3C8B7] bg-opacity-70 border border-[#8BA08F]"></div>
                      <span className="text-sm text-[#233536]">Data Management</span>
                    </div>
                    <div className="legend-item flex items-center">
                      <div className="legend-color infra-color w-4 h-4 rounded mr-2 bg-[#D1CBC0] bg-opacity-70 border border-[#59635D]"></div>
                      <span className="text-sm text-[#233536]">Infrastructure</span>
                    </div>
                    <div className="legend-item flex items-center">
                      <div className="legend-color security-color w-4 h-4 rounded mr-2 bg-[#A9A396] bg-opacity-70 border border-[#233536]"></div>
                      <span className="text-sm text-[#233536]">Security</span>
                    </div>
                    <div className="legend-item flex items-center">
                      <div className="legend-color practices-color w-4 h-4 rounded mr-2 bg-[#B3C8B7] bg-opacity-50 border border-[#8BA08F]"></div>
                      <span className="text-sm text-[#233536]">Best Practices</span>
                    </div>
                  </div>
              )}
            </div>

            {/* Selected Node Information */}
            {selectedNode && (
                <Card className="mt-6 bg-white shadow-sm border border-[#B3C8B7]">
                  {isNarrowView ? (
                      <div className="p-3">
                        {/* Mobile view with collapsible section */}
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => setIsNodeInfoOpen(!isNodeInfoOpen)}
                        >
                          <div className="flex items-center">
                            <ChevronRight className="h-5 w-5 text-[#233536] mr-3" />
                            <span className="text-[#233536] font-medium">
                        {selectedNode.label || "Selected Node"}
                      </span>
                          </div>
                          {isNodeInfoOpen ? (
                              <ChevronDown className="h-5 w-5 text-[#59635D]" />
                          ) : (
                              <Menu className="h-5 w-5 text-[#59635D]" />
                          )}
                        </div>

                        {/* Collapsible content */}
                        {isNodeInfoOpen && (
                            <div className="mt-3 pt-3 border-t border-[#B3C8B7]">
                              <p className="text-[#59635D]">{selectedNode.description || "No description available."}</p>
                            </div>
                        )}
                      </div>
                  ) : (
                      /* Desktop view - Always expanded */
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-[#233536]">{selectedNode.label}</h3>
                        <p className="text-[#59635D] mt-2">{selectedNode.description || "No description available."}</p>
                      </div>
                  )}
                </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-[#233536] text-white py-4">
          <div className="container mx-auto px-4 text-center">
            <p>© 2025 Alejandro Chang. All rights reserved.</p>
          </div>
        </footer>
      </div>
  );
}