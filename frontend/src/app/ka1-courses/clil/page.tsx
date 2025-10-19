import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function CLILCoursePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-purple-700 py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-6">
              <span className="text-orange-400 text-sm font-semibold">Erasmus+ KA1</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Content and Language Integrated Learning – CLIL
            </h1>
            <div className="flex items-center justify-center space-x-6 text-blue-100">
              <div className="text-center">
                <div className="text-2xl font-bold">80 EURO</div>
                <div className="text-sm">PER DAY</div>
              </div>
              <div className="w-px h-12 bg-blue-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">5 DAYS</div>
                <div className="text-sm">DURATION</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Details */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/ka1-courses" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to KA1 Courses
            </Link>
          </div>

          {/* Course Description */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Course Description</h2>
            <div className="prose prose-lg text-gray-600 leading-relaxed">
              <p className="mb-4">
                It is called Content and Language Integrated Learning (CLIL) when a subject is taught in English to learners with a distinct primary language (such as math, science, or geography). The content of the class and an aspect of the English language are the two main points of concentration for each lesson.
              </p>
              <p className="mb-4">
                EMI (English as the Medium of Instruction) is a close cousin of this course, which focuses primarily on teaching the subject matter, and both techniques benefit from this course.
              </p>
              <p className="mb-4">
                CLIL is widely employed in state schools and foreign contexts where students need to enhance their English while also learning the required curriculum. It's a common practice for many English teachers to use English to teach a different subject or topic, whether it's a grammar point or a vocabulary word.
              </p>
              <p>
                If you're just starting out in the field of CLIL teaching or have some experience under your belt, this course will provide you with a good foundation in the subject matter.
              </p>
            </div>
          </div>

          {/* Learning Outcomes */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Learning Outcomes</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Learn how to incorporate the four abilities of English or any other foreign language into the classroom and school curriculum</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Create learning activities that are both fun and effective in achieving language and subject goals</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">It is important to create an engaging classroom environment where learning is pleasant and focused on relevant information</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Learn how to effectively use English in the classroom so that students can work together and communicate with one another</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">New concepts for raising student interest and motivation in the acquisition of languages by employing interesting and 'genuine' materials from the real world can be implemented in the classroom</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Daily Programme */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Daily Programme</h2>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mr-4">Day 1</div>
                  <h3 className="text-lg font-semibold text-gray-900">CLIL Fundamentals</h3>
                </div>
                <p className="text-gray-600">Soft and hard CLIL definitions and models, Aims of CLIL: a dual focus on content and language, What is the role of a CLIL teacher in education?, Theory: CLIL is based on four C's and three D'S, How does CLIL work in practice?</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mr-4">Day 2</div>
                  <h3 className="text-lg font-semibold text-gray-900">Educational Goals & Framework</h3>
                </div>
                <p className="text-gray-600">Specifying educational goals, From the beginning to the end of the process, Knowing what a student's academic language needs are, Constructing a framework for content and constructing a framework for language</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold mr-4">Day 3</div>
                  <h3 className="text-lg font-semibold text-gray-900">CLIL Resources & Materials</h3>
                </div>
                <p className="text-gray-600">Choosing CLIL resources, In the context of the CLIL classroom, adapting materials, Developing CLIL resources, Recognizing and addressing cognitive and language difficulties</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold mr-4">Day 4</div>
                  <h3 className="text-lg font-semibold text-gray-900">Assessment Strategies</h3>
                </div>
                <p className="text-gray-600">What are we testing? Is it content, skills, or language?, What makes a good test question, in terms of summative assessment?, Tips and approaches for doing formative assessments, The design was done the wrong way around</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold mr-4">Day 5</div>
                  <h3 className="text-lg font-semibold text-gray-900">Course Evaluation & Certification</h3>
                </div>
                <p className="text-gray-600">The evaluation of the course includes a review of the skills and knowledge students have gained, as well as comments from the instructor and class discussion, The giving of the Certificate of Attendance upon course completion, Adventures and other cultural activities</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your CLIL Journey?</h3>
            <p className="text-blue-100 mb-6">Join our comprehensive CLIL course and enhance your teaching skills</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200">
                Enroll Now
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}







