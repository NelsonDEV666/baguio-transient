import React from "react";
import { PROPERTY } from "@/lib/config/property";

export function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-400 text-xs py-10 mt-20 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        <div className="text-center sm:text-left">
          <p className="font-bold text-sm text-white mb-1">{PROPERTY.name}</p>
          <p>© {new Date().getFullYear()} All Rights Reserved. Staycation Booking Hub.</p>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <a 
            href={PROPERTY.socials.facebookPageUrl}
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1.5 font-medium text-gray-300 hover:text-blue-400 transition-colors"
          >
            <span>🌐</span> Facebook Page
          </a>
          
          <a 
            href={`mailto:${PROPERTY.socials.businessEmail}`}
            className="flex items-center gap-1.5 font-medium text-gray-300 hover:text-red-400 transition-colors"
          >
            <span>✉️</span> Contact Email
          </a>
        </div>

      </div>
    </footer>
  );
}