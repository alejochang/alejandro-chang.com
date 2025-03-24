import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { User, BookOpen, Network, ChevronRight } from "lucide-react";
import profileData from "@/data/profileData.json";
import navigationConfig from "@/config/navigation";

interface HeaderProps {
  currentPage?: 'home' | 'skills' | 'graph';
}

export default function Header({ currentPage = 'home' }: HeaderProps) {
  const [location] = useLocation();
  const { personalInfo, about } = profileData;
  const { showNavigation, buttons } = navigationConfig;
  
  return (
    <header className="bg-[var(--secondary-color)] text-[var(--text-light)] shadow-[var(--shadow)]">
      <div className="container mx-auto px-4">
        <div className="py-6">
          {/* Top row with profile picture, name/headline, and current position indicator */}
          <div className="flex flex-row items-center mb-6">
            {/* Profile picture with squared rounded corners */}
            <div className="mr-6">
              <Link href="/">
                <div className="bg-[var(--text-light)] rounded-lg shadow-[var(--shadow)] w-[120px] h-[120px] overflow-hidden cursor-pointer hover:shadow-lg transition-[var(--transition)]">
                  <img 
                    src={personalInfo.profilePicture} 
                    alt={`${personalInfo.name} profile`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            </div>
            
            {/* Name and details */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-light)] mb-2">{personalInfo.name}</h2>
              <p className="text-md text-[var(--highlight-color)]">
                {about.headline}
              </p>
            </div>
          </div>
          
          {/* Navigation buttons - style changes based on current page */}
          {showNavigation && (
            <div className="flex justify-center">
              <div className="inline-flex bg-[var(--primary-color)] bg-opacity-20 rounded-md p-1.5 shadow-[var(--shadow)]">
                {buttons.profile && (
                  <Link href="/">
                    <Button 
                      className={`${
                        currentPage === 'home' 
                          ? 'bg-[var(--secondary-color)] text-[var(--text-light)]' 
                          : 'bg-[var(--text-light)] text-[var(--secondary-color)]'
                      } hover:bg-[var(--medium-gray)] hover:text-[var(--text-light)] rounded-md mx-1 transition-[var(--transition)]`}
                      size="sm"
                    >
                      <User className="h-4 w-4 mr-1.5" /> Profile
                    </Button>
                  </Link>
                )}
                {buttons.skillsTree && (
                  <Link href="/skillset-overview">
                    <Button 
                      className={`${
                        currentPage === 'skills' 
                          ? 'bg-[var(--secondary-color)] text-[var(--text-light)]' 
                          : 'bg-[var(--text-light)] text-[var(--secondary-color)]'
                      } hover:bg-[var(--medium-gray)] hover:text-[var(--text-light)] rounded-md mx-1 transition-[var(--transition)]`}
                      size="sm"
                    >
                      <BookOpen className="h-4 w-4 mr-1.5" /> Skills Tree
                    </Button>
                  </Link>
                )}
                {buttons.knowledgeGraph && (
                  <Link href="/technical-expertise">
                    <Button 
                      className={`${
                        currentPage === 'graph' 
                          ? 'bg-[var(--secondary-color)] text-[var(--text-light)]' 
                          : 'bg-[var(--text-light)] text-[var(--secondary-color)]'
                      } hover:bg-[var(--medium-gray)] hover:text-[var(--text-light)] rounded-md mx-1 transition-[var(--transition)]`}
                      size="sm"
                    >
                      <Network className="h-4 w-4 mr-1.5" /> Knowledge Graph
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}