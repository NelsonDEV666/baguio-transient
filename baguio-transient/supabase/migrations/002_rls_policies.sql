-- Enable RLS on all core data endpoints
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasonal_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check if current request belongs to an authenticated admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.role() = 'authenticated';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bookings Table Security Policies
CREATE POLICY "guests_create_bookings"
  ON bookings FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "admin_full_bookings"
  ON bookings FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- Seasonal Rates Table Security Policies
CREATE POLICY "public_read_rates"
  ON seasonal_rates FOR SELECT TO anon USING (is_active = TRUE);

CREATE POLICY "admin_full_rates"
  ON seasonal_rates FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- Blocked Dates Table Security Policies
CREATE POLICY "public_read_blocked"
  ON blocked_dates FOR SELECT TO anon USING (true);

CREATE POLICY "admin_full_blocked"
  ON blocked_dates FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- Gallery Images Table Security Policies
CREATE POLICY "public_read_gallery"
  ON gallery_images FOR SELECT TO anon USING (is_active = TRUE);

CREATE POLICY "admin_full_gallery"
  ON gallery_images FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- Notification Log Table Security Policies
CREATE POLICY "admin_full_notifications"
  ON notification_log FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- Admin Settings Table Security Policies
CREATE POLICY "public_read_settings"
  ON admin_settings FOR SELECT TO anon USING (true);

CREATE POLICY "admin_full_settings"
  ON admin_settings FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());