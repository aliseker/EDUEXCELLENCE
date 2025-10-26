'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';

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

interface Review {
  id: number;
  name: string;
  title: string;
  content: string;
  rating: number;
  company?: string;
  location?: string;
  createdAt: string;
  isActive: boolean;
  isApproved: boolean;
  order: number;
}

const ContactPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  // Fetch contacts from API
  const fetchContacts = async () => {
    try {
      const response = await fetch('https://localhost:7166/api/Contact/primary');
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
      const response = await fetch('https://localhost:7166/api/socialmedia/active');
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

  // Fetch reviews from API
  const fetchReviews = async () => {
    try {
      const response = await fetch('https://localhost:7166/api/Review/active');
      if (response.ok) {
        const data = await response.json();
        setReviews(data.slice(0, 3)); // En fazla 3 tane göster
      } else {
        console.error('Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchContacts(), fetchSocialMedias(), fetchReviews()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (formStatus.type) {
      setFormStatus({ type: null, message: '' });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormStatus({ type: null, message: '' });

    try {
      const response = await fetch('https://localhost:7166/api/Contact/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus({ 
          type: 'success', 
          message: 'Mesajınız başarıyla gönderildi! En kısa sürede size geri dönüş yapacağız.' 
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setFormStatus({ 
          type: 'error', 
          message: 'Mesaj gönderilemedi. Lütfen tekrar deneyin veya doğrudan iletişime geçin.' 
        });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setFormStatus({ 
        type: 'error', 
        message: 'Bir hata oluştu. Lütfen tekrar deneyin veya doğrudan email ya da telefon ile iletişime geçin.' 
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Parse contact details
  const getContactDetails = (type: string) => {
    const contact = contacts.find(c => c.type.toLowerCase() === type.toLowerCase());
    if (contact) {
      try {
        return JSON.parse(contact.details);
      } catch {
        return [contact.details];
      }
    }
    return null;
  };

  // Fallback data
  const fallbackContacts = {
    address: ['Kısla Mah. 37 Sk. Cengizhan Apt. B Girişi No: 6', 'İç Kapı No: 102 Muratpaşa, Antalya / Türkiye'],
    phone: ['+90 505 274 90 36'],
    email: ['info@edu-excellence.net']
  };

  const addressDetails = getContactDetails('address') || fallbackContacts.address;
  const phoneDetails = getContactDetails('phone') || fallbackContacts.phone;
  const emailDetails = getContactDetails('email') || fallbackContacts.email;

  // Platform icons
  const PLATFORM_ICONS: { [key: string]: string } = {
    instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
    facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    twitter: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z',
    linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    tiktok: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z'
  };

  const PLATFORM_NAMES: { [key: string]: string } = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    twitter: 'Twitter',
    linkedin: 'LinkedIn',
    youtube: 'YouTube',
    tiktok: 'TikTok'
  };

  const PLATFORM_COLORS: { [key: string]: string } = {
    instagram: 'bg-pink-600',
    facebook: 'bg-blue-600',
    twitter: 'bg-sky-500',
    linkedin: 'bg-indigo-600',
    youtube: 'bg-red-600',
    tiktok: 'bg-black'
  };

  const getPlatformIcon = (platform: string) => {
    return PLATFORM_ICONS[platform.toLowerCase()] || PLATFORM_ICONS.instagram;
  };

  const getPlatformName = (platform: string) => {
    return PLATFORM_NAMES[platform.toLowerCase()] || platform;
  };

  const getPlatformColor = (platform: string) => {
    return PLATFORM_COLORS[platform.toLowerCase()] || 'bg-gray-600';
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Address',
      details: addressDetails
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Phone',
      details: phoneDetails
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email',
      details: emailDetails
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      {/* Contact Form Hero Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Bize Ulaşın
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Erasmus+ eğitim programları hakkındaki sorularınız için bizimle iletişime geçin.
              Uzman ekibimiz size yardımcı olmaya hazır.
            </p>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Mesaj Gönderin
              </h2>

              {formStatus.type && (
                <div className={`mb-6 p-4 rounded-lg ${
                  formStatus.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  <div className="flex items-center">
                    {formStatus.type === 'success' ? (
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <p>{formStatus.message}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-400"
                    placeholder="Adınız ve soyadınız"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta Adresi *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-400"
                    placeholder="ornek@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon Numarası
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-400"
                    placeholder="+90 555 555 55 55"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Konu *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-400"
                    placeholder="Mesajınızın konusu"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mesajınız *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none text-gray-900 placeholder-gray-400"
                    placeholder="Lütfen mesajınızı detaylı bir şekilde yazın..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                    formLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
                  }`}
                >
                  {formLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Gönderiliyor...
                    </span>
                  ) : (
                    'Mesajı Gönder'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  İletişim Bilgileri
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                  <div className="col-span-full flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">İletişim bilgileri yükleniyor...</span>
                  </div>
                ) : (
                  contactInfo.map((info, index) => (
                    <div key={index} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                          {info.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                          {info.title}
                        </h3>
                        <div className="space-y-3">
                          {info.details.map((detail: string, detailIndex: number) => {
                            const isPhone = /^[\+]?[0-9\s\-\(\)]+$/.test(detail.trim());
                            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(detail.trim());
                            
                            if (isPhone) {
                              return (
                                <a 
                                  key={detailIndex} 
                                  href={'tel:' + detail.replace(/[^\d+]/g, '')}
                                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer block text-lg font-medium"
                                >
                                  {detail}
                                </a>
                              );
                            } else if (isEmail) {
                              return (
                                <a 
                                  key={detailIndex} 
                                  href={'mailto:' + detail}
                                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer block text-lg font-medium"
                                >
                                  {detail}
                                </a>
                              );
                            } else {
                              return (
                                <p key={detailIndex} className="text-gray-600 text-lg leading-relaxed">
                                  {detail}
                                </p>
                              );
                            }
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Social Media */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 4a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Sosyal Medya
                  </h3>
                  <p className="text-gray-600">
                    Güncel haberler ve duyurular için bizi takip edin
                  </p>
                </div>
                {socialMedias.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {socialMedias.map((socialMedia) => (
                      <a 
                        key={socialMedia.id}
                        href={socialMedia.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="group flex flex-col items-center p-4 bg-white hover:bg-gray-50 transition-all duration-200 border border-gray-200 rounded-xl hover:shadow-lg transform hover:-translate-y-1"
                      >
                        <div className={'w-16 h-16 ' + getPlatformColor(socialMedia.platform) + ' rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-300'}>
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d={getPlatformIcon(socialMedia.platform)} />
                          </svg>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900 text-xs">
                            {getPlatformName(socialMedia.platform)}
                          </div>
                          {socialMedia.displayName && (
                            <div className="text-xs text-gray-500 mt-1">{socialMedia.displayName}</div>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <p className="text-gray-500">Henüz sosyal medya hesabı eklenmemiş</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Başarılı Program</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">2000+</div>
                <div className="text-gray-600">Mutlu Öğrenci</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">25+</div>
                <div className="text-gray-600">Ülke</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
                <div className="text-gray-600">Memnuniyet</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Reviews Section */}
      {reviews.length > 0 && (
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Müşterilerimiz Ne Diyor?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Başarı hikayeleri ve deneyimler
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg mr-4">
                      {review.name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg">{review.name}</h4>
                      <p className="text-sm text-gray-600">{review.title}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <svg key={i} className={'w-5 h-5 ' + (i < review.rating ? 'text-yellow-400' : 'text-gray-300')} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed italic mb-6">
                    "{review.content}"
                  </p>
                  
                  <div className="flex items-center justify-end">
                    <div className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Map Section */}
      <div className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Konumumuz
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              EduExcellence Eğitim Merkezi, Antalya&apos;nın merkezinde, 
              kolay ulaşılabilir bir konumda bulunmaktadır.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3186.123456789!2d30.7123!3d36.8969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDUzJzQ4LjgiTiAzMMKwNDInNDQuMyJF!5e0!3m2!1str!2str!4v1234567890123!5m2!1str!2str&q=Kısla+Mah.+37+Sk.+Cengizhan+Apt.+B+Girişi+No:+6+Muratpaşa+Antalya"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="EduExcellence Konum - Antalya"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sıkça Sorulan Sorular
            </h2>
            <p className="text-gray-600">
              Erasmus programları hakkında en çok merak edilen sorular ve cevapları
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "KA1 kurslarına nasıl başvurabilirim?",
                answer: "KA1 kurslarımıza başvurmak için bizimle iletişime geçebilirsiniz. Kurs kataloğumuzu inceleyerek ilginizi çeken kursu belirleyip telefon (+90 505 274 90 36) veya e-posta (info@edu-excellence.net) ile bizimle iletişime geçebilirsiniz. Başvurularınızı değerlendirip en kısa sürede size dönüş yapıyoruz."
              },
              {
                question: "Hangi şehirlerde kurslar düzenleniyor?",
                answer: "Kurslarımızı Antalya, İstanbul, Paris, Dortmund, Cologne, Düsseldorf, Pamukkale, Mykonos ve Granada'da düzenliyoruz. Her şehirde farklı uzmanlık alanlarında kurslar sunuyoruz. Kurs detaylarında hangi şehirde düzenlendiği belirtilmiştir."
              },
              {
                question: "KA2 projelerinde ortaklık nasıl kurulur?",
                answer: "KA2 projelerimizde ortaklık kurmak için bizimle iletişime geçebilirsiniz. Proje yazım aşamasından rapor hazırlama sürecine kadar tüm aşamalarda size destek sağlıyoruz. ESSENTIAL KA210-VET ve Sustainable Tourism projelerimizde aktif olarak ortak arıyoruz."
              },
              {
                question: "Kurs ücretleri ve ödeme koşulları nelerdir?",
                answer: "Her kursun ücreti kurs kataloğunda belirtilmiştir. Kurs ücretleri günlük bazda hesaplanır ve kurs türüne, süresine ve lokasyona göre değişiklik gösterebilir. Ödeme koşulları hakkında detaylı bilgi için bizimle iletişime geçebilirsiniz."
              },
              {
                question: "Staj ve job shadowing hizmetleri nelerdir?",
                answer: "Staj düzenleme ve job shadowing hizmetlerimizle öğrencilerin ve profesyonellerin uluslararası deneyim kazanmalarını sağlıyoruz. Farklı sektörlerde partner kurumlarımızla işbirliği yaparak en uygun staj imkanlarını sunuyoruz."
              },
              {
                question: "Kurslarda hangi diller kullanılıyor?",
                answer: "Kurslarımız genellikle İngilizce olarak düzenlenir. CLIL (Content and Language Integrated Learning) kurslarımızda hem içerik hem de dil öğrenimi bir arada gerçekleşir. Türkçe destek de sağlanabilir."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
