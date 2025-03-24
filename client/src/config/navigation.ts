/**
 * Navigation Configuration
 * Control the visibility of navigation elements in the header
 */

interface NavigationConfig {
  // Show/hide the entire navigation section
  showNavigation: boolean;

  // Show/hide individual navigation buttons
  buttons: {
    profile: boolean;
    skillsTree: boolean;
    knowledgeGraph: boolean;
  };
}

const navigationConfig: NavigationConfig = {
  showNavigation: true,
  buttons: {
    profile: true,
    skillsTree: true,
    knowledgeGraph: true,
  },
};

export default navigationConfig;
