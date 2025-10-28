'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/config/api';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  fullContent: string;
  publishedAt: string;
  type: 'news' | 'event' | 'blog' | 'announcement';
  images: string[];
  author: string;
  category: string;
  isFeatured: boolean;
  readTime: number;
  imageUrl?: string;
}

export default function NewsDetailPage() {
  const params = useParams();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  // DOMPurify only works in browser
  const DOMPurify = useMemo(() => {
    if (typeof window !== 'undefined') {
      return require('dompurify');
    }
    return null;
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedImageIndex !== null && newsItem) {
        if (event.key === 'Escape') {
          setSelectedImageIndex(null);
        } else if (event.key === 'ArrowLeft') {
          setSelectedImageIndex(
            selectedImageIndex > 0 ? selectedImageIndex - 1 : newsItem.images.length - 1
          );
        } else if (event.key === 'ArrowRight') {
          setSelectedImageIndex(
            selectedImageIndex < newsItem.images.length - 1 ? selectedImageIndex + 1 : 0
          );
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, newsItem]);

  // Paylaşım fonksiyonları
  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(newsItem?.title || '');
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(newsItem?.title || '');
    const summary = encodeURIComponent(newsItem?.fullContent?.replace(/<[^>]*>/g, '').substring(0, 200) || '');
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link kopyalandı!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Link kopyalandı!');
    }
  };

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        const newsId = params.id as string;
        const response = await fetch(`${API_BASE_URL}/Blogs/${newsId}`, {
          cache: 'no-store'
        });
        
        if (response.ok) {
          const data = await response.json();
          setNewsItem(data);
        } else {
          console.error('Failed to fetch news item');
          setNewsItem(null);
        }
      } catch (error) {
        console.error('Error fetching news item:', error);
        setNewsItem(null);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchNewsItem();
    }
  }, [params.id]);

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

  if (!newsItem) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">News Not Found</h3>
            <p className="text-gray-500 mb-4">The news you are looking for is not available</p>
            <Link href="/news" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Back to News
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
              <span className="text-orange-400 text-xs font-semibold">{newsItem.category}</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              {newsItem.title}
            </h1>
          </div>
        </div>
      </section>

      {/* News Content */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/news" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to News
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 max-w-full overflow-hidden">
              {/* Featured Image */}
              {(newsItem.imageUrl || (newsItem.images && newsItem.images.length > 0)) && (
                <div className="mb-8">
                  <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={newsItem.imageUrl || newsItem.images[0]}
                      alt={newsItem.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                </div>
              )}

              {/* News Content */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(newsItem.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {newsItem.type === 'news' ? 'Haber' : 
                     newsItem.type === 'event' ? 'Etkinlik' :
                     newsItem.type === 'blog' ? 'Blog' : 'Duyuru'}
                  </div>
                </div>
                <div 
                  className="prose prose-xl text-gray-700 leading-relaxed max-w-full break-words overflow-hidden"
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify ? DOMPurify.sanitize(newsItem.fullContent, {
                      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre', 'span', 'div'],
                      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'style']
                    }) : newsItem.fullContent
                  }}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Share Section */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Bu Haberi Paylaş</h3>
                <p className="text-gray-600 mb-6 text-sm">Haberimizi sosyal medyada paylaşarak daha fazla kişiye ulaşmasını sağlayın</p>
                <div className="space-y-3">
                  <button 
                    onClick={shareOnTwitter}
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                    Twitter'da Paylaş
                  </button>
                  <button 
                    onClick={shareOnLinkedIn}
                    className="w-full bg-blue-800 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn'de Paylaş
                  </button>
                  <button 
                    onClick={shareOnFacebook}
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook'ta Paylaş
                  </button>
                  <button 
                    onClick={copyToClipboard}
                    className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Linki Kopyala
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Photo Gallery - Full Width */}
          {newsItem.images && newsItem.images.length > 0 && (
            <div className="mt-16">
              <div className="text-center mb-12">
                <h3 className="text-4xl font-bold text-gray-900 mb-4">Fotoğraf Galerisi</h3>
                <p className="text-lg text-gray-600">Haberimizden kareler</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {newsItem.images.map((image, index) => (
                  <div 
                    key={index} 
                    className="group relative h-64 lg:h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      src={image}
                      alt={`${newsItem.title} - Image ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImageIndex !== null && newsItem && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-4 right-4 z-[60] bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation Buttons */}
            {newsItem.images.length > 1 && (
              <>
                {/* Previous Button */}
                <button
                  onClick={() => setSelectedImageIndex(
                    selectedImageIndex > 0 ? selectedImageIndex - 1 : newsItem.images.length - 1
                  )}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-[60] bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-4 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Next Button */}
                <button
                  onClick={() => setSelectedImageIndex(
                    selectedImageIndex < newsItem.images.length - 1 ? selectedImageIndex + 1 : 0
                  )}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-[60] bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-4 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Main Image */}
            <div className="relative">
              <Image
                src={newsItem.images[selectedImageIndex]}
                alt={`${newsItem.title} - Image ${selectedImageIndex + 1}`}
                width={1200}
                height={800}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            </div>

            {/* Image Counter */}
            {newsItem.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[60] bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm font-medium">
                {selectedImageIndex + 1} / {newsItem.images.length}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
