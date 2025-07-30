import React from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, MapPin, Calendar, Code, Briefcase, GraduationCap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { portfolioApi } from '../services/portfolioApi';
import SEO from '../components/SEO';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Skill, Experience, Education } from '../types/api';

const About: React.FC = () => {
  const { data: skills, isLoading: skillsLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: () => portfolioApi.getSkills().then(res => res.data),
  });

  const { data: experiences, isLoading: experiencesLoading } = useQuery({
    queryKey: ['experiences'],
    queryFn: () => portfolioApi.getExperience().then((res: any) => res.data),
  });

  const { data: education, isLoading: educationLoading } = useQuery({
    queryKey: ['education'],
    queryFn: () => portfolioApi.getEducation().then(res => res.data),
  });

  const personalInfo = {
    name: "Your Name",
    title: "Full-Stack Developer",
    location: "Your City, Country",
    email: "your.email@example.com",
    yearsOfExperience: 5,
    bio: `I'm a passionate full-stack developer with ${5} years of experience creating 
    beautiful, functional, and user-friendly web applications. I specialize in modern 
    JavaScript frameworks, cloud technologies, and agile development practices. 
    
    My journey in tech started with a curiosity about how websites work, and it has 
    evolved into a career where I get to solve complex problems and build solutions 
    that make a real impact. I'm always eager to learn new technologies and take on 
    challenging projects that push my skills to the next level.`,
    interests: [
      "Web Development",
      "Cloud Architecture",
      "Open Source",
      "Machine Learning",
      "UI/UX Design",
      "Blockchain Technology"
    ]
  };

  const stats = [
    { label: "Years Experience", value: personalInfo.yearsOfExperience },
    { label: "Projects Completed", value: "50+" },
    { label: "Technologies Mastered", value: "20+" },
    { label: "Happy Clients", value: "30+" }
  ];

  return (
    <>
      <SEO 
        title="About"
        description={`Learn more about ${personalInfo.name}, a ${personalInfo.title} with ${personalInfo.yearsOfExperience} years of experience in web development, specializing in React, Node.js, and modern web technologies.`}
        keywords="about, full stack developer, web developer experience, skills, background, software engineer"
      />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-br from-primary-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    About Me
                  </h1>
                  <h2 className="text-2xl md:text-3xl text-primary-600 dark:text-primary-400 font-semibold mb-6">
                    {personalInfo.title}
                  </h2>
                </div>
                
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  {personalInfo.bio.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="leading-relaxed">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button>
                    <a href="/resume.pdf" className="flex items-center gap-2" target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4" />
                      Download Resume
                    </a>
                  </Button>
                  <Button variant="secondary">
                    <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Get In Touch
                    </a>
                  </Button>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 pt-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {personalInfo.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Available for work
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="relative">
                  <div className="w-80 h-80 bg-gradient-to-br from-primary-400 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-6xl font-bold shadow-2xl">
                    {personalInfo.name.split(' ').map(name => name[0]).join('')}
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl shadow-lg"
                  >
                    💻
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="text-center p-6">
                    <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="section-padding bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Technical Skills
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Technologies and tools I use to bring ideas to life
              </p>
            </motion.div>

            {skillsLoading ? (
              <LoadingSpinner size="lg" className="py-12" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills?.map((skill: Skill, index: number) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                          <Code className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {skill.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {skill.category}
                          </p>
                        </div>
                      </div>
                      
                      {skill.proficiency && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">Proficiency</span>
                            <span className="text-gray-900 dark:text-white font-medium">
                              {skill.proficiency}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.proficiency}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className="bg-primary-600 dark:bg-primary-400 h-2 rounded-full"
                            />
                          </div>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Experience Section */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Work Experience
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                My professional journey and the roles that shaped my expertise
              </p>
            </motion.div>

            {experiencesLoading ? (
              <LoadingSpinner size="lg" className="py-12" />
            ) : (
              <div className="space-y-8">
                {experiences?.map((experience: Experience, index: number) => (
                  <motion.div
                    key={experience.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <Card className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                            <Briefcase className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {experience.position}
                            </h3>
                            <p className="text-primary-600 dark:text-primary-400 font-medium">
                              {experience.company}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(experience.start_date).getFullYear()} - 
                          {experience.end_date ? new Date(experience.end_date).getFullYear() : 'Present'}
                        </div>
                      </div>
                      
                      {experience.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {experience.description}
                        </p>
                      )}
                      
                      {experience.technologies && (
                        <div className="flex flex-wrap gap-2">
                          {experience.technologies.split(',').map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Education Section */}
        <section className="section-padding bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Education & Certifications
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Academic background and professional certifications
              </p>
            </motion.div>

            {educationLoading ? (
              <LoadingSpinner size="lg" className="py-12" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {education?.map((edu: Education, index: number) => (
                  <motion.div
                    key={edu.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <Card className="p-6 h-full">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                          <GraduationCap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                            {edu.degree}
                          </h3>
                          <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                            {edu.institution}
                          </p>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-3">
                            <Calendar className="w-4 h-4" />
                            {new Date(edu.start_date).getFullYear()} - 
                            {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}
                          </div>
                          {edu.gpa && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              GPA: {edu.gpa}
                            </div>
                          )}
                          {edu.description && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {edu.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Interests Section */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Interests & Passions
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Beyond coding, here are the areas that fuel my curiosity and drive for innovation
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {personalInfo.interests.map((interest, index) => (
                  <motion.span
                    key={interest}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="px-6 py-3 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full font-medium"
                  >
                    {interest}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
