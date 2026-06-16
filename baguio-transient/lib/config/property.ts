export const PROPERTY = {
  // Brand Identity Configuration
  name: "Your Property Name Here",
  tagline: "Experience the perfect cozy staycation getaway designed for comfort",
  location: "City, Province, Philippines",
  city: "Your City", 
  maxPax: 10,
  checkInTime: "2:00 PM",
  checkOutTime: "12:00 PM",

  // Automated Financial Parameters
  basePriceWeekday: 3500,
  basePriceWeekend: 4500,
  basePaxCount: 4,
  extraPaxPrice: 500,
  reservationFeePercent: 50,

  // Feature Allocations Checklist
  amenities: [
    "Hot Shower",
    "High-Speed WiFi",
    "Secured Parking",
    "Complete Kitchen",
    "Smart TV Setup",
    "Family Friendly",
    "Air Conditioning",
    "Fresh Bed Linens"
  ],

  // Client-Customizable Navigation Landmarks
  nearbyAttractions: [
    { name: "Local Tourist Landmark Alpha", distanceKm: 1.2 },
    { name: "Famous City Park Area", distanceKm: 2.5 },
    { name: "Central Shopping Mall", distanceKm: 3.1 },
    { name: "Popular Dining District", distanceKm: 0.8 }
  ],

  // Localization Payment Configurations
  paymentInstructions: {
    gcash: {
      number: "09XX XXX XXXX",
      name: "PROPERTY OWNER NAME"
    },
    bankTransfer: {
      bank: "BDO / BPI",
      accountNumber: "XXXX-XXXX-XXXX",
      accountName: "PROPERTY OWNER NAME"
    }
  },

  // Structural Cancellation Thresholds
  cancellationPolicy: {
    fullRefundDaysBeforeCheckIn: 7,
    partialRefundDaysBeforeCheckIn: 3,
    partialRefundPercent: 50,
    noRefundDaysBeforeCheckIn: 2
  },

  // White-Label Client External Contact Links
  socials: {
    facebookMessengerUrl: "https://m.me/your-page-id",
    facebookPageUrl: "https://facebook.com/your-page-slug",
    businessEmail: "reservations@yourdomain.com"
  },

  // Global Optimization SEO Metrics
  seo: {
    title: "Premium Transient & Staycation Hub",
    description: "Book your next secure vacation getaway rental directly with our optimized interactive date scheduling matrix.",
    keywords: ["transient house", "staycation rental", "vacation home", "direct booking"]
  }
} as const;