-- Barberly Platform - Database Seed File (Corrected for Prisma naming)
-- Tables use snake_case as defined in Prisma schema

-- Clean existing data (in reverse order of foreign keys)
TRUNCATE TABLE reviews, appointments, services, availability, gallery_images, 
         shop_barbers, shops, barber_profiles, customer_profiles, users RESTART IDENTITY CASCADE;

-- ============================================
-- USERS (Customers, Barbers, Admin)
-- ============================================
-- Password for all: Password123!
-- Valid bcrypt hash generated for Password123!

INSERT INTO users (id, email, "passwordHash", "firstName", "lastName", phone, role, "isActive", "createdAt", "updatedAt")
VALUES
-- Admin
('admin-001', 'admin@barberly.com', '$2a$10$eHQlzP629uDd/bQN0skyo.ZHhm1UDQUfN3WfgagLUsfQHWLvBnVzy', 'Admin', 'User', '+1234567890', 'ADMIN', true, NOW(), NOW()),

-- Barbers
('barber-001', 'mike.johnson@barberly.com', '$2a$10$eHQlzP629uDd/bQN0skyo.ZHhm1UDQUfN3WfgagLUsfQHWLvBnVzy', 'Mike', 'Johnson', '+1234567891', 'BARBER', true, NOW(), NOW()),
('barber-002', 'david.brown@barberly.com', '$2a$10$eHQlzP629uDd/bQN0skyo.ZHhm1UDQUfN3WfgagLUsfQHWLvBnVzy', 'David', 'Brown', '+1234567892', 'BARBER', true, NOW(), NOW()),
('barber-003', 'emma.davis@barberly.com', '$2a$10$eHQlzP629uDd/bQN0skyo.ZHhm1UDQUfN3WfgagLUsfQHWLvBnVzy', 'Emma', 'Davis', '+1234567893', 'BARBER', true, NOW(), NOW()),
('barber-004', 'james.wilson@barberly.com', '$2a$10$eHQlzP629uDd/bQN0skyo.ZHhm1UDQUfN3WfgagLUsfQHWLvBnVzy', 'James', 'Wilson', '+1234567894', 'BARBER', true, NOW(), NOW()),
('barber-005', 'sophia.martinez@barberly.com', '$2a$10$eHQlzP629uDd/bQN0skyo.ZHhm1UDQUfN3WfgagLUsfQHWLvBnVzy', 'Sophia', 'Martinez', '+1234567895', 'BARBER', true, NOW(), NOW()),

-- Customers
('customer-001', 'john.doe@example.com', '$2a$10$eHQlzP629uDd/bQN0skyo.ZHhm1UDQUfN3WfgagLUsfQHWLvBnVzy', 'John', 'Doe', '+1234567896', 'CUSTOMER', true, NOW(), NOW()),
('customer-002', 'jane.smith@example.com', '$2a$10$eHQlzP629uDd/bQN0skyo.ZHhm1UDQUfN3WfgagLUsfQHWLvBnVzy', 'Jane', 'Smith', '+1234567897', 'CUSTOMER', true, NOW(), NOW()),
('customer-003', 'alex.johnson@example.com', '$2a$10$eHQlzP629uDd/bQN0skyo.ZHhm1UDQUfN3WfgagLUsfQHWLvBnVzy', 'Alex', 'Johnson', '+1234567898', 'CUSTOMER', true, NOW(), NOW()),
('customer-004', 'maria.garcia@example.com', '$2a$10$eHQlzP629uDd/bQN0skyo.ZHhm1UDQUfN3WfgagLUsfQHWLvBnVzy', 'Maria', 'Garcia', '+1234567899', 'CUSTOMER', true, NOW(), NOW()),
('customer-005', 'robert.chen@example.com', '$2a$10$eHQlzP629uDd/bQN0skyo.ZHhm1UDQUfN3WfgagLUsfQHWLvBnVzy', 'Robert', 'Chen', '+1234567800', 'CUSTOMER', true, NOW(), NOW());

-- ============================================
-- CUSTOMER PROFILES
-- ============================================
INSERT INTO customer_profiles (id, "userId", "dateOfBirth", address, city, state, "zipCode", "createdAt", "updatedAt")
VALUES
('cp-001', 'customer-001', '1990-05-15', '123 Customer St', 'New York', 'NY', '10001', NOW(), NOW()),
('cp-002', 'customer-002', '1985-08-22', '456 Main Ave', 'Los Angeles', 'CA', '90001', NOW(), NOW()),
('cp-003', 'customer-003', '1992-03-10', '789 Oak Rd', 'Chicago', 'IL', '60601', NOW(), NOW()),
('cp-004', 'customer-004', '1988-11-30', '321 Pine St', 'Houston', 'TX', '77001', NOW(), NOW()),
('cp-005', 'customer-005', '1995-07-18', '654 Elm Dr', 'Phoenix', 'AZ', '85001', NOW(), NOW());

