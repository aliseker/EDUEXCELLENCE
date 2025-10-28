'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { API_BASE_URL } from '@/config/api';

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [ka2Categories, setKa2Categories] = useState<string[]>([]);

  // KA2 kategorilerini çek
  useEffect(() => {
    const fetchKa2Categories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/Ka2`, {
          cache: 'no-store'
        });
        if (response.ok) {
          const projects = await response.json();
          // Benzersiz kategorileri çıkar
          const uniqueCategories = [...new Set(projects.map((project: any) => project.type))];
          setKa2Categories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching KA2 categories:', error);
      }
    };

    fetchKa2Categories();
  }, []);

  // KA2 kategorileri için dropdown oluştur
  const getKa2DropdownItems = () => {
    const categoryConfigs = {
      // KA210 - Small-scale partnerships
      'KA210-VET': {
        description: 'Small-scale VET Partnerships',
        color: 'from-green-500 to-blue-600'
      },
      'KA210-YOU': {
        description: 'Small-scale Youth Partnerships',
        color: 'from-blue-500 to-purple-600'
      },
      'KA210-HED': {
        description: 'Small-scale Higher Education Partnerships',
        color: 'from-indigo-500 to-blue-600'
      },
      'KA210-ADU': {
        description: 'Small-scale Adult Education Partnerships',
        color: 'from-purple-500 to-pink-600'
      },
      'KA210-SCH': {
        description: 'Small-scale School Partnerships',
        color: 'from-orange-500 to-red-600'
      },
      // KA220 - Large-scale partnerships
      'KA220-VET': {
        description: 'Large-scale VET Partnerships',
        color: 'from-emerald-500 to-teal-600'
      },
      'KA220-YOU': {
        description: 'Large-scale Youth Partnerships',
        color: 'from-cyan-500 to-blue-600'
      },
      'KA220-HED': {
        description: 'Large-scale Higher Education Partnerships',
        color: 'from-violet-500 to-purple-600'
      },
      'KA220-ADU': {
        description: 'Large-scale Adult Education Partnerships',
        color: 'from-fuchsia-500 to-pink-600'
      },
      'KA220-SCH': {
        description: 'Large-scale School Partnerships',
        color: 'from-amber-500 to-orange-600'
      }
    };

    return ka2Categories.map(category => ({
      title: category,
      description: categoryConfigs[category as keyof typeof categoryConfigs]?.description || `${category} Project`,
      image: '/images/ka2.svg',
      href: `/ka2-projects/${category.toLowerCase()}`,
      color: categoryConfigs[category as keyof typeof categoryConfigs]?.color || 'from-blue-500 to-purple-600'
    }));
  };

  const menuItems = [
    {
      title: 'HOME',
      href: '/'
    },
    {
      title: 'ABOUT US',
      href: '/about'
    },
    {
      title: 'SERVICES',
      href: '/services',
      dropdown: [
        {
          title: 'Internship Arrangement',
          description: 'Professional internship placement services',
          image: '/images/vocational.svg',
          href: '/services/internship'
        },
        {
          title: 'Job Shadowing Services',
          description: 'Professional observation and learning programs',
          image: '/images/hero-handshake.svg',
          href: '/services/job-shadowing'
        }
      ]
    },
    {
      title: 'KA1 COURSES',
      href: '/ka1-courses',
      dropdown: [
        {
          title: 'Course Catalog',
          description: 'Discover and filter courses in calendar view',
          image: '/images/ka1.svg',
          href: '/ka1-courses',
          color: 'from-blue-500 to-purple-600'
        },
        {
          title: 'Course Locations',
          description: 'Course locations and cities',
          image: '/images/location-icon.svg',
          href: '/ka1-courses/locations',
          color: 'from-green-500 to-blue-600'
        }
      ]
    },
    {
      title: 'REVIEWS',
      href: '/reviews'
    },
    {
      title: 'KA2 PROJECTS',
      href: '/',
      dropdown: getKa2DropdownItems()
    },
    {
      title: 'NEWS',
      href: '/news'
    },
    {
      title: 'CONTACT',
      href: '/contact'
    }
  ];

  return (
    <nav className="bg-white shadow-xl sticky top-0 z-[1000] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="h-12 w-12 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-200 overflow-hidden">
                <Image
                  src="/images/logo.jpg"
                  alt="EduExcellence Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  priority
                  unoptimized
                />
              </div>
              <div className="ml-3">
                <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  EduExcellence
                </div>
                <div className="text-xs text-gray-500 -mt-1">
                  Erasmus Education Center
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <div className="ml-8 flex items-center space-x-6">
              {menuItems.map((item) => (
                <div
                  key={item.title}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.title)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={`px-2 py-3 text-sm font-semibold transition-all duration-200 relative group whitespace-nowrap ${
                      pathname === item.href
                        ? 'text-orange-500' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    {item.title}
                    {item.dropdown && (
                      <svg className="w-4 h-4 ml-1 inline-block group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    <div className={`absolute bottom-0 left-0 h-0.5 transition-all duration-200 ${
                      pathname === item.href
                        ? 'w-full bg-orange-500' 
                        : 'w-0 bg-blue-600 group-hover:w-full'
                    }`}></div>
                  </Link>
                  
                  {/* Dropdown Menu */}
                  {item.dropdown && activeDropdown === item.title && (
                    <div className="absolute left-[-20px] mt-2 w-[560px] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-gray-100 py-6 z-[9999]">
                      <div className="grid grid-cols-2 gap-4 px-6">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.title}
                            href={dropdownItem.href}
                            className="group bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-xl p-4 transition-all duration-300 border border-gray-200 hover:border-blue-300 hover:shadow-lg"
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-10 h-10 bg-gradient-to-br ${dropdownItem.color || 'from-blue-500 to-purple-600'} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-xl transition-all duration-200`}>
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-1">
                                  {dropdownItem.title}
                                </h3>
                                <p className="text-xs text-gray-600 leading-snug line-clamp-2">
                                  {dropdownItem.description}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>


          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {menuItems.map((item) => (
                <div key={item.title}>
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </Link>
                  {item.dropdown && (
                    <div className="pl-4 space-y-1">
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.title}
                          href={dropdownItem.href}
                          className="text-gray-500 hover:text-blue-600 block px-3 py-2 text-sm"
                          onClick={() => setIsOpen(false)}
                        >
                          {dropdownItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
