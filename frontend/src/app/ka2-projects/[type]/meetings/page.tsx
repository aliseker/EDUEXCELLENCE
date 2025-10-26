'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Meeting {
  id: number;
  title: string;
  description: string;
  images: string[];
  ka2ProjectId: number;
  createdAt: string;
  updatedAt?: string;
}

export default function MeetingsPage() {
  const params = useParams();
  const router = useRouter();
  const projectType = params.type as string;
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [currentMeetingIndex, setCurrentMeetingIndex] = useState(0);
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
    const fetchMeetings = async () => {
      if (!projectId) return;

      try {
        console.log('Fetching meetings for project:', projectId);
        const response = await fetch('https://localhost:7166/api/Meeting/project/' + projectId);
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Meetings data:', data);
          setMeetings(data);
          
          // Set first image of first meeting as selected
          if (data.length > 0 && data[0].images && data[0].images.length > 0) {
            console.log('First meeting images:', data[0].images);
            setSelectedImage(data[0].images[0]);
          }
        } else {
          console.error('Failed to fetch meetings, status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
      setLoading(false);
    };

    if (projectId) {
      fetchMeetings();
    }
  }, [projectId]);

  // Update selected image when meeting changes
  useEffect(() => {
    if (meetings[currentMeetingIndex] && meetings[currentMeetingIndex].images?.length > 0) {
      setSelectedImage(meetings[currentMeetingIndex].images[0]);
    } else {
      setSelectedImage(null);
    }
  }, [currentMeetingIndex, meetings]);

  // Auto-play slideshow
  useEffect(() => {
    const currentMeet = meetings[currentMeetingIndex];
    if (!isAutoPlay || !currentMeet || !currentMeet.images || currentMeet.images.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      const currentIndex = currentMeet.images.findIndex(img => img === selectedImage);
      const nextIndex = (currentIndex + 1) % currentMeet.images.length;
      setSelectedImage(currentMeet.images[nextIndex]);
    }, 3000); // 3 saniyede bir değişir

    return () => clearInterval(interval);
  }, [isAutoPlay, selectedImage, meetings, currentMeetingIndex]);

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

  const currentMeeting = meetings[currentMeetingIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-purple-700 py-12">
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
              Project Meetings
            </h1>
            {meetings.length > 0 && (
              <p className="text-lg text-white/90">
                Meeting {currentMeetingIndex + 1} of {meetings.length}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Meeting Navigation */}
      {meetings.length > 1 && (
        <section className="py-4 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Meeting {currentMeetingIndex + 1} of {meetings.length}
                </span>
                <div className="flex space-x-2">
                  {meetings.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentMeetingIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentMeetingIndex
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentMeetingIndex(Math.max(0, currentMeetingIndex - 1))}
                  disabled={currentMeetingIndex === 0}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => setCurrentMeetingIndex(Math.min(meetings.length - 1, currentMeetingIndex + 1))}
                  disabled={currentMeetingIndex === meetings.length - 1}
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
          {currentMeeting ? (
            <>
              {/* Header Section */}
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  {currentMeeting.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(currentMeeting.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span>{currentMeeting.images?.length || 0} Photos</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <p className="text-gray-600 text-base leading-relaxed whitespace-pre-wrap">
                  {currentMeeting.description}
                </p>
              </div>

              {/* Photo Gallery */}
              {currentMeeting.images && currentMeeting.images.length > 0 ? (
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Main Photo - Sol Taraf */}
                  <div className="flex-1">
                    {selectedImage && (
                      <img
                        src={selectedImage.startsWith('http') ? selectedImage : 'https://localhost:7166' + selectedImage}
                        alt={currentMeeting.title}
                        className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow-lg"
                      />
                    )}
                  </div>

                  {/* Photo Grid - Sağ Taraf */}
                  {currentMeeting.images.length > 1 && (
                    <div className={`${
                      currentMeeting.images.length >= 2 && currentMeeting.images.length <= 4 
                        ? 'w-full md:w-40 md:h-[500px]' 
                        : 'w-full md:w-52'
                    }`}>
                      <div className={`grid gap-2 ${
                        currentMeeting.images.length >= 2 && currentMeeting.images.length <= 4 
                          ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-1 md:h-full md:auto-rows-fr' 
                          : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-2'
                      } ${
                        currentMeeting.images.length > 8 
                          ? 'max-h-[500px] overflow-y-auto pr-2 custom-scrollbar' 
                          : ''
                      }`}>
                        {currentMeeting.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedImage(image);
                              setIsAutoPlay(false);
                            }}
                            className={`relative rounded-lg overflow-hidden transition-all ${
                              currentMeeting.images.length >= 2 && currentMeeting.images.length <= 4 
                                ? 'w-full md:h-full' 
                                : 'aspect-square'
                            } ${
                              selectedImage === image
                                ? 'ring-2 ring-blue-500 scale-95'
                                : 'ring-1 ring-gray-200 hover:ring-blue-300 hover:scale-105'
                            }`}
                          >
                            <img
                              src={image.startsWith('http') ? image : 'https://localhost:7166' + image}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-full object-cover"
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
                  <p className="text-gray-500">Photos will appear here when they are added to this meeting.</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Meetings Yet</h3>
              <p className="text-gray-600 mb-8">There are no meetings recorded for this project yet.</p>
              <button
                onClick={() => router.back()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
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

