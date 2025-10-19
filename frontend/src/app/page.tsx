import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import BlogSection from '@/components/BlogSection';
import UpcomingApprovedCourses from '@/components/UpcomingApprovedCourses';
import LatestCourses from '@/components/LatestCourses';
import WhyChooseUs from '@/components/WhyChooseUs';
import WhoWeAre from '@/components/WhoWeAre';
import ReviewsSection from '@/components/ReviewsSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <BlogSection />
      <UpcomingApprovedCourses />
      <LatestCourses />
      <WhyChooseUs />
      <WhoWeAre />
      <ReviewsSection />
      <Footer />
    </div>
  );
}
