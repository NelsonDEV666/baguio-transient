-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Bookings Table
CREATE TABLE bookings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name          VARCHAR(255) NOT NULL,
  guest_email         VARCHAR(255) NOT NULL,
  guest_phone         VARCHAR(50) NOT NULL,
  check_in            DATE NOT NULL,
  check_out           DATE NOT NULL,
  pax_count           INT NOT NULL CHECK (pax_count >= 1 AND pax_count <= 20),
  total_price         DECIMAL(10,2) NOT NULL,
  reservation_fee     DECIMAL(10,2) NOT NULL,
  remaining_balance   DECIMAL(10,2) NOT NULL,
  payment_receipt_url TEXT,
  status              VARCHAR(50) DEFAULT 'pending'
                        CHECK (status IN ('pending','confirmed','cancelled','no_show')),
  special_requests    TEXT,
  rejection_reason    TEXT,
  admin_notes         TEXT,
  notification_sent   BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seasonal Rates Table
CREATE TABLE seasonal_rates (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rate_name         VARCHAR(100) NOT NULL,
  start_date        DATE NOT NULL,
  end_date          DATE NOT NULL,
  base_price        DECIMAL(10,2) NOT NULL,
  extra_pax_price   DECIMAL(10,2) NOT NULL,
  included_pax      INT NOT NULL DEFAULT 4,
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blocked Dates Table
CREATE TABLE blocked_dates (
  id          SERIAL PRIMARY KEY,
  block_date  DATE UNIQUE NOT NULL,
  reason      VARCHAR(255),
  created_by  UUID REFERENCES auth.users(id),
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property Gallery Table
CREATE TABLE gallery_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url         TEXT NOT NULL,
  alt_text    VARCHAR(255),
  sort_order  INT DEFAULT 0,
  is_hero     BOOLEAN DEFAULT FALSE,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Notification Log Table
CREATE TABLE notification_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id    UUID REFERENCES bookings(id) ON DELETE CASCADE,
  type          VARCHAR(100) NOT NULL,
  recipient     VARCHAR(255) NOT NULL,
  status        VARCHAR(50) DEFAULT 'sent',
  error_message TEXT,
  sent_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Settings Table
CREATE TABLE admin_settings (
  key         VARCHAR(100) PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Optimization Indexes
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_check_in ON bookings(check_in);
CREATE INDEX idx_bookings_check_out ON bookings(check_out);
CREATE INDEX idx_bookings_guest_email ON bookings(guest_email);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX idx_blocked_dates_date ON blocked_dates(block_date);
CREATE INDEX idx_seasonal_rates_dates ON seasonal_rates(start_date, end_date);
CREATE INDEX idx_gallery_sort ON gallery_images(sort_order, is_active);

-- Auto-update updated_at Timestamp Trigger Logic
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();