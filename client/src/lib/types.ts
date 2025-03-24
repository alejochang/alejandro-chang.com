export interface Skill {
  id: number;
  name: string;
  description?: string;
  category: string;
  level: string;
  experience?: string[];
  relatedSkills?: string[];
  resources?: Resource[];
  isLeaf?: boolean;
  children?: Skill[];
  parent?: number | null;
}

export interface Resource {
  title: string;
  url: string;
  type?: string;
}

export interface SkillNode {
  id: number;
  name: string;
  category: string;
  children?: SkillNode[];
}

export interface GraphNode {
  id: string;
  label: string;
  category: string;
  skillId?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
