'use client';

import Image from 'next/image';

const WhoWeAre = () => {
  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden min-h-[600px]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="flex flex-col gap-8 min-h-[400px]">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Who We{' '}
                <span className="text-orange-500 relative">
                  Are
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500"></div>
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Edu-Excellence & Consultancy is at your service with its rich course content and competent instructors 
                in Course Centers based in Antalya, Istanbul, Porto and Amsterdam. Edu-Excellence & Consultancy, 
                which is with you in the project writing phase, partnership establishment, project implementation 
                and report preparation processes in the field of Erasmus+ Program KA2 Cooperation Partnerships, 
                will be happy to be your partner in any of your Cooperation Partnership projects.
              </p>
            </div>

            <div className="pt-4">
              <button className="border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-500 hover:text-white transition-all duration-200 transform hover:scale-105">
                GET STARTED
              </button>
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
                  loading="lazy"
                />
                {/* Gradient Overlay */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-transparent rounded-bl-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
