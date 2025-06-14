
import React from 'react';
import { CVTemplate } from './CVTemplates';

interface CVData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    professionalTitle: string;
    summary: string;
    photoUrl?: string;
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

interface TemplatePreviewProps {
  data: CVData;
  template: CVTemplate;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ data, template }) => {
  const renderFormattedText = (html: string) => {
    return <div dangerouslySetInnerHTML={{ __html: html }} className="formatted-content" />;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
  };

  // Template-specific styling
  const getTemplateStyles = () => {
    switch (template.id) {
      case 'modern-blue':
        return {
          primary: 'text-blue-600',
          accent: 'bg-blue-100',
          border: 'border-blue-300',
          header: 'bg-blue-600'
        };
      case 'classic-elegant':
        return {
          primary: 'text-gray-700',
          accent: 'bg-gray-100',
          border: 'border-gray-300',
          header: 'bg-gray-700'
        };
      case 'creative-orange':
        return {
          primary: 'text-orange-600',
          accent: 'bg-orange-100',
          border: 'border-orange-300',
          header: 'bg-orange-500'
        };
      case 'minimal-green':
        return {
          primary: 'text-green-600',
          accent: 'bg-green-100',
          border: 'border-green-300',
          header: 'bg-green-500'
        };
      case 'executive-dark':
        return {
          primary: 'text-slate-800',
          accent: 'bg-slate-100',
          border: 'border-slate-400',
          header: 'bg-slate-800'
        };
      case 'modern-purple':
        return {
          primary: 'text-purple-600',
          accent: 'bg-purple-100',
          border: 'border-purple-300',
          header: 'bg-purple-500'
        };
      case 'clean-teal':
        return {
          primary: 'text-teal-600',
          accent: 'bg-teal-100',
          border: 'border-teal-300',
          header: 'bg-teal-500'
        };
      case 'artistic-red':
        return {
          primary: 'text-red-600',
          accent: 'bg-red-100',
          border: 'border-red-300',
          header: 'bg-red-500'
        };
      case 'corporate-navy':
        return {
          primary: 'text-blue-900',
          accent: 'bg-blue-100',
          border: 'border-blue-400',
          header: 'bg-blue-900'
        };
      case 'modern-gradient':
        return {
          primary: 'text-pink-600',
          accent: 'bg-gradient-to-r from-pink-100 to-violet-100',
          border: 'border-pink-300',
          header: 'bg-gradient-to-r from-pink-500 to-violet-500'
        };
      default:
        return {
          primary: 'text-eemploi-primary',
          accent: 'bg-gray-100',
          border: 'border-gray-300',
          header: 'bg-eemploi-primary'
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen" style={{ fontFamily: template.style === 'classic' ? 'serif' : 'sans-serif' }}>
      <style>{`
        .formatted-content ul, .formatted-content ol {
          margin-left: 20px;
          margin-bottom: 10px;
        }
        .formatted-content li {
          margin-bottom: 5px;
        }
        .formatted-content strong, .formatted-content b {
          font-weight: bold;
        }
        .formatted-content em, .formatted-content i {
          font-style: italic;
        }
        .formatted-content u {
          text-decoration: underline;
        }
      `}</style>

      {/* Header Section */}
      <div className={`${styles.header} text-white p-6 rounded-t-lg mb-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {data.personalInfo.firstName} {data.personalInfo.lastName}
            </h1>
            {data.personalInfo.professionalTitle && (
              <h2 className="text-xl opacity-90">
                {data.personalInfo.professionalTitle}
              </h2>
            )}
          </div>
          {data.personalInfo.photoUrl && (
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
              <img 
                src={data.personalInfo.photoUrl} 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
          )}
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm opacity-90">
          {data.personalInfo.email && <div>📧 {data.personalInfo.email}</div>}
          {data.personalInfo.phone && <div>📞 {data.personalInfo.phone}</div>}
          {data.personalInfo.address && <div>📍 {data.personalInfo.address}</div>}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Summary */}
        {data.personalInfo.summary && (
          <div>
            <h3 className={`text-xl font-semibold ${styles.primary} mb-3 pb-2 border-b-2 ${styles.border}`}>
              Profil Professionnel
            </h3>
            <div className="text-gray-700 leading-relaxed">
              {renderFormattedText(data.personalInfo.summary)}
            </div>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div>
            <h3 className={`text-xl font-semibold ${styles.primary} mb-4 pb-2 border-b-2 ${styles.border}`}>
              Expérience Professionnelle
            </h3>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id} className={`p-4 rounded-lg ${styles.accent}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-medium">{exp.position}</h4>
                      <p className={`${styles.primary} font-medium`}>{exp.company}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(exp.startDate)} - {exp.current ? 'Présent' : formatDate(exp.endDate)}
                    </div>
                  </div>
                  {exp.description && (
                    <div className="text-gray-700 text-sm">
                      {renderFormattedText(exp.description)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div>
            <h3 className={`text-xl font-semibold ${styles.primary} mb-4 pb-2 border-b-2 ${styles.border}`}>
              Formation
            </h3>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{edu.degree}</h4>
                    <p className={`${styles.primary}`}>{edu.institution}</p>
                    {edu.description && (
                      <div className="text-sm text-gray-600 mt-1">
                        {renderFormattedText(edu.description)}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div>
            <h3 className={`text-xl font-semibold ${styles.primary} mb-4 pb-2 border-b-2 ${styles.border}`}>
              Compétences
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {data.skills.map((skill) => (
                <div key={skill.id} className={`p-3 rounded-lg ${styles.accent} text-center`}>
                  <div className="font-medium">{skill.name}</div>
                  <div className="text-sm text-gray-600">{skill.level}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatePreview;
