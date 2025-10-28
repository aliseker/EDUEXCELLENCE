'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/api';

interface Course {
  id: number;
  title: string;
  description: string;
  fee: string;
  duration: string;
  startDate: string;
  endDate: string;
  location: string;
  level: string;
  maxParticipants: number;
  currentParticipants: number;
  isApproved: boolean;
  dailyProgram: string[];
  imageUrl?: string;
}

interface Contact {
  id: number;
  title: string;
  type: string;
  details: string;
  order: number;
  isPrimary: boolean;
}

export default function CourseDetailPage() {
  const params = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Fetch course from API
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseId = params.id as string;
                const response = await fetch(`${API_BASE_URL}/Courses/${courseId}`, {
          cache: 'no-store'
        });
        
        if (response.ok) {
          const apiCourse = await response.json();
          console.log('API Course data:', apiCourse);
          console.log('ImageUrl from API:', apiCourse.imageUrl);
          // Convert API data to component format
          const convertedCourse: Course = {
            id: apiCourse.id,
            title: apiCourse.title,
            description: apiCourse.description,
            fee: apiCourse.fee,
            duration: apiCourse.duration,
            startDate: apiCourse.startDate,
            endDate: apiCourse.endDate,
            location: apiCourse.location,
            level: apiCourse.level,
            maxParticipants: apiCourse.maxParticipants,
            currentParticipants: apiCourse.currentParticipants,
            isApproved: apiCourse.isApproved,
            dailyProgram: apiCourse.dailyPrograms || [],
            imageUrl: apiCourse.imageUrl
          };
          setCourse(convertedCourse);
        } else {
          console.error('Failed to fetch course');
          setCourse(null);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        setCourse(null);
      }
      setLoading(false);
    };

    fetchCourse();
  }, [params.id]);

  // Fetch contacts from API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/Contact/primary`, {
          cache: 'no-store'
        });
        if (response.ok) {
          const data = await response.json();
          setContacts(data);
        } else {
          console.error('Failed to fetch contacts');
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  // Parse contact details
  const getContactDetails = (type: string) => {
    const contact = contacts.find(c => c.type.toLowerCase() === type.toLowerCase());
    if (contact) {
      try {
        const parsed = JSON.parse(contact.details);
        return Array.isArray(parsed) ? parsed[0] : parsed;
      } catch {
        return contact.details;
      }
    }
    return null;
  };

  // Fallback data
  const fallbackContacts = {
    phone: '+90 505 274 90 36',
    email: 'info@edu-excellence.net'
  };

  const phoneDetails = getContactDetails('phone') || fallbackContacts.phone;
  const emailDetails = getContactDetails('email') || fallbackContacts.email;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Course Not Found</h3>
            <p className="text-gray-500 mb-4">The course you are looking for is not available</p>
            <Link href="/ka1-courses" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Back to Courses
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-purple-700 py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full mb-4">
              <span className="text-orange-400 text-xs font-semibold">Erasmus+ KA1</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-3">
              {course.title}
            </h1>
            <div className="flex items-center justify-center space-x-4 text-blue-100">
              <div className="text-center">
                <div className="text-lg font-bold">{course.fee}</div>
                <div className="text-xs">PER DAY</div>
              </div>
              <div className="w-px h-8 bg-blue-300"></div>
              <div className="text-center">
                <div className="text-lg font-bold">{course.duration}</div>
                <div className="text-xs">DURATION</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Details */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/ka1-courses" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to KA1 Courses
            </Link>
          </div>

          {/* Course Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                      <p className="text-gray-700 font-medium">{course.location}</p>
            </div>

            <div className="bg-green-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Level</h3>
                      <p className="text-gray-700 font-medium">{course.level}</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Participants</h3>
                      <p className="text-gray-700 font-medium">{course.currentParticipants}/{course.maxParticipants}</p>
            </div>

            <div className="bg-orange-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Duration</h3>
                      <p className="text-gray-700 font-medium">{course.duration}</p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white mb-12">
            <h3 className="text-2xl font-bold mb-4">Interested in this Course?</h3>
            <p className="text-blue-100 mb-6">Contact us for detailed information and application</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm text-blue-200">Phone</p>
                  <a 
                    href={`tel:${phoneDetails.replace(/[^\d+]/g, '')}`}
                    className="font-semibold hover:text-blue-300 transition-colors duration-200 cursor-pointer"
                  >
                    {phoneDetails}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm text-blue-200">Email</p>
                  <a 
                    href={`mailto:${emailDetails}`}
                    className="font-semibold hover:text-blue-300 transition-colors duration-200 cursor-pointer"
                  >
                    {emailDetails}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Course Description */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Course Description</h2>
            <div className="prose prose-lg text-gray-700 leading-relaxed">
              <p className="font-medium">{course.description}</p>
            </div>
          </div>

          {/* Daily Programme */}
          {course.dailyProgram && course.dailyProgram.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Daily Programme</h2>
              <div className="space-y-4">
                {course.dailyProgram.map((day, index) => {
                  const colors = ['bg-blue-100 text-blue-800', 'bg-green-100 text-green-800', 'bg-purple-100 text-purple-800', 'bg-orange-100 text-orange-800', 'bg-red-100 text-red-800', 'bg-indigo-100 text-indigo-800', 'bg-pink-100 text-pink-800'];
                  const colorClass = colors[index % colors.length];
                  
                  return (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold mr-4 ${colorClass}`}>
                          Day {index + 1}
                        </div>
                      </div>
                      <p className="text-gray-700 font-medium">{day}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
