-- Barberly Platform - Database Seed File
-- Run this after: npx prisma migrate dev
-- Execute: psql -U postgres -d barberly -f seed.sql

-- Clean existing data (in reverse order of foreign keys)
TRUNCATE TABLE "Review", "Appointment", "Service", "BarberAvailability", "GalleryImage", 
         "ShopAssignment", "Shop", "BarberProfile", "User" RESTART IDENTITY CASCADE;

-- ============================================
-- USERS (Customers, Barbers, Admin)
-- ============================================
-- Password for all: Password123! (bcrypt hashed)
-- $2b$10$rL5H5h8B5KqH8kH5h8B5KO8H5h8B5KqH8kH5h8B5KO8H5h8B5KqH8

INSERT INTO "User" (id, email, password, "firstName", "lastName", phone, role, "isActive", "createdAt", "updatedAt")
VALUES
-- Admin
('admin-001', 'admin@barberly.com', '$2b$10$rL5H5h8B5KqH8kH5h8B5KO8H5h8B5KqH8kH5h8B5KO8H5h8B5KqH8', 'Admin', 'User', '+1234567890', 'ADMIN', true, NOW(), NOW()),

-- Barbers
('barber-001', 'mike.johnson@barberly.com', '$2b$10$rL5H5h8B5KqH8kH5h8B5KO8H5h8B5KqH8kH5h8B5KO8H5h8B5KqH8', 'Mike', 'Johnson', '+1234567891', 'BARBER', true, NOW(), NOW()),
('barber-002', 'david.brown@barberly.com', '$2b$10$rL5H5h8B5KqH8kH5h8B5KO8H5h8B5KqH8kH5h8B5KO8H5h8B5KqH8', 'David', 'Brown', '+1234567892', 'BARBER', true, NOW(), NOW()),
('barber-003', 'emma.davis@barberly.com', '$2b$10$rL5H5h8B5KqH8kH5h8B5KO8H5h8B5KqH8kH5h8B5KO8H5h8B5KqH8', 'Emma', 'Davis', '+1234567893', 'BARBER', true, NOW(), NOW()),
('barber-004', 'james.wilson@barberly.com', '$2b$10$rL5H5h8B5KqH8kH5h8B5KO8H5h8B5KqH8kH5h8B5KO8H5h8B5KqH8', 'James', 'Wilson', '+1234567894', 'BARBER', true, NOW(), NOW()),
('barber-005', 'sophia.martinez@barberly.com', '$2b$10$rL5H5h8B5KqH8kH5h8B5KO8H5h8B5KqH8kH5h8B5KO8H5h8B5KqH8', 'Sophia', 'Martinez', '+1234567895', 'BARBER', true, NOW(), NOW()),

-- Customers
('customer-001', 'john.doe@example.com', '$2b$10$rL5H5h8B5KqH8kH5h8B5KO8H5h8B5KqH8kH5h8B5KO8H5h8B5KqH8', 'John', 'Doe', '+1234567896', 'CUSTOMER', true, NOW(), NOW()),
('customer-002', 'jane.smith@example.com', '$2b$10$rL5H5h8B5KqH8kH5h8B5KO8H5h8B5KqH8kH5h8B5KO8H5h8B5KqH8', 'Jane', 'Smith', '+1234567897', 'CUSTOMER', true, NOW(), NOW()),
('customer-003', 'alex.johnson@example.com', '$2b$10$rL5H5h8B5KqH8kH5h8B5KO8H5h8B5KqH8kH5h8B5KO8H5h8B5KqH8', 'Alex', 'Johnson', '+1234567898', 'CUSTOMER', true, NOW(), NOW()),
('customer-004', 'maria.garcia@example.com', '$2b$10$rL5H5h8B5KqH8kH5h8B5KO8H5h8B5KqH8kH5h8B5KO8H5h8B5KqH8', 'Maria', 'Garcia', '+1234567899', 'CUSTOMER', true, NOW(), NOW()),
('customer-005', 'robert.chen@example.com', '$2b$10$rL5H5h8B5KqH8kH5h8B5KO8H5h8B5KqH8kH5h8B5KO8H5h8B5KqH8', 'Robert', 'Chen', '+1234567800', 'CUSTOMER', true, NOW(), NOW());

-- ============================================
-- BARBER PROFILES
-- ============================================
INSERT INTO "BarberProfile" (id, "userId", bio, specialties, "yearsOfExperience", rating, "totalReviews", 
                             "licenseNumber", "idProofUrl", "approvalStatus", city, state, "zipCode", "createdAt", "updatedAt")
