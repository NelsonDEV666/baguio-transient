"use client";

import React, { useState, useEffect } from "react";
import { PROPERTY } from "../lib/config/property";
import { BookingForm } from "../components/public/BookingForm";
import { ImageGallery } from "../components/public/ImageGallery";
import { Footer } from "../components/public/Footer";
import { MapPin, Check, Home, MessageSquare } from "lucide-react";

export default function HomePage() {
  // Ultra-premium generic vacation property background slideshow references
  const heroImages = [
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80"
  ];

  const [heroIndex, setHeroIndex] = useState(0);

  // Drive background auto-rotation loops every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <main className="pb-10">
        
        {/* Dynamic Premium Cross-Fade Hero Section */}
        <section className="relative bg-gray-900 text-white pt-20 pb-28 px-4 overflow-hidden min-h-[360px] flex items-center justify-center">
          {/* Layered Image Stack rendering the transitions */}
          {heroImages.map((imgUrl, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${idx === heroIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
              style={{ backgroundImage: `url('${imgUrl}')` }}
            />
          ))}
          
          {/* Dark Contrast Mask Overlay blocking visual text blindness */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/70 to-gray-950/80 backdrop-blur-[1px]" />

          {/* Core Content Typography layer */}
          <div className="relative max-w-3xl mx-auto space-y-4 text-center z-10">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 backdrop-blur-md px-3 py-1 rounded-full text-blue-200 text-xs font-semibold uppercase tracking-wide mb-2">
              <Home className="w-3.5 h-3.5 text-blue-400" /> Welcome to {PROPERTY.city}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-md">
              {PROPERTY.name}
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 font-medium max-w-2xl mx-auto leading-relaxed opacity-90">
              {PROPERTY.tagline}
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-300">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold tracking-wide drop-shadow-xs">{PROPERTY.location}</span>
            </div>
          </div>
        </section>

        {/* Global Layout Grid Execution */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column Structural Details */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Image Gallery Canvas */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
                <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Property Showcase</h3>
                <ImageGallery />
              </div>

              {/* Specification highlights parameters panel */}
              <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5">
                <h3 className="text-xs font-bold text-gray-900 mb-4 border-b pb-2 uppercase tracking-wider">Property Highlights</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Maximum Capacity</span>
                    <span className="font-bold text-gray-900">Up to {PROPERTY.maxPax} Guests</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Standard Check-in</span>
                    <span className="font-bold text-gray-900">{PROPERTY.checkInTime}</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Standard Check-out</span>
                    <span className="font-bold text-gray-900">{PROPERTY.checkOutTime}</span>
                  </li>
                </ul>
              </div>

              {/* Amenities checkboxes checklists */}
              <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5">
                <h3 className="text-xs font-bold text-gray-900 mb-4 border-b pb-2 uppercase tracking-wider">Included Amenities</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PROPERTY.amenities.map((amenity, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 font-semibold">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[3]" />
                      <span>{amenity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* White-labeled dynamic Messenger Direct Inquiry Escapement routing card */}
              <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl shadow-md p-5 text-white border border-blue-600">
                <h3 className="text-base font-bold mb-1 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-300" /> Have Custom Inquiries?
                </h3>
                <p className="text-xs text-blue-100 leading-relaxed mb-4">
                  Want to verify custom dates, corporate packages, or specific amenities before making a reservation downpayment? Chat directly with management!
                </p>
                <a 
                  href={PROPERTY.socials.facebookMessengerUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-white text-blue-700 font-bold text-sm py-2.5 rounded-xl transition-all shadow-sm hover:bg-blue-50 hover:scale-[1.01]"
                >
                  Message Us Directly
                </a>
              </div>

              {/* Dynamic Attractions Node Mapping */}
              <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5">
                <h3 className="text-xs font-bold text-gray-900 mb-4 border-b pb-2 uppercase tracking-wider">Nearby Attractions</h3>
                <ul className="space-y-3">
                  {PROPERTY.nearbyAttractions.map((place, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700 font-semibold">{place.name}</span>
                      <span className="text-gray-400 font-mono text-xs">{place.distanceKm} km away</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Right Column Booking Core Interaction Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
                <div className="bg-blue-50 border-b border-blue-100 p-6">
                  <h2 className="text-lg font-bold text-blue-950 uppercase tracking-wider">Secure Your Stay</h2>
                  <p className="text-xs text-blue-800 mt-0.5">Select your specific check-in/out range targets on the grid below.</p>
                </div>
                <div className="p-6 sm:p-8">
                  <BookingForm />
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Footer implementation structure asset integration mount */}
      <Footer />
    </div>
  );
}