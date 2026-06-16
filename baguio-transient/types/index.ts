export type BookingStatus = "pending" | "confirmed" | "cancelled" | "no_show";

export type Booking = {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  pax_count: number;
  total_price: number;
  reservation_fee: number;
  remaining_balance: number;
  payment_receipt_url: string | null;
  status: BookingStatus;
  special_requests: string | null;
  rejection_reason: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type SeasonalRate = {
  id: string;
  rate_name: string;
  start_date: string;
  end_date: string;
  base_price: number;
  extra_pax_price: number;
  included_pax: number;
  is_active: boolean;
  created_at: string;
};

export type BlockedDate = {
  id: number;
  block_date: string;
  reason: string | null;
  created_at: string;
};

export type GalleryImage = {
  id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_hero: boolean;
  is_active: boolean;
  created_at: string;
};

export type AvailabilityResponse = {
  unavailableDates: string[];
  pendingDates: string[];
  confirmedDates: string[];
  blockedDates: string[];
};

export type DashboardMetrics = {
  pendingCount: number;
  confirmedCount: number;
  totalRevenue: number;
  occupancyThisMonth: number;
  upcomingCheckIns: number;
};

export type PriceBreakdown = {
  nights: number;
  accommodationTotal: number;
  extraPaxFee: number;
  grandTotal: number;
  reservationFee: number;
  remainingBalance: number;
};