VALUES
('bp-001', 'barber-001', 
 'Master barber with 10+ years of experience. Specializing in classic cuts and modern styles. Passionate about making every client look their best.',
 ARRAY['Classic Haircuts', 'Beard Grooming', 'Hot Towel Shaves', 'Hair Styling'],
 10, 4.8, 156, 'BAR-2014-001', 'https://example.com/id1.jpg', 'APPROVED',
 'New York', 'NY', '10001', NOW(), NOW()),

('bp-002', 'barber-002',
 'Professional barber focused on precision cuts and beard designs. Trained in traditional and contemporary techniques.',
 ARRAY['Fade Haircuts', 'Beard Design', 'Hair Coloring', 'Scalp Treatment'],
 8, 4.7, 98, 'BAR-2016-002', 'https://example.com/id2.jpg', 'APPROVED',
 'Los Angeles', 'CA', '90001', NOW(), NOW()),

('bp-003', 'barber-003',
 'Creative stylist with expertise in modern cuts and color. Love helping clients express their personality through their hair.',
 ARRAY['Modern Styling', 'Hair Coloring', 'Perms', 'Hair Treatment'],
 12, 4.9, 203, 'BAR-2012-003', 'https://example.com/id3.jpg', 'APPROVED',
 'Chicago', 'IL', '60601', NOW(), NOW()),

('bp-004', 'barber-004',
 'Traditional barber offering timeless cuts and premium grooming services. Attention to detail is my priority.',
 ARRAY['Traditional Cuts', 'Straight Razor Shave', 'Beard Trim', 'Hair Texture'],
 15, 4.6, 187, 'BAR-2009-004', 'https://example.com/id4.jpg', 'APPROVED',
 'Houston', 'TX', '77001', NOW(), NOW()),

('bp-005', 'barber-005',
 'Expert in contemporary styles and trendy cuts. Always up-to-date with the latest hair trends and techniques.',
 ARRAY['Trendy Cuts', 'Fade Designs', 'Hair Art', 'Styling'],
 6, 4.5, 74, 'BAR-2018-005', 'https://example.com/id5.jpg', 'APPROVED',
 'Phoenix', 'AZ', '85001', NOW(), NOW());

-- ============================================
-- SHOPS
-- ============================================
INSERT INTO "Shop" (id, name, description, address, city, state, "zipCode", phone, email, 
                    "openingHours", amenities, "imageUrl", "isActive", "createdAt", "updatedAt")
VALUES
('shop-001', 'Downtown Barbershop',
 'Premium barbershop in the heart of downtown. Offering classic and modern grooming services.',
 '123 Main Street', 'New York', 'NY', '10001',
 '+1234567890', 'downtown@barberly.com',
 '{"Monday": "9:00 AM - 8:00 PM", "Tuesday": "9:00 AM - 8:00 PM", "Wednesday": "9:00 AM - 8:00 PM", "Thursday": "9:00 AM - 8:00 PM", "Friday": "9:00 AM - 9:00 PM", "Saturday": "8:00 AM - 9:00 PM", "Sunday": "10:00 AM - 6:00 PM"}',
 ARRAY['WiFi', 'Parking', 'Coffee', 'TV', 'Credit Cards'],
 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70',
 true, NOW(), NOW()),

('shop-002', 'West Side Cuts',
 'Modern barbershop with a relaxed atmosphere. Walk-ins welcome!',
 '456 West Avenue', 'Los Angeles', 'CA', '90001',
 '+1234567891', 'westside@barberly.com',
 '{"Monday": "10:00 AM - 7:00 PM", "Tuesday": "10:00 AM - 7:00 PM", "Wednesday": "10:00 AM - 7:00 PM", "Thursday": "10:00 AM - 7:00 PM", "Friday": "10:00 AM - 8:00 PM", "Saturday": "9:00 AM - 8:00 PM", "Sunday": "Closed"}',
 ARRAY['WiFi', 'Refreshments', 'Modern Equipment'],
 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1',
 true, NOW(), NOW()),

