import React, { useState } from 'react';
import { User, Course, Quiz } from '../types';
import { Book, CheckCircle, Award } from 'lucide-react';
import Certificate from './Certificate';

interface StudentDashboardProps {
  user: User;
}

const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Introduction to React',
    description: 'Learn the basics of React development',
    progress: 75,
    completed: false,
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: '2',
    title: 'Advanced JavaScript',
    description: 'Master JavaScript concepts',
    progress: 100,
    completed: true,
    imageUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=60'
  }
];

const MOCK_QUIZ: Quiz = {
  id: '1',
  title: 'React Fundamentals Quiz',
  courseId: '1',
  questions: [
    {
      id: '1',
      text: 'What is React?',
      options: [
        'A JavaScript library',
        'A programming language',
        'A database',
        'An operating system'
      ],
      correctAnswer: 0
    }
  ]
};

function StudentDashboard({ user }: StudentDashboardProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_COURSES.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4">{course.description}</p>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex space-x-2">
                {!course.completed && (
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowQuiz(true);
                    }}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
                  >
                    <Book className="w-4 h-4 mr-2" />
                    Take Quiz
                  </button>
                )}
                {course.completed && (
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowCertificate(true);
                    }}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    View Certificate
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">{MOCK_QUIZ.title}</h2>
            {MOCK_QUIZ.questions.map((question) => (
              <div key={question.id} className="mb-6">
                <p className="font-semibold mb-2">{question.text}</p>
                <div className="space-y-2">
                  {question.options.map((option, index) => (
                    <label key={index} className="flex items-center space-x-2">
                      <input type="radio" name={question.id} value={index} />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowQuiz(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Quiz submitted successfully!');
                  setShowQuiz(false);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showCertificate && selectedCourse && (
        <Certificate
          course={selectedCourse}
          user={user}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
}

export default StudentDashboard;