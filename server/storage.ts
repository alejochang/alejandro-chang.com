import { 
  InsertSkill, 
  InsertResource, 
  InsertSkillRelationship, 
  Skill, 
  Resource, 
  SkillRelationship,
  SkillNode
} from "@shared/schema";

// Define interface for storage operations
export interface IStorage {
  // Skills
  getAllSkills(): Promise<SkillNode>;
  getSkill(id: number): Promise<Skill | undefined>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<boolean>;
  searchSkills(query: string): Promise<Skill[]>;
  
  // Resources
  getSkillResources(skillId: number): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: number, resource: Partial<InsertResource>): Promise<Resource | undefined>;
  deleteResource(id: number): Promise<boolean>;
  
  // Relationships for graph visualization
  getSkillsGraph(): Promise<{nodes: any[], edges: any[]}>;
  createSkillRelationship(relationship: InsertSkillRelationship): Promise<SkillRelationship>;
  deleteSkillRelationship(id: number): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private skills: Map<number, Skill>;
  private resources: Map<number, Resource>;
  private relationships: Map<number, SkillRelationship>;
  private currentSkillId: number;
  private currentResourceId: number;
  private currentRelationshipId: number;

  constructor() {
    this.skills = new Map();
    this.resources = new Map();
    this.relationships = new Map();
    this.currentSkillId = 1;
    this.currentResourceId = 1;
    this.currentRelationshipId = 1;
    
    // Initialize with some default skills data
    this.initializeDefaultSkills();
  }

  // Helper method to build a tree from flat skills data
  private buildSkillTree(): SkillNode {
    const skillsArray = Array.from(this.skills.values());
    const skillsMap: Record<number, SkillNode> = {};
    
    // First pass: create all nodes without children
    skillsArray.forEach(skill => {
      skillsMap[skill.id] = {
        id: skill.id,
        name: skill.name,
        category: skill.category,
        children: []
      };
    });
    
    // Create root node
    const rootNode: SkillNode = {
      id: 0,
      name: "Software Engineering",
      category: "core",
      children: []
    };
    
    // Second pass: build the tree structure
    skillsArray.forEach(skill => {
      const node = skillsMap[skill.id];
      
      if (skill.parentId === null || skill.parentId === undefined) {
        // This is a top-level skill
        rootNode.children?.push(node);
      } else if (skillsMap[skill.parentId]) {
        // Add to parent's children
        skillsMap[skill.parentId].children = skillsMap[skill.parentId].children || [];
        skillsMap[skill.parentId].children?.push(node);
      }
    });
    
    return rootNode;
  }

  // Initialize with some default skills
  private initializeDefaultSkills() {
    // Core Development Skills
    const coreId = this.addSkill({
      name: "Core Development Skills",
      category: "core",
      parentId: null,
      isLeaf: false,
      description: "Fundamental skills for software development"
    });
    
    // Languages & Paradigms
    const languagesId = this.addSkill({
      name: "Languages & Paradigms",
      category: "core",
      parentId: coreId,
      isLeaf: false,
      description: "Programming languages and paradigms"
    });
    
    // JavaScript/TypeScript
    const jsId = this.addSkill({
      name: "JavaScript/TypeScript",
      category: "core",
      parentId: languagesId,
      isLeaf: true,
      level: "Expert",
      description: "JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification. TypeScript is a strict syntactical superset of JavaScript that adds optional static typing.",
      experience: [
        "15+ years experience with JavaScript",
        "Used at Intuit for frontend development",
        "Built React applications at RBC",
        "Provided JS consultation at Rangle.io"
      ],
      resources: [
        { title: "MDN Web Docs - JavaScript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
        { title: "TypeScript Documentation", url: "https://www.typescriptlang.org/docs/" },
        { title: "JavaScript: The Good Parts (Book)", url: "https://www.oreilly.com/library/view/javascript-the-good/9780596517748/" }
      ],
      relatedSkills: ["React", "Node.js", "Web Development", "Frontend"]
    });
    
    // Python
    this.addSkill({
      name: "Python",
      category: "core",
      parentId: languagesId,
      isLeaf: true,
      level: "Intermediate",
      description: "Python is an interpreted high-level general-purpose programming language."
    });
    
    // Java
    this.addSkill({
      name: "Java",
      category: "core",
      parentId: languagesId,
      isLeaf: true,
      level: "Advanced",
      description: "Java is a class-based, object-oriented programming language."
    });
    
    // Software Principles
    const principlesId = this.addSkill({
      name: "Software Principles",
      category: "core",
      parentId: coreId,
      isLeaf: false,
      description: "Software engineering principles and best practices"
    });
    
    // SOLID Principles
    this.addSkill({
      name: "SOLID Principles",
      category: "core",
      parentId: principlesId,
      isLeaf: true,
      level: "Advanced",
      description: "Design principles for object-oriented programming"
    });
    
    // Clean Code
    this.addSkill({
      name: "Clean Code",
      category: "core",
      parentId: principlesId,
      isLeaf: true,
      level: "Intermediate",
      description: "Practices for writing maintainable, readable code"
    });
    
    // Frontend Development
    const frontendId = this.addSkill({
      name: "Frontend Development",
      category: "frontend",
      parentId: null,
      isLeaf: false,
      description: "Development of user interfaces and client-side applications"
    });
    
    // UI Technologies
    const uiTechId = this.addSkill({
      name: "UI Technologies",
      category: "frontend",
      parentId: frontendId,
      isLeaf: false,
      description: "Technologies for building user interfaces"
    });
    
    // HTML5/CSS3
    this.addSkill({
      name: "HTML5/CSS3",
      category: "frontend",
      parentId: uiTechId,
      isLeaf: true,
      level: "Expert",
      description: "Core web technologies for structure and styling"
    });
    
    // Frontend Frameworks
    const frameworksId = this.addSkill({
      name: "Frontend Frameworks",
      category: "frontend",
      parentId: frontendId,
      isLeaf: false,
      description: "Frameworks for building web applications"
    });
    
    // React Ecosystem
    const reactId = this.addSkill({
      name: "React Ecosystem",
      category: "frontend",
      parentId: frameworksId,
      isLeaf: true,
      level: "Expert",
      description: "React and its surrounding libraries and tools"
    });
    
    // Vue Ecosystem
    this.addSkill({
      name: "Vue Ecosystem",
      category: "frontend",
      parentId: frameworksId,
      isLeaf: true,
      level: "Intermediate",
      description: "Vue.js and its surrounding libraries and tools"
    });
    
    // Backend Development
    const backendId = this.addSkill({
      name: "Backend Development",
      category: "backend",
      parentId: null,
      isLeaf: false,
      description: "Server-side application and API development"
    });
    
    // REST APIs
    const restApiId = this.addSkill({
      name: "REST APIs",
      category: "backend",
      parentId: backendId,
      isLeaf: true,
      level: "Expert",
      description: "Representational State Transfer architectural style"
    });
    
    // GraphQL
    this.addSkill({
      name: "GraphQL",
      category: "backend",
      parentId: backendId,
      isLeaf: true,
      level: "Intermediate",
      description: "Query language for APIs and runtime for executing those queries"
    });

    // Add some relationships for the graph view
    this.createSkillRelationship({
      sourceId: jsId,
      targetId: reactId,
      type: "uses"
    });
    
    this.createSkillRelationship({
      sourceId: reactId,
      targetId: restApiId,
      type: "connects-to"
    });
  }

  // Helper method to add a skill
  private addSkill(skill: InsertSkill): number {
    const id = this.currentSkillId++;
    const newSkill: Skill = { 
      id, 
      ...skill
    };
    this.skills.set(id, newSkill);
    return id;
  }

  // Get all skills as a tree structure
  async getAllSkills(): Promise<SkillNode> {
    return this.buildSkillTree();
  }

  // Get a specific skill by ID
  async getSkill(id: number): Promise<Skill | undefined> {
    const skill = this.skills.get(id);
    
    if (skill) {
      // Get related resources
      const resources = Array.from(this.resources.values())
        .filter(resource => resource.skillId === id);
      
      // Enhance the skill with resources if any exist
      if (resources.length > 0) {
        skill.resources = resources.map(r => ({
          title: r.title,
          url: r.url,
          type: r.type
        }));
      }
    }
    
    return skill;
  }

  // Create a new skill
  async createSkill(skillData: InsertSkill): Promise<Skill> {
    const id = this.currentSkillId++;
    const skill: Skill = { id, ...skillData };
    this.skills.set(id, skill);
    return skill;
  }

  // Update an existing skill
  async updateSkill(id: number, skillData: Partial<InsertSkill>): Promise<Skill | undefined> {
    const existingSkill = this.skills.get(id);
    
    if (!existingSkill) {
      return undefined;
    }
    
    const updatedSkill = { ...existingSkill, ...skillData };
    this.skills.set(id, updatedSkill);
    return updatedSkill;
  }

  // Delete a skill
  async deleteSkill(id: number): Promise<boolean> {
    // Check if the skill exists
    if (!this.skills.has(id)) {
      return false;
    }
    
    // Delete any associated resources
    Array.from(this.resources.entries())
      .filter(([_, resource]) => resource.skillId === id)
      .forEach(([resourceId, _]) => {
        this.resources.delete(resourceId);
      });
    
    // Delete any relationships involving this skill
    Array.from(this.relationships.entries())
      .filter(([_, rel]) => rel.sourceId === id || rel.targetId === id)
      .forEach(([relId, _]) => {
        this.relationships.delete(relId);
      });
    
    // Delete the skill itself
    return this.skills.delete(id);
  }

  // Search skills by name
  async searchSkills(query: string): Promise<Skill[]> {
    const normalizedQuery = query.toLowerCase();
    
    return Array.from(this.skills.values())
      .filter(skill => 
        skill.name.toLowerCase().includes(normalizedQuery) ||
        (skill.description && skill.description.toLowerCase().includes(normalizedQuery))
      );
  }

  // Get resources for a skill
  async getSkillResources(skillId: number): Promise<Resource[]> {
    return Array.from(this.resources.values())
      .filter(resource => resource.skillId === skillId);
  }

  // Create a resource
  async createResource(resourceData: InsertResource): Promise<Resource> {
    const id = this.currentResourceId++;
    const resource: Resource = { id, ...resourceData };
    this.resources.set(id, resource);
    return resource;
  }

  // Update a resource
  async updateResource(id: number, resourceData: Partial<InsertResource>): Promise<Resource | undefined> {
    const existingResource = this.resources.get(id);
    
    if (!existingResource) {
      return undefined;
    }
    
    const updatedResource = { ...existingResource, ...resourceData };
    this.resources.set(id, updatedResource);
    return updatedResource;
  }

  // Delete a resource
  async deleteResource(id: number): Promise<boolean> {
    return this.resources.delete(id);
  }

  // Get skills data for graph visualization
  async getSkillsGraph(): Promise<{nodes: any[], edges: any[]}> {
    const nodes = Array.from(this.skills.values()).map(skill => ({
      id: `skill-${skill.id}`,
      label: skill.name,
      category: skill.category,
      skillId: skill.id
    }));
    
    // First, add edges based on parent-child relationships
    const parentEdges = Array.from(this.skills.values())
      .filter(skill => skill.parentId !== null && skill.parentId !== undefined)
      .map(skill => ({
        id: `parent-${skill.parentId}-child-${skill.id}`,
        source: `skill-${skill.parentId}`,
        target: `skill-${skill.id}`,
        type: 'parent-child'
      }));
    
    // Then add edges based on explicit relationships
    const relationshipEdges = Array.from(this.relationships.values())
      .map(rel => ({
        id: `rel-${rel.id}`,
        source: `skill-${rel.sourceId}`,
        target: `skill-${rel.targetId}`,
        type: rel.type
      }));
    
    const edges = [...parentEdges, ...relationshipEdges];
    
    return { nodes, edges };
  }

  // Create a relationship between skills
  async createSkillRelationship(relationshipData: InsertSkillRelationship): Promise<SkillRelationship> {
    const id = this.currentRelationshipId++;
    const relationship: SkillRelationship = { id, ...relationshipData };
    this.relationships.set(id, relationship);
    return relationship;
  }

  // Delete a relationship
  async deleteSkillRelationship(id: number): Promise<boolean> {
    return this.relationships.delete(id);
  }
}

export const storage = new MemStorage();
