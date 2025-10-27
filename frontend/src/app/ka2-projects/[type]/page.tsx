'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/api';

interface Ka2Project {
  id: number;
  title: string;
  description: string;
  type: string;
  location: string;
  coordinator: string;
  partnerCountries: string;
  objectives: string;
  activities: string[];
  results: string[];
  targetGroup: string;
  budget: string;
  checkProject?: string;
  isActive: boolean;
  imageUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export default function KA2ProjectPage() {
  const params = useParams();
  const projectType = params.type as string;
  const [projects, setProjects] = useState<Ka2Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  
  // Current project based on index
  const currentProject = projects[currentProjectIndex];

  // Kategori konfigürasyonları
  const categoryConfigs = {
    // KA210 - Small-scale partnerships
    'ka210-vet': {
      title: 'Small-scale VET Partnerships',
      description: 'Essential Soft Skills Training for Vocational Education',
      color: 'from-green-500 to-blue-600',
      heroColor: 'from-green-600 to-blue-700',
      badgeColor: 'bg-green-500/10 border-green-500/20 text-green-400'
    },
    'ka210-you': {
      title: 'Small-scale Youth Partnerships',
      description: 'Youth Empowerment for Social Cohesion',
      color: 'from-blue-500 to-purple-600',
      heroColor: 'from-blue-600 to-purple-700',
      badgeColor: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
    },
    'ka210-hed': {
      title: 'Small-scale Higher Education Partnerships',
      description: 'Higher Education Innovation and Collaboration',
      color: 'from-indigo-500 to-blue-600',
      heroColor: 'from-indigo-600 to-blue-700',
      badgeColor: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
    },
    'ka210-adu': {
      title: 'Small-scale Adult Education Partnerships',
      description: 'Adult Education Innovation and Digital Learning',
      color: 'from-purple-500 to-pink-600',
      heroColor: 'from-purple-600 to-pink-700',
      badgeColor: 'bg-purple-500/10 border-purple-500/20 text-purple-400'
    },
    'ka210-sch': {
      title: 'Small-scale School Partnerships',
      description: 'School Education Excellence and Innovation',
      color: 'from-orange-500 to-red-600',
      heroColor: 'from-orange-600 to-red-700',
      badgeColor: 'bg-orange-500/10 border-orange-500/20 text-orange-400'
    },
    // KA220 - Large-scale partnerships
    'ka220-vet': {
      title: 'Large-scale VET Partnerships',
      description: 'Comprehensive Vocational Education Transformation',
      color: 'from-emerald-500 to-teal-600',
      heroColor: 'from-emerald-600 to-teal-700',
      badgeColor: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
    },
    'ka220-you': {
      title: 'Large-scale Youth Partnerships',
      description: 'Comprehensive Youth Development Programs',
      color: 'from-cyan-500 to-blue-600',
      heroColor: 'from-cyan-600 to-blue-700',
      badgeColor: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
    },
    'ka220-hed': {
      title: 'Large-scale Higher Education Partnerships',
      description: 'Comprehensive Higher Education Transformation',
      color: 'from-violet-500 to-purple-600',
      heroColor: 'from-violet-600 to-purple-700',
      badgeColor: 'bg-violet-500/10 border-violet-500/20 text-violet-400'
    },
    'ka220-adu': {
      title: 'Large-scale Adult Education Partnerships',
      description: 'Comprehensive Adult Education Innovation',
      color: 'from-fuchsia-500 to-pink-600',
      heroColor: 'from-fuchsia-600 to-pink-700',
      badgeColor: 'bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400'
    },
    'ka220-sch': {
      title: 'Large-scale School Partnerships',
      description: 'Comprehensive School Education Excellence',
      color: 'from-amber-500 to-orange-600',
      heroColor: 'from-amber-600 to-orange-700',
      badgeColor: 'bg-amber-500/10 border-amber-500/20 text-amber-400'
    }
  };

  const config = categoryConfigs[projectType as keyof typeof categoryConfigs] || {
    title: `${projectType.toUpperCase()} Project`,
    description: 'Erasmus+ Partnership Project',
    color: 'from-blue-500 to-purple-600',
    heroColor: 'from-blue-600 to-purple-700',
    badgeColor: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log(`Fetching projects for type: ${projectType.toUpperCase()}`);
        // Fetch all projects and filter by type
        const response = await fetch(`${API_BASE_URL}/Ka2`);
        console.log(`Response status: ${response.status}`);
        
        if (response.ok) {
          const apiProjects = await response.json();
          console.log(`Fetched all projects:`, apiProjects);
          
          // Filter by type
          const filteredProjects = apiProjects.filter((project: Ka2Project) => 
            project.type.toUpperCase() === projectType.toUpperCase()
          );
          console.log(`Filtered projects for ${projectType}:`, filteredProjects);
          
          // Sort projects by endDate (most recent first)
          const sortedProjects = filteredProjects.sort((a: Ka2Project, b: Ka2Project) => {
            const dateA = new Date(a.endDate);
            const dateB = new Date(b.endDate);
            return dateB.getTime() - dateA.getTime(); // En yeni önce
          });
          console.log(`Sorted projects:`, sortedProjects);
          setProjects(sortedProjects);
        } else {
          const errorText = await response.text();
          console.error(`Failed to fetch ${projectType.toUpperCase()} projects:`, errorText);
        }
      } catch (error) {
        console.error(`Error fetching ${projectType.toUpperCase()} projects:`, error);
      }
      setLoading(false);
    };