('shop-003', 'Classic Cuts & Shaves',
 'Traditional barbershop experience with old-school charm and new-school technique.',
 '789 Oak Street', 'Chicago', 'IL', '60601',
 '+1234567892', 'classic@barberly.com',
 '{"Monday": "8:00 AM - 6:00 PM", "Tuesday": "8:00 AM - 6:00 PM", "Wednesday": "8:00 AM - 6:00 PM", "Thursday": "8:00 AM - 6:00 PM", "Friday": "8:00 AM - 7:00 PM", "Saturday": "8:00 AM - 5:00 PM", "Sunday": "Closed"}',
 ARRAY['Hot Towels', 'Vintage Chairs', 'Classic Atmosphere'],
 'https://images.unsplash.com/photo-1621605815971-fbc98d665033',
 true, NOW(), NOW());

-- ============================================
-- SHOP ASSIGNMENTS (Barbers assigned to Shops)
-- ============================================
INSERT INTO "ShopAssignment" (id, "barberId", "shopId", role, "startDate", "endDate", "isActive", "createdAt", "updatedAt")
VALUES
('sa-001', 'bp-001', 'shop-001', 'Senior Barber', NOW() - INTERVAL '2 years', NULL, true, NOW(), NOW()),
('sa-002', 'bp-002', 'shop-002', 'Master Barber', NOW() - INTERVAL '1 year', NULL, true, NOW(), NOW()),
('sa-003', 'bp-003', 'shop-003', 'Lead Stylist', NOW() - INTERVAL '3 years', NULL, true, NOW(), NOW()),
('sa-004', 'bp-004', 'shop-001', 'Master Barber', NOW() - INTERVAL '1 year 6 months', NULL, true, NOW(), NOW()),
('sa-005', 'bp-005', 'shop-002', 'Stylist', NOW() - INTERVAL '6 months', NULL, true, NOW(), NOW());

-- ============================================
-- SERVICES
-- ============================================
INSERT INTO "Service" (id, "barberId", name, description, price, duration, category, "isActive", "createdAt", "updatedAt")
VALUES
-- Mike Johnson's Services
('srv-001', 'bp-001', 'Classic Haircut', 'Traditional haircut with scissors and clippers. Includes consultation and styling.', 35.00, 30, 'Haircuts', true, NOW(), NOW()),
('srv-002', 'bp-001', 'Premium Fade', 'High, mid, or low fade with precision detail work.', 45.00, 45, 'Haircuts', true, NOW(), NOW()),
('srv-003', 'bp-001', 'Beard Trim & Shape', 'Professional beard trimming and shaping with hot towel treatment.', 25.00, 20, 'Beard', true, NOW(), NOW()),
('srv-004', 'bp-001', 'Hot Towel Shave', 'Traditional straight razor shave with hot towels and premium products.', 40.00, 30, 'Shaving', true, NOW(), NOW()),
('srv-005', 'bp-001', 'Haircut & Beard Combo', 'Complete grooming package with haircut and beard service.', 55.00, 60, 'Combo', true, NOW(), NOW()),

-- David Brown's Services
('srv-006', 'bp-002', 'Signature Fade', 'Custom fade design tailored to your style.', 50.00, 45, 'Haircuts', true, NOW(), NOW()),
('srv-007', 'bp-002', 'Beard Design', 'Creative beard shaping and design work.', 30.00, 25, 'Beard', true, NOW(), NOW()),
('srv-008', 'bp-002', 'Hair Color', 'Professional hair coloring service.', 80.00, 90, 'Coloring', true, NOW(), NOW()),
('srv-009', 'bp-002', 'Scalp Treatment', 'Therapeutic scalp massage and treatment.', 35.00, 30, 'Treatment', true, NOW(), NOW()),

-- Emma Davis's Services  
('srv-010', 'bp-003', 'Modern Cut & Style', 'Contemporary haircut with professional styling.', 60.00, 60, 'Haircuts', true, NOW(), NOW()),
('srv-011', 'bp-003', 'Hair Coloring', 'Full or partial hair coloring with premium products.', 120.00, 120, 'Coloring', true, NOW(), NOW()),
('srv-012', 'bp-003', 'Perm Service', 'Professional perm or wave treatment.', 150.00, 150, 'Treatment', true, NOW(), NOW()),
('srv-013', 'bp-003', 'Deep Conditioning', 'Intensive hair treatment and conditioning.', 45.00, 45, 'Treatment', true, NOW(), NOW()),

-- James Wilson's Services
('srv-014', 'bp-004', 'Traditional Cut', 'Classic barbering with timeless technique.', 40.00, 35, 'Haircuts', true, NOW(), NOW()),
('srv-015', 'bp-004', 'Straight Razor Shave', 'Luxury shave with straight razor and premium care.', 50.00, 40, 'Shaving', true, NOW(), NOW()),
('srv-016', 'bp-004', 'Beard Maintenance', 'Complete beard care and grooming.', 30.00, 25, 'Beard', true, NOW(), NOW()),

