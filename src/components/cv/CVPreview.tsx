
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Mail, Phone, Briefcase, GraduationCap } from 'lucide-react';

interface CVData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    professionalTitle: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    position: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: string;
  }>;
}

interface CVPreviewProps {
  data: CVData;
}

const CVPreview: React.FC<CVPreviewProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-green-500';
      case 'Avancé': return 'bg-blue-500';
      case 'Intermédiaire': return 'bg-yellow-500';
      case 'Débutant': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* En-tête */}
      <div className="text-center mb-8 pb-6 border-b-2 border-eemploi-primary">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        {data.personalInfo.professionalTitle && (
          <h2 className="text-xl text-eemploi-primary font-medium mb-4">
            {data.personalInfo.professionalTitle}
          </h2>
        )}
        
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          {data.personalInfo.email && (
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              {data.personalInfo.email}
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              {data.personalInfo.phone}
            </div>
          )}
          {data.personalInfo.address && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {data.personalInfo.address}
            </div>
          )}
        </div>
      </div>

      {/* Résumé professionnel */}
      {data.personalInfo.summary && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-3 border-b border-gray-300 pb-1">
            Profil professionnel
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {data.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Expérience professionnelle */}
      {data.experience.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-4 border-b border-gray-300 pb-1 flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            Expérience professionnelle
          </h3>
          <div className="space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id} className="relative pl-6 border-l-2 border-eemploi-primary">
                <div className="absolute w-3 h-3 bg-eemploi-primary rounded-full -left-2 top-1.5"></div>
                <div className="mb-2">
                  <h4 className="text-lg font-medium text-foreground">{exp.position}</h4>
                  <p className="text-eemploi-secondary font-medium">{exp.company}</p>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(exp.startDate)} - {exp.current ? 'Présent' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formation */}
      {data.education.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-4 border-b border-gray-300 pb-1 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2" />
            Formation
          </h3>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id} className="relative pl-6 border-l-2 border-eemploi-secondary">
                <div className="absolute w-3 h-3 bg-eemploi-secondary rounded-full -left-2 top-1.5"></div>
                <div className="mb-2">
                  <h4 className="text-lg font-medium text-foreground">{edu.degree}</h4>
                  <p className="text-eemploi-secondary font-medium">{edu.institution}</p>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </div>
                </div>
                {edu.description && (
                  <p className="text-muted-foreground text-sm">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compétences */}
      {data.skills.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-4 border-b border-gray-300 pb-1">
            Compétences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.skills.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-foreground">{skill.name}</span>
                <Badge variant="secondary" className={`${getLevelColor(skill.level)} text-white`}>
                  {skill.level}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CVPreview;
