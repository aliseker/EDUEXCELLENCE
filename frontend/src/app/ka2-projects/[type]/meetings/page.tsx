'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

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
        const response = await fetch(`https://localhost:7166/api/Meeting/project/${projectId}`);
        if (response.ok) {
          const data = await response.json();
          setMeetings(data);
          // Set first image of first meeting as selected
          if (data.length > 0 && data[0].images && data[0].images.length > 0) {
            setSelectedImage(data[0].images[0]);
          }
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
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {currentMeeting ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Photo Gallery */}
              <div className="lg:col-span-2">
                {/* Selected Image */}
                {selectedImage ? (
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                    <div className="relative h-[500px]">
                      <Image
                        src={selectedImage.startsWith('http') ? selectedImage : `https://localhost:7166${selectedImage}`}
                        alt={currentMeeting.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center mb-6">
                    <div className="text-6xl mb-4">📷</div>
                    <p className="text-gray-600">No photos available for this meeting</p>
                  </div>
                )}

                {/* Thumbnail Gallery */}
                {currentMeeting.images && currentMeeting.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {currentMeeting.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className={`relative h-24 rounded-lg overflow-hidden border-4 transition-all ${
                          selectedImage === image
                            ? 'border-blue-600 scale-105'
                            : 'border-transparent hover:border-blue-300'
                        }`}
                      >
                        <Image
                          src={image.startsWith('http') ? image : `https://localhost:7166${image}`}
                          alt={`${currentMeeting.title} - ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar - Description */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentMeeting.title}</h2>
                  
                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Description</h3>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {currentMeeting.description}
                    </div>
                  </div>

                  {/* Meeting Info */}
                  <div className="border-t border-gray-200 pt-6 space-y-4">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <div className="text-xs text-gray-500">Created</div>
                        <div className="font-medium">
                          {new Date(currentMeeting.createdAt).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    </div>

                    {currentMeeting.updatedAt && (
                      <div className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <div>
                          <div className="text-xs text-gray-500">Last Updated</div>
                          <div className="font-medium">
                            {new Date(currentMeeting.updatedAt).toLocaleDateString('tr-TR')}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <div className="text-xs text-gray-500">Photos</div>
                        <div className="font-medium">
                          {currentMeeting.images?.length || 0} Images
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

