import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import ReactPlayer from 'react-player';
import { Star, GraduationCap } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  videoLink: string;
  thumbnail: string;
  rating: number;
  createdBy: string; // instructor name
  createdAt: any;
}

function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [userRating, setUserRating] = useState<number>(0);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'courses'));
        const coursesData: Course[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Course[];
        setCourses(coursesData);
      } catch (err: any) {
        console.error('Error fetching courses:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleRatingSubmit = async () => {
    if (!selectedCourse || userRating === 0) return;

    try {
      const courseRef = doc(db, 'courses', selectedCourse.id);
      await updateDoc(courseRef, {
        rating: userRating
      });

      alert('Rating submitted successfully!');
      setSelectedCourse({ ...selectedCourse, rating: userRating });
      setUserRating(0);
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        <h2 className="text-2xl font-bold">Error Loading Courses</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Available Courses</h1>

      {selectedCourse ? (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-4xl">
            <ReactPlayer
              url={selectedCourse.videoLink}
              controls
              width="100%"
              height="500px"
            />
          </div>

          <div className="w-full max-w-4xl mt-6 bg-white p-6 rounded-lg shadow-md">
            {/* Title */}
            <h2 className="text-2xl font-bold mb-2">{selectedCourse.title}</h2>

            {/* Instructor */}
            <div className="flex items-center space-x-3 mb-4">
              <GraduationCap className="text-indigo-500" />
              <p className="text-gray-700 font-semibold">Instructor: {selectedCourse.createdBy}</p>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-6">{selectedCourse.description}</p>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <Star className="text-yellow-400 w-6 h-6" />
              <span className="text-lg font-semibold">{selectedCourse.rating}/5</span>
            </div>

            {/* Give Rating */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Rate this course:</h3>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setUserRating(num)}
                    className={`p-2 rounded-full ${
                      userRating >= num ? 'bg-yellow-400' : 'bg-gray-300'
                    }`}
                  >
                    <Star className="w-5 h-5 text-white" />
                  </button>
                ))}
              </div>
              <button
                onClick={handleRatingSubmit}
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-500"
              >
                Submit Rating
              </button>
            </div>

            <button
              onClick={() => setSelectedCourse(null)}
              className="mt-6 text-indigo-600 hover:underline"
            >
              ← Back to Courses
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedCourse(course)}
            >
              {/* Thumbnail */}
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
              )}

              {/* Course Info */}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>

                {/* Instructor */}
                <p className="text-gray-600 mb-2 text-sm">By {course.createdBy}</p>

                <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>

                {/* Rating */}
                <div className="flex items-center">
                  <Star className="text-yellow-400 w-5 h-5" />
                  <span className="ml-1 text-gray-700 font-medium">{course.rating}/5</span>
                </div>
              </div>    
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;
