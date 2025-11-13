'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { API_BASE_URL, BACKEND_BASE_URL } from '@/config/api';

interface Dissemination {
  id: number;
  title: string;
  description: string;
  images: string[];
  ka2ProjectId: number;
  createdAt: string;
  updatedAt?: string;
}

export default function DisseminationsPage() {
  const params = useParams();
  const router = useRouter();
  const projectType = params.type as string;
  const [disseminations, setDisseminations] = useState<Dissemination[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [currentDisseminationIndex, setCurrentDisseminationIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Get project ID from URL query or fetch from project type
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('projectId');
    if (id) {
      setProjectId(parseInt(id));
    }
  }, []);

  useEffect(() => {
    const fetchDisseminations = async () => {
      if (!projectId) return;

      try {
        console.log('Fetching disseminations for project:', projectId);
        const response = await fetch(`${API_BASE_URL}/Dissemination/project/${projectId}`, {
          cache: 'no-store'
        });
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Disseminations data:', data);
          setDisseminations(data);
          
          // Set first image of first dissemination as selected
          if (data.length > 0 && data[0].images && data[0].images.length > 0) {
            console.log('First dissemination images:', data[0].images);
            setSelectedImage(data[0].images[0]);
          }
        } else {
          console.error('Failed to fetch disseminations, status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching disseminations:', error);
      }
      setLoading(false);
    };

    if (projectId) {
      fetchDisseminations();
    }
  }, [projectId]);

  // Update selected image when dissemination changes
  useEffect(() => {
    if (disseminations[currentDisseminationIndex] && disseminations[currentDisseminationIndex].images?.length > 0) {
      setSelectedImage(disseminations[currentDisseminationIndex].images[0]);
    } else {
      setSelectedImage(null);
    }
  }, [currentDisseminationIndex, disseminations]);

  // Auto-play slideshow
  useEffect(() => {
    const currentDiss = disseminations[currentDisseminationIndex];
    if (!isAutoPlay || !currentDiss || !currentDiss.images || currentDiss.images.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      const currentIndex = currentDiss.images.findIndex(img => img === selectedImage);
      const nextIndex = (currentIndex + 1) % currentDiss.images.length;
      setSelectedImage(currentDiss.images[nextIndex]);
    }, 3000); // 3 saniyede bir değişir

    return () => clearInterval(interval);
  }, [isAutoPlay, selectedImage, disseminations, currentDisseminationIndex]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentDissemination = disseminations[currentDisseminationIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 to-teal-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="text-white flex items-center mb-6 hover:text-white/80 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Project
          </button>
          <div className="text-white text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Project Disseminations
            </h1>
            {disseminations.length > 0 && (
              <p className="text-lg text-white/90">
                Dissemination {currentDisseminationIndex + 1} of {disseminations.length}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Dissemination Navigation */}
      {disseminations.length > 1 && (
        <section className="py-4 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Dissemination {currentDisseminationIndex + 1} of {disseminations.length}
                </span>
                <div className="flex space-x-2">
                  {disseminations.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentDisseminationIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentDisseminationIndex
                          ? 'bg-gradient-to-r from-green-600 to-teal-600'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentDisseminationIndex(Math.max(0, currentDisseminationIndex - 1))}
                  disabled={currentDisseminationIndex === 0}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => setCurrentDisseminationIndex(Math.min(disseminations.length - 1, currentDisseminationIndex + 1))}
                  disabled={currentDisseminationIndex === disseminations.length - 1}
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

      {/* Main Content */}
      <section className="py-12 pb-24 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {currentDissemination ? (
            <>
              {/* Header Section */}
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  {currentDissemination.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(currentDissemination.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span>{currentDissemination.images?.length || 0} Photos</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <p className="text-gray-600 text-base leading-relaxed whitespace-pre-wrap">
                  {currentDissemination.description}
                </p>
              </div>

              {/* Photo Gallery */}
              {currentDissemination.images && currentDissemination.images.length > 0 ? (
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Main Photo - Sol Taraf */}
                  <div className="flex-1 rounded-xl overflow-hidden h-[500px] bg-gray-50 flex items-center justify-center">
                    {selectedImage && (
                      <img
                        src={selectedImage.startsWith('data:') || selectedImage.startsWith('http') 
                          ? selectedImage 
                          : `${BACKEND_BASE_URL}${selectedImage}`}
                        alt={currentDissemination.title}
                        className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-lg"
                      />
                    )}
                  </div>

                  {/* Photo Grid - Sağ Taraf */}
                  {currentDissemination.images.length > 1 && (
                    <div className={`${
                      currentDissemination.images.length >= 2 && currentDissemination.images.length <= 4 
                        ? 'w-full md:w-40 md:h-[500px]' 
                        : 'w-full md:w-52'
                    }`}>
                      <div className={`grid gap-2 ${
                        currentDissemination.images.length >= 2 && currentDissemination.images.length <= 4 
                          ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-1 md:h-full md:auto-rows-fr' 
                          : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-2'
                      } ${
                        currentDissemination.images.length > 8 
                          ? 'max-h-[500px] overflow-y-auto pr-2 custom-scrollbar' 
                          : ''
                      }`}>
                        {currentDissemination.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedImage(image);
                              setIsAutoPlay(false);
                            }}
                            className={`relative rounded-lg overflow-hidden transition-all block ${
                              currentDissemination.images.length >= 2 && currentDissemination.images.length <= 4 
                                ? 'w-full md:h-[120px] md:w-full' 
                                : 'h-[120px] w-full'
                            } ${
                              selectedImage === image
                                ? 'ring-2 ring-green-500 scale-95'
                                : 'ring-1 ring-gray-200 hover:ring-green-300 hover:scale-105'
                            }`}
                          >
                            <img
                              src={image.startsWith('data:') || image.startsWith('http') 
                                ? image 
                                : `${BACKEND_BASE_URL}${image}`}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-full object-cover object-center"
                              style={{ minWidth: '100%', minHeight: '100%' }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No photos yet</h3>
                  <p className="text-gray-500">Photos will appear here when they are added to this dissemination.</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📢</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Disseminations Yet</h3>
              <p className="text-gray-600 mb-8">There are no disseminations recorded for this project yet.</p>
              <button
                onClick={() => router.back()}
                className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-200"
              >
                Back to Project
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

