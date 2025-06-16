import React, { useState,useEffect } from 'react';
import { User, StudentProgress } from '../types';
import { Users, PlusCircle, BookOpen } from 'lucide-react';
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc,addDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface TeacherDashboardProps { 
  user: User;
}

const MOCK_STUDENTS: StudentProgress[] = [
  {
    userId: '1',
    userName: 'John Student',
    courseId: '1',
    progress: 75,
    quizScores: [{ quizId: '1', score: 85 }]
  },
  {
    userId: '2',
    userName: 'Alice Student',
    courseId: '1',
    progress: 100,
    quizScores: [{ quizId: '1', score: 95 }]
  }
];

function TeacherDashboard({ user }: TeacherDashboardProps) {
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([{ text: '', options: ['', '', '', ''], correctAnswer: 0 }]);

  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [videoLink, setVideoLink] = useState('');

  // const [myCourses, setMyCourses] = useState([]);
  interface Course {
    id: string;
    title: string;
    description: string;
    videoLink: string;
  }

  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };


  useEffect(() => {
    fetchMyCourses(); 
  }, []);

  //CRUD courses
  const fetchMyCourses = async () => {
    if (!user?.id) return;

    const q = query(collection(db, 'courses'), where('createdBy', '==', user.id));
    const querySnapshot = await getDocs(q);

    const courses: Course[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Course, 'id'>) // because id is separate from Firestore fields
    }));

    setMyCourses(courses);
    console.log("My Courses:", myCourses);
  }; 

  const handleDelete = async (courseId: string) => {
    try {
      await deleteDoc(doc(db, 'courses', courseId));
      setMyCourses((prev) => prev.filter((c) => c.id !== courseId));
      alert('Course deleted!');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete.');
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse({ ...course }); // Clone to allow editing
  };


  const handleUpdate = async () => {
  if (!editingCourse) return;
  if (!editingCourse.title || !editingCourse.description || !editingCourse.videoLink) {
    alert('All fields required!');
    return;
  }

  try {
    setLoading(true);
    await updateDoc(doc(db, 'courses', editingCourse.id), {
      title: editingCourse.title,
      description: editingCourse.description,
      videoLink: editingCourse.videoLink,
    });
    alert('Updated successfully!');
    setEditingCourse(null);
    fetchMyCourses();
  } catch (error) {
    console.error('Update error:', error);
    alert('Failed to update.');
  } finally {
    setLoading(false);
  }
};





  const handleCreateCourse = async () => {
    if (!courseTitle || !courseDescription || !videoLink) {
      alert('Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      await addDoc(collection(db, 'courses'), {
        title: courseTitle,
        description: courseDescription,
        videoLink,
        createdBy: user.id,
        createdAt: new Date()
      });
      alert('Course created successfully!');
      setShowCreateCourse(false);
      setCourseTitle('');
      setCourseDescription('');
      setVideoLink('');
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    if (!quizTitle || questions.length === 0) {
      alert('Please fill in all quiz details');
      return;
    }
    try {
      setLoading(true);
      await addDoc(collection(db, 'quizzes'), {
        title: quizTitle,
        questions: questions.map((q) => ({
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer
        })),
        createdBy: user.name,
        createdAt: new Date()
      });
      alert('Quiz created successfully!');
      setShowCreateQuiz(false);
      setQuizTitle('');
      setQuestions([{ text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <h1>{user.id}</h1>
        <div className="space-x-4">
          <button
            onClick={() => setShowCreateQuiz(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Quiz
          </button>
          <button
            onClick={() => setShowCreateCourse(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Course
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Progress */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Student Progress</h2>
          </div>
          <div className="space-y-4">
            {MOCK_STUDENTS.map((student) => (
              <div key={student.userId} className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{student.userName}</h3>
                  <span className="text-sm text-gray-600">
                    Progress: {student.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${student.progress}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Latest Quiz Score: {student.quizScores[0]?.score}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <BookOpen className="w-6 h-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Course Overview</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Students</span>
              <span className="font-semibold">{MOCK_STUDENTS.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Average Progress</span>
              <span className="font-semibold">
                {Math.round(
                  MOCK_STUDENTS.reduce((acc, curr) => acc + curr.progress, 0) / MOCK_STUDENTS.length
                )}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Average Quiz Score</span>
              <span className="font-semibold">
                {Math.round(
                  MOCK_STUDENTS.reduce((acc, curr) => acc + curr.quizScores[0]?.score, 0) / MOCK_STUDENTS.length
                )}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Create Quiz Modal */}
      {showCreateQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-4">Create New Quiz</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Quiz Title</label>
                <input
                  type="text"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  className="w-full border rounded-md p-2"
                />
              </div>

              {questions.map((question, qIndex) => (
                <div key={qIndex} className="border-t pt-4">
                  <label className="block text-sm font-medium mb-1">
                    Question {qIndex + 1}
                  </label>
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[qIndex].text = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    className="w-full border rounded-md p-2 mb-2"
                  />
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center space-x-2 mb-2">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={question.correctAnswer === oIndex}
                        onChange={() => {
                          const newQuestions = [...questions];
                          newQuestions[qIndex].correctAnswer = oIndex;
                          setQuestions(newQuestions);
                        }}
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newQuestions = [...questions];
                          newQuestions[qIndex].options[oIndex] = e.target.value;
                          setQuestions(newQuestions);
                        }}
                        className="flex-1 border rounded-md p-2"
                        placeholder={`Option ${oIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>
              ))}
              <button
                onClick={addQuestion}
                className="text-indigo-600 hover:text-indigo-500"
              >
                + Add Question
              </button>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowCreateQuiz(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateQuiz}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
              >
                {loading ? 'Creating...' : 'Create Quiz'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      {showCreateCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">Create New Course</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Course Title</label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  className="w-full border rounded-md p-2"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Video Link</label>
                <input
                  type="text"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  className="w-full border rounded-md p-2"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowCreateCourse(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCourse}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
              >
                {loading ? 'Creating...' : 'Create Course'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
      <h1 className="text-xl font-bold mb-4">My Courses</h1>

      {myCourses.map((course) => (
        <div key={course.id} className="border p-4 mb-4 rounded">
          <h2 className="font-semibold">{course.title}</h2>
          <p>{course.description}</p>
          <p className="text-sm text-blue-500">{course.videoLink}</p>
          <button onClick={() => handleEdit(course)} className="mr-2 text-yellow-600">Edit</button>
          <button onClick={() => handleDelete(course.id)} className="text-red-600">Delete</button>
        </div>
      ))}

      {/* Edit Course Modal */}
    {editingCourse && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-xl w-full">
          <h2 className="text-2xl font-bold mb-4">Edit Course</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Course Title</label>
              <input
                type="text"
                value={editingCourse.title}
                onChange={(e) =>
                  setEditingCourse({ ...editingCourse, title: e.target.value })
                }
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={editingCourse.description}
                onChange={(e) =>
                  setEditingCourse({ ...editingCourse, description: e.target.value })
                }
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Video Link</label>
              <input
                type="text"
                value={editingCourse.videoLink}
                onChange={(e) =>
                  setEditingCourse({ ...editingCourse, videoLink: e.target.value })
                }
                className="w-full border rounded-md p-2"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setEditingCourse(null)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    </div>
      

    </div>
  );
}

export default TeacherDashboard;
