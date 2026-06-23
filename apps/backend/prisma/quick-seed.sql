-- Quick Seed for Barberly - Add Barber Profiles and Services

-- Insert Barber Profiles (users already exist)
INSERT INTO barber_profiles (id, "userId", bio, experience, rating, "reviewCount", status, specialty, "createdAt", "updatedAt")
VALUES
('bp-001', 'barber-001', 'Master barber with 10+ years of experience specializing in classic cuts.', 10, 4.8, 156, 'ACTIVE', 'Classic Haircuts, Beard Grooming, Hot Towel Shaves', NOW(), NOW()),
('bp-002', 'barber-002', 'Professional barber focused on precision cuts and beard designs.', 8, 4.7, 98, 'ACTIVE', 'Fade Haircuts, Beard Design, Hair Coloring', NOW(), NOW()),
('bp-003', 'barber-003', 'Creative stylist with expertise in modern cuts and color.', 12, 4.9, 203, 'ACTIVE', 'Modern Styling, Hair Coloring, Perms', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert Customer Profiles (users already exist)
INSERT INTO customer_profiles (id, "userId", "createdAt", "updatedAt")
VALUES
('cp-001', 'customer-001', NOW(), NOW()),
('cp-002', 'customer-002', NOW(), NOW()),
('cp-003', 'customer-003', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert Shops
INSERT INTO shops (id, name, description, address, city, state, "zipCode", phone, email, "isActive", "createdAt", "updatedAt")
VALUES
('shop-001', 'Downtown Barbershop', 'Premium barbershop in the heart of downtown.', '123 Main Street', 'New York', 'NY', '10001', '+1234567890', 'downtown@barberly.com', true, NOW(), NOW()),
('shop-002', 'West Side Cuts', 'Modern barbershop with a relaxed atmosphere.', '456 West Avenue', 'Los Angeles', 'CA', '90001', '+1234567891', 'westside@barberly.com', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Assign Barbers to Shops
INSERT INTO shop_barbers (id, "barberId", "shopId", "isActive", "createdAt", "updatedAt")
VALUES
('sa-001', 'bp-001', 'shop-001', true, NOW(), NOW()),
('sa-002', 'bp-002', 'shop-002', true, NOW(), NOW()),
('sa-003', 'bp-003', 'shop-001', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert Services
INSERT INTO services (id, "barberId", name, description, price, duration, "isActive", "createdAt", "updatedAt")
VALUES
-- Mike Johnson's Services  
('srv-001', 'bp-001', 'Classic Haircut', 'Traditional haircut with scissors and clippers.', 35.00, 30, true, NOW(), NOW()),
('srv-002', 'bp-001', 'Premium Fade', 'High, mid, or low fade with precision.', 45.00, 45, true, NOW(), NOW()),
('srv-003', 'bp-001', 'Beard Trim & Shape', 'Professional beard trimming.', 25.00, 20, true, NOW(), NOW()),
('srv-004', 'bp-001', 'Hot Towel Shave', 'Traditional straight razor shave.', 40.00, 30, true, NOW(), NOW()),

-- David Brown's Services
('srv-005', 'bp-002', 'Signature Fade', 'Custom fade design.', 50.00, 45, true, NOW(), NOW()),
('srv-006', 'bp-002', 'Beard Design', 'Creative beard shaping.', 30.00, 25, true, NOW(), NOW()),
('srv-007', 'bp-002', 'Hair Color', 'Professional hair coloring.', 80.00, 90, true, NOW(), NOW()),

-- Emma Davis's Services
('srv-008', 'bp-003', 'Modern Cut & Style', 'Contemporary haircut with styling.', 60.00, 60, true, NOW(), NOW()),
('srv-009', 'bp-003', 'Hair Coloring', 'Full or partial hair coloring.', 120.00, 120, true, NOW(), NOW()),
('srv-010', 'bp-003', 'Deep Conditioning', 'Intensive hair treatment.', 45.00, 45, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert Availability (dayOfWeek: 0=Sunday, 1=Monday, ..., 6=Saturday)
INSERT INTO availability (id, "barberId", "dayOfWeek", "startTime", "endTime", "isActive", "createdAt", "updatedAt")
VALUES
-- Mike Johnson - Monday to Saturday (1-6)
('av-001', 'bp-001', 1, '09:00', '18:00', true, NOW(), NOW()),
('av-002', 'bp-001', 2, '09:00', '18:00', true, NOW(), NOW()),
('av-003', 'bp-001', 3, '09:00', '18:00', true, NOW(), NOW()),
('av-004', 'bp-001', 4, '09:00', '18:00', true, NOW(), NOW()),
('av-005', 'bp-001', 5, '09:00', '20:00', true, NOW(), NOW()),
('av-006', 'bp-001', 6, '08:00', '17:00', true, NOW(), NOW()),

-- David Brown - Tuesday to Saturday (2-6)
('av-007', 'bp-002', 2, '10:00', '19:00', true, NOW(), NOW()),
('av-008', 'bp-002', 3, '10:00', '19:00', true, NOW(), NOW()),
('av-009', 'bp-002', 4, '10:00', '19:00', true, NOW(), NOW()),
('av-010', 'bp-002', 5, '10:00', '20:00', true, NOW(), NOW()),
('av-011', 'bp-002', 6, '09:00', '18:00', true, NOW(), NOW()),

-- Emma Davis - Monday to Friday (1-5)
('av-012', 'bp-003', 1, '09:00', '17:00', true, NOW(), NOW()),
('av-013', 'bp-003', 2, '09:00', '17:00', true, NOW(), NOW()),
('av-014', 'bp-003', 3, '09:00', '17:00', true, NOW(), NOW()),
('av-015', 'bp-003', 4, '09:00', '17:00', true, NOW(), NOW()),
('av-016', 'bp-003', 5, '09:00', '19:00', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert Gallery Images
INSERT INTO gallery_images (id, "barberId", "imageUrl", caption, "order", "createdAt")
VALUES
('gal-001', 'bp-001', 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c', 'Classic fade with line up', 1, NOW()),
('gal-002', 'bp-001', 'https://images.unsplash.com/photo-1605497788044-5a32c7078486', 'Premium beard grooming', 2, NOW()),
('gal-003', 'bp-002', 'https://images.unsplash.com/photo-1606819717115-9159c900370b', 'Signature fade design', 1, NOW()),
('gal-004', 'bp-003', 'https://images.unsplash.com/photo-1560869713-7d0a29430803', 'Modern styling work', 1, NOW())
ON CONFLICT (id) DO NOTHING;

-- Verify
SELECT 'Barber Profiles:' as table_name, COUNT(*) as count FROM barber_profiles
UNION ALL
SELECT 'Services:', COUNT(*) FROM services
UNION ALL
SELECT 'Shops:', COUNT(*) FROM shops
UNION ALL
SELECT 'Availability:', COUNT(*) FROM availability
UNION ALL
SELECT 'Gallery Images:', COUNT(*) FROM gallery_images;
