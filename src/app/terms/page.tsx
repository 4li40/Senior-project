// app/terms/page.tsx
"use client";

import React from "react";

export default function TermsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">📄 Terms of Service – StudyBuddy</h1>
      <p className="mb-4 text-gray-700">
        <strong>Effective Date:</strong> April 23, 2025
      </p>

      <p className="mb-4 text-gray-700">
        Welcome to StudyBuddy! These Terms of Service ("Terms") govern your access to and use of the StudyBuddy platform,
        including all related services and applications (collectively, the "Service"). By registering for or using StudyBuddy,
        you agree to be bound by these Terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-700">1. Acceptance of Terms</h2>
      <p className="mb-4 text-gray-700">
        By creating an account, accessing, or using the Service, you confirm that you are at least 16 years old and you agree
        to abide by these Terms. If you do not agree, you may not use the platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-700">2. Account Registration</h2>
      <p className="mb-4 text-gray-700">
        You must provide accurate and complete information when creating your account. You are solely responsible for maintaining
        the security of your account and password.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-700">3. Role-Based Access</h2>
      <p className="mb-4 text-gray-700">
        There are two types of users on StudyBuddy:
      </p>
      <ul className="list-disc ml-6 mb-4 text-gray-700">
        <li><strong>Students</strong>, who can browse and enroll in courses.</li>
        <li><strong>Tutors</strong>, who can create and offer educational content, manage sessions, and interact with students.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-700">4. Tutor Compensation & Platform Fee</h2>
      <p className="mb-4 text-gray-700">
        Tutors set their own prices for the courses they offer. However, by using StudyBuddy, you agree that the platform will
        retain <strong>15% of the total course fee</strong> as a service fee. The remaining 85% will be made available for
        withdrawal after the course is purchased.
      </p>
      <p className="mb-4 text-gray-700">
        <strong>For example:</strong> If a course is priced at $100, StudyBuddy will retain $15, and the tutor will receive $85.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-700">5. Payments and Refunds</h2>
      <p className="mb-4 text-gray-700">
        Payment processing is handled via trusted third-party providers. Refunds are evaluated on a case-by-case basis and are
        subject to our refund policy available on the support page.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-700">6. Modifications</h2>
      <p className="mb-4 text-gray-700">
        StudyBuddy reserves the right to modify or update these Terms at any time. Continued use of the platform after such
        changes constitutes acceptance of the updated Terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-700">7. Contact</h2>
      <p className="mb-4 text-gray-700">
        If you have any questions about these Terms, please contact us at <a href="mailto:support@studybuddy.com" className="text-blue-600 underline">support@studybuddy.com</a>.
      </p>
    </div>
  );
}
