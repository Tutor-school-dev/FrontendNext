import React, { useState } from "react";
import CourseEnrollmentDialog from "./CourseEnrollmentDialog";

interface Props {
  course: {
    id: string;
    title: string;
    description: string;
    // Add other course fields as needed
  };
}

const CourseCard: React.FC<Props> = ({ course }) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="border rounded-lg p-4 shadow bg-white">
      <h3 className="text-lg font-bold mb-2">{course.title}</h3>
      <p className="mb-4">{course.description}</p>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => {
          window.location.href = '/select-role';
        }}
      >
        Enroll Now
      </button>
    </div>
  );
};

export default CourseCard;
