"use client";

import MainNavBar from "@/components/MainNavBar";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MessageCircle } from "lucide-react";

export default function Contact() {
  const contactMethods = [
    {
      id: "email",
      title: "Email Us",
      description: "Send us an email, and we’ll get back to you within 24 hours.",
      link: "mailto:support@studybuddy.com",
      linkText: "support@studybuddy.com",
      icon: <Mail className="w-6 h-6 text-blue-500" />,
    },
    {
      id: "call",
      title: "Call Us",
      description: "Speak with our support team during business hours.",
      link: "tel:+96181419450",
      linkText: " +961 814 194 50",
      icon: <Phone className="w-6 h-6 text-green-500" />,
    },
    {
      id: "chat",
      title: "Chat with Us",
      description: "Get instant help with our live chat support.",
      link: "/chat",
      linkText: "Start Chat",
      icon: <MessageCircle className="w-6 h-6 text-purple-500" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <MainNavBar />

      {/* Header Section */}
      <div className="bg-gradient-to-r bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Have a question? We're here to help. Reach out to us via email, phone, or live chat.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow py-16 container mx-auto px-4 bg-white text-black">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-6"></h2>
          <p className="text-lg text-gray-900 max-w-2xl mx-auto mb-12">
            Choose any of the contact methods below to connect with us. We're ready to assist you.
          </p>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
            {contactMethods.map((method) => (
              <ContactCard key={method.id} {...method} />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Study Buddy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function ContactCard({
  title,
  description,
  link,
  linkText,
  icon,
}: {
  title: string;
  description: string;
  link: string;
  linkText: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="cursor-pointer bg-gray-800 text-white hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center mb-4 space-x-4">
          {icon}
          <h3 className="font-semibold text-xl">{title}</h3>
        </div>
        <p className="text-sm text-gray-400 mb-4">{description}</p>
        <a
          href={link}
          className="block px-4 py-2 bg-blue-500 text-white font-medium rounded-md text-center hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          target={link.startsWith("mailto:") || link.startsWith("tel:") ? "_self" : "_blank"}
          rel="noopener noreferrer"
          aria-label={`Contact us via ${title}`}
        >
          {linkText}
        </a>
      </CardContent>
    </Card>
  );
}
