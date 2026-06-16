-- Seed baseline calendar seasonal price definitions for 2026/2027 runs
INSERT INTO seasonal_rates (rate_name, start_date, end_date, base_price, extra_pax_price, included_pax)
VALUES
  ('Regular Rainy Season Rate', '2026-06-01', '2026-10-30', 3500.00, 300.00, 4),
  ('Undas Peak Weekend',        '2026-10-31', '2026-11-02', 4500.00, 400.00, 4),
  ('Pre-Christmas Peak',       '2026-11-03', '2026-12-19', 3800.00, 300.00, 4),
  ('Christmas Celebration',    '2026-12-20', '2026-12-26', 5000.00, 450.00, 4),
  ('New Year Holiday Surge',   '2026-12-27', '2027-01-02', 6000.00, 500.00, 4),
  ('Regular Dry Season Rate',   '2027-01-03', '2027-04-14', 3500.00, 300.00, 4);

-- Seed primary operational fallback values
INSERT INTO admin_settings (key, value) VALUES
  ('min_stay_nights', '1'),
  ('max_advance_booking_days', '365'),
  ('booking_cutoff_hours', '24'),
  ('notify_admin_email', 'admin@thepinesbaguio.com')
ON CONFLICT (key) DO NOTHING;