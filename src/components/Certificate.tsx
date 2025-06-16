import React from 'react';
import { User, Course } from '../types';
import { jsPDF } from 'jspdf';
import { Download, X } from 'lucide-react';

interface CertificateProps {
  user: User;
  course: Course;
  onClose: () => void;
}

function Certificate({ user, course, onClose }: CertificateProps) {
  const downloadCertificate = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Add certificate content
    doc.setFontSize(40);
    doc.text('Certificate of Completion', 150, 50, { align: 'center' });
    
    doc.setFontSize(20);
    doc.text(`This is to certify that`, 150, 80, { align: 'center' });
    
    doc.setFontSize(30);
    doc.text(user.name, 150, 100, { align: 'center' });
    
    doc.setFontSize(20);
    doc.text(`has successfully completed the course`, 150, 120, { align: 'center' });
    
    doc.setFontSize(25);
    doc.text(course.title, 150, 140, { align: 'center' });
    
    doc.setFontSize(15);
    const date = new Date().toLocaleDateString();
    doc.text(`Date: ${date}`, 150, 170, { align: 'center' });

    // Save the PDF
    doc.save(`${course.title.toLowerCase().replace(/\s+/g, '-')}-certificate.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="border-8 border-double border-gray-200 p-8 text-center">
          <h1 className="text-4xl font-bold mb-8">Certificate of Completion</h1>
          
          <p className="text-xl mb-4">This is to certify that</p>
          <p className="text-3xl font-bold mb-4">{user.name}</p>
          <p className="text-xl mb-4">has successfully completed the course</p>
          <p className="text-2xl font-bold mb-8">{course.title}</p>
          
          <p className="text-lg">
            Date: {new Date().toLocaleDateString()}
          </p>

          <button
            onClick={downloadCertificate}
            className="mt-8 flex items-center px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-500 mx-auto"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Certificate
          </button>
        </div>
      </div>
    </div>
  );
}

export default Certificate;