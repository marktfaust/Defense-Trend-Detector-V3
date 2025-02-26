import React, { useState } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaGlobe,
  FaBuilding,
  FaEnvelope,
} from "react-icons/fa";

interface SocialFooterProps {
  personalWebsite: string;
  linkedIn: string;
  companyWebsite: string;
  github: string;
  youtube: string;
  email?: string;
  companyName?: string;
  name?: string;
}

const SocialFooter: React.FC<SocialFooterProps> = ({
  personalWebsite,
  linkedIn,
  companyWebsite,
  github,
  youtube,
  email = "contact@example.com",
  companyName = "My Company",
  name = "Your Name",
}) => {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const socialLinks = [
    {
      id: "website",
      url: personalWebsite,
      icon: FaGlobe,
      color: "bg-blue-500",
      label: "Website",
      hoverColor: "hover:text-blue-400",
    },
    {
      id: "linkedin",
      url: linkedIn,
      icon: FaLinkedin,
      color: "bg-blue-700",
      label: "LinkedIn",
      hoverColor: "hover:text-blue-500",
    },
    {
      id: "company",
      url: companyWebsite,
      icon: FaBuilding,
      color: "bg-green-600",
      label: companyName,
      hoverColor: "hover:text-green-400",
    },
    {
      id: "github",
      url: github,
      icon: FaGithub,
      color: "bg-gray-800",
      label: "GitHub",
      hoverColor: "hover:text-gray-400",
    },
    {
      id: "youtube",
      url: youtube,
      icon: FaYoutube,
      color: "bg-red-600",
      label: "YouTube",
      hoverColor: "hover:text-red-500",
    },
    {
      id: "email",
      url: `mailto:${email}`,
      icon: FaEnvelope,
      color: "bg-yellow-500",
      label: "Email",
      hoverColor: "hover:text-yellow-400",
    },
  ];

  return (
    <footer className="relative bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white py-12 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 120 + 40}px`,
              height: `${Math.random() * 120 + 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
              animation: `float ${Math.random() * 20 + 20}s linear infinite`,
              animationDelay: `${Math.random() * 20}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center">
          <div className="mb-8 text-center">
            <h2 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              CHECK OUT MY OTHER WORK
            </h2>
            <p className="mt-2 text-gray-300 max-w-lg mx-auto">
              Let's collaborate on something amazing! Check out my work or reach
              out through any of these platforms.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                aria-label={link.label}
                onMouseEnter={() => setHoveredIcon(link.id)}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                <div
                  className={`
                  w-16 h-16 rounded-full ${
                    link.color
                  } flex items-center justify-center
                  transform transition-transform duration-300
                  ${hoveredIcon === link.id ? "scale-110" : "scale-100"}
                `}
                >
                  <link.icon size={28} className="text-white" />
                </div>
                <span
                  className={`
                  absolute top-full left-1/2 transform -translate-x-1/2 mt-2
                  text-sm whitespace-nowrap
                  transition-opacity duration-300
                  ${hoveredIcon === link.id ? "opacity-100" : "opacity-0"}
                `}
                >
                  {link.label}
                </span>
              </a>
            ))}
          </div>

          <div className="w-full max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-8"></div>

          <div className="text-center">
            <p className="text-lg font-semibold">{name}</p>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} All Rights Reserved
            </p>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(100px, 100px) rotate(180deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
      `}</style>
    </footer>
  );
};

export default SocialFooter;
