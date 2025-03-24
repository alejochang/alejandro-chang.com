import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Code, GraduationCap, Award, FolderOpen, Search, ChevronRight, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import profileData from "@/data/profileData.json";

// Helper function to get the right icon component for profile sections
const getIconComponent = (iconName: string) => {
  switch (iconName.toLowerCase()) {
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

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<string>("experience");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<string[]>(["experience"]);
  const { personalInfo, experience, skills, education, certifications, projects, profileSections } = profileData;
  const resumeContentRef = useRef<HTMLDivElement>(null);
  
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar with search and navigation */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
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
            </div>
          </div>
          
          {/* Main content area */}
          <div className="col-span-1 lg:col-span-3">
            <div 
              ref={resumeContentRef}
              className="bg-white rounded-lg shadow-md overflow-auto h-[80vh] p-6"
            >
              {/* Experience Section */}
              <div id="experience-section" className="resume-section">
                <h2 className="text-2xl font-bold text-[var(--secondary-color)] mb-6">Work Experience</h2>
                
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
                        <strong className="text-[var(--secondary-color)]">Tech & Tools:</strong>{' '}
                        {job.technologies.join(', ')}
                      </p>
                      
                      {index < experience.length - 1 && <hr className="my-6 border-[var(--light-gray)]" />}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Skills Section */}
              <div id="skills-section" className="resume-section mt-10">
                <h2 className="text-2xl font-bold text-[var(--secondary-color)] mb-6">Technical Skills</h2>
                
                <div className="space-y-6">
                  {skills.technical.map((skillCategory) => (
                    <div key={skillCategory.category} className="skill-category">
                      <h4 className="text-lg font-semibold text-[var(--secondary-color)] mb-3">
                        {skillCategory.category}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {skillCategory.items.map((skill, skillIndex) => (
                          <span 
                            key={skillIndex} 
                            className="px-3 py-1.5 bg-[var(--light-gray)] bg-opacity-30 text-[var(--text-color)] rounded-md text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <div className="skill-category">
                    <h4 className="text-lg font-semibold text-[var(--secondary-color)] mb-3">
                      Soft Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.soft.map((skill, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1.5 bg-[var(--highlight-color)] bg-opacity-30 text-[var(--text-color)] rounded-md text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Education Section */}
              <div id="education-section" className="resume-section mt-10">
                <h2 className="text-2xl font-bold text-[var(--secondary-color)] mb-6">Education</h2>
                
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
              <div id="certifications-section" className="resume-section mt-10">
                <h2 className="text-2xl font-bold text-[var(--secondary-color)] mb-6">Certifications</h2>
                
                <div className="flex flex-wrap gap-4">
                  {certifications.map((cert) => (
                    <div key={cert.name} className="bg-[var(--highlight-color)] bg-opacity-20 px-4 py-3 rounded-md">
                      <p className="font-medium text-[var(--secondary-color)]">{cert.name}</p>
                      <p className="text-sm text-[var(--medium-gray)]">{cert.issuer}, {cert.year}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Projects Section */}
              <div id="projects-section" className="resume-section mt-10">
                <h2 className="text-2xl font-bold text-[var(--secondary-color)] mb-6">Projects</h2>
                
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