    if (projectType) {
      fetchProjects();
    }
  }, [projectType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const project = projects[currentProjectIndex]; // Show current project or use static data as fallback
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className={`relative bg-gradient-to-br ${config.heroColor} py-16 overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className={`inline-flex items-center px-4 py-2 ${config.badgeColor} rounded-full mb-6`}>
              <span className="text-sm font-semibold">{projectType.toUpperCase()}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              {project?.title || config.title}
            </h1>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              {config.description}
            </p>
          </div>
        </div>
      </section>

      {/* Project Navigation */}
      {projects.length > 1 && (
        <section className="py-4 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Project {currentProjectIndex + 1} of {projects.length}
                </span>
                <div className="flex space-x-2">
                  {projects.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentProjectIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentProjectIndex
                          ? `bg-gradient-to-r ${config.color}`
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentProjectIndex(Math.max(0, currentProjectIndex - 1))}
                  disabled={currentProjectIndex === 0}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => setCurrentProjectIndex(Math.min(projects.length - 1, currentProjectIndex + 1))}
                  disabled={currentProjectIndex === projects.length - 1}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Project Overview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Project <span className={`text-transparent bg-clip-text bg-gradient-to-r ${config.color}`}>Overview</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {project?.objectives || `The ${projectType.toUpperCase()} project focuses on enhancing education through innovative approaches, international collaboration, and best practice sharing. Our mission is to improve educational outcomes and foster cross-cultural understanding.`}
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {project?.description || `By developing new methodologies, training educators, and creating accessible resources, we aim to empower learners and strengthen the education sector.`}
              </p>
              
            </div>
            
            <div className="relative">
              {/* Partners and Project Value */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className={`w-12 h-12 bg-gradient-to-br ${config.color} rounded-lg flex items-center justify-center mb-4`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Partners</h3>
                  <p className="text-gray-600">{project?.partnerCountries || 'Multiple European Countries'}</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className={`w-12 h-12 bg-gradient-to-br ${config.color} rounded-lg flex items-center justify-center mb-4`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Value</h3>
                  <p className="text-gray-600">{project?.budget || '60.000 Euro'}</p>
                </div>
              </div>

              {/* Project Details */}
              {project && (
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Project Details</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Location</span>
                      <p className="font-medium text-gray-900">{project.location || 'Multiple Locations'}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Project Activities</h3>
                <div className="space-y-4">
                  {project?.activities && project.activities.length > 0 ? (
                    project.activities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className={`w-8 h-8 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <span className="text-white font-semibold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{activity}</h4>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-start space-x-4">
                        <div className={`w-8 h-8 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <span className="text-white font-semibold text-sm">1</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Training Programs</h4>
                          <p className="text-gray-600 text-sm">Professional development and skill enhancement</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className={`w-8 h-8 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <span className="text-white font-semibold text-sm">2</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">International Exchange</h4>
                          <p className="text-gray-600 text-sm">Cross-cultural learning experiences</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className={`w-8 h-8 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <span className="text-white font-semibold text-sm">3</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Resource Development</h4>
                          <p className="text-gray-600 text-sm">Innovative learning materials and tools</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meeting & Dissemination Buttons */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-stretch">
            {/* Meeting Button */}
            <div className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-gradient-to-r ${config.color} flex-1 max-w-md`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${config.color} rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className={`px-3 py-1 bg-gradient-to-r ${config.color} rounded-full`}>
                    <span className="text-xs font-semibold text-white">Interactive</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                  Meeting
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Access meeting schedules, agendas, minutes, and collaborative sessions for project coordination and partnership activities.
                </p>
                <Link 
                  href={`/ka2-projects/${projectType}/meetings?projectId=${project?.id}`}
                  className={`w-full bg-gradient-to-r ${config.color} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center group`}
                >
                  <span>View Meetings</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Dissemination Button */}
            <div className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-gradient-to-r ${config.color} flex-1 max-w-md`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${config.color} rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <div className={`px-3 py-1 bg-gradient-to-r ${config.color} rounded-full`}>
                    <span className="text-xs font-semibold text-white">Resources</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                  Dissemination
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Explore project outputs, publications, presentations, and dissemination activities to share project results with stakeholders.
                </p>
                <Link 
                  href={`/ka2-projects/${projectType}/disseminations?projectId=${project?.id}`}
                  className={`w-full bg-gradient-to-r ${config.color} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center group`}
                >
                  <span>View Disseminations</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expected Results */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Expected <span className={`text-transparent bg-clip-text bg-gradient-to-r ${config.color}`}>Results</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our project aims to create lasting impact in education and international cooperation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Enhanced Learning</h3>
              <p className="text-gray-600">Improved educational methods and outcomes</p>
            </div>

            <div className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Digital Resources</h3>
              <p className="text-gray-600">Innovative online learning platforms</p>
            </div>

            <div className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">International Network</h3>
              <p className="text-gray-600">Strong partnerships across Europe</p>
            </div>

            <div className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Social Impact</h3>
              <p className="text-gray-600">Positive change in education sector</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 bg-gradient-to-r ${config.heroColor}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Join Our {projectType.toUpperCase()} Project?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Be part of the education innovation and international cooperation program
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {currentProject && currentProject.checkProject && (
              <a 
                href={currentProject.checkProject}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 text-center"
              >
                Check Project
              </a>
            )}
            <a 
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-200 text-center"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
