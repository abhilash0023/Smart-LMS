export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  courseId: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  completed: boolean;
  imageUrl: string;
}

export interface StudentProgress {
  userId: string;
  userName: string;
  courseId: string;
  progress: number;
  quizScores: { quizId: string; score: number }[];
}