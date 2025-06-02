import React from 'react';

// Define the Course interface for type safety
interface Course {
  title: string;
  description: string;
  videos: string[];
  coursework: string[];
  quizzes: string[];
}

// Sample course data (hardcoded for the mock-up)
const courses: Course[] = [
  {
    title: "Introduction to MEP Engineering",
    description: "Learn the basics of mechanical, electrical, and plumbing engineering.",
    videos: ["Introduction to MEP", "Mechanical Systems Overview", "Electrical Systems Overview", "Plumbing Systems Overview"],
    coursework: ["Assignment 1: MEP Basics", "Assignment 2: System Design"],
    quizzes: ["Quiz 1: MEP Fundamentals", "Quiz 2: System Components"]
  },
  {
    title: "Advanced HVAC Systems",
    description: "Deep dive into heating, ventilation, and air conditioning systems.",
    videos: ["HVAC System Types", "Energy Efficiency in HVAC", "HVAC Control Systems"],
    coursework: ["Design Project: HVAC System"],
    quizzes: ["Quiz: HVAC Design Principles"]
  },
  {
    title: "Electrical Systems Design",
    description: "Master the design and implementation of electrical systems in buildings.",
    videos: ["Electrical Load Calculations", "Lighting Design", "Power Distribution Systems"],
    coursework: ["Assignment: Electrical System Layout"],
    quizzes: ["Quiz: Electrical Safety Standards"]
  },
  {
    title: "Plumbing and Piping Systems",
    description: "Explore the principles of plumbing and piping design for various applications.",
    videos: ["Water Supply Systems", "Drainage and Venting", "Piping Materials and Sizing"],
    coursework: ["Project: Plumbing System Design"],
    quizzes: ["Quiz: Plumbing Codes and Standards"]
  }
];

// Header component optimized for mobile
function Header() {
  return (
    <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-gray-800 text-white">
      <div className="flex justify-between items-center w-full sm:w-auto">
        <h1 className="text-2xl font-bold">Bernoullia</h1>
        <button className="sm:hidden text-white">Menu</button> {/* Placeholder for mobile menu */}
      </div>
      <nav className="hidden sm:flex ml-6">
        <a href="#" className="mx-2 hover:text-yellow-300">Home</a>
        <a href="#" className="mx-2 text-yellow-300">Courses</a>
        <a href="#" className="mx-2 hover:text-yellow-300">About</a>
      </nav>
      <input
        type="text"
        placeholder="Search courses..."
        className="mt-4 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 w-full sm:w-auto sm:mt-0"
      />
    </header>
  );
}

// CourseCard component with mobile optimizations
interface CourseCardProps {
  course: Course;
}

function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="p-4 sm:p-6 border border-gray-300 rounded-lg shadow-md bg-white">
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">{course.title}</h3>
      <p className="text-sm sm:text-base text-gray-600 mt-2">{course.description}</p>
      <details className="mt-4">
        <summary className="cursor-pointer text-blue-500 font-medium py-2">View Course</summary>
        <div className="mt-4 text-gray-700 text-sm">
          <h4 className="font-semibold text-base">Video Lectures</h4>
          <ul className="list-disc pl-5 mt-2">
            {course.videos.map((video, index) => (
              <li key={index}>{video}</li>
            ))}
          </ul>
          <h4 className="font-semibold text-base mt-4">Coursework</h4>
          <ul className="list-disc pl-5 mt-2">
            {course.coursework.map((work, index) => (
              <li key={index}>{work}</li>
            ))}
          </ul>
          <h4 className="font-semibold text-base mt-4">Quizzes</h4>
          <ul className="list-disc pl-5 mt-2">
            {course.quizzes.map((quiz, index) => (
              <li key={index}>{quiz}</li>
            ))}
          </ul>
        </div>
      </details>
    </div>
  );
}

// Main CoursesPage component with mobile optimizations
function CoursesPage() {
  return (
    <div className="bg-gray-100">
      <Header />
      <div className="container mx-auto p-4 sm:p-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Available Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;