-- Sophia Martinez's Services
('srv-017', 'bp-005', 'Trendy Cut', 'Latest styles and trendy haircuts.', 45.00, 40, 'Haircuts', true, NOW(), NOW()),
('srv-018', 'bp-005', 'Fade Design', 'Artistic fade with custom designs.', 55.00, 50, 'Haircuts', true, NOW(), NOW()),
('srv-019', 'bp-005', 'Hair Art', 'Creative hair designs and patterns.', 40.00, 30, 'Styling', true, NOW(), NOW());

-- ============================================
-- BARBER AVAILABILITY
-- ============================================
INSERT INTO "BarberAvailability" (id, "barberId", "dayOfWeek", "startTime", "endTime", "isAvailable", "createdAt", "updatedAt")
VALUES
-- Mike Johnson (Monday to Saturday)
('ba-001', 'bp-001', 'MONDAY', '09:00', '18:00', true, NOW(), NOW()),
('ba-002', 'bp-001', 'TUESDAY', '09:00', '18:00', true, NOW(), NOW()),
('ba-003', 'bp-001', 'WEDNESDAY', '09:00', '18:00', true, NOW(), NOW()),
('ba-004', 'bp-001', 'THURSDAY', '09:00', '18:00', true, NOW(), NOW()),
('ba-005', 'bp-001', 'FRIDAY', '09:00', '20:00', true, NOW(), NOW()),
('ba-006', 'bp-001', 'SATURDAY', '08:00', '17:00', true, NOW(), NOW()),

-- David Brown (Tuesday to Saturday)
('ba-007', 'bp-002', 'TUESDAY', '10:00', '19:00', true, NOW(), NOW()),
('ba-008', 'bp-002', 'WEDNESDAY', '10:00', '19:00', true, NOW(), NOW()),
('ba-009', 'bp-002', 'THURSDAY', '10:00', '19:00', true, NOW(), NOW()),
('ba-010', 'bp-002', 'FRIDAY', '10:00', '20:00', true, NOW(), NOW()),
('ba-011', 'bp-002', 'SATURDAY', '09:00', '18:00', true, NOW(), NOW()),

-- Emma Davis (Monday to Friday)
('ba-012', 'bp-003', 'MONDAY', '09:00', '17:00', true, NOW(), NOW()),
('ba-013', 'bp-003', 'TUESDAY', '09:00', '17:00', true, NOW(), NOW()),
('ba-014', 'bp-003', 'WEDNESDAY', '09:00', '17:00', true, NOW(), NOW()),
('ba-015', 'bp-003', 'THURSDAY', '09:00', '17:00', true, NOW(), NOW()),
('ba-016', 'bp-003', 'FRIDAY', '09:00', '19:00', true, NOW(), NOW()),

-- James Wilson (All week)
('ba-017', 'bp-004', 'MONDAY', '08:00', '16:00', true, NOW(), NOW()),
('ba-018', 'bp-004', 'TUESDAY', '08:00', '16:00', true, NOW(), NOW()),
('ba-019', 'bp-004', 'WEDNESDAY', '08:00', '16:00', true, NOW(), NOW()),
('ba-020', 'bp-004', 'THURSDAY', '08:00', '16:00', true, NOW(), NOW()),
('ba-021', 'bp-004', 'FRIDAY', '08:00', '18:00', true, NOW(), NOW()),
('ba-022', 'bp-004', 'SATURDAY', '08:00', '15:00', true, NOW(), NOW()),
('ba-023', 'bp-004', 'SUNDAY', '10:00', '14:00', true, NOW(), NOW()),

-- Sophia Martinez (Wednesday to Sunday)
('ba-024', 'bp-005', 'WEDNESDAY', '11:00', '19:00', true, NOW(), NOW()),
('ba-025', 'bp-005', 'THURSDAY', '11:00', '19:00', true, NOW(), NOW()),
('ba-026', 'bp-005', 'FRIDAY', '11:00', '20:00', true, NOW(), NOW()),
('ba-027', 'bp-005', 'SATURDAY', '10:00', '20:00', true, NOW(), NOW()),
('ba-028', 'bp-005', 'SUNDAY', '11:00', '17:00', true, NOW(), NOW());

-- ============================================
-- APPOINTMENTS
-- ============================================
INSERT INTO "Appointment" (id, "customerId", "barberId", "serviceId", "shopId", "appointmentDate", 
                          "startTime", "endTime", status, notes, "totalPrice", "createdAt", "updatedAt")
