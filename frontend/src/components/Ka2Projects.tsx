'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/api';

interface Ka2Project {
  id: number;
  title: string;
  description: string;
  type: string;
  duration: string;
  location: string;
  coordinator: string;
  partnerCountries: string;
  objectives: string;
  activities: string[];
  results: string[];
  targetGroup: string;
  budget: string;
  startDate: string;
  endDate: string;
  checkProject?: string;
  isActive: boolean;
  imageUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

const Ka2Projects = () => {
  const [projects, setProjects] = useState<Ka2Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/Ka2/active`);
        if (response.ok) {
          const apiProjects = await response.json();
          setProjects(apiProjects);
        } else {
          console.error('Failed to fetch KA2 projects');
        }
      } catch (error) {
        console.error('Error fetching KA2 projects:', error);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            KA2 Strategic Partnership Projects
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our active strategic partnership projects that bring together organizations from across Europe to innovate and share best practices.
          </p>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white text-4xl">🤝</div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {project.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      {project.duration}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-2">📍</span>
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-2">👥</span>
                      <span>{project.partnerCountries}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-2">🎯</span>
                      <span>{project.targetGroup}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-2">💰</span>
                      <span>{project.budget}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      📅 {new Date(project.startDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })} - {new Date(project.endDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </div>
                    <Link 
                      href={`/ka2-projects/${project.type.toLowerCase()}`}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Active Projects</h3>
            <p className="text-gray-600">No active KA2 projects available at the moment.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link 
            href="/ka2-projects"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            View All KA2 Projects
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Ka2Projects;

