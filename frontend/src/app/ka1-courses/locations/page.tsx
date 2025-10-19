import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function CourseLocationsPage() {
  const locations = [
    {
      id: 1,
      name: "Antalya",
      country: "Turkey",
      flag: "🇹🇷",
      image: "/images/antalya-location.jpg",
      description: "Beautiful Mediterranean city with rich history and modern facilities",
      features: ["Historic Old Town", "Modern Conference Centers", "Mediterranean Climate", "Cultural Heritage"]
    },
    {
      id: 2,
      name: "İstanbul",
      country: "Turkey", 
      flag: "🇹🇷",
      image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Bridge between Europe and Asia, vibrant cultural hub",
      features: ["Historic Peninsula", "Modern Business District", "Rich Culture", "International Airport"]
    },
    {
      id: 3,
      name: "Paris",
      country: "France",
      flag: "🇫🇷",
      image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      description: "City of Light, perfect for educational and cultural experiences",
      features: ["Historic Landmarks", "World-Class Museums", "Educational Excellence", "Cultural Capital"]
    },
    {
      id: 4,
      name: "Dortmund",
      country: "Germany",
      flag: "🇩🇪",
      image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Modern German city with excellent educational infrastructure",
      features: ["Modern Facilities", "Green Spaces", "Industrial Heritage", "Educational Excellence"]
    },
    {
      id: 5,
      name: "Cologne",
      country: "Germany", 
      flag: "🇩🇪",
      image: "/images/cologne-location.jpg",
      description: "Historic city on the Rhine with vibrant cultural scene",
      features: ["Historic Cathedral", "Rhine River", "Cultural Events", "Modern Infrastructure"]
    },
    {
      id: 6,
      name: "Düsseldorf",
      country: "Germany",
      flag: "🇩🇪",
      image: "/images/dusseldorf-location.jpg",
      description: "Fashion and business capital with international flair",
      features: ["Business Hub", "Fashion District", "International Community", "Modern Architecture"]
    },
    {
      id: 7,
      name: "Pamukkale",
      country: "Turkey",
      flag: "🇹🇷",
      image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Natural wonder with thermal springs and ancient ruins",
      features: ["Thermal Springs", "Ancient Hierapolis", "Natural Beauty", "UNESCO Heritage"]
    },
    {
      id: 8,
      name: "Mykonos",
      country: "Greece",
      flag: "🇬🇷",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Beautiful Greek island with traditional architecture",
      features: ["Traditional Architecture", "Beautiful Beaches", "Cultural Heritage", "Mediterranean Charm"]
    },
    {
      id: 9,
      name: "Granada",
      country: "Spain",
      flag: "🇪🇸",
      image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Historic Andalusian city with Moorish heritage",
      features: ["Alhambra Palace", "Historic Quarter", "Cultural Diversity", "Educational Tradition"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-purple-700 py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full mb-4">
              <span className="text-orange-400 text-xs font-semibold">Erasmus+ KA1</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              Course <span className="text-orange-400">Locations</span>
            </h1>
            <p className="text-sm text-blue-100 max-w-2xl mx-auto">
              Discover our international course locations across Europe and Turkey
            </p>
          </div>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our <span className="text-blue-600">Course Locations</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              International project activities, Teacher Training Courses, EU funded projects, Local and International courses, seminars, jobshadowing and internship activities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locations.map((location) => (
              <div key={location.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100">
                {/* Location Header */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={location.image}
                    alt={`${location.name}, ${location.country}`}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{location.flag}</span>
                      <div>
                        <h3 className="text-xl font-bold text-white">{location.name}</h3>
                        <p className="text-gray-200 text-sm">{location.country}</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Location Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {location.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Features</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {location.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-xs text-gray-600">
                          <svg className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Locations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our <span className="text-blue-600">Locations</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each location is carefully selected to provide the best learning environment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Strategic Locations</h3>
              <p className="text-gray-600">Carefully selected cities across Europe and Turkey for optimal learning experiences</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Modern Facilities</h3>
              <p className="text-gray-600">State-of-the-art conference centers and educational facilities in each location</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cultural Experience</h3>
              <p className="text-gray-600">Rich cultural heritage and local experiences to enhance your learning journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Explore Our Course Locations?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Choose your preferred location and start your educational journey with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ka1-courses" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200">
              View All Courses
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}