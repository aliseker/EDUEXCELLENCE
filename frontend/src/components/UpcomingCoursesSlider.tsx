'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Course {
  id: number;
  title: string;
  fee: string;
  duration: string;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  level: string;
  maxParticipants: number;
  currentParticipants: number;
  isApproved: boolean;
  description: string;
  learningOutcomes: string[];
  dailyProgram: string[];
}

const UpcomingCoursesSlider = () => {
  const [sliderIndex, setSliderIndex] = useState(0);

  // Sample courses data
  const courses: Course[] = [
    {
      id: 1,
      title: "CONTENT AND LANGUAGE INTEGRATED LEARNING – CLIL",
      fee: "80 EURO PER DAY",
      duration: "5 DAYS",
      startDate: "2025-01-15",
      endDate: "2025-01-19",
      location: "İstanbul",
      category: "Language Teaching",
      level: "Intermediate",
      maxParticipants: 20,
      currentParticipants: 15,
      isApproved: true,
      description: "It is called Content and Language Integrated Learning (CLIL) when a subject is taught in English to learners with a distinct primary language (such as math, science, or geography). The content of the class and an aspect of the English language are the two main points of concentration for each lesson. EMI (English as the Medium of Instruction) is a close cousin of this course, which focuses primarily on teaching the subject matter, and both techniques benefit from this course.",
      learningOutcomes: [
        "Learn how to incorporate the four abilities of English or any other foreign language into the classroom and school curriculum",
        "Create learning activities that are both fun and effective in achieving language and subject goals",
        "It is important to create an engaging classroom environment where learning is pleasant and focused on relevant information",
        "Learn how to effectively use English in the classroom so that students can work together and communicate with one another",
        "New concepts for raising student interest and motivation in the acquisition of languages by employing interesting and 'genuine' materials from the real world can be implemented in the classroom"
      ],
      dailyProgram: [
        "Day 1: Soft and hard CLIL definitions and models, Aims of CLIL: a dual focus on content and language, What is the role of a CLIL teacher in education?, Theory: CLIL is based on four C's and three D'S, How does CLIL work in practice?",
        "Day 2: Specifying educational goals, From the beginning to the end of the process, Knowing what a student's academic language needs are, Constructing a framework for content and constructing a framework for language",
        "Day 3: Choosing CLIL resources, In the context of the CLIL classroom, adapting materials, Developing CLIL resources, Recognizing and addressing cognitive and language difficulties",
        "Day 4: What are we testing? Is it content, skills, or language?, What makes a good test question, in terms of summative assessment?, Tips and approaches for doing formative assessments, The design was done the wrong way around",
        "Day 5: The evaluation of the course includes a review of the skills and knowledge students have gained, as well as comments from the instructor and class discussion, The giving of the Certificate of Attendance upon course completion, Adventures and other cultural activities"
      ]
    },
    {
      id: 2,
      title: "DIGITAL TEACHING AND LEARNING",
      fee: "90 EURO PER DAY",
      duration: "7 DAYS",
      startDate: "2025-02-10",
      endDate: "2025-02-16",
      location: "Porto",
      category: "Digital Education",
      level: "Beginner",
      maxParticipants: 18,
      currentParticipants: 12,
      isApproved: true,
      description: "Comprehensive course on digital teaching methodologies and online learning platforms. Learn how to effectively integrate technology into your teaching practice.",
      learningOutcomes: [
        "Master digital teaching tools and platforms",
        "Create engaging online learning experiences",
        "Understand digital pedagogy principles",
        "Implement effective online assessment strategies",
        "Build digital literacy skills for educators"
      ],
      dailyProgram: [
        "Day 1: Introduction to digital education and current trends",
        "Day 2: Learning Management Systems (LMS) overview",
        "Day 3: Interactive content creation tools",
        "Day 4: Digital assessment and feedback methods",
        "Day 5: Online collaboration and communication tools",
        "Day 6: Mobile learning and apps for education",
        "Day 7: Course evaluation and certificate presentation"
      ]
    },
    {
      id: 3,
      title: "STEM EDUCATION METHODOLOGY",
      fee: "85 EURO PER DAY",
      duration: "6 DAYS",
      startDate: "2025-01-20",
      endDate: "2025-01-25",
      location: "Amsterdam",
      category: "STEM Education",
      level: "Advanced",
      maxParticipants: 15,
      currentParticipants: 8,
      isApproved: true,
      description: "Comprehensive course on Science, Technology, Engineering, and Mathematics (STEM) education methodologies. Learn how to integrate STEM concepts across different subjects and create engaging learning experiences.",
      learningOutcomes: [
        "Understand STEM education principles and methodologies",
        "Design integrated STEM lesson plans",
        "Use technology to enhance STEM learning",
        "Create hands-on STEM activities",
        "Assess STEM learning outcomes effectively"
      ],
      dailyProgram: [
        "Day 1: Introduction to STEM education principles",
        "Day 2: Science integration in curriculum",
        "Day 3: Technology tools for STEM learning",
        "Day 4: Engineering design process in education",
        "Day 5: Mathematics in STEM contexts",
        "Day 6: Assessment and evaluation in STEM"
      ]
    },
    {
      id: 4,
      title: "INCLUSIVE EDUCATION PRACTICES",
      fee: "75 EURO PER DAY",
      duration: "5 DAYS",
      startDate: "2025-01-15",
      endDate: "2025-01-19",
      location: "Antalya",
      category: "Special Education",
      level: "Intermediate",
      maxParticipants: 25,
      currentParticipants: 20,
      isApproved: true,
      description: "Learn about inclusive education practices and how to create learning environments that accommodate all students regardless of their abilities, backgrounds, or learning styles.",
      learningOutcomes: [
        "Understand principles of inclusive education",
        "Design accessible learning materials",
        "Implement differentiated instruction strategies",
        "Create supportive classroom environments",
        "Collaborate with support staff and families"
      ],
      dailyProgram: [
        "Day 1: Understanding inclusive education principles",
        "Day 2: Universal Design for Learning (UDL)",
        "Day 3: Differentiated instruction strategies",
        "Day 4: Assistive technologies and tools",
        "Day 5: Building inclusive school communities"
      ]
    },
    {
      id: 5,
      title: "PROJECT-BASED LEARNING",
      fee: "80 EURO PER DAY",
      duration: "5 DAYS",
      startDate: "2025-01-25",
      endDate: "2025-01-29",
      location: "Berlin",
      category: "Teaching Methods",
      level: "Intermediate",
      maxParticipants: 22,
      currentParticipants: 18,
      isApproved: true,
      description: "Explore project-based learning methodologies and learn how to design and implement effective PBL experiences that engage students and promote deep learning.",
      learningOutcomes: [
        "Design effective project-based learning experiences",
        "Facilitate student collaboration and teamwork",
        "Assess project outcomes and student learning",
        "Integrate technology in PBL activities",
        "Manage project timelines and resources"
      ],
      dailyProgram: [
        "Day 1: Introduction to Project-Based Learning",
        "Day 2: Designing PBL experiences",
        "Day 3: Facilitating student collaboration",
        "Day 4: Assessment in PBL contexts",
        "Day 5: Technology integration in projects"
      ]
    },
    {
      id: 6,
      title: "ENVIRONMENTAL EDUCATION",
      fee: "70 EURO PER DAY",
      duration: "4 DAYS",
      startDate: "2025-03-10",
      endDate: "2025-03-13",
      location: "Granada",
      category: "Environmental Studies",
      level: "Beginner",
      maxParticipants: 20,
      currentParticipants: 14,
      isApproved: true,
      description: "Learn about environmental education principles and how to integrate sustainability concepts into various subjects. This course focuses on practical approaches to teaching environmental awareness.",
      learningOutcomes: [
        "Understand environmental education principles",
        "Integrate sustainability into curriculum",
        "Design outdoor learning experiences",
        "Promote environmental awareness in students",
        "Use local resources for environmental education"
      ],
      dailyProgram: [
        "Day 1: Environmental education foundations",
        "Day 2: Sustainability in curriculum design",
        "Day 3: Outdoor and experiential learning",
        "Day 4: Community engagement and action projects"
      ]
    }
  ];

  // Get upcoming courses (all approved courses for demo)
  const upcomingCourses = courses.filter(course => course.isApproved);

  // Auto-slider effect
  useEffect(() => {
    if (upcomingCourses.length <= 3) return; // Don't auto-slide if 3 or fewer courses
    
    const interval = setInterval(() => {
      setSliderIndex((prevIndex) => 
        prevIndex >= upcomingCourses.length - 3 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [upcomingCourses.length]);

  return (
    <section className="py-8 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            🗓️ Yaklaşan Kurslar
          </h2>
          <p className="text-gray-600 text-base">
            Önümüzdeki 3 ay içinde başlayacak {upcomingCourses.length} kurs
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          <div className="flex justify-center overflow-hidden pb-4">
            <div className="flex space-x-6">
              {upcomingCourses.slice(sliderIndex, sliderIndex + 3).map((course, index) => {
                const courseDate = new Date(course.startDate);
                const today = new Date();
                const daysUntil = Math.ceil((courseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={course.id} className="flex-shrink-0 w-80 h-64">
                    <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-xl p-4 border border-red-300/30 hover:from-red-500 hover:to-red-600 transition-all duration-300 group shadow-lg h-full flex flex-col">
                      {/* Date Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="bg-white/20 rounded-full px-3 py-1">
                          <div className="text-white font-bold text-xs">
                            {courseDate.toLocaleDateString('tr-TR', { 
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            })}
                          </div>
                          <div className="text-red-100 text-xs">
                            {daysUntil === 0 ? 'Bugün' : `${daysUntil} gün kaldı`}
                          </div>
                        </div>
                        <div className="bg-green-500 rounded-full px-3 py-1 shadow-md">
                          <span className="text-white text-xs font-semibold flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Onaylı
                          </span>
                        </div>
                      </div>

                      {/* Course Info */}
                      <div className="mb-3 flex-1">
                        <h3 className="text-white font-bold text-sm mb-2 line-clamp-2 group-hover:text-red-100 transition-colors">
                          {course.title}
                        </h3>
                        <div className="flex items-center text-red-100 text-xs mb-1">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {course.location}
                        </div>
                        <div className="flex items-center justify-between text-red-100 text-xs">
                          <span>⏱️ {course.duration}</span>
                          <span>💰 {course.fee}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link
                        href={`/ka1-courses/${course.id}`}
                        className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 border border-white/30 hover:border-white/50 text-xs text-center block"
                      >
                        Detayları Gör
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          {upcomingCourses.length > 3 && (
            <>
              <button
                onClick={() => setSliderIndex(Math.max(0, sliderIndex - 1))}
                disabled={sliderIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 z-10 w-10 h-10 flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={() => setSliderIndex(Math.min(upcomingCourses.length - 3, sliderIndex + 1))}
                disabled={sliderIndex >= upcomingCourses.length - 3}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 z-10 w-10 h-10 flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          {/* Scroll Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: Math.max(1, upcomingCourses.length - 2) }, (_, index) => (
              <button
                key={index}
                onClick={() => setSliderIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === sliderIndex ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingCoursesSlider;



