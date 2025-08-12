import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Code,
  GraduationCap,
  Award,
  FolderOpen,
  Search,
  ChevronRight,
  ChevronDown,
  User,
  Menu,
  Globe,
  Database,
  Cpu,
  Layers,
  GitBranch,
  ShieldCheck,
  BarChart,
  Terminal,
  Server,
  Cloud,
  Brain,
  Palette,
  Monitor,
  Network,
  Wrench
} from "lucide-react";
import Header from "@/components/Header";
import profileData from "@/data/profileData.json";
import { useIsMobile } from "@/hooks/use-mobile";

// Helper function to get the right icon component for profile sections
const getIconComponent = (iconName: string) => {
  switch (iconName.toLowerCase()) {
    case "user":
      return <User className="h-5 w-5 text-[var(--medium-gray)] mr-3" />;
    case "briefcase":
      return <Briefcase className="h-5 w-5 text-[var(--medium-gray)] mr-3" />;
    case "code":
      return <Code className="h-5 w-5 text-[var(--medium-gray)] mr-3" />;
    case "graduation-cap":
      return <GraduationCap className="h-5 w-5 text-[var(--medium-gray)] mr-3" />;
    case "certificate":
      return <Award className="h-5 w-5 text-[var(--medium-gray)] mr-3" />;
    case "project-diagram":
      return <FolderOpen className="h-5 w-5 text-[var(--medium-gray)] mr-3" />;
    default:
      return <ChevronRight className="h-5 w-5 text-[var(--medium-gray)] mr-3" />;
  }
};

