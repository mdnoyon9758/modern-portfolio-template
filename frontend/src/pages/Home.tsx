import React, { useState, useEffect } from 'react';
import { motion, useViewportScroll, useTransform } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin, User, Phone, Mail, MapPin, Code, Coffee, Award, Users, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectsApi, blogApi } from '../services/portfolioApi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SEO from '../components/SEO';
import InfoCard from '../components/ui/InfoCard';
import AutoImageSlider from '../components/ui/AutoImageSlider';
import { Project, BlogPost, parseTechnologies } from '../types/api';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

const skills = [
  { name: 'React', icon: 'react.svg' },
  { name: 'TypeScript', icon: 'typescript.svg' },
  { name: 'Node.js', icon: 'nodejs.svg' },
  { name: 'Python', icon: 'python.svg' },
  { name: 'MongoDB', icon: 'mongodb.svg' },
  { name: 'Docker', icon: 'docker.svg' },
];


const Home: React.FC = () => {
  const { settings, isLoading: settingsLoading } = useSiteSettings();
  const { scrollYProgress } = useViewportScroll();
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  
  // Array of beautiful gradient colors for scroll animations
  const colorSchemes = [
    'from-blue-400 to-purple-600',
    'from-pink-400 to-red-600', 
    'from-green-400 to-blue-600',
    'from-purple-400 to-pink-600',
    'from-yellow-400 to-orange-600',
    'from-indigo-400 to-purple-600',
    'from-teal-400 to-blue-600',
    'from-rose-400 to-pink-600'
  ];
  
  // Change color scheme based on scroll position
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      const newIndex = Math.floor(latest * colorSchemes.length);
      if (newIndex !== currentColorIndex && newIndex < colorSchemes.length) {
        setCurrentColorIndex(newIndex);
      }
    });
    return unsubscribe;
  }, [scrollYProgress, currentColorIndex, colorSchemes.length]);
  
  // Transform values for scroll animations
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 0.8, 0.8, 0.6]);

  const { data: featuredProjects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects', 'featured'],
    queryFn: () => projectsApi.getFeatured().then(res => res.data),
  });

  const { data: featuredPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['blog', 'featured'],
    queryFn: () => blogApi.getFeatured().then(res => res.data),
  });

  const isLoading = settingsLoading || projectsLoading || postsLoading;


  const stats = [
    { value: settings.yearsOfExperience || '3+', label: 'Years Experience', icon: <Award /> },
    { value: settings.projectsCompleted || '20+', label: 'Projects Completed', icon: <Code /> },
    { value: settings.technologiesMastered || '10+', label: 'Technologies', icon: <Coffee /> },
    { value: settings.happyClients || '5+', label: 'Happy Clients', icon: <Users /> },
  ];

  if (isLoading) {
    return <LoadingSpinner size="lg" className="py-24" />;
  }

  return (
    <>
      <SEO 
        title={settings.metaTitle || "Home"}
        description={settings.metaDescription || "Welcome to my portfolio"}
        keywords={settings.metaKeywords || "full stack developer, react, nodejs"}
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
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
                  {settings.heroTitle}
                  <br />
                  <span className="gradient-text">{settings.heroSubtitle}</span>
                </h1>
                
                {/* Personal Info with InfoCard */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <InfoCard 
                    text={settings.ownerName} 
                    label="NAME" 
                    delay={0.3}
                    icon={<User className="w-5 h-5" />}
                  />
                  <InfoCard 
                    text={settings.ownerPhone} 
                    label="PHONE" 
                    delay={0.5}
                    icon={<Phone className="w-5 h-5" />}
                  />
                  <InfoCard 
                    text={settings.ownerEmail} 
                    label="EMAIL" 
                    delay={0.7}
                    icon={<Mail className="w-5 h-5" />}
                  />
                  <InfoCard 
                    text={settings.ownerLocation} 
                    label="LOCATION" 
                    delay={0.9}
                    icon={<MapPin className="w-5 h-5" />}
                  />
                </div>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  {settings.heroDescription}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button>
                    <Link to="/projects" className="flex items-center gap-2">
                      View My Work
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <motion.a
                    href={settings.resumeUrl}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-secondary flex items-center gap-2 text-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="w-4 h-4" />
                    Download Resume
                  </motion.a>
                </div>
                <div className="flex gap-4">
                  <motion.a
                    href={settings.githubUrl}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-primary-100 dark:hover:bg-primary-900/20 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-6 h-6" />
                  </motion.a>
                  <motion.a
                    href={settings.linkedinUrl}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-primary-100 dark:hover:bg-primary-900/20 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="w-6 h-6" />
                  </motion.a>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="relative w-96 h-96">
                  {settings.enableHeroSlider ? (
                    <AutoImageSlider
                      autoplay={settings.sliderAutoplay}
                      interval={parseInt(settings.sliderInterval) || 5000}
                      showDots={settings.sliderShowDots}
                      showArrows={settings.sliderShowArrows}
                      className="rounded-full"
                      fallbackImages={[settings.heroImageUrl || "/img/profile.png", "/logo192.png", "/logo512.png"]}
                    />
                  ) : (
                    <>
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-full"
                        animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                      ></motion.div>
                      <img 
                        src={settings.heroImageUrl || "/img/profile.png"} 
                        alt={settings.ownerName} 
                        className="absolute inset-0 w-full h-full object-cover rounded-full p-4"
                      />
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      
      {/* Stats Section */}
      {settings.showHeroStats && (
        <section className="section-padding bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="text-primary-500 dark:text-primary-400 text-4xl mx-auto">
                    {stat.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects */}
      <motion.section 
        className="section-padding relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
        }}
      >
        {/* Dynamic background overlay */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${colorSchemes[currentColorIndex]} opacity-5`}
          animate={{ opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Here are some of my recent projects that showcase my skills and passion for development.
            </p>
          </motion.div>

          {projectsLoading ? (
            <LoadingSpinner size="lg" className="py-12" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects?.slice(0, 3).map((project: Project, index: number) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="cursor-pointer"
                >
                  <Link to={`/projects/${project.id}`}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 hover:border-primary-200 dark:hover:border-primary-700">
                      <div className="space-y-4">
                        {project.image_url && (
                          <div className="relative overflow-hidden rounded-lg">
                            <img
                              src={project.image_url}
                              alt={project.title}
                              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        )}
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                          {project.short_description || project.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {parseTechnologies(project.technologies).slice(0, 3).map((tech: string) => (
                            <span
                              key={tech}
                              className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium text-sm group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors pt-2">
                            <span>View Project</span>
                            <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button>
              <Link to="/projects" className="flex items-center gap-2">
                View All Projects
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Skills Section */}
      <motion.section 
        className="section-padding relative overflow-hidden"
      >
        {/* Dynamic background overlay */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${colorSchemes[(currentColorIndex + 1) % colorSchemes.length]} opacity-3`}
          animate={{ opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Technologies I Love
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              I work with modern technologies and tools to create exceptional digital experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 120
                }}
                whileHover={{ scale: 1.15, y: -10, rotate: 5 }}
                className="text-center group cursor-pointer"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center group-hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    {skill.name.slice(0, 2)}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {skill.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Blog Posts */}
      <motion.section className="section-padding bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
        {/* Dynamic background overlay */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${colorSchemes[(currentColorIndex + 2) % colorSchemes.length]} opacity-5 dark:opacity-10`}
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Latest Blog Posts
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Thoughts, tutorials, and insights about web development and technology.
            </p>
          </motion.div>

          {postsLoading ? (
            <LoadingSpinner size="lg" className="py-12" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredPosts?.slice(0, 2).map((post: BlogPost, index: number) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="cursor-pointer group"
                >
                  <Link to={`/blog/${post.slug || post.id}`}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 hover:border-primary-200 dark:hover:border-primary-700">
                      <div className="space-y-4">
                        {post.featured_image && (
                          <div className="relative overflow-hidden rounded-lg">
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                          {post.reading_time && (
                            <>
                              <span>•</span>
                              <Clock className="w-4 h-4" />
                              <span>{post.reading_time} min read</span>
                            </>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                          {post.excerpt || post.content?.substring(0, 150) + '...'}
                        </p>
                        <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium text-sm group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                          <span>Read More</span>
                          <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button>
              <Link to="/blog" className="flex items-center gap-2">
                Read More Posts
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Let's work together to bring your ideas to life. Whether you need a new website, 
              mobile app, or custom solution, I'm here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/contact" 
                  className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
                >
                  Get In Touch
                  <Mail className="w-4 h-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/projects" 
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-all duration-200 inline-flex items-center gap-2"
                >
                  View Portfolio
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
    </>
  );
};

export default Home;