-- ============================================
-- BARBER PROFILES
-- ============================================
INSERT INTO barber_profiles (id, "userId", bio, specialties, "yearsOfExperience", "licenseNumber", "approvalStatus", 
                             city, state, "zipCode", "createdAt", "updatedAt")
VALUES
('bp-001', 'barber-001', 
 'Master barber with 10+ years of experience. Specializing in classic cuts and modern styles.',
 ARRAY['Classic Haircuts', 'Beard Grooming', 'Hot Towel Shaves', 'Hair Styling'],
 10, 'BAR-2014-001', 'APPROVED',
 'New York', 'NY', '10001', NOW(), NOW()),

('bp-002', 'barber-002',
 'Professional barber focused on precision cuts and beard designs.',
 ARRAY['Fade Haircuts', 'Beard Design', 'Hair Coloring', 'Scalp Treatment'],
 8, 'BAR-2016-002', 'APPROVED',
 'Los Angeles', 'CA', '90001', NOW(), NOW()),

('bp-003', 'barber-003',
 'Creative stylist with expertise in modern cuts and color.',
 ARRAY['Modern Styling', 'Hair Coloring', 'Perms', 'Hair Treatment'],
 12, 'BAR-2012-003', 'APPROVED',
 'Chicago', 'IL', '60601', NOW(), NOW()),

('bp-004', 'barber-004',
 'Traditional barber offering timeless cuts and premium grooming services.',
 ARRAY['Traditional Cuts', 'Straight Razor Shave', 'Beard Trim'],
 15, 'BAR-2009-004', 'APPROVED',
 'Houston', 'TX', '77001', NOW(), NOW()),

('bp-005', 'barber-005',
 'Expert in contemporary styles and trendy cuts.',
 ARRAY['Trendy Cuts', 'Fade Designs', 'Hair Art', 'Styling'],
 6, 'BAR-2018-005', 'APPROVED',
 'Phoenix', 'AZ', '85001', NOW(), NOW());

-- ============================================
-- SHOPS
-- ============================================
INSERT INTO shops (id, name, description, address, city, state, "zipCode", phone, email, 
                   "imageUrl", "isActive", "createdAt", "updatedAt")
VALUES
('shop-001', 'Downtown Barbershop',
 'Premium barbershop in the heart of downtown.',
 '123 Main Street', 'New York', 'NY', '10001',
 '+1234567890', 'downtown@barberly.com',
 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70',
 true, NOW(), NOW()),

('shop-002', 'West Side Cuts',
 'Modern barbershop with a relaxed atmosphere.',
 '456 West Avenue', 'Los Angeles', 'CA', '90001',
 '+1234567891', 'westside@barberly.com',
 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1',
 true, NOW(), NOW()),

('shop-003', 'Classic Cuts & Shaves',
 'Traditional barbershop experience.',
 '789 Oak Street', 'Chicago', 'IL', '60601',
 '+1234567892', 'classic@barberly.com',
 'https://images.unsplash.com/photo-1621605815971-fbc98d665033',
 true, NOW(), NOW());

-- ============================================
-- SHOP ASSIGNMENTS (Barbers assigned to Shops)
-- ============================================
INSERT INTO shop_barbers (id, "barberId", "shopId", role, "startDate", "isActive", "createdAt", "updatedAt")
VALUES
('sa-001', 'bp-001', 'shop-001', 'Senior Barber', NOW() - INTERVAL '2 years', true, NOW(), NOW()),
('sa-002', 'bp-002', 'shop-002', 'Master Barber', NOW() - INTERVAL '1 year', true, NOW(), NOW()),
('sa-003', 'bp-003', 'shop-003', 'Lead Stylist', NOW() - INTERVAL '3 years', true, NOW(), NOW()),
('sa-004', 'bp-004', 'shop-001', 'Master Barber', NOW() - INTERVAL '1 year 6 months', true, NOW(), NOW()),
('sa-005', 'bp-005', 'shop-002', 'Stylist', NOW() - INTERVAL '6 months', true, NOW(), NOW());

