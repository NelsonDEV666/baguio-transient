-- Instantiate payment-receipts bucket (Max 10MB, restricted types)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-receipts',
  'payment-receipts',
  true,
  10485760,
  ARRAY['image/jpeg','image/png','image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Instantiate gallery-images bucket (Max 10MB, restricted types)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery-images',
  'gallery-images',
  true,
  10485760,
  ARRAY['image/jpeg','image/png','image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Storage RLS Rules for Payment Receipts
CREATE POLICY "anon_upload_receipts"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'payment-receipts');

CREATE POLICY "public_read_receipts"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'payment-receipts');

CREATE POLICY "admin_delete_receipts"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'payment-receipts' AND is_admin());

-- Storage RLS Rules for Gallery Images
CREATE POLICY "admin_manage_gallery"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'gallery-images' AND is_admin())
  WITH CHECK (bucket_id = 'gallery-images' AND is_admin());

CREATE POLICY "public_read_gallery_images"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'gallery-images');