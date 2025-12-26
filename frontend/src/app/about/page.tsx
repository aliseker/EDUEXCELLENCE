import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 py-12 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/20 rounded-full translate-y-40 -translate-x-40"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-4">
              <span className="text-orange-400 text-xs font-semibold">Since 2008</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
              <span className="text-orange-400">15+</span> Years of Excellence
            </h1>
            <p className="text-sm text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Your trusted partner in international education and Erasmus programs
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto mt-4"></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Left Column - Text */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  About <span className="text-blue-600">Edu Excellence</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed text-justify">
                  <strong className="text-gray-900">Edu Excellence</strong> is a leading SME in international project activities, 
                  teacher training, EU-funded projects, and comprehensive educational services. With over 15 years of 
                  proven experience, we are committed to delivering excellence through our disciplined working system 
                  and unwavering dedication to quality.
                </p>
                
                <p className="text-lg text-gray-600 leading-relaxed text-justify">
                  Operating across multiple international locations including <strong className="text-gray-900">Antalya, Istanbul, 
                  Düsseldorf, Dortmund, Granada, Paris, and Mykonos</strong>, we serve as your trusted partner in 
                  Erasmus+ Program KA2 Cooperation Partnerships.
                </p>
                
                <p className="text-lg text-gray-600 leading-relaxed text-justify">
                  Our comprehensive support includes project writing, partnership establishment, implementation, 
                  and report preparation. We also provide <strong className="text-gray-900">KA1 courses for teacher development</strong> 
                  with full support for accommodation, transportation, and cultural activities.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">7</div>
                  <div className="text-sm text-gray-600">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
                  <div className="text-sm text-gray-600">Projects</div>
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/topluluk.jpg"
                    alt="Edu Excellence community and team"
                    width={600}
                    height={600}
                    className="w-full h-auto object-cover object-center"
                    style={{ objectPosition: 'center 30%' }}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-transparent rounded-bl-3xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-6">
              Our Services
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              What We <span className="text-blue-600">Offer</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive educational services and international project support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                ),
                title: "Internship Arrangement",
                description: "Professional internship placement services for students and graduates in various industries across Europe. We provide comprehensive support including visa assistance, accommodation, and cultural integration programs."
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ),
                title: "Job Shadowing Services",
                description: "Specialized job shadowing programs for educators and professionals to observe and learn from European counterparts. Includes structured observation periods, professional development workshops, and networking opportunities."
              }
            ].map((service, index) => {
              const href = service.title === "Internship Arrangement" 
                ? "/services/internship" 
                : service.title === "Job Shadowing Services" 
                ? "/services/job-shadowing" 
                : "#";
              
              return (
                <Link key={index} href={href} className="block h-full">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed flex-1">
                      {service.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Motto Section */}
      <section className="py-16 bg-gray-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-orange-500 mb-6 leading-relaxed">
              Our Motto is; Collaborate with Right Persons and Organisations and Enjoy Erasmus
            </h2>
            <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto"></div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
