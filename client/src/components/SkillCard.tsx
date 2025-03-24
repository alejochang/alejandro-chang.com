import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skill } from "@/lib/types";

interface SkillCardProps {
  skill: Skill;
}

export default function SkillCard({ skill }: SkillCardProps) {
  const getLevelColor = (level?: string) => {
    if (!level) return 'bg-[#59635D]';
    
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-[#B3C8B7]';
      case 'intermediate':
        return 'bg-[#8BA08F]';
      case 'advanced':
        return 'bg-[#59635D]';
      case 'expert':
        return 'bg-[#233536]';
      default:
        return 'bg-[#A9A396]';
    }
  };

  return (
    <Card className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start pb-4 border-b border-gray-200 mb-4">
          <h2 className="text-2xl font-bold text-[#233536]">{skill.name}</h2>
          <Badge className={`${getLevelColor(skill.level)} text-white`}>
            {skill.level || "Unspecified"}
          </Badge>
        </div>
        
        <div className="space-y-6">
          {skill.description && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#59635D]">Description</h3>
              <p className="text-[#233536]">{skill.description}</p>
            </div>
          )}
          
          {skill.experience && skill.experience.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#59635D]">Experience</h3>
              <ul className="space-y-2">
                {skill.experience.map((item, index) => (
                  <li key={index} className="bg-[#D1CBC0] bg-opacity-30 p-3 rounded text-[#233536]">{item}</li>
                ))}
              </ul>
            </div>
          )}
          
          {skill.relatedSkills && skill.relatedSkills.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#59635D]">Related Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skill.relatedSkills.map((relatedSkill, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1 bg-[#B3C8B7] bg-opacity-50 text-[#233536] border-[#8BA08F] hover:bg-[#D1CBC0] transition-colors">
                    {relatedSkill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {skill.resources && skill.resources.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#59635D]">Learning Resources</h3>
              <ul className="space-y-1">
                {skill.resources.map((resource, index) => (
                  <li key={index}>
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#8BA08F] hover:text-[#233536] hover:underline transition-colors"
                    >
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
