import { z } from "zod";

export const BookingSchema = z.object({
  guest_name: z.string().min(2).max(255),
  guest_email: z.string().email(),
  guest_phone: z.string().min(10).max(20).regex(/^[0-9+\-\s()]+$/),
  check_in: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  check_out: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  pax_count: z.number().int().min(1).max(20),
  special_requests: z.string().max(500).optional(),
  payment_receipt_url: z.string().url(),
}).refine(
  (data) => new Date(data.check_out) > new Date(data.check_in),
  { message: "Check-out must be after check-in", path: ["check_out"] }
).refine(
  (data) => new Date(data.check_in) >= new Date(new Date().toISOString().split("T")[0]),
  { message: "Check-in cannot be in the past", path: ["check_in"] }
);

export const SeasonalRateSchema = z.object({
  rate_name: z.string().min(1).max(100),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  base_price: z.number().positive(),
  extra_pax_price: z.number().nonnegative(),
  included_pax: z.number().int().min(1),
}).refine(
  (data) => data.end_date > data.start_date,
  { message: "End date must be after start date", path: ["end_date"] }
);

export const BlockDateSchema = z.object({
  block_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().max(255).optional(),
});

export const RejectBookingSchema = z.object({
  bookingId: z.string().uuid(),
  reason: z.string().min(5).max(500),
});