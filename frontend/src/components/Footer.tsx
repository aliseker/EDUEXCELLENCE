'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { API_BASE_URL } from '@/config/api';

interface Contact {
  id: number;
  title: string;
  type: string;
  details: string;
  order: number;
  isPrimary: boolean;
}

interface SocialMedia {
  id: number;
  platform: string;
  url: string;
  displayName?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const Footer = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);
  
  // DOMPurify only works in browser
  const DOMPurify = useMemo(() => {
    if (typeof window !== 'undefined') {
      return require('dompurify');
    }
    return null;
  }, []);

  // Fetch contacts from API
  const fetchContacts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Contact/primary`);
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

  // Fetch social media from API
  const fetchSocialMedias = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/socialmedia/active`);
      if (response.ok) {
        const data = await response.json();
        setSocialMedias(data);
      } else {
        console.error('Failed to fetch social medias');
      }
    } catch (error) {
      console.error('Error fetching social medias:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchContacts(), fetchSocialMedias()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Parse contact details
  const getContactDetails = (type: string) => {
    const contact = contacts.find(c => c.type.toLowerCase() === type.toLowerCase());
    if (contact) {
      try {
        const parsed = JSON.parse(contact.details);
        return Array.isArray(parsed) ? parsed.join('<br />') : parsed;
      } catch {
        return contact.details;
      }
    }
    return null;
  };

  // Fallback data
  const fallbackContacts = {
    address: "Kısla Mah. 37 Sk. Cengizhan Apt. B Girişi No: 6<br />İç Kapı No: 102 Muratpaşa, Antalya / Türkiye",
    phone: "+90 505 274 90 36",
    email: "info@edu-excellence.net"
  };

  const addressDetails = getContactDetails('address') || fallbackContacts.address;
  const phoneDetails = getContactDetails('phone') || fallbackContacts.phone;
  const emailDetails = getContactDetails('email') || fallbackContacts.email;

  // Platform icons and colors
  const PLATFORM_ICONS: { [key: string]: string } = {
    instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
    facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    twitter: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z',
    linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    tiktok: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z'
  };

  const PLATFORM_COLORS: { [key: string]: string } = {
    instagram: 'bg-pink-500 hover:bg-pink-600',
    facebook: 'bg-blue-600 hover:bg-blue-700',
    twitter: 'bg-sky-500 hover:bg-sky-600',
    linkedin: 'bg-indigo-600 hover:bg-indigo-700',
    youtube: 'bg-red-600 hover:bg-red-700',
    tiktok: 'bg-black hover:bg-gray-800'
  };

  const getPlatformIcon = (platform: string) => {
    return PLATFORM_ICONS[platform.toLowerCase()] || PLATFORM_ICONS.instagram;
  };

  const getPlatformColor = (platform: string) => {
    return PLATFORM_COLORS[platform.toLowerCase()] || 'bg-gray-600 hover:bg-gray-700';
  };
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-white rounded-lg overflow-hidden flex items-center justify-center">
                <Image
                  src="/images/logo.jpg"
                  alt="EduExcellence Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
              <span className="ml-3 text-xl font-bold">EduExcellence</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Take your career to the next level with international education opportunities. 
              Discover the world with Erasmus programs and language courses.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ka1-courses" className="text-gray-300 hover:text-white transition-colors duration-200">
                  KA1 Courses
                </Link>
              </li>
              <li>
                <Link href="/ka2-projects/ka210-vet" className="text-gray-300 hover:text-white transition-colors duration-200">
                  KA2 Projects
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-300 hover:text-white transition-colors duration-200">
                  News & Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Course Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Course Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ka1-courses" className="text-gray-300 hover:text-white transition-colors duration-200">
                  KA1 Courses
                </Link>
              </li>
              <li>
                <Link href="/ka1-courses/locations" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Course Locations
                </Link>
              </li>
              <li>
                <Link href="/ka2-projects/ka210-vet" className="text-gray-300 hover:text-white transition-colors duration-200">
                  KA2 Projects
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/services/internship" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Internship Programs
                </Link>
              </li>
              <li>
                <Link href="/services/job-shadowing" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Job Shadowing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-gray-300 text-sm" dangerouslySetInnerHTML={{ 
                    __html: DOMPurify ? DOMPurify.sanitize(addressDetails, {
                      ALLOWED_TAGS: ['br', 'strong', 'em', 'span'],
                      ALLOWED_ATTR: []
                    }) : addressDetails
                  }} />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a 
                  href={'tel:' + phoneDetails.replace(/[^\d+]/g, '')}
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-200 cursor-pointer"
                >
                  {phoneDetails}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a 
                  href={'mailto:' + emailDetails}
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-200 cursor-pointer"
                >
                  {emailDetails}
                </a>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex space-x-4">
              {socialMedias.map((socialMedia) => (
                <a 
                  key={socialMedia.id}
                  href={socialMedia.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                  className={'w-10 h-10 ' + getPlatformColor(socialMedia.platform) + ' rounded-lg flex items-center justify-center transition-colors duration-200'}
                  title={socialMedia.displayName || socialMedia.platform}
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d={getPlatformIcon(socialMedia.platform)} />
                      </svg>
                    </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 EduExcellence. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Terms of Use
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

