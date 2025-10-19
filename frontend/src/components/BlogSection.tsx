'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface BlogItem {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readTime: number;
  category: string;
  imageUrl?: string;
  type: string;
}

const BlogSection = () => {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);

  // API'den blog verilerini çek
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('https://localhost:7166/api/Blogs');
        if (response.ok) {
          const data = await response.json();
          // Eğer featured blog yoksa, tüm blog'ları al
          let featuredBlogs = data.filter((blog: any) => blog.isFeatured);
          if (featuredBlogs.length === 0) {
            featuredBlogs = data.slice(0, 4); // İlk 4 blog'u al
          } else {
            featuredBlogs = featuredBlogs.slice(0, 4); // İlk 4 featured blog'u al
          }
          setBlogs(featuredBlogs);
        } else {
          console.error('Failed to fetch blogs');
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);



  // Ana blog kartı render fonksiyonu
  const renderMainBlogCard = (blog: any, index: number) => {
    return (
      <article className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 group hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col lg:flex-row">
          {/* Blog Görseli - YATAY */}
          <div className="relative lg:w-1/2">
            {blog.imageUrl && (blog.imageUrl.startsWith('http') || blog.imageUrl.startsWith('/') || blog.imageUrl.startsWith('data:')) ? (
              <Image
                src={blog.imageUrl}
                alt={blog.title}
                width={600}
                height={400}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-[300px] bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <div className="text-white text-6xl">📰</div>
              </div>
            )}
          </div>
          
          {/* İçerik */}
          <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col justify-center max-w-full">
            {/* Kategori ve Tarih */}
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                {blog.type === 'news' ? 'News' : 
                 blog.type === 'event' ? 'Event' :
                 blog.type === 'blog' ? 'Blog' : 'Announcement'}
              </span>
              <div className="flex items-center text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">
                  {new Date(blog.publishedAt).toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
            
            <h3 className="text-2xl lg:text-3xl font-black text-gray-800 mb-4 leading-tight group-hover:text-blue-600 transition-colors overflow-hidden" style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical'
            }}>
              {blog.title}
            </h3>
            <p className="text-gray-500 text-sm lg:text-base mb-6 font-light leading-relaxed min-h-[5rem]">
              {blog.excerpt}
            </p>
            
            <div className="flex justify-end">
              <Link 
                href={`/news/${blog.id}`}
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Read Article
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  };

  // Küçük blog kartı render fonksiyonu
  const renderSmallBlogCard = (blog: any, index: number) => {
    return (
      <article className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-200 cursor-pointer">
        <Link href={`/news/${blog.id}`} className="block">
          {/* Blog Görseli - ÜSTTE */}
          <div className="relative h-[200px] overflow-hidden">
            {blog.imageUrl && (blog.imageUrl.startsWith('http') || blog.imageUrl.startsWith('/') || blog.imageUrl.startsWith('data:')) ? (
              <Image
                src={blog.imageUrl}
                alt={blog.title}
                width={400}
                height={200}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <div className="text-white text-4xl">📰</div>
              </div>
            )}
            
            {/* Kategori Badge */}
            <div className="absolute top-3 left-3">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                {blog.type === 'news' ? 'News' : 
                 blog.type === 'event' ? 'Event' :
                 blog.type === 'blog' ? 'Blog' : 'Announcement'}
              </span>
            </div>
          </div>
          
          {/* İçerik */}
          <div className="p-4 flex flex-col h-full">
            <div className="flex-1">
              <h4 className="text-lg font-black text-gray-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors overflow-hidden" style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {blog.title}
              </h4>
              <div className="text-sm text-gray-500 leading-relaxed mb-3 font-light overflow-hidden" style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                lineHeight: '1.3',
                maxHeight: '3.9em'
              }}>
                {blog.excerpt}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center text-gray-500">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-medium">
                  {new Date(blog.publishedAt).toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                Read
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-4">
            📝 Blog & News
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            <span className="text-blue-600">Erasmus</span> World News
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Latest information about Erasmus programs, educational opportunities and international projects
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative mb-8">
          {loading ? (
            <div className="flex items-center justify-center h-[600px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading news...</p>
              </div>
            </div>
          ) : blogs.length > 0 ? (
            <div className="space-y-8">
              {/* Ana Blog Kartı - Tam Genişlik */}
              <div>
                {renderMainBlogCard(blogs[0], 0)}
              </div>

              {/* Alt Kısım - 3'lü Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.slice(1, 4).map((blog, index) => (
                  <div key={blog.id}>
                    {renderSmallBlogCard(blog, index + 1)}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[600px]">
              <div className="text-center">
                <div className="text-6xl mb-4">📰</div>
                <p className="text-gray-600">Henüz haber bulunmuyor</p>
              </div>
            </div>
          )}

        </div>

        {/* Tüm Haberleri Görüntüle Butonu */}
        <div className="text-center">
          <Link
            href="/news"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            View All News
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;

