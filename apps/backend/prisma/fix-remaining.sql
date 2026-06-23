-- Fix Shop Barbers
INSERT INTO shop_barbers (id, "barberId", "shopId", "isPrimary")
VALUES
('sa-001', 'bp-001', 'shop-001', true),
('sa-002', 'bp-002', 'shop-002', true),
('sa-003', 'bp-003', 'shop-001', false)
ON CONFLICT (id) DO NOTHING;

-- Fix Availability
INSERT INTO availability (id, "barberId", "dayOfWeek", "startTime", "endTime", "isActive")
VALUES
('av-001', 'bp-001', 1, '09:00', '18:00', true),
('av-002', 'bp-001', 2, '09:00', '18:00', true),
('av-003', 'bp-001', 3, '09:00', '18:00', true),
('av-004', 'bp-001', 4, '09:00', '18:00', true),
('av-005', 'bp-001', 5, '09:00', '20:00', true),
('av-006', 'bp-001', 6, '08:00', '17:00', true),
('av-007', 'bp-002', 2, '10:00', '19:00', true),
('av-008', 'bp-002', 3, '10:00', '19:00', true),
('av-009', 'bp-002', 4, '10:00', '19:00', true),
('av-010', 'bp-002', 5, '10:00', '20:00', true),
('av-011', 'bp-002', 6, '09:00', '18:00', true),
('av-012', 'bp-003', 1, '09:00', '17:00', true),
('av-013', 'bp-003', 2, '09:00', '17:00', true),
('av-014', 'bp-003', 3, '09:00', '17:00', true),
('av-015', 'bp-003', 4, '09:00', '17:00', true),
('av-016', 'bp-003', 5, '09:00', '19:00', true)
ON CONFLICT (id) DO NOTHING;

SELECT 'Data inserted successfully!' as status;
SELECT 'Shop Barbers:' as table_name, COUNT(*) as count FROM shop_barbers
UNION ALL
SELECT 'Availability:', COUNT(*) FROM availability;
