import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-white py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* About Us Section */}
        <div>
          <h3 className="font-bold text-lg mb-2">About Us</h3>
          <p className="text-sm">
            We’re dedicated to connecting students with expert tutors for
            personalized learning experiences.
          </p>
        </div>

        {/* Quick Links Section */}
        <div>
          <h3 className="font-bold text-lg mb-2">Quick Links</h3>
          <ul className="text-sm space-y-2">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="/find-a-tutor" className="hover:underline">
                Find a Tutor
              </a>
            </li>
            <li>
              <a href="/become-a-tutor" className="hover:underline">
                Become a Tutor
              </a>
            </li>
            <li>
              <a href="/faqs" className="hover:underline">
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Connect With Us Section */}
        <div>
          <h3 className="font-bold text-lg mb-2">Connect With Us</h3>
          <ul className="text-sm space-y-2">
            <li>
              <a
                href="mailto:support@studybuddy.com"
                className="hover:underline"
              >
                📧 support@studybuddy.com
              </a>
            </li>
            <li>📞 +961 81 419 450</li>
            <li>📍 Tripoli</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