VALUES
-- Past Appointments (COMPLETED)
('apt-001', 'customer-001', 'bp-001', 'srv-001', 'shop-001', 
 CURRENT_DATE - INTERVAL '10 days', '10:00', '10:30', 'COMPLETED', 
 'Regular customer, prefers medium fade', 35.00, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),

('apt-002', 'customer-002', 'bp-003', 'srv-010', 'shop-003',
 CURRENT_DATE - INTERVAL '8 days', '14:00', '15:00', 'COMPLETED',
 'First time customer, consultation done', 60.00, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),

('apt-003', 'customer-003', 'bp-002', 'srv-006', 'shop-002',
 CURRENT_DATE - INTERVAL '5 days', '11:00', '11:45', 'COMPLETED',
 NULL, 50.00, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),

('apt-004', 'customer-004', 'bp-001', 'srv-005', 'shop-001',
 CURRENT_DATE - INTERVAL '3 days', '15:00', '16:00', 'COMPLETED',
 'Regular combo service', 55.00, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

-- Today's Appointments
('apt-005', 'customer-001', 'bp-004', 'srv-015', 'shop-001',
 CURRENT_DATE, '09:00', '09:40', 'CONFIRMED',
 'Prefers close shave', 50.00, NOW() - INTERVAL '2 days', NOW()),

('apt-006', 'customer-005', 'bp-002', 'srv-007', 'shop-002',
 CURRENT_DATE, '11:30', '11:55', 'PENDING',
 'New beard design requested', 30.00, NOW() - INTERVAL '1 day', NOW()),

('apt-007', 'customer-002', 'bp-003', 'srv-013', 'shop-003',
 CURRENT_DATE, '14:00', '14:45', 'CONFIRMED',
 NULL, 45.00, NOW() - INTERVAL '3 days', NOW()),

-- Upcoming Appointments
('apt-008', 'customer-003', 'bp-001', 'srv-002', 'shop-001',
 CURRENT_DATE + INTERVAL '2 days', '10:00', '10:45', 'CONFIRMED',
 'Premium fade with line up', 45.00, NOW(), NOW()),

('apt-009', 'customer-004', 'bp-005', 'srv-018', 'shop-002',
 CURRENT_DATE + INTERVAL '3 days', '16:00', '16:50', 'PENDING',
 'Design pattern requested', 55.00, NOW(), NOW()),

('apt-010', 'customer-001', 'bp-003', 'srv-011', 'shop-003',
 CURRENT_DATE + INTERVAL '5 days', '13:00', '15:00', 'CONFIRMED',
 'Full color service, bring color swatches', 120.00, NOW(), NOW()),

-- Cancelled Appointment
('apt-011', 'customer-005', 'bp-002', 'srv-009', 'shop-002',
 CURRENT_DATE - INTERVAL '2 days', '15:00', '15:30', 'CANCELLED',
 'Customer cancelled - schedule conflict', 35.00, NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 days');

-- ============================================
-- REVIEWS
-- ============================================
INSERT INTO "Review" (id, "appointmentId", "customerId", "barberId", rating, comment, tags, 
                     "barberReply", "repliedAt", "createdAt", "updatedAt")
VALUES
('rev-001', 'apt-001', 'customer-001', 'bp-001', 5,
 'Excellent service! Mike is very professional and gave me exactly the haircut I wanted. The atmosphere was great and I felt very comfortable. Will definitely come back!',
 ARRAY['Professional', 'Skilled', 'Friendly'],
 'Thank you so much for the kind words! Looking forward to seeing you again.',
 NOW() - INTERVAL '9 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days'),

('rev-002', 'apt-002', 'customer-002', 'bp-003', 5,
 'Emma is amazing! She really knows how to style hair and gave me great recommendations. Love my new look!',
 ARRAY['Creative', 'Professional', 'Great Results'],
 'So glad you love it! Thanks for trusting me with your hair!',
 NOW() - INTERVAL '7 days', NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days'),

('rev-003', 'apt-003', 'customer-003', 'bp-002', 4,
 'Great haircut, though I had to wait a bit longer than expected. David did a fantastic job once we got started.',
 ARRAY['Skilled', 'Quality Work'],
 NULL, NULL, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),

('rev-004', 'apt-004', 'customer-004', 'bp-001', 5,
 'Best barber experience I have had in years! Mike is incredibly skilled and pays attention to every detail. The shop is clean and modern.',
 ARRAY['Excellent Service', 'Clean', 'Detailed'],
 'Thank you! Your feedback means a lot to me.',
 NOW() - INTERVAL '2 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),

('rev-005', NULL, 'customer-005', 'bp-004', 4,
 'James does great traditional cuts. Very experienced and knows classic styles well. Highly recommend for anyone wanting a timeless look.',
 ARRAY['Experienced', 'Traditional', 'Quality'],
 NULL, NULL, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),

('rev-006', NULL, 'customer-001', 'bp-002', 4,
 'Good service overall. David is skilled and the pricing is fair. Would recommend!',
 ARRAY['Fair Pricing', 'Skilled'],
 NULL, NULL, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),

('rev-007', NULL, 'customer-003', 'bp-005', 5,
 'Sophia is super talented! She gave me an amazing fade design that everyone compliments. Very happy!',
 ARRAY['Talented', 'Creative', 'Trendy'],
 'Thank you so much! Glad you are happy with it!',
 NOW() - INTERVAL '12 days', NOW() - INTERVAL '13 days', NOW() - INTERVAL '12 days'),

('rev-008', NULL, 'customer-002', 'bp-004', 3,
 'It was okay. Nothing special but not bad either. The barber was friendly.',
 ARRAY['Friendly'],
 NULL, NULL, NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days');

-- ============================================
-- GALLERY IMAGES
-- ============================================
INSERT INTO "GalleryImage" (id, "barberId", "imageUrl", caption, "uploadedAt", "createdAt", "updatedAt")
VALUES
-- Mike Johnson's Gallery
('gal-001', 'bp-001', 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c', 'Classic fade with line up', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days', NOW()),
('gal-002', 'bp-001', 'https://images.unsplash.com/photo-1605497788044-5a32c7078486', 'Premium beard grooming', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days', NOW()),
('gal-003', 'bp-001', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033', 'Hot towel shave service', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days', NOW()),

-- David Brown's Gallery
('gal-004', 'bp-002', 'https://images.unsplash.com/photo-1606819717115-9159c900370b', 'Signature fade design', NOW() - INTERVAL '28 days', NOW() - INTERVAL '28 days', NOW()),
('gal-005', 'bp-002', 'https://images.unsplash.com/photo-1621607512214-68297480165e', 'Custom beard shaping', NOW() - INTERVAL '22 days', NOW() - INTERVAL '22 days', NOW()),

-- Emma Davis's Gallery
('gal-006', 'bp-003', 'https://images.unsplash.com/photo-1560869713-7d0a29430803', 'Modern styling work', NOW() - INTERVAL '35 days', NOW() - INTERVAL '35 days', NOW()),
('gal-007', 'bp-003', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e', 'Hair coloring transformation', NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days', NOW()),
('gal-008', 'bp-003', 'https://images.unsplash.com/photo-1595475884562-073c8c060b83', 'Creative hair treatment', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days', NOW()),

-- James Wilson's Gallery
('gal-009', 'bp-004', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1', 'Traditional barbering', NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days', NOW()),
('gal-010', 'bp-004', 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70', 'Straight razor expertise', NOW() - INTERVAL '32 days', NOW() - INTERVAL '32 days', NOW()),

-- Sophia Martinez's Gallery
('gal-011', 'bp-005', 'https://images.unsplash.com/photo-1621607003964-6ab0e5b48963', 'Trendy fade with design', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', NOW()),
('gal-012', 'bp-005', 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a', 'Hair art patterns', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days', NOW());

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify data was inserted correctly

-- SELECT COUNT(*) as user_count FROM "User";
-- SELECT COUNT(*) as barber_count FROM "BarberProfile";
-- SELECT COUNT(*) as shop_count FROM "Shop";
-- SELECT COUNT(*) as service_count FROM "Service";
-- SELECT COUNT(*) as appointment_count FROM "Appointment";
-- SELECT COUNT(*) as review_count FROM "Review";
-- SELECT COUNT(*) as gallery_count FROM "GalleryImage";

-- ============================================
-- SEED DATA SUMMARY
-- ============================================
-- Users: 11 (1 admin, 5 barbers, 5 customers)
-- Barber Profiles: 5
-- Shops: 3
-- Shop Assignments: 5
-- Services: 19
-- Barber Availability: 28 slots
-- Appointments: 11 (4 completed, 4 confirmed, 2 pending, 1 cancelled)
-- Reviews: 8
-- Gallery Images: 12
-- ============================================
