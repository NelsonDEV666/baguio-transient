import { Resend } from "resend";
import { PROPERTY } from "./config/property";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummyKeyForBuild");

type Booking = {
  id: string;
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  pax_count: number;
  total_price: number;
  reservation_fee: number;
  remaining_balance: number;
  rejection_reason?: string;
};

export async function sendBookingReceivedGuest(booking: Booking) {
  return resend.emails.send({
    from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
    to: booking.guest_email,
    subject: `Booking Received — Reference #${booking.id.slice(0, 8).toUpperCase()}`,
    html: bookingReceivedGuestHtml(booking),
  });
}

export async function sendBookingAlertAdmin(booking: Booking) {
  const adminEmail = process.env.ADMIN_EMAIL!;
  return resend.emails.send({
    from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
    to: adminEmail,
    subject: `New Booking from ${booking.guest_name}`,
    html: bookingAlertAdminHtml(booking),
  });
}

export async function sendBookingConfirmedGuest(booking: Booking) {
  return resend.emails.send({
    from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
    to: booking.guest_email,
    subject: `Booking Confirmed — ${PROPERTY.name}`,
    html: bookingConfirmedGuestHtml(booking),
  });
}

export async function sendBookingRejectedGuest(booking: Booking) {
  return resend.emails.send({
    from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
    to: booking.guest_email,
    subject: `Booking Update — ${PROPERTY.name}`,
    html: bookingRejectedGuestHtml(booking),
  });
}

// --- HTML Templates ---

function bookingReceivedGuestHtml(b: Booking): string {
  return `
    <h2>Hi ${b.guest_name},</h2>
    <p>We've received your booking request. Please wait for admin confirmation within 24 hours.</p>
    <p><strong>Reference ID:</strong> ${b.id.slice(0, 8).toUpperCase()}</p>
    <p><strong>Check-in:</strong> ${b.check_in}</p>
    <p><strong>Check-out:</strong> ${b.check_out}</p>
    <p><strong>Pax:</strong> ${b.pax_count}</p>
    <p><strong>Total:</strong> ₱${b.total_price.toLocaleString()}</p>
    <p><strong>Reservation Fee (50%):</strong> ₱${b.reservation_fee.toLocaleString()}</p>
    <p>We will notify you once your booking is confirmed.</p>
    <p>— ${PROPERTY.name} Team</p>
  `;
}

function bookingAlertAdminHtml(b: Booking): string {
  const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin`;
  return `
    <h2>New Booking Received</h2>
    <p><strong>Guest:</strong> ${b.guest_name} (${b.guest_email})</p>
    <p><strong>Dates:</strong> ${b.check_in} → ${b.check_out}</p>
    <p><strong>Pax:</strong> ${b.pax_count}</p>
    <p><strong>Total:</strong> ₱${b.total_price.toLocaleString()}</p>
    <p><a href="${adminUrl}">Go to Admin Dashboard →</a></p>
  `;
}

function bookingConfirmedGuestHtml(b: Booking): string {
  return `
    <h2>Your booking is confirmed! 🎉</h2>
    <p>Hi ${b.guest_name}, we're excited to host you at ${PROPERTY.name}.</p>
    <p><strong>Check-in:</strong> ${b.check_in} at ${PROPERTY.checkInTime}</p>
    <p><strong>Check-out:</strong> ${b.check_out} by ${PROPERTY.checkOutTime}</p>
    <p><strong>Remaining Balance:</strong> ₱${b.remaining_balance.toLocaleString()} (due on arrival)</p>
    <p>For inquiries, contact us at ${(PROPERTY as any).contact?.phone || "our registered number"}</p>
  `;
}

function bookingRejectedGuestHtml(b: Booking): string {
  return `
    <h2>Booking Update</h2>
    <p>Hi ${b.guest_name}, unfortunately we were unable to confirm your booking.</p>
    ${b.rejection_reason ? `<p><strong>Reason:</strong> ${b.rejection_reason}</p>` : ""}
    <p>Please try different dates or contact us at ${(PROPERTY as any).contact?.phone || "our registered number"}.</p>
  `;
}