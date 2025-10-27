'use client';

import Image from 'next/image';
import Link from 'next/link';

interface CourseCardProps {
  id: number;
  title: string;
  description: string;
  fee: string;
  duration: string;
  startDate: string | null;
  endDate: string | null;
  location: string;
  level: string;
  maxParticipants: number;
  currentParticipants: number;
  isApproved: boolean;
  learningOutcomes: string[];
  dailyProgram: string[];
  imageUrl?: string;
}

const CourseCard = ({
  id,
  title,
  description,
  fee,
  duration,
  startDate,
  endDate,
  location,
  level,
  maxParticipants,
  currentParticipants,
  isApproved,
  learningOutcomes,
  dailyProgram,
  imageUrl
}: CourseCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden border border-gray-200 flex flex-col h-full">
      {/* Course Cover Image */}
      {imageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold bg-white/20 px-2 py-1 rounded">
            KA1 Course
          </span>
          <div className="text-right">
            <div className="text-sm font-bold">{fee}</div>
            <div className="text-xs opacity-90">{duration}</div>
          </div>
        </div>
        <h3 className="text-base font-bold leading-tight mb-2">
          {title}
        </h3>
        <div className="flex items-center justify-between text-xs">
          <span>📍 {location}</span>
          <span>📅 {
            startDate && endDate 
              ? `${new Date(startDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                })} - ${new Date(endDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                })}`
              : startDate
              ? new Date(startDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                })
              : 'To be announced'
          }</span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Course Info */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center text-xs text-gray-500">
            <svg className="w-3 h-3 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Level: {level}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <svg className="w-3 h-3 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Participants: {currentParticipants}/{maxParticipants}</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          {isApproved ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Approved Course
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Pending Approval
            </span>
          )}
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex gap-2 mt-auto">
          <Link
            href={`/ka1-courses/${id}`}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

