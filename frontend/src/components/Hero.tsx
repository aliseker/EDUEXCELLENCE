'use client';

import Link from 'next/link';
import Image from 'next/image';
import HeroAnimation from './HeroAnimation';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/config/api';

// Static fallback content for initial render (prevents LCP delay)
const FALLBACK_HERO = {
  id: 0,
  title: "Transform Your Future with Erasmus+ Education Programs",
  description: "Unlock international education opportunities and elevate your career with KA1, KA2, and KA3 programs across Europe.",
  items: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

interface HeroData {
  id: number;
  title: string;
  description?: string;
  items: Array<{
    id: number;
    text: string;
    heroId: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

const Hero = () => {
  // Start with fallback data for immediate LCP
  const [heroData, setHeroData] = useState<HeroData>(FALLBACK_HERO as HeroData);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        // Anasayfa için direkt fetch kullan - token gerektirmeyen public endpoint
        const response = await fetch(`${API_BASE_URL}/Hero/active`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setHeroData(data);
      } catch (error) {
        console.error('Error fetching hero data:', error);
        // Keep fallback data on error
      }
    };

    // Delay API call slightly to prioritize initial render
    const timer = setTimeout(fetchHeroData, 100);
    return () => clearTimeout(timer);
  }, []);

  // Parse title to separate main title and highlighted part
  const titleParts = heroData.title.split(' with ');
  const mainTitle = titleParts[0] || heroData.title;
  const highlightedTitle = titleParts[1] ? `with ${titleParts[1]}` : '';

  return (
        <section className="relative bg-blue-50 overflow-hidden min-h-[600px] lg:min-h-[700px] isolate z-0">
      {/* Background Animation - Sadece Hero içinde kalır */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <HeroAnimation />
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 -z-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 z-10">
        {/* Full Width Title Section */}
        <div className="text-center mb-6">
          <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {mainTitle}
            {highlightedTitle && (
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
                {highlightedTitle}
              </span>
            )}
          </h1>
          {heroData.description && (
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
              {heroData.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="flex flex-col gap-8 overflow-hidden min-h-[400px]">
            {/* Dynamic Items */}
            {heroData.items && heroData.items.length > 0 && (
              <div className="py-2">
                <ul className="space-y-3">
                  {heroData.items.map((item, index) => (
                    <li key={item.id} className="flex items-start">
                      <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                      <span className="text-gray-700 text-lg leading-relaxed break-words overflow-wrap-anywhere">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/ka1-courses"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Explore Courses
              </Link>
              <Link
                href="/about"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
              >
                About Us
              </Link>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="relative z-10">
              <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-2xl flex items-center justify-center p-8">
                <svg width="500" height="300" viewBox="0 0 500 300" className="w-full h-full">
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                    <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                  </defs>
                  
                  {/* Books Stack - Left */}
                  <g transform="translate(80, 120)">
                    <rect x="0" y="0" width="50" height="70" rx="6" fill="url(#grad1)" opacity="0.9"/>
                    <rect x="4" y="4" width="42" height="62" rx="4" fill="white" opacity="0.2"/>
                    <line x1="12" y1="15" x2="38" y2="15" stroke="#3B82F6" strokeWidth="2"/>
                    <line x1="12" y1="25" x2="35" y2="25" stroke="#3B82F6" strokeWidth="1.5"/>
                    <line x1="12" y1="35" x2="32" y2="35" stroke="#3B82F6" strokeWidth="1.5"/>
                    
                    <rect x="15" y="-15" width="50" height="70" rx="6" fill="url(#grad2)" opacity="0.8"/>
                    <rect x="19" y="-11" width="42" height="62" rx="4" fill="white" opacity="0.2"/>
                    <line x1="27" y1="0" x2="53" y2="0" stroke="#10B981" strokeWidth="2"/>
                    <line x1="27" y1="10" x2="50" y2="10" stroke="#10B981" strokeWidth="1.5"/>
                    <line x1="27" y1="20" x2="47" y2="20" stroke="#10B981" strokeWidth="1.5"/>
                    
                    <rect x="30" y="-30" width="50" height="70" rx="6" fill="url(#grad3)" opacity="0.7"/>
                    <rect x="34" y="-26" width="42" height="62" rx="4" fill="white" opacity="0.2"/>
                    <line x1="42" y1="-15" x2="68" y2="-15" stroke="#F59E0B" strokeWidth="2"/>
                    <line x1="42" y1="-5" x2="65" y2="-5" stroke="#F59E0B" strokeWidth="1.5"/>
                    <line x1="42" y1="5" x2="62" y2="5" stroke="#F59E0B" strokeWidth="1.5"/>
                  </g>
                  
                  {/* Diploma/Certificate - Center */}
                  <g transform="translate(200, 100)">
                    <rect x="0" y="0" width="120" height="90" rx="8" fill="white" stroke="url(#grad1)" strokeWidth="3"/>
                    <rect x="10" y="10" width="100" height="70" rx="4" fill="url(#grad1)" opacity="0.1"/>
                    
                    {/* Diploma Content */}
                    <circle cx="60" cy="25" r="8" fill="url(#grad1)" opacity="0.8"/>
                    <text x="60" y="30" textAnchor="middle" fill="white" fontSize="12" fontFamily="Arial, sans-serif" fontWeight="bold">EU</text>
                    
                    <text x="60" y="50" textAnchor="middle" fill="#1F2937" fontSize="14" fontFamily="Arial, sans-serif" fontWeight="bold">CERTIFICATE</text>
                    <text x="60" y="65" textAnchor="middle" fill="#6B7280" fontSize="10" fontFamily="Arial, sans-serif">Erasmus+</text>
                    <text x="60" y="75" textAnchor="middle" fill="#6B7280" fontSize="10" fontFamily="Arial, sans-serif">Approved</text>
                  </g>
                  
                  {/* Globe/World - Right */}
                  <g transform="translate(350, 120)">
                    <circle cx="0" cy="0" r="35" fill="none" stroke="url(#grad1)" strokeWidth="3" opacity="0.8"/>
                    <circle cx="0" cy="0" r="30" fill="none" stroke="url(#grad2)" strokeWidth="2" opacity="0.6"/>
                    <circle cx="0" cy="0" r="25" fill="none" stroke="url(#grad3)" strokeWidth="1" opacity="0.4"/>
                    
                    {/* Continents */}
                    <ellipse cx="-8" cy="-3" rx="6" ry="10" fill="url(#grad1)" opacity="0.3"/>
                    <ellipse cx="12" cy="2" rx="5" ry="8" fill="url(#grad2)" opacity="0.3"/>
                    <ellipse cx="2" cy="12" rx="8" ry="6" fill="url(#grad3)" opacity="0.3"/>
                    
                    {/* Connection Lines */}
                    <line x1="-25" y1="0" x2="-35" y2="0" stroke="url(#grad1)" strokeWidth="2" opacity="0.6"/>
                    <line x1="25" y1="0" x2="35" y2="0" stroke="url(#grad1)" strokeWidth="2" opacity="0.6"/>
                    <line x1="0" y1="-25" x2="0" y2="-35" stroke="url(#grad1)" strokeWidth="2" opacity="0.6"/>
                    <line x1="0" y1="25" x2="0" y2="35" stroke="url(#grad1)" strokeWidth="2" opacity="0.6"/>
                  </g>
                  
                  {/* Floating Elements */}
                  <g opacity="0.7">
                    {/* Stars */}
                    <g transform="translate(120, 60)">
                      <polygon points="0,-6 2,-2 6,0 2,2 0,6 -2,2 -6,0 -2,-2" fill="#F59E0B"/>
                    </g>
                    <g transform="translate(380, 80)">
                      <polygon points="0,-5 1.5,-1.5 5,0 1.5,1.5 0,5 -1.5,1.5 -5,0 -1.5,-1.5" fill="#10B981"/>
                    </g>
                    <g transform="translate(150, 200)">
                      <polygon points="0,-4 1,-1 4,0 1,1 0,4 -1,1 -4,0 -1,-1" fill="#8B5CF6"/>
                    </g>
                    
                    {/* Light Bulb */}
                    <g transform="translate(300, 200)">
                      <circle cx="0" cy="0" r="10" fill="#F59E0B" opacity="0.8"/>
                      <rect x="-1.5" y="10" width="3" height="6" fill="#1F2937"/>
                      <rect x="-3" y="16" width="6" height="2" fill="#1F2937"/>
                    </g>
                    
                    {/* Graduation Cap */}
                    <g transform="translate(100, 200)">
                      <rect x="-12" y="0" width="24" height="6" fill="#1F2937"/>
                      <rect x="-16" y="-4" width="32" height="4" fill="#1F2937"/>
                      <circle cx="0" cy="-2" r="1.5" fill="#F59E0B"/>
                    </g>
                  </g>
                  
                  {/* Connection Lines Between Elements */}
                  <g opacity="0.4">
                    <path d="M 130 155 Q 165 140 200 145" stroke="url(#grad1)" strokeWidth="2" fill="none" strokeDasharray="5,5"/>
                    <path d="M 320 155 Q 285 140 250 145" stroke="url(#grad2)" strokeWidth="2" fill="none" strokeDasharray="5,5"/>
                  </g>
                </svg>
              </div>
              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Certified Education</div>
                    <div className="text-xs text-gray-500">EU Approved</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">25+ Countries</div>
                    <div className="text-xs text-gray-500">Across Europe</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl scale-105 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
