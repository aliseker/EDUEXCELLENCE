'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { API_BASE_URL } from '@/config/api';

interface Meeting {
  id: number;
  title: string;
  description: string;
  images: string[];
  ka2ProjectId: number;
  createdAt: string;
  updatedAt?: string;
}

export default function MeetingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = params.meetingId as string;
  const projectType = params.type as string;
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/Meeting/${meetingId}`);
        if (response.ok) {
          const data = await response.json();
          setMeeting(data);
          if (data.images && data.images.length > 0) {
            setSelectedImage(data.images[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching meeting:', error);
      }
      setLoading(false);
    };

    fetchMeeting();
  }, [meetingId]);

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

  if (!meeting) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Meeting Not Found</h1>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
        <Footer />
      </div>
    );
  }

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
            Back to Meetings
          </button>
          <div className="text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-sm font-semibold">
                  {new Date(meeting.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {meeting.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Photo Gallery */}
            <div className="lg:col-span-2">
              {/* Selected Image */}
              {selectedImage && (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                  <div className="relative h-[500px]">
                    <Image
                      src={selectedImage}
                      alt={meeting.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Thumbnail Gallery */}
              {meeting.images && meeting.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {meeting.images.map((image, index) => (
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
                        src={image}
                        alt={`${meeting.title} - ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* No Images Placeholder */}
              {(!meeting.images || meeting.images.length === 0) && (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <div className="text-6xl mb-4">📷</div>
                  <p className="text-gray-600">No photos available for this meeting</p>
                </div>
              )}
            </div>

            {/* Sidebar - Description */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Meeting Details</h2>
                
                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Description</h3>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {meeting.description}
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
                        {new Date(meeting.createdAt).toLocaleDateString('en-US')}
                      </div>
                    </div>
                  </div>

                  {meeting.updatedAt && (
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <div>
                        <div className="text-xs text-gray-500">Last Updated</div>
                        <div className="font-medium">
                          {new Date(meeting.updatedAt).toLocaleDateString('en-US')}
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
                        {meeting.images?.length || 0} Images
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}








