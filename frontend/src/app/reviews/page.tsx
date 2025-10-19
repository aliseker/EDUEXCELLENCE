'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Review {
  id: number;
  name: string;
  title: string;
  content: string;
  rating: number;
  createdAt: string;
  isActive: boolean;
  isApproved: boolean;
  order: number;
  videoUrl?: string;
}

interface VideoTestimonial {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  isApproved: boolean;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [videoTestimonials, setVideoTestimonials] = useState<VideoTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all reviews from API
      const reviewsResponse = await fetch('https://localhost:7166/api/Review/active');
      if (reviewsResponse.ok) {
        const allData = await reviewsResponse.json();
        
        // Separate normal reviews and video reviews
        const normalReviews = allData.filter((item: Review) => !item.videoUrl || item.videoUrl === '');
        const videoReviews = allData.filter((item: Review) => item.videoUrl && item.videoUrl !== '');
        
        setReviews(normalReviews);
        
        // Convert video reviews to video testimonials format
        const videoTestimonialsData = videoReviews.map((video: Review) => {
          // Convert YouTube URL to embed format
          let embedUrl = video.videoUrl!;
          if (embedUrl.includes('youtube.com/watch?v=')) {
            const videoId = embedUrl.split('v=')[1]?.split('&')[0];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
          } else if (embedUrl.includes('youtu.be/')) {
            const videoId = embedUrl.split('youtu.be/')[1]?.split('?')[0];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
          }
          
          return {
            id: video.id,
            title: video.title,
            description: video.content,
            videoUrl: embedUrl,
            isApproved: video.isApproved
          };
        });
        
        setVideoTestimonials(videoTestimonialsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const approvedReviews = reviews.filter(review => review.isApproved);
  const approvedVideos = videoTestimonials.filter(video => video.isApproved);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Yorumlar yükleniyor...</p>
            </div>
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
      <section className="relative bg-gradient-to-br from-purple-600 to-pink-600 py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Müşteri <span className="text-orange-400">Yorumları</span>
            </h1>
            <p className="text-lg text-purple-100 max-w-2xl mx-auto">
              Başarı hikayeleri ve deneyimler - EduExcellence ile kariyerinizi bir üst seviyeye taşıyın
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Başarılı Program</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="text-3xl font-bold text-purple-600 mb-2">2000+</div>
              <div className="text-gray-600">Mutlu Öğrenci</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="text-3xl font-bold text-green-600 mb-2">25+</div>
              <div className="text-gray-600">Ülke</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-gray-600">Memnuniyet</div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              🎥 Video <span className="text-purple-600">Testimonials</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Müşterilerimizin deneyimlerini video formatında izleyin
            </p>
          </div>

          {approvedVideos.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {approvedVideos.map((video) => (
                <div key={video.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                  {/* Video */}
                  <div className="relative aspect-video bg-gray-200">
                    <iframe
                      src={video.videoUrl}
                      title={video.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>

                  {/* Video Info */}
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2 text-xl">{video.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz video yorumu yok</h3>
              <p className="text-gray-500">Admin panelinden video yorumları ekleyebilirsiniz.</p>
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              📝 Müşteri <span className="text-purple-600">Yorumları</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Başarı hikayeleri ve deneyimler
            </p>
          </div>

          {approvedReviews.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Henüz yorum yok</h3>
              <p className="text-gray-600">İlk yorumu siz yapın!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {approvedReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                  {/* Avatar and Info */}
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-4">
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{review.name}</h3>
                      <p className="text-sm text-gray-600">{review.title}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    {renderStars(review.rating)}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    "{review.content}"
                  </p>

                  {/* Program Info */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        {review.title}
                      </span>
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}