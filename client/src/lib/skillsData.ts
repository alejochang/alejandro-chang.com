import { Skill } from "./types";

// This is a base skill node for building the skill tree
export const createBaseNode = (
  id: number,
  name: string,
  category: string,
  isLeaf: boolean = false,
  children: Skill[] = []
): Skill => ({
  id,
  name,
  category,
  level: "Beginner",
  isLeaf,
  children,
});

// Helper to convert flat skills data to hierarchical
export const buildSkillTree = (skills: Skill[]): Skill => {
  const skillsMap: Record<number, Skill> = {};
  
  // First, create a map of all skills by id
  skills.forEach(skill => {
    skillsMap[skill.id] = { ...skill, children: [] };
  });
  
  // Root skill
  const rootSkill: Skill = {
    id: 0,
    name: "Software Engineering",
    category: "core",
    level: "Beginner",
    children: []
  };
  
  // Then, for each skill, add it as a child to its parent
  skills.forEach(skill => {
    if (skill.parent === null || skill.parent === undefined) {
      // If the skill has no parent, it's a top-level skill
      rootSkill.children?.push(skillsMap[skill.id]);
    } else if (skillsMap[skill.parent]) {
      // Otherwise, add it to its parent's children array
      skillsMap[skill.parent].children = skillsMap[skill.parent].children || [];
      skillsMap[skill.parent].children?.push(skillsMap[skill.id]);
    }
  });
  
  return rootSkill;
};

// Helper to flatten hierarchical skills data
export const flattenSkillTree = (skillTree: Skill): Skill[] => {
  const result: Skill[] = [];
  
  const traverse = (node: Skill, parentId: number | null = null) => {
    const { children, ...nodeWithoutChildren } = node;
    result.push({ ...nodeWithoutChildren, parent: parentId });
    
    if (children && children.length > 0) {
      children.forEach(child => traverse(child, node.id));
    }
  };
  
  traverse(skillTree);
  return result;
};

// Helper to search skills tree
export const searchSkillsTree = (tree: Skill, query: string): Skill[] => {
  const results: Skill[] = [];
  
  const search = (node: Skill) => {
    if (node.name.toLowerCase().includes(query.toLowerCase())) {
      results.push(node);
    }
    
    if (node.children && node.children.length > 0) {
      node.children.forEach(search);
    }
  };
  
  search(tree);
  return results;
};

// Utility to find a skill by ID in the tree
export const findSkillById = (tree: Skill, id: number): Skill | null => {
  if (tree.id === id) return tree;
  
  if (tree.children) {
    for (const child of tree.children) {
      const result = findSkillById(child, id);
      if (result) return result;
    }
  }
  
  return null;
};

// Get parent path for a skill (breadcrumbs)
export const getSkillPath = (tree: Skill, id: number): Skill[] => {
  const path: Skill[] = [];
  
  const findPath = (node: Skill, targetId: number, currentPath: Skill[]): boolean => {
    // Add the current node to the path
    currentPath.push(node);
    
    // Check if the current node is the target
    if (node.id === targetId) {
      return true;
    }
    
    // If the node has children, recursively search them
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        if (findPath(child, targetId, currentPath)) {
          return true;
        }
      }
    }
    
    // If we get here, the target is not in this path, remove the node and return false
    currentPath.pop();
    return false;
  };
  
  findPath(tree, id, path);
  return path;
};
