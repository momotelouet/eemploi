import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { User, GraduationCap, Briefcase, Save, Plus, Trash2, Award, Languages, Code, MapPin, Globe, Phone, Mail } from 'lucide-react';
import { MOROCCO_CITIES } from '@/components/ui/cities';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  nationality: string;
  dateOfBirth: string;
  profilePhoto: string;
  professionalTitle: string;
  summary: string;
  linkedIn: string;
  portfolio: string;
  github: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  honors: string;
  description: string;
}

interface Experience {
  id: string;
  position: string;
  company: string;
  location: string;
  industry: string;
  startDate: string;
  endDate: string;
  current: boolean;
  achievements: string[];
  description: string;
}

interface Skill {
  id: string;
  name: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  category: 'Technique' | 'Linguistique' | 'Personnel' | 'Métier';
}

interface Language {
  id: string;
  name: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Natif';
  certification: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate: string;
  credentialId: string;
  url: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  url: string;
  startDate: string;
  endDate: string;
  role: string;
}

const ProfileForm = () => {
  const { toast } = useToast();
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    nationality: '',
    dateOfBirth: '',
    profilePhoto: '',
    professionalTitle: '',
    summary: '',
    linkedIn: '',
    portfolio: '',
    github: ''
  });

  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  // Education functions
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      honors: '',
      description: ''
    };
    setEducation(prev => [...prev, newEducation]);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(prev => prev.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const removeEducation = (id: string) => {
    setEducation(prev => prev.filter(edu => edu.id !== id));
  };

  // Experience functions
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      position: '',
      company: '',
      location: '',
      industry: '',
      startDate: '',
      endDate: '',
      current: false,
      achievements: [''],
      description: ''
    };
    setExperience(prev => [...prev, newExperience]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean | string[]) => {
    setExperience(prev => prev.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const removeExperience = (id: string) => {
    setExperience(prev => prev.filter(exp => exp.id !== id));
  };

  const addAchievement = (expId: string) => {
    setExperience(prev => prev.map(exp => 
      exp.id === expId ? { ...exp, achievements: [...exp.achievements, ''] } : exp
    ));
  };

  const updateAchievement = (expId: string, achievementIndex: number, value: string) => {
    setExperience(prev => prev.map(exp => 
      exp.id === expId ? {
        ...exp,
        achievements: exp.achievements.map((ach, index) => 
          index === achievementIndex ? value : ach
        )
      } : exp
    ));
  };

  const removeAchievement = (expId: string, achievementIndex: number) => {
    setExperience(prev => prev.map(exp => 
      exp.id === expId ? {
        ...exp,
        achievements: exp.achievements.filter((_, index) => index !== achievementIndex)
      } : exp
    ));
  };

  // Skills functions
  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 'Intermédiaire',
      category: 'Technique'
    };
    setSkills(prev => [...prev, newSkill]);
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    setSkills(prev => prev.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };

  const removeSkill = (id: string) => {
    setSkills(prev => prev.filter(skill => skill.id !== id));
  };

  // Languages functions
  const addLanguage = () => {
    const newLanguage: Language = {
      id: Date.now().toString(),
      name: '',
      level: 'B1',
      certification: ''
    };
    setLanguages(prev => [...prev, newLanguage]);
  };

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    setLanguages(prev => prev.map(lang => 
      lang.id === id ? { ...lang, [field]: value } : lang
    ));
  };

  const removeLanguage = (id: string) => {
    setLanguages(prev => prev.filter(lang => lang.id !== id));
  };

  // Certifications functions
  const addCertification = () => {
    const newCertification: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
      url: ''
    };
    setCertifications(prev => [...prev, newCertification]);
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    setCertifications(prev => prev.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  const removeCertification = (id: string) => {
    setCertifications(prev => prev.filter(cert => cert.id !== id));
  };

  // Projects functions
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      description: '',
      technologies: [],
      url: '',
      startDate: '',
      endDate: '',
      role: ''
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, field: keyof Project, value: string | string[]) => {
    setProjects(prev => prev.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    ));
  };

  const removeProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const handleSave = async () => {
    try {
      // Simulate saving process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "CV Professionnel mis à jour",
        description: "Votre profil professionnel a été sauvegardé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive"
      });
    }
  };

  const generateCV = () => {
    toast({
      title: "CV généré",
      description: "Votre CV professionnel est en cours de génération...",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <User className="w-4 h-4 mr-2" />
          CV Professionnel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mon CV Professionnel</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="personal">Profil</TabsTrigger>
            <TabsTrigger value="experience">Expérience</TabsTrigger>
            <TabsTrigger value="education">Formation</TabsTrigger>
            <TabsTrigger value="skills">Compétences</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="projects">Projets</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informations personnelles et professionnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={personalInfo.firstName}
                      onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={personalInfo.lastName}
                      onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                      placeholder="Votre nom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="professionalTitle">Titre professionnel</Label>
                    <Input
                      id="professionalTitle"
                      value={personalInfo.professionalTitle}
                      onChange={(e) => handlePersonalInfoChange('professionalTitle', e.target.value)}
                      placeholder="ex: Développeur Full-Stack Senior"
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      Téléphone
                    </Label>
                    <Input
                      id="phone"
                      value={personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                      placeholder="+212 6 12 34 56 78"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Adresse
                    </Label>
                    <Input
                      id="address"
                      value={personalInfo.address}
                      onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                      placeholder="123 Rue Mohammed V"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Select value={personalInfo.city} onValueChange={value => handlePersonalInfoChange('city', value)}>
                        <SelectTrigger id="city">
                          <SelectValue placeholder="Casablanca" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOROCCO_CITIES.map((city) => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Code postal</Label>
                      <Input
                        id="postalCode"
                        value={personalInfo.postalCode}
                        onChange={(e) => handlePersonalInfoChange('postalCode', e.target.value)}
                        placeholder="20000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Pays</Label>
                      <Input
                        id="country"
                        value={personalInfo.country}
                        onChange={(e) => handlePersonalInfoChange('country', e.target.value)}
                        placeholder="Maroc"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="space-y-2">
                  <Label htmlFor="summary">Résumé professionnel</Label>
                  <Textarea
                    id="summary"
                    value={personalInfo.summary}
                    onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                    placeholder="Décrivez votre parcours professionnel, vos objectifs et votre valeur ajoutée en 3-4 phrases..."
                    rows={4}
                  />
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedIn" className="flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedIn"
                      value={personalInfo.linkedIn}
                      onChange={(e) => handlePersonalInfoChange('linkedIn', e.target.value)}
                      placeholder="linkedin.com/in/votreprofil"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio</Label>
                    <Input
                      id="portfolio"
                      value={personalInfo.portfolio}
                      onChange={(e) => handlePersonalInfoChange('portfolio', e.target.value)}
                      placeholder="votreportfolio.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      value={personalInfo.github}
                      onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
                      placeholder="github.com/votrenom"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Expérience professionnelle
                  </div>
                  <Button onClick={addExperience} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {experience.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Ajoutez votre expérience professionnelle pour créer un CV complet.
                  </div>
                ) : (
                  experience.map((exp, index) => (
                    <div key={exp.id} className="border rounded-lg p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-lg">Expérience {index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExperience(exp.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Poste *</Label>
                          <Input
                            value={exp.position}
                            onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                            placeholder="Chef de projet, Développeur Senior..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Entreprise *</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            placeholder="Nom de l'entreprise"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Lieu</Label>
                          <Input
                            value={exp.location}
                            onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                            placeholder="Casablanca, Maroc"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Secteur d'activité</Label>
                          <Input
                            value={exp.industry}
                            onChange={(e) => updateExperience(exp.id, 'industry', e.target.value)}
                            placeholder="Technologie, Finance, Santé..."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Date de début</Label>
                          <Input
                            type="date"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Date de fin</Label>
                          <Input
                            type="date"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                            disabled={exp.current}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`current-${exp.id}`}
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor={`current-${exp.id}`}>Poste actuel</Label>
                      </div>

                      {/* Achievements */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Réalisations clés</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addAchievement(exp.id)}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Ajouter
                          </Button>
                        </div>
                        {exp.achievements.map((achievement, achIndex) => (
                          <div key={achIndex} className="flex items-center space-x-2">
                            <Input
                              value={achievement}
                              onChange={(e) => updateAchievement(exp.id, achIndex, e.target.value)}
                              placeholder="• Réalisation mesurable avec des résultats quantifiés"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAchievement(exp.id, achIndex)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <Label>Description du poste</Label>
                        <Textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                          placeholder="Décrivez vos responsabilités principales et l'environnement de travail..."
                          rows={3}
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Formation et éducation
                  </div>
                  <Button onClick={addEducation} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {education.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Ajoutez votre parcours éducatif pour enrichir votre CV.
                  </div>
                ) : (
                  education.map((edu, index) => (
                    <div key={edu.id} className="border rounded-lg p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-lg">Formation {index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEducation(edu.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Diplôme *</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            placeholder="Master, Licence, Ingénieur, BTS..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Établissement *</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                            placeholder="Université, École, Institut..."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Domaine d'étude</Label>
                          <Input
                            value={edu.field}
                            onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                            placeholder="Informatique, Gestion, Ingénierie..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Lieu</Label>
                          <Input
                            value={edu.location}
                            onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                            placeholder="Rabat, Maroc"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>Date de début</Label>
                          <Input
                            type="date"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Date de fin</Label>
                          <Input
                            type="date"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Moyenne/GPA</Label>
                          <Input
                            value={edu.gpa}
                            onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                            placeholder="16/20, 3.8/4.0..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Mention/Distinction</Label>
                          <Input
                            value={edu.honors}
                            onChange={(e) => updateEducation(edu.id, 'honors', e.target.value)}
                            placeholder="Très Bien, Magna Cum Laude..."
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Projets et activités</Label>
                        <Textarea
                          value={edu.description}
                          onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                          placeholder="Projets académiques, mémoire, activités extra-scolaires..."
                          rows={3}
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Code className="w-5 h-5 mr-2" />
                    Compétences et langues
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Skills Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Compétences techniques et métier</h3>
                    <Button onClick={addSkill} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skills.map((skill) => (
                      <div key={skill.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <Input
                            value={skill.name}
                            onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                            placeholder="Nom de la compétence"
                            className="mr-2"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSkill(skill.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <Select value={skill.category} onValueChange={(value) => updateSkill(skill.id, 'category', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Technique">Technique</SelectItem>
                              <SelectItem value="Métier">Métier</SelectItem>
                              <SelectItem value="Personnel">Personnel</SelectItem>
                              <SelectItem value="Linguistique">Linguistique</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Select value={skill.level} onValueChange={(value) => updateSkill(skill.id, 'level', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Débutant">Débutant</SelectItem>
                              <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                              <SelectItem value="Avancé">Avancé</SelectItem>
                              <SelectItem value="Expert">Expert</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Languages Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <Languages className="w-5 h-5 mr-2" />
                      Langues
                    </h3>
                    <Button onClick={addLanguage} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {languages.map((language) => (
                      <div key={language.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <Input
                            value={language.name}
                            onChange={(e) => updateLanguage(language.id, 'name', e.target.value)}
                            placeholder="Langue"
                            className="mr-2"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLanguage(language.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <Select value={language.level} onValueChange={(value) => updateLanguage(language.id, 'level', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A1">A1 - Débutant</SelectItem>
                              <SelectItem value="A2">A2 - Élémentaire</SelectItem>
                              <SelectItem value="B1">B1 - Intermédiaire</SelectItem>
                              <SelectItem value="B2">B2 - Avancé</SelectItem>
                              <SelectItem value="C1">C1 - Autonome</SelectItem>
                              <SelectItem value="C2">C2 - Maîtrise</SelectItem>
                              <SelectItem value="Natif">Natif</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Input
                            value={language.certification}
                            onChange={(e) => updateLanguage(language.id, 'certification', e.target.value)}
                            placeholder="Certification (optionnel)"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Certifications et formations
                  </div>
                  <Button onClick={addCertification} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {certifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Ajoutez vos certifications professionnelles pour valoriser votre expertise.
                  </div>
                ) : (
                  certifications.map((cert, index) => (
                    <div key={cert.id} className="border rounded-lg p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-lg">Certification {index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCertification(cert.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nom de la certification *</Label>
                          <Input
                            value={cert.name}
                            onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                            placeholder="AWS Solutions Architect, PMP..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Organisme certificateur *</Label>
                          <Input
                            value={cert.issuer}
                            onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                            placeholder="Amazon Web Services, PMI..."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Date d'obtention</Label>
                          <Input
                            type="date"
                            value={cert.date}
                            onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Date d'expiration</Label>
                          <Input
                            type="date"
                            value={cert.expiryDate}
                            onChange={(e) => updateCertification(cert.id, 'expiryDate', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>ID de certification</Label>
                          <Input
                            value={cert.credentialId}
                            onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                            placeholder="Numéro de certificat"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>URL de vérification</Label>
                        <Input
                          value={cert.url}
                          onChange={(e) => updateCertification(cert.id, 'url', e.target.value)}
                          placeholder="Lien pour vérifier la certification"
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Code className="w-5 h-5 mr-2" />
                    Projets et réalisations
                  </div>
                  <Button onClick={addProject} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {projects.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Présentez vos projets les plus significatifs pour démontrer vos compétences.
                  </div>
                ) : (
                  projects.map((project, index) => (
                    <div key={project.id} className="border rounded-lg p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-lg">Projet {index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProject(project.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Titre du projet *</Label>
                          <Input
                            value={project.title}
                            onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                            placeholder="Application e-commerce, Site web..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Votre rôle</Label>
                          <Input
                            value={project.role}
                            onChange={(e) => updateProject(project.id, 'role', e.target.value)}
                            placeholder="Chef de projet, Développeur principal..."
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description du projet</Label>
                        <Textarea
                          value={project.description}
                          onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                          placeholder="Décrivez le contexte, les objectifs, les défis et les résultats du projet..."
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Technologies utilisées</Label>
                          <Input
                            value={project.technologies.join(', ')}
                            onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(', '))}
                            placeholder="React, Node.js, MongoDB..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Date de début</Label>
                          <Input
                            type="date"
                            value={project.startDate}
                            onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Date de fin</Label>
                          <Input
                            type="date"
                            value={project.endDate}
                            onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>URL du projet (Demo/GitHub)</Label>
                        <Input
                          value={project.url}
                          onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                          placeholder="https://github.com/user/projet ou https://demo.com"
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-6">
          <Button onClick={generateCV} variant="outline" className="bg-eemploi-accent text-white hover:bg-eemploi-accent/90">
            <Award className="w-4 h-4 mr-2" />
            Générer mon CV
          </Button>
          <Button onClick={handleSave} className="bg-eemploi-primary hover:bg-eemploi-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder le profil
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileForm;