-- ============================================
-- SERVICES
-- ============================================
INSERT INTO services (id, "barberId", name, description, price, duration, category, "isActive", "createdAt", "updatedAt")
VALUES
-- Mike Johnson's Services
('srv-001', 'bp-001', 'Classic Haircut', 'Traditional haircut with scissors and clippers.', 35.00, 30, 'Haircuts', true, NOW(), NOW()),
('srv-002', 'bp-001', 'Premium Fade', 'High, mid, or low fade with precision.', 45.00, 45, 'Haircuts', true, NOW(), NOW()),
('srv-003', 'bp-001', 'Beard Trim & Shape', 'Professional beard trimming.', 25.00, 20, 'Beard', true, NOW(), NOW()),
('srv-004', 'bp-001', 'Hot Towel Shave', 'Traditional straight razor shave.', 40.00, 30, 'Shaving', true, NOW(), NOW()),
('srv-005', 'bp-001', 'Haircut & Beard Combo', 'Complete grooming package.', 55.00, 60, 'Combo', true, NOW(), NOW()),

-- David Brown's Services
('srv-006', 'bp-002', 'Signature Fade', 'Custom fade design.', 50.00, 45, 'Haircuts', true, NOW(), NOW()),
('srv-007', 'bp-002', 'Beard Design', 'Creative beard shaping.', 30.00, 25, 'Beard', true, NOW(), NOW()),
('srv-008', 'bp-002', 'Hair Color', 'Professional hair coloring.', 80.00, 90, 'Coloring', true, NOW(), NOW()),
('srv-009', 'bp-002', 'Scalp Treatment', 'Therapeutic scalp massage.', 35.00, 30, 'Treatment', true, NOW(), NOW()),

-- Emma Davis's Services  
('srv-010', 'bp-003', 'Modern Cut & Style', 'Contemporary haircut with styling.', 60.00, 60, 'Haircuts', true, NOW(), NOW()),
('srv-011', 'bp-003', 'Hair Coloring', 'Full or partial hair coloring.', 120.00, 120, 'Coloring', true, NOW(), NOW()),
('srv-012', 'bp-003', 'Perm Service', 'Professional perm treatment.', 150.00, 150, 'Treatment', true, NOW(), NOW()),
('srv-013', 'bp-003', 'Deep Conditioning', 'Intensive hair treatment.', 45.00, 45, 'Treatment', true, NOW(), NOW()),

-- James Wilson's Services
('srv-014', 'bp-004', 'Traditional Cut', 'Classic barbering.', 40.00, 35, 'Haircuts', true, NOW(), NOW()),
('srv-015', 'bp-004', 'Straight Razor Shave', 'Luxury shave.', 50.00, 40, 'Shaving', true, NOW(), NOW()),
('srv-016', 'bp-004', 'Beard Maintenance', 'Complete beard care.', 30.00, 25, 'Beard', true, NOW(), NOW()),

-- Sophia Martinez's Services
('srv-017', 'bp-005', 'Trendy Cut', 'Latest styles.', 45.00, 40, 'Haircuts', true, NOW(), NOW()),
('srv-018', 'bp-005', 'Fade Design', 'Artistic fade.', 55.00, 50, 'Haircuts', true, NOW(), NOW()),
('srv-019', 'bp-005', 'Hair Art', 'Creative hair designs.', 40.00, 30, 'Styling', true, NOW(), NOW());

-- ============================================
-- BARBER AVAILABILITY
-- ============================================
INSERT INTO availability (id, "barberId", "dayOfWeek", "startTime", "endTime", "isAvailable", "createdAt", "updatedAt")
VALUES
-- Mike Johnson
('ba-001', 'bp-001', 'MONDAY', '09:00', '18:00', true, NOW(), NOW()),
('ba-002', 'bp-001', 'TUESDAY', '09:00', '18:00', true, NOW(), NOW()),
('ba-003', 'bp-001', 'WEDNESDAY', '09:00', '18:00', true, NOW(), NOW()),
('ba-004', 'bp-001', 'THURSDAY', '09:00', '18:00', true, NOW(), NOW()),
('ba-005', 'bp-001', 'FRIDAY', '09:00', '20:00', true, NOW(), NOW()),
('ba-006', 'bp-001', 'SATURDAY', '08:00', '17:00', true, NOW(), NOW()),

-- David Brown
('ba-007', 'bp-002', 'TUESDAY', '10:00', '19:00', true, NOW(), NOW()),
('ba-008', 'bp-002', 'WEDNESDAY', '10:00', '19:00', true, NOW(), NOW()),
('ba-009', 'bp-002', 'THURSDAY', '10:00', '19:00', true, NOW(), NOW()),
('ba-010', 'bp-002', 'FRIDAY', '10:00', '20:00', true, NOW(), NOW()),
('ba-011', 'bp-002', 'SATURDAY', '09:00', '18:00', true, NOW(), NOW()),

-- Emma Davis
('ba-012', 'bp-003', 'MONDAY', '09:00', '17:00', true, NOW(), NOW()),
('ba-013', 'bp-003', 'TUESDAY', '09:00', '17:00', true, NOW(), NOW()),
('ba-014', 'bp-003', 'WEDNESDAY', '09:00', '17:00', true, NOW(), NOW()),
('ba-015', 'bp-003', 'THURSDAY', '09:00', '17:00', true, NOW(), NOW()),
('ba-016', 'bp-003', 'FRIDAY', '09:00', '19:00', true, NOW(), NOW());

-- ============================================
-- APPOINTMENTS
-- ============================================
INSERT INTO appointments (id, "customerId", "barberId", "serviceId", "shopId", "appointmentDate", 
                          "startTime", "endTime", status, notes, "totalPrice", "createdAt", "updatedAt")
VALUES
-- Past Appointments (COMPLETED)
('apt-001', 'customer-001', 'bp-001', 'srv-001', 'shop-001', 
 CURRENT_DATE - INTERVAL '10 days', '10:00', '10:30', 'COMPLETED', 
 'Regular customer', 35.00, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),

('apt-002', 'customer-002', 'bp-003', 'srv-010', 'shop-003',
 CURRENT_DATE - INTERVAL '8 days', '14:00', '15:00', 'COMPLETED',
 'First time customer', 60.00, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),

('apt-003', 'customer-003', 'bp-002', 'srv-006', 'shop-002',
 CURRENT_DATE - INTERVAL '5 days', '11:00', '11:45', 'COMPLETED',
 NULL, 50.00, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),

-- Today's Appointments
('apt-004', 'customer-001', 'bp-004', 'srv-015', 'shop-001',
 CURRENT_DATE, '09:00', '09:40', 'CONFIRMED',
 'Prefers close shave', 50.00, NOW() - INTERVAL '2 days', NOW()),

('apt-005', 'customer-005', 'bp-002', 'srv-007', 'shop-002',
 CURRENT_DATE, '11:30', '11:55', 'PENDING',
 'New design', 30.00, NOW() - INTERVAL '1 day', NOW());

-- ============================================
-- REVIEWS
-- ============================================
INSERT INTO reviews (id, "appointmentId", "customerId", "barberId", rating, comment, tags, 
                     "barberReply", "repliedAt", "createdAt", "updatedAt")
VALUES
('rev-001', 'apt-001', 'customer-001', 'bp-001', 5,
 'Excellent service! Mike is very professional.',
 ARRAY['Professional', 'Skilled', 'Friendly'],
 'Thank you so much!',
 NOW() - INTERVAL '9 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days'),

('rev-002', 'apt-002', 'customer-002', 'bp-003', 5,
 'Emma is amazing! Great recommendations.',
 ARRAY['Creative', 'Professional'],
 'So glad you love it!',
 NOW() - INTERVAL '7 days', NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days'),

('rev-003', 'apt-003', 'customer-003', 'bp-002', 4,
 'Great haircut! Very skilled.',
 ARRAY['Skilled', 'Quality Work'],
 NULL, NULL, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days');

-- ============================================
-- GALLERY IMAGES
-- ============================================
INSERT INTO gallery_images (id, "barberId", "imageUrl", caption, "uploadedAt", "createdAt", "updatedAt")
VALUES
('gal-001', 'bp-001', 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c', 'Classic fade', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days', NOW()),
('gal-002', 'bp-001', 'https://images.unsplash.com/photo-1605497788044-5a32c7078486', 'Premium beard', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days', NOW()),
('gal-003', 'bp-002', 'https://images.unsplash.com/photo-1606819717115-9159c900370b', 'Signature fade', NOW() - INTERVAL '28 days', NOW() - INTERVAL '28 days', NOW()),
('gal-004', 'bp-003', 'https://images.unsplash.com/photo-1560869713-7d0a29430803', 'Modern styling', NOW() - INTERVAL '35 days', NOW() - INTERVAL '35 days', NOW());

-- Done! Verify with:
-- SELECT COUNT(*) FROM users;
-- SELECT COUNT(*) FROM barber_profiles;
-- SELECT COUNT(*) FROM services;
-- SELECT COUNT(*) FROM appointments;