// Helper function to get skill category icon
const getSkillCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "programming languages":
      return <Code className="h-5 w-5 text-white" />;
    case "databases":
      return <Database className="h-5 w-5 text-white" />;
    case "frontend":
    case "frontend development":
      return <Palette className="h-5 w-5 text-white" />;
    case "backend":
    case "backend development":
      return <Server className="h-5 w-5 text-white" />;
    case "devops":
    case "devops & cloud":
    case "cloud platforms":
      return <Cloud className="h-5 w-5 text-white" />;
    case "ai":
    case "ai & machine learning":
    case "machine learning":
      return <Brain className="h-5 w-5 text-white" />;
    case "web development":
      return <Globe className="h-5 w-5 text-white" />;
    case "development tools":
      return <Terminal className="h-5 w-5 text-white" />;
    case "tools":
    case "tools & methodologies":
    case "methodologies":
      return <Wrench className="h-5 w-5 text-white" />;
    case "version control":
      return <GitBranch className="h-5 w-5 text-white" />;
    case "security":
      return <ShieldCheck className="h-5 w-5 text-white" />;
    case "analytics":
      return <BarChart className="h-5 w-5 text-white" />;
    case "hardware & systems":
      return <Cpu className="h-5 w-5 text-white" />;
    case "networking":
      return <Network className="h-5 w-5 text-white" />;
    default:
      return <Code className="h-5 w-5 text-white" />;
  }
};

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<string>("about");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<string[]>(["about"]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isNarrowView, setIsNarrowView] = useState<boolean>(window.innerWidth < 1024);
  const {
    personalInfo,
    about,
    experience,
    skills,
    education,
    certifications,
    projects,
    profileSections
  } = profileData;
  const resumeContentRef = useRef<HTMLDivElement>(null);

  // Track window size changes
  useEffect(() => {
    const handleResize = () => {
      setIsNarrowView(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset to About section when revisiting profile page
  useEffect(() => {
    // Reset to "about" section when the profile page is loaded
    setActiveSection("about");

    // Auto-expand only the about section
    setExpandedSections(["about"]);

    // Auto-scroll to the about section
    if (resumeContentRef.current) {
      const sectionElement = document.getElementById("about-section");
      if (sectionElement) {
        resumeContentRef.current.scrollTop = 0; // Scroll to top
      }
    }
  }, []);

  // Handle section toggle
  const toggleSection = (sectionId: string) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter(id => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };

  // Handle section selection
  const selectSection = (sectionId: string) => {
    setActiveSection(sectionId);

    // Make sure the selected section is expanded
    if (!expandedSections.includes(sectionId)) {
      setExpandedSections([...expandedSections, sectionId]);
    }

    // Auto-scroll to the section in the resume content
    if (resumeContentRef.current) {
      const sectionElement = document.getElementById(sectionId + "-section");
      if (sectionElement) {
        resumeContentRef.current.scrollTop = sectionElement.offsetTop - 20;
      }
    }
  };

  // Filter sections based on search term
  const filterSections = (item: any) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    return item.name.toLowerCase().includes(term);
  };

  return (
      <div className="flex flex-col min-h-screen">
        {/* Unified Header */}
        <Header currentPage="home" />

        {/* Main content - Profile View */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left sidebar with search and navigation */}
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
                          {getIconComponent(profileSections.find(s => s.id === activeSection)?.icon || "")}
                          <span className="text-[var(--text-color)] font-medium">
                        {profileSections.find(s => s.id === activeSection)?.name || "Select Section"}
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
                          <div className="mt-2 bg-[var(--backgroundLight)] rounded-md p-2">
                            <div className="relative mb-3">
                              <input
                                  type="text"
                                  placeholder="Search sections..."
                                  className="w-full px-4 py-2 border border-[var(--light-gray)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  aria-label="Search profile sections"
                              />
                              <Search className="absolute right-3 top-2.5 h-4 w-4 text-[var(--medium-gray)]" />
                            </div>

                            <ul className="space-y-1" role="tree" aria-label="Profile Navigation Menu">
                              {profileSections.filter(filterSections).map((section) => (
                                  <li
                                      key={section.id}
                                      className={`cursor-pointer rounded-md transition-colors ${
                                          activeSection === section.id ? 'bg-[var(--highlight-color)] bg-opacity-25 border-l-4 border-[var(--primary-color)]' : ''
                                      }`}
                                      role="treeitem"
                                  >
                                    <div
                                        className="flex items-center py-2 px-3"
                                        onClick={() => {
                                          selectSection(section.id);
                                          setIsMobileMenuOpen(false); // Close menu after selection on mobile
                                        }}
                                    >
                                      {getIconComponent(section.icon)}
                                      <span className="text-[var(--text-color)] font-medium">{section.name}</span>
                                    </div>
                                  </li>
                              ))}
                            </ul>
                          </div>
                      )}
                    </div>
                ) : (
                    /* Desktop view - Regular expanded menu */
                    <>
                      <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Search profile sections..."
                            className="w-full px-4 py-2 border border-[var(--light-gray)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            aria-label="Search profile sections"
                        />
                        <Search className="absolute right-3 top-2.5 h-4 w-4 text-[var(--medium-gray)]" />
                      </div>

                      <ul className="space-y-1" role="tree" aria-label="Profile Navigation Menu">
                        {profileSections.filter(filterSections).map((section) => (
                            <li
                                key={section.id}
                                className={`cursor-pointer rounded-md transition-colors ${
                                    activeSection === section.id ? 'bg-[var(--highlight-color)] bg-opacity-25 border-l-4 border-[var(--primary-color)]' : ''
                                }`}
                                role="treeitem"
                                aria-expanded={expandedSections.includes(section.id)}
                            >
                              <div
                                  className="flex items-center py-2 px-3"
                                  onClick={() => {
                                    toggleSection(section.id);
                                    selectSection(section.id);
                                  }}
                              >
                                {getIconComponent(section.icon)}
                                <span className="text-[var(--text-color)] font-medium">{section.name}</span>
                                {expandedSections.includes(section.id) ? (
                                    <ChevronDown className="ml-auto h-4 w-4 text-[var(--medium-gray)]" />
                                ) : (
                                    <ChevronRight className="ml-auto h-4 w-4 text-[var(--medium-gray)]" />
                                )}
                              </div>
                            </li>
                        ))}
                      </ul>
                    </>
                )}
              </div>
            </div>

            {/* Main content area */}
            <div className="col-span-1 lg:col-span-9">
              <div
                  ref={resumeContentRef}
                  className="bg-white rounded-lg shadow-md overflow-auto h-[80vh] p-6"
              >
                {/* About Me Section */}
                <div id="about-section" className={`resume-section ${activeSection !== 'about' ? 'hidden' : ''}`}>
                  <h2 className="text-2xl font-bold text-[var(--secondary-color)] mb-6">{about.title}</h2>

                  <div className="rounded-lg p-6 mb-8 border-l-4 border-[var(--primary-color)]">
                    <p className="text-[var(--text-color)] mb-4 whitespace-pre-line">{about.description}</p>

                    <div className="mt-6">
                      <h3 className="text-lg font-bold text-[var(--secondary-color)] mb-3">{about.strengthsTitle}</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {about.highlights.map((highlight, index) => (
                            <li key={index} className="flex items-start">
                              <div className="bg-[var(--primary-color)] rounded-full p-1 mr-3 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="text-[var(--text-color)]">{highlight}</span>
                            </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <a
                          href={personalInfo.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-[var(--primary-color)] text-white rounded-md hover:bg-[var(--secondary-color)] transition-colors"
                      >
                        <i className="fa-brands fa-linkedin mr-2"></i> LinkedIn
                      </a>
                      <a
                          href={personalInfo.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-[var(--primary-color)] text-white rounded-md hover:bg-[var(--secondary-color)] transition-colors"
                      >
                        <i className="fa-brands fa-github mr-2"></i> GitHub
                      </a>
                      <a
                          href={`mailto:${personalInfo.email}`}
                          className="inline-flex items-center px-4 py-2 bg-[var(--primary-color)] text-white rounded-md hover:bg-[var(--secondary-color)] transition-colors"
                      >
                        <i className="fa-solid fa-envelope mr-2"></i> Contact Me
                      </a>
                    </div>
                  </div>
                </div>

                {/* Experience Section */}
                <div id="experience-section" className={`resume-section ${activeSection !== 'experience' ? 'hidden' : ''}`}>
                  <h2 className="text-2xl font-bold text-[var(--secondary-color)] mb-6">
                    {profileSections.find(section => section.id === 'experience')?.title}
                  </h2>

                  <div className="space-y-8">
                    {experience.map((job, index) => (
                        <div key={job.id} id={job.id + "-section"} className="job-entry">
                          <div className="mb-3">
                            <h3 className="text-xl font-bold text-[var(--secondary-color)]">
                              <span>{job.title}</span> | <span className="text-[var(--primary-color)]">{job.company}</span>
                            </h3>
                            <p className="text-[var(--medium-gray)] italic">
                              {job.period} | {job.location}
                            </p>
                          </div>

                          <ul className="list-disc pl-5 space-y-2 mb-4">
                            {job.achievements.map((achievement, aIndex) => (
                                <li key={aIndex} className="text-[var(--text-color)]">{achievement}</li>
                            ))}
                          </ul>

                          <p className="mb-4">
                            <strong className="text-[var(--secondary-color)]">{skills.techAndToolsLabel}</strong>{' '}
                            {job.technologies.join(', ')}
                          </p>

                          {index < experience.length - 1 && <hr className="my-6 border-[var(--light-gray)]" />}
                        </div>
                    ))}
                  </div>
                </div>

                {/* Skills Section */}
                <div id="skills-section" className={`resume-section mt-10 ${activeSection !== 'skills' ? 'hidden' : ''}`}>
                  <h2 className="text-2xl font-bold text-[var(--secondary-color)] mb-8">
                    {profileSections.find(section => section.id === 'skills')?.title}
                  </h2>

                  <div className="space-y-10">
                    {/* Technical Skills */}
                    {skills.technical.map((skillCategory, categoryIndex) => (
                        <div key={skillCategory.category} className="skill-category bg-white rounded-lg shadow-sm p-6 border-l-4 border-[var(--primary-color)]">
                          <h4 className="text-xl font-semibold text-[var(--secondary-color)] mb-4 flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--highlight-color)] flex items-center justify-center mr-3 text-white">
                              {getSkillCategoryIcon(skillCategory.category)}
                            </div>
                            {skillCategory.category}
                          </h4>

                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
                            {skillCategory.items.map((skill, skillIndex) => (
                                <div
                                    key={skillIndex}
                                    className="flex items-center"
                                >
                                  <div className="h-2 w-2 rounded-full bg-[var(--primary-color)] mr-2"></div>
                                  <span className="text-[var(--text-color)]">{skill}</span>
                                </div>
                            ))}
                          </div>
                        </div>
                    ))}

                    {/* Soft Skills */}
                    <div className="skill-category bg-gradient-to-r from-[var(--highlight-color)] to-[var(--backgroundLight)] bg-opacity-20 rounded-lg p-6 border-r-4 border-[var(--secondary-color)]">
                      <h4 className="text-xl font-semibold text-[var(--secondary-color)] mb-4">
                        {skills.softSkillsTitle}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mt-4">
                        {skills.soft.map((skill, index) => (
                            <div
                                key={index}
                                className="flex items-center"
                            >
                              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[var(--secondary-color)] flex items-center justify-center mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="text-[var(--text-color)] font-medium">{skill}</span>
                            </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Education Section */}
                <div id="education-section" className={`resume-section mt-10 ${activeSection !== 'education' ? 'hidden' : ''}`}>
                  <h2 className="text-2xl font-bold text-[var(--secondary-color)] mb-6">
                    {profileSections.find(section => section.id === 'education')?.title}
                  </h2>

                  <div className="space-y-6">
                    {education.map((edu) => (
                        <div key={edu.institution} className="border-l-4 border-[var(--primary-color)] pl-4 py-2">
                          <h4 className="text-lg font-bold text-[var(--secondary-color)]">{edu.degree}</h4>
                          <p className="text-[var(--medium-gray)]">{edu.institution}, {edu.location} | {edu.year}</p>
                          <ul className="list-disc pl-5 mt-2">
                            {edu.highlights.map((highlight, hIndex) => (
                                <li key={hIndex} className="text-sm text-[var(--medium-gray)]">{highlight}</li>
                            ))}
                          </ul>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Certifications Section */}
                <div id="certifications-section" className={`resume-section mt-10 ${activeSection !== 'certifications' ? 'hidden' : ''}`}>
                  <h2 className="text-2xl font-bold text-[var(--secondary-color)] mb-6">
                    {profileSections.find(section => section.id === 'certifications')?.title}
                  </h2>

                  <div className="flex flex-wrap gap-4">
                    {certifications.map((cert) => (
                        <div key={cert.name} className="bg-[var(--highlight-color)] bg-opacity-20 px-4 py-3 rounded-md">
                          <p className="font-medium text-[var(--secondary-color)]">{cert.name}</p>
                          <p className="text-sm text-[var(--medium-gray)]">{cert.issuer}, {cert.year}</p>
                          <a
                              className="inline-flex items-center justify-center mt-2 px-3 py-1 text-xs bg-[var(--secondary-color)] bg-opacity-10 text-[var(--secondary-color)] rounded border border-[var(--secondary-color)] border-opacity-30 hover:bg-opacity-20 transition-colors"
                              target="_self"
                              aria-label={`Show credential for ${cert.name}`}
                              href={cert.link}
                          >
                            <span className="mr-1">Show credential</span>
                            <svg
                                role="none"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 16 16"
                                className="fill-current"
                            >
                              <use href="#link-external-small" width="12" height="12"></use>
                            </svg>
                          </a>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Projects Section */}
                <div id="projects-section" className={`resume-section mt-10 ${activeSection !== 'projects' ? 'hidden' : ''}`}>
                  <h2 className="text-2xl font-bold text-[var(--secondary-color)] mb-6">
                    {profileSections.find(section => section.id === 'projects')?.title}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project) => (
                        <Card key={project.title}>
                          <CardContent className="p-5">
                            <h3 className="text-lg font-bold text-[var(--secondary-color)] mb-2">{project.title}</h3>
                            <p className="text-[var(--medium-gray)] mb-4">{project.description}</p>

                            {project.highlights && project.highlights.length > 0 && (
                                <div className="mb-4">
                                  <h5 className="font-semibold text-[var(--medium-gray)] mb-2">Key Features:</h5>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {project.highlights.map((highlight, hIndex) => (
                                        <li key={hIndex} className="text-[var(--medium-gray)] text-sm">{highlight}</li>
                                    ))}
                                  </ul>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2 mt-3">
                              {project.technologies.map((tech, techIndex) => (
                                  <span key={techIndex} className="px-2 py-1 bg-[var(--light-gray)] bg-opacity-25 text-[var(--text-color)] rounded-md text-xs">
                              {tech}
                            </span>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-[var(--secondary-color)] text-[var(--text-light)] py-8 mt-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">{personalInfo.name}</h2>
                <p className="text-[var(--highlight-color)]">{personalInfo.title}</p>
              </div>

              <div className="flex space-x-4 my-4 md:my-0">
                {profileData.socialLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--text-light)] hover:text-[var(--highlight-color)] transition-colors"
                        aria-label={link.name}
                    >
                      {link.icon === "linkedin" && <i className="fa-brands fa-linkedin text-xl"></i>}
                      {link.icon === "github" && <i className="fa-brands fa-github text-xl"></i>}
                      {link.icon === "twitter" && <i className="fa-brands fa-twitter text-xl"></i>}
                      {link.icon === "envelope" && <i className="fa-solid fa-envelope text-xl"></i>}
                    </a>
                ))}
              </div>

              <div>
                <p>© {new Date().getFullYear()} - All Rights Reserved</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
  );
}