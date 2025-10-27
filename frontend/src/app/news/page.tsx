'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface BlogItem {
  id: number;
  title: string;
  excerpt: string;
  fullContent: string;
  category: string;
  type: string;
  author: string;
  imageUrl?: string;
  readTime: number;
  isFeatured: boolean;
  publishedAt: string;
  createdAt: string;
  images: string[];
}

const NewsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [allContent, setAllContent] = useState<BlogItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('https://localhost:7166/api/Blogs');
        if (response.ok) {
          const apiBlogs = await response.json();
          console.log('API Response:', apiBlogs); // Debug için
          
          // Tarihe göre en yeniden en eskiye sırala (en son yüklenen en başta)
          apiBlogs.sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt || a.publishedAt).getTime();
            const dateB = new Date(b.createdAt || b.publishedAt).getTime();
            return dateB - dateA; // En yeni önce
          });
          
          setAllContent(apiBlogs);
          setFilteredContent(apiBlogs);
        } else {
          console.error('Failed to fetch blogs');
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    let filtered;
    if (tab === 'all') {
      filtered = allContent;
    } else {
      filtered = allContent.filter(item => item.type === tab);
    }
    
    // Filtrelenmiş içeriği de tarihe göre sırala
    filtered.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt || a.publishedAt).getTime();
      const dateB = new Date(b.createdAt || b.publishedAt).getTime();
      return dateB - dateA; // En yeni önce
    });
    
    setFilteredContent(filtered);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'news': return 'bg-blue-100 text-blue-800';
      case 'event': return 'bg-purple-100 text-purple-800';
      case 'blog': return 'bg-green-100 text-green-800';
      case 'announcement': return 'bg-orange-100 text-orange-800';
      case 'success': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Updates</h1>
          <p className="text-xl md:text-2xl mb-8">Stay updated with the latest news, events, and announcements</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8">
          {[
            { key: 'all', label: 'All' },
            { key: 'news', label: 'News' },
            { key: 'event', label: 'Events' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-6 py-3 mx-2 mb-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        {filteredContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <Link key={item.id} href={`/news/${item.id}`}>
                <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group">
                  {/* Cover Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {item.imageUrl && item.imageUrl.trim() !== '' && item.imageUrl !== 'null' ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={400}
                        height={192}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          console.log('Image load error for:', item.title, 'URL:', item.imageUrl);
                          e.currentTarget.style.display = 'none';
                          // Fallback göster
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback Image */}
                    <div className={`w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${item.imageUrl && item.imageUrl.trim() !== '' && item.imageUrl !== 'null' ? 'hidden' : ''}`}>
                      <div className="text-gray-400 text-4xl">
                        {item.type === 'news' ? '📰' : item.type === 'event' ? '🎉' : '📝'}
                      </div>
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(item.type)}`}>
                        {item.type === 'news' ? 'Haber' : item.type === 'event' ? 'Etkinlik' : 'Blog'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {item.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>
                          {new Date(item.createdAt || item.publishedAt).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span>{item.author}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Content Found</h3>
            <p className="text-gray-600">No content available for the selected category.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default NewsPage;
