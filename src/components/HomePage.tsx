import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, Laptop, Code, Brain } from 'lucide-react';

const FEATURED_COURSES = [
  {
    id: 1,
    title: 'Web Development Fundamentals',
    description: 'Learn HTML, CSS, and JavaScript basics',
    icon: <Code className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60',
    students: 1234,
    modules: 12
  },
  {
    id: 2,
    title: 'Data Science Essentials',
    description: 'Master data analysis and visualization',
    icon: <Brain className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
    students: 856,
    modules: 10
  },
  {
    id: 3,
    title: 'UI/UX Design',
    description: 'Create beautiful and functional interfaces',
    icon: <Laptop className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&auto=format&fit=crop&q=60',
    students: 967,
    modules: 8
  }
];

const FEATURES = [
  {
    icon: <BookOpen className="w-8 h-8 text-indigo-500" />,
    title: 'Expert-Led Courses',
    description: 'Learn from industry professionals'
  },
  {
    icon: <Users className="w-8 h-8 text-indigo-500" />,
    title: 'Interactive Learning',
    description: 'Engage with peers and instructors'
  },
  {
    icon: <Award className="w-8 h-8 text-indigo-500" />,
    title: 'Certificates',
    description: 'Earn recognized certifications'
  }
];

function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Transform Your Future with E-Learning</h1>
            <p className="text-xl mb-8">Access world-class education from anywhere, anytime.</p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/login/student"
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                Start Learning
              </Link>
              <Link
                to="/login/teacher"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Teach with Us
              </Link>
              <Link
                to="/register"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Register Now
              </Link>

            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Courses Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Courses</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURED_COURSES.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      {course.icon}
                    </div>
                    <h3 className="text-xl font-semibold ml-3">{course.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{course.students.toLocaleString()} students</span>
                    <span>{course.modules} modules</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-gray-600 mb-8">Join thousands of students already learning with us</p>
          <Link
            to="/login/student"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;