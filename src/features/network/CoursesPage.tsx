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

// CourseCard component with mobile optimizations
interface CourseCardProps {
  course: Course;
}

function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-blue-900/80 border border-blue-700/30 rounded-xl shadow-lg p-6 flex flex-col gap-2 hover:scale-[1.02] transition-transform duration-200">
      <h3 className="text-xl font-bold text-blue-100 drop-shadow-sm">{course.title}</h3>
      <p className="text-base text-blue-300 mb-2">{course.description}</p>
      <details className="mt-2 group">
        <summary className="cursor-pointer text-blue-400 font-semibold py-1 group-open:text-yellow-300 transition-colors">View Course Details</summary>
        <div className="mt-3 text-blue-200 text-sm space-y-2">
          <div>
            <h4 className="font-semibold text-blue-300">Video Lectures</h4>
            <ul className="list-disc pl-5 mt-1">
              {course.videos.map((video, index) => (
                <li key={index}>{video}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-300">Coursework</h4>
            <ul className="list-disc pl-5 mt-1">
              {course.coursework.map((work, index) => (
                <li key={index}>{work}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-300">Quizzes</h4>
            <ul className="list-disc pl-5 mt-1">
              {course.quizzes.map((quiz, index) => (
                <li key={index}>{quiz}</li>
              ))}
            </ul>
          </div>
        </div>
      </details>
    </div>
  );
}

// Main CoursesPage component with mobile optimizations
function CoursesPage() {
  return (
    <div className="min-h-screen bg-transparent">
      {/* Site-wide header/footer are used by App.jsx */}
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <h2 className="text-3xl font-extrabold text-blue-100 mb-8 drop-shadow">Available Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;