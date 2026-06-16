"use client";

import React, { useState, useEffect } from "react";

export function ImageGallery() {
  const images = [
    { url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80", alt: "Cozy Living Area" },
    { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=500&q=80", alt: "Comfortable Bedroom" },
    { url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=500&q=80", alt: "Fully equipped kitchen" },
    { url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=500&q=80", alt: "Scenic view" }
  ];

  const [activeImage, setActiveImage] = useState(images[0].url);
  const [mounted, setMounted] = useState(false);

  // Defer rendering interactive button attributes until safe client execution
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full aspect-[16/9] rounded-2xl bg-gray-100 animate-pulse" />;
  }

  return (
    <div className="space-y-3">
      <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden border bg-gray-100 shadow-xs">
        <img 
          src={activeImage} 
          alt="Transient View" 
          className="w-full h-full object-cover transition-all duration-300 transform hover:scale-102"
        />
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveImage(img.url)}
            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all bg-gray-100 ${activeImage === img.url ? 'border-blue-600 scale-95 ring-2 ring-blue-100' : 'border-transparent opacity-80 hover:opacity-100'}`}
          >
            <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}