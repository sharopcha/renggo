-- Insert sample organization first
insert into public.organizations (id, name, tax_register_number, settings)
values ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Renggo Fleet Services', 'EE123456789', '{"currency": "EUR", "timezone": "Europe/Tallinn"}'::jsonb);

-- Insert sample vehicles
insert into public.vehicles
  (organization_id, vehicle_class, plate, vin, make, model, year, photo_url,
   odometer_km, location, utilization_pct, base_daily_rate_eur, lifetime_revenue_eur,
   total_trips, rating)
values
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Compact',            'EST-1234', 'WVWZZZ1KZ6W000001', 'Toyota',    'Corolla',      2020, 'https://picsum.photos/seed/corolla/800/600',      48000, 'Tallinn', 72, 29.00,  5200.00,  88, 4.7),
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'SUV (Midsize)',      'EST-2345', 'JTMHU09JX50000002', 'Toyota',    'RAV4',         2022, 'https://picsum.photos/seed/rav4/800/600',         26000, 'Tallinn', 65, 45.00,  6100.00,  64, 4.6),
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Passenger Van',      'EST-3456', 'WV2ZZZ7HZ9H000003', 'Volkswagen','Caravelle',    2019, 'https://picsum.photos/seed/caravelle/800/600',    94000, 'Tallinn', 58, 59.00,  7800.00, 102, 4.4),
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Pickup',             'EST-4567', '1FTYR10D45PA00004', 'Ford',      'Ranger',       2019, 'https://picsum.photos/seed/ranger/800/600',       88000, 'Harju',   49, 55.00,  6400.00,  75, 4.3),
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Sedan',              'EST-5678', 'WBA5A51040G000005', 'BMW',       '530i',         2018, 'https://picsum.photos/seed/530i/800/600',         112000,'Tallinn', 44, 69.00,  9100.00,  96, 4.8),
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Electric (BEV)',     'EST-6789', '5YJ3E1EA7JF000006', 'Tesla',     'Model 3',      2021, 'https://picsum.photos/seed/model3/800/600',       37000, 'Tallinn', 77, 65.00, 12500.00, 140, 4.9),
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Hybrid / PHEV',      'EST-7890', 'JTDKB20U693000007', 'Toyota',    'Prius',        2017, 'https://picsum.photos/seed/prius/800/600',        128000,'Tartu',  53, 32.00,  5800.00,  92, 4.5),
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Convertible / Cabrio','EST-8901','JM1NC2EF9A0200008', 'Mazda',     'MX-5',         2016, 'https://picsum.photos/seed/mx5/800/600',          76000, 'Tallinn', 35, 70.00,  4300.00,  41, 4.7),
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Minivan / MPV',      'EST-9012', 'WVWZZZ1TZ7W000009', 'Volkswagen','Touran',       2015, 'https://picsum.photos/seed/touran/800/600',       153000,'Harju',   39, 38.00,  5100.00,  83, 4.2),
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Cargo Van',          'EST-0123', '1FTBW2CM0KKA00010', 'Ford',      'Transit',      2018, 'https://picsum.photos/seed/transit/800/600',      189000,'Tallinn', 61, 49.00, 10200.00, 120, 4.4),
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Crossover',          'EST-1122', 'SJNFAAZ12U0000011', 'Nissan',    'Qashqai',      2021, 'https://picsum.photos/seed/qashqai/800/600',      31000, 'Tartu',   68, 42.00,  5600.00,  66, 4.6),
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'SUV (Full-size)',    'EST-2211', 'WAUZZZ4M7HD000012', 'Audi',      'Q7',           2019, 'https://picsum.photos/seed/q7/800/600',           72000, 'Tallinn', 57, 85.00, 13400.00, 110, 4.8);

-- Insert sample customers
insert into public.customers
  (organization_id, first_name, last_name, email, phone, avatar_url,
   address, city, country, postal_code,
   drivers_license_number, drivers_license_expiry, drivers_license_verified,
   status, is_verified, verification_date,
   total_trips, total_cancellations, lifetime_spend_eur, average_rating,
   date_of_birth, notes)
values
  -- Active verified customers with good history
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Maria', 'Tamm', 'maria.tamm@email.ee', '+372 5123 4567', 'https://i.pravatar.cc/150?img=1',
   'Narva mnt 5', 'Tallinn', 'Estonia', '10120',
   'DL-EST-8901234', '2027-06-15', true,
   'Active', true, '2023-03-15 10:30:00',
   45, 2, 2340.50, 4.8,
   '1988-05-20', 'Excellent customer, always on time'),
  
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Andrus', 'Kask', 'andrus.kask@gmail.com', '+372 5234 5678', 'https://i.pravatar.cc/150?img=12',
   'Liivalaia 12-4', 'Tallinn', 'Estonia', '10118',
   'DL-EST-7812345', '2026-11-20', true,
   'Active', true, '2023-01-10 14:20:00',
   38, 1, 1890.00, 4.9,
   '1992-08-14', 'Frequent renter, prefers SUVs'),
  
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Laura', 'Mägi', 'laura.magi@yahoo.com', '+372 5345 6789', 'https://i.pravatar.cc/150?img=5',
   'Pärnu mnt 25', 'Tallinn', 'Estonia', '10141',
   'DL-EST-9012345', '2028-03-10', true,
   'Active', true, '2022-11-05 09:15:00',
   52, 0, 3120.75, 4.7,
   '1985-12-03', 'Corporate account manager'),
  
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Kristjan', 'Saar', 'kristjan.saar@hotmail.com', '+372 5456 7890', 'https://i.pravatar.cc/150?img=15',
   'Viru väljak 2', 'Tartu', 'Estonia', '51003',
   'DL-EST-6723456', '2027-09-25', true,
   'Active', true, '2023-05-20 16:45:00',
   28, 3, 1456.00, 4.5,
   '1990-03-28', 'Lives in Tartu, occasional renter'),
  
  -- Active unverified customers (newer)
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Johanna', 'Lepik', 'johanna.lepik@gmail.com', '+372 5567 8901', 'https://i.pravatar.cc/150?img=9',
   'Endla 4', 'Tallinn', 'Estonia', '10122',
   'DL-EST-5634567', '2026-12-15', false,
   'Active', false, null,
   5, 0, 289.50, 4.6,
   '1995-07-19', 'New customer, verification pending'),
  
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Markus', 'Vaher', 'markus.vaher@email.com', '+372 5678 9012', 'https://i.pravatar.cc/150?img=13',
   'Kentmanni 8', 'Tallinn', 'Estonia', '10116',
   'DL-EST-4545678', '2027-04-30', false,
   'Active', false, null,
   3, 1, 187.00, 4.3,
   '1993-11-02', 'Requested license verification'),
  
  -- Suspended customers
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Kaarel', 'Järv', 'kaarel.jarv@mail.ee', '+372 5789 0123', 'https://i.pravatar.cc/150?img=14',
   'Tartu mnt 67', 'Tallinn', 'Estonia', '10115',
   'DL-EST-3456789', '2026-08-20', true,
   'Suspended', true, '2022-08-10 11:00:00',
   22, 8, 1234.00, 3.8,
   '1987-04-15', 'Suspended due to multiple late returns'),
  
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Piret', 'Ots', 'piret.ots@inbox.lv', '+372 5890 1234', 'https://i.pravatar.cc/150?img=10',
   'Gonsiori 21', 'Tallinn', 'Estonia', '10147',
   'DL-EST-2367890', '2025-10-05', true,
   'Suspended', true, '2023-02-14 13:30:00',
   15, 6, 945.00, 3.5,
   '1991-09-22', 'Suspended - payment issues resolved, can be reactivated'),
  
  -- Banned customer
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Tõnu', 'Kukk', 'tonu.kukk@gmail.com', '+372 5901 2345', 'https://i.pravatar.cc/150?img=11',
   'Mere pst 10', 'Tallinn', 'Estonia', '10111',
   'DL-EST-1278901', '2026-05-12', true,
   'Banned', true, '2022-06-20 10:00:00',
   18, 12, 890.00, 2.1,
   '1989-02-08', 'BANNED - Multiple violations, vehicle damage not reported'),
  
  -- International customers
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Anna', 'Volkova', 'anna.volkova@mail.ru', '+371 2345 6789', 'https://i.pravatar.cc/150?img=2',
   'Brīvības iela 45', 'Riga', 'Latvia', 'LV-1010',
   'DL-LVA-9012345', '2027-07-18', true,
   'Active', true, '2023-04-05 12:00:00',
   12, 0, 678.00, 4.7,
   '1994-06-11', 'Frequent cross-border rentals'),
  
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Mindaugas', 'Petrauskas', 'mindaugas.p@gmail.com', '+370 6123 4567', 'https://i.pravatar.cc/150?img=16',
   'Gedimino pr. 15', 'Vilnius', 'Lithuania', 'LT-01103',
   'DL-LTU-8123456', '2026-09-30', true,
   'Active', true, '2023-06-12 15:30:00',
   8, 1, 445.50, 4.5,
   '1991-10-25', 'Business traveler'),
  
  -- Inactive customer
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Rein', 'Kivi', 'rein.kivi@email.ee', '+372 5012 3456', null,
   'Koidu 18', 'Tartu', 'Estonia', '50106',
   'DL-EST-0189012', '2025-11-20', true,
   'Inactive', true, '2022-03-10 09:00:00',
   2, 0, 128.00, 4.0,
   '1986-01-30', 'Last rental over 18 months ago'),
  
  -- Recent customers with various stats
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Kert', 'Laur', 'kert.laur@gmail.com', '+372 5123 9876', 'https://i.pravatar.cc/150?img=17',
   'Sõpruse pst 145', 'Tallinn', 'Estonia', '13417',
   'DL-EST-9990123', '2028-01-15', true,
   'Active', true, '2024-08-22 11:20:00',
   18, 1, 892.00, 4.6,
   '1996-04-17', 'Young professional, weekend rentals'),
  
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Helena', 'Rumm', 'helena.rumm@yahoo.com', '+372 5234 8765', 'https://i.pravatar.cc/150?img=3',
   'Mustamäe tee 4', 'Tallinn', 'Estonia', '10621',
   'DL-EST-8881234', '2027-02-28', true,
   'Active', true, '2024-05-10 14:00:00',
   24, 2, 1234.50, 4.7,
   '1990-08-09', 'Family trips, prefers vans'),
  
  ('1baaf78c-3719-45bc-9cf8-d3b3b3059006', 'Erik', 'Palm', 'erik.palm@hotmail.com', '+372 5345 7654', 'https://i.pravatar.cc/150?img=18',
   'Paldiski mnt 80', 'Tallinn', 'Estonia', '10617',
   'DL-EST-7772345', '2026-06-10', false,
   'Active', false, null,
   2, 0, 156.00, 4.4,
   '1998-12-21', 'Student, verification documents submitted');

-- Insert sample rentals
-- Get customer and vehicle IDs for reference
DO $$
DECLARE
  v_org_id uuid := '1baaf78c-3719-45bc-9cf8-d3b3b3059006';
  v_customer1_id uuid;
  v_customer2_id uuid;
  v_customer3_id uuid;
  v_customer4_id uuid;
  v_vehicle1_id uuid;
  v_vehicle2_id uuid;
  v_vehicle3_id uuid;
  v_vehicle4_id uuid;
  v_vehicle5_id uuid;
  v_vehicle6_id uuid;
  v_rental1_id uuid := gen_random_uuid();
  v_rental2_id uuid := gen_random_uuid();
  v_rental3_id uuid := gen_random_uuid();
  v_rental4_id uuid := gen_random_uuid();
  v_rental5_id uuid := gen_random_uuid();
  v_rental6_id uuid := gen_random_uuid();
  v_rental7_id uuid := gen_random_uuid();
  v_rental8_id uuid := gen_random_uuid();
  v_rental9_id uuid := gen_random_uuid();
  v_rental10_id uuid := gen_random_uuid();
BEGIN
  -- Get customer IDs
  SELECT id INTO v_customer1_id FROM public.customers WHERE email = 'maria.tamm@email.ee' LIMIT 1;
  SELECT id INTO v_customer2_id FROM public.customers WHERE email = 'andrus.kask@gmail.com' LIMIT 1;
  SELECT id INTO v_customer3_id FROM public.customers WHERE email = 'laura.magi@yahoo.com' LIMIT 1;
  SELECT id INTO v_customer4_id FROM public.customers WHERE email = 'kristjan.saar@hotmail.com' LIMIT 1;
  
  -- Get vehicle IDs
  SELECT id INTO v_vehicle1_id FROM public.vehicles WHERE plate = 'EST-1234' LIMIT 1;
  SELECT id INTO v_vehicle2_id FROM public.vehicles WHERE plate = 'EST-2345' LIMIT 1;
  SELECT id INTO v_vehicle3_id FROM public.vehicles WHERE plate = 'EST-3456' LIMIT 1;
  SELECT id INTO v_vehicle4_id FROM public.vehicles WHERE plate = 'EST-6789' LIMIT 1;
  SELECT id INTO v_vehicle5_id FROM public.vehicles WHERE plate = 'EST-0123' LIMIT 1;
  SELECT id INTO v_vehicle6_id FROM public.vehicles WHERE plate = 'EST-1122' LIMIT 1;

  -- Insert completed rentals
  INSERT INTO public.rentals (id, organization_id, vehicle_id, customer_id, start_date, end_date, status, pickup_location, return_location, pickup_city, return_city, price_eur, deposit_eur, insurance_eur, extras_eur, odometer_start, odometer_end, created_at)
  VALUES
    (v_rental1_id, v_org_id, v_vehicle1_id, v_customer1_id, 
     '2024-12-15 10:00:00+00', '2024-12-18 10:00:00+00', 'completed',
     'Tallinn Airport', 'Tallinn City Center', 'Tallinn', 'Tallinn',
     87.00, 200.00, 15.00, 0, 47800, 48100, '2024-12-10 14:30:00+00'),
    
    (v_rental2_id, v_org_id, v_vehicle2_id, v_customer2_id,
     '2024-12-20 09:00:00+00', '2024-12-23 09:00:00+00', 'completed',
     'Tallinn Downtown', 'Tallinn Downtown', 'Tallinn', 'Tallinn',
     135.00, 300.00, 20.00, 10.00, 25600, 25850, '2024-12-15 11:20:00+00'),
    
    (v_rental3_id, v_org_id, v_vehicle3_id, v_customer3_id,
     '2025-01-05 14:00:00+00', '2025-01-08 14:00:00+00', 'completed',
     'Tallinn Port', 'Tallinn Port', 'Tallinn', 'Tallinn',
     177.00, 400.00, 25.00, 30.00, 93500, 93820, '2025-01-02 09:15:00+00'),
    
    (v_rental4_id, v_org_id, v_vehicle4_id, v_customer1_id,
     '2025-01-10 08:00:00+00', '2025-01-12 18:00:00+00', 'completed',
     'Tallinn City Center', 'Tallinn Airport', 'Tallinn', 'Tallinn',
     130.00, 250.00, 18.00, 0, 36800, 37020, '2025-01-08 16:45:00+00'),
    
    (v_rental5_id, v_org_id, v_vehicle5_id, v_customer4_id,
     '2024-12-28 11:00:00+00', '2024-12-31 11:00:00+00', 'completed',
     'Tallinn Central', 'Tallinn Central', 'Tallinn', 'Tallinn',
     147.00, 300.00, 22.00, 15.00, 188500, 188680, '2024-12-22 13:00:00+00');

  -- Insert active rental
  INSERT INTO public.rentals (id, organization_id, vehicle_id, customer_id, start_date, end_date, status, pickup_location, return_location, pickup_city, return_city, price_eur, deposit_eur, insurance_eur, extras_eur, odometer_start, created_at)
  VALUES
    (v_rental6_id, v_org_id, v_vehicle6_id, v_customer2_id,
     '2025-01-08 10:00:00+00', '2025-01-11 10:00:00+00', 'active',
     'Tartu City Center', 'Tartu City Center', 'Tartu', 'Tartu',
     126.00, 250.00, 18.00, 0, 30800, '2025-01-05 15:30:00+00');

  -- Insert upcoming rentals
  INSERT INTO public.rentals (id, organization_id, vehicle_id, customer_id, start_date, end_date, status, pickup_location, return_location, pickup_city, return_city, price_eur, deposit_eur, insurance_eur, extras_eur, created_at)
  VALUES
    (v_rental7_id, v_org_id, v_vehicle1_id, v_customer3_id,
     '2025-01-20 09:00:00+00', '2025-01-24 09:00:00+00', 'upcoming',
     'Tallinn Airport', 'Tallinn Airport', 'Tallinn', 'Tallinn',
     116.00, 200.00, 20.00, 0, '2025-01-15 10:00:00+00'),
    
    (v_rental8_id, v_org_id, v_vehicle4_id, v_customer1_id,
     '2025-01-25 14:00:00+00', '2025-01-28 14:00:00+00', 'upcoming',
     'Tallinn City Center', 'Tallinn City Center', 'Tallinn', 'Tallinn',
     195.00, 300.00, 25.00, 10.00, '2025-01-18 11:30:00+00');

  -- Insert cancelled rentals
  INSERT INTO public.rentals (id, organization_id, vehicle_id, customer_id, start_date, end_date, status, pickup_location, return_location, pickup_city, return_city, price_eur, deposit_eur, insurance_eur, notes, created_at)
  VALUES
    (v_rental9_id, v_org_id, v_vehicle2_id, v_customer4_id,
     '2025-01-12 11:00:00+00', '2025-01-15 11:00:00+00', 'cancelled',
     'Tallinn Downtown', 'Tallinn Downtown', 'Tallinn', 'Tallinn',
     135.00, 300.00, 0, 'Customer cancelled 3 days before pickup', '2025-01-05 09:00:00+00'),
    
    (v_rental10_id, v_org_id, v_vehicle3_id, v_customer2_id,
     '2024-12-22 10:00:00+00', '2024-12-25 10:00:00+00', 'cancelled',
     'Tallinn Port', 'Tallinn Port', 'Tallinn', 'Tallinn',
     177.00, 400.00, 0, 'Vehicle unavailable due to maintenance', '2024-12-18 14:00:00+00');

  -- Insert payments for completed rentals
  INSERT INTO public.payments (organization_id, rental_id, customer_id, type, amount_eur, status, method, method_details, transaction_id, processor_fee_eur, platform_fee_eur, processed_at, created_at)
  VALUES
    -- Rental 1 payments
    (v_org_id, v_rental1_id, v_customer1_id, 'charge', 302.00, 'succeeded', 'card', 'Visa •••• 4242', 'ch_1Abc123', 9.06, 45.30, '2024-12-15 10:05:00+00', '2024-12-15 10:01:00+00'),
    (v_org_id, v_rental1_id, v_customer1_id, 'refund', 200.00, 'succeeded', 'card', 'Visa •••• 4242', 're_1Abc124', 0, 0, '2024-12-18 11:00:00+00', '2024-12-18 10:30:00+00'),
    
    -- Rental 2 payments
    (v_org_id, v_rental2_id, v_customer2_id, 'charge', 465.00, 'succeeded', 'card', 'Mastercard •••• 5555', 'ch_1Def456', 13.95, 69.75, '2024-12-20 09:05:00+00', '2024-12-20 09:01:00+00'),
    (v_org_id, v_rental2_id, v_customer2_id, 'refund', 300.00, 'succeeded', 'card', 'Mastercard •••• 5555', 're_1Def457', 0, 0, '2024-12-23 10:00:00+00', '2024-12-23 09:30:00+00'),
    
    -- Rental 3 payments
    (v_org_id, v_rental3_id, v_customer3_id, 'charge', 632.00, 'succeeded', 'card', 'Visa •••• 1234', 'ch_1Ghi789', 18.96, 94.80, '2025-01-05 14:05:00+00', '2025-01-05 14:01:00+00'),
    (v_org_id, v_rental3_id, v_customer3_id, 'refund', 400.00, 'succeeded', 'card', 'Visa •••• 1234', 're_1Ghi790', 0, 0, '2025-01-08 15:00:00+00', '2025-01-08 14:30:00+00'),
    
    -- Rental 4 payments
    (v_org_id, v_rental4_id, v_customer1_id, 'charge', 398.00, 'succeeded', 'card', 'Visa •••• 4242', 'ch_1Jkl012', 11.94, 59.70, '2025-01-10 08:05:00+00', '2025-01-10 08:01:00+00'),
    (v_org_id, v_rental4_id, v_customer1_id, 'refund', 250.00, 'succeeded', 'card', 'Visa •••• 4242', 're_1Jkl013', 0, 0, '2025-01-12 19:00:00+00', '2025-01-12 18:30:00+00'),
    
    -- Rental 5 payments
    (v_org_id, v_rental5_id, v_customer4_id, 'charge', 484.00, 'succeeded', 'bank_transfer', 'Bank Transfer EE123', 'bt_1Mno345', 5.00, 72.60, '2024-12-28 11:05:00+00', '2024-12-28 11:01:00+00'),
    (v_org_id, v_rental5_id, v_customer4_id, 'refund', 300.00, 'succeeded', 'bank_transfer', 'Bank Transfer EE123', 'bt_1Mno346', 0, 0, '2024-12-31 12:00:00+00', '2024-12-31 11:30:00+00'),
    
    -- Rental 6 (active) - charge only
    (v_org_id, v_rental6_id, v_customer2_id, 'charge', 394.00, 'succeeded', 'card', 'Mastercard •••• 5555', 'ch_1Pqr678', 11.82, 59.10, '2025-01-08 10:05:00+00', '2025-01-08 10:01:00+00'),
    
    -- Rental 7 (upcoming) - pending payment
    (v_org_id, v_rental7_id, v_customer3_id, 'charge', 336.00, 'pending', 'card', 'Visa •••• 1234', null, 0, 0, null, '2025-01-15 10:05:00+00'),
    
    -- Rental 8 (upcoming) - failed then succeeded
    (v_org_id, v_rental8_id, v_customer1_id, 'charge', 530.00, 'failed', 'card', 'Visa •••• 9999', null, 0, 0, null, '2025-01-18 11:35:00+00'),
    (v_org_id, v_rental8_id, v_customer1_id, 'charge', 530.00, 'succeeded', 'card', 'Visa •••• 4242', 'ch_1Stu901', 15.90, 79.50, '2025-01-18 11:45:00+00', '2025-01-18 11:40:00+00'),
    
    -- Rental 9 (cancelled) - refund
    (v_org_id, v_rental9_id, v_customer4_id, 'charge', 435.00, 'succeeded', 'card', 'Visa •••• 6789', 'ch_1Vwx234', 13.05, 65.25, '2025-01-05 09:05:00+00', '2025-01-05 09:01:00+00'),
    (v_org_id, v_rental9_id, v_customer4_id, 'refund', 435.00, 'succeeded', 'card', 'Visa •••• 6789', 're_1Vwx235', 0, 0, '2025-01-09 10:00:00+00', '2025-01-09 09:30:00+00');

  -- Insert platform fees as separate payment records
  INSERT INTO public.payments (organization_id, rental_id, type, amount_eur, status, method, description, processed_at, created_at)
  VALUES
    (v_org_id, v_rental1_id, 'fee', 15.30, 'succeeded', 'platform_fee', 'Platform service fee', '2024-12-18 12:00:00+00', '2024-12-18 12:00:00+00'),
    (v_org_id, v_rental2_id, 'fee', 24.75, 'succeeded', 'platform_fee', 'Platform service fee', '2024-12-23 12:00:00+00', '2024-12-23 12:00:00+00'),
    (v_org_id, v_rental3_id, 'fee', 34.20, 'succeeded', 'platform_fee', 'Platform service fee', '2025-01-08 16:00:00+00', '2025-01-08 16:00:00+00'),
    (v_org_id, v_rental4_id, 'fee', 21.90, 'succeeded', 'platform_fee', 'Platform service fee', '2025-01-12 20:00:00+00', '2025-01-12 20:00:00+00'),
    (v_org_id, v_rental5_id, 'fee', 26.10, 'succeeded', 'platform_fee', 'Platform service fee', '2024-12-31 13:00:00+00', '2024-12-31 13:00:00+00');

  -- Insert payouts
  INSERT INTO public.payouts (organization_id, amount_eur, status, method, bank_account, transaction_id, period_start, period_end, scheduled_date, processed_date, notes, created_at)
  VALUES
    (v_org_id, 1250.00, 'succeeded', 'bank_transfer', 'EE123456789012345678', 'po_2024_12', '2024-12-01 00:00:00+00', '2024-12-31 23:59:59+00', '2025-01-05 00:00:00+00', '2025-01-05 10:30:00+00', 'December 2024 payout', '2024-12-31 12:00:00+00'),
    (v_org_id, 2450.00, 'pending', 'bank_transfer', 'EE123456789012345678', null, '2025-01-01 00:00:00+00', '2025-01-31 23:59:59+00', '2025-02-05 00:00:00+00', null, 'January 2025 payout scheduled', '2025-01-31 12:00:00+00');

END $$;

-- Insert sample maintenance tasks and notes
DO $$
DECLARE
  v_org_id uuid := '1baaf78c-3719-45bc-9cf8-d3b3b3059006';
  v_vehicle1_id uuid;
  v_vehicle2_id uuid;
  v_vehicle3_id uuid;
  v_task1_id uuid := gen_random_uuid();
  v_task2_id uuid := gen_random_uuid();
  v_task3_id uuid := gen_random_uuid();
BEGIN
  SELECT id INTO v_vehicle1_id FROM public.vehicles WHERE plate = 'EST-1234' LIMIT 1; -- Toyota Corolla
  SELECT id INTO v_vehicle2_id FROM public.vehicles WHERE plate = 'EST-1122' LIMIT 1; -- Nissan Qashqai
  SELECT id INTO v_vehicle3_id FROM public.vehicles WHERE plate = 'EST-0123' LIMIT 1; -- Ford Transit

  INSERT INTO public.maintenance_tasks (id, organization_id, vehicle_id, vehicle_label, task, description, due_date, due_km, severity, status, assignee)
  VALUES
    (v_task1_id, v_org_id, v_vehicle1_id, 'Toyota Corolla (EST-1234)', 'Oil Change & Filter', 'Regular oil change and filter replacement. Check fluid levels and tire pressure.', '2025-11-15', 50000, 'Low', 'Open', 'Mike Johnson'),
    (v_task2_id, v_org_id, v_vehicle2_id, 'Nissan Qashqai (EST-1122)', 'Brake Pad Replacement', 'Front brake pads showing wear indicators. Immediate replacement required.', '2025-11-12', 32000, 'High', 'In Progress', 'Sarah Wilson'),
    (v_task3_id, v_org_id, v_vehicle3_id, 'Ford Transit (EST-0123)', 'Engine Diagnostic', 'Check engine light activated. Full diagnostic scan required.', '2025-11-10', 190000, 'High', 'Open', 'David Chen');

  INSERT INTO public.maintenance_task_notes (task_id, content, visibility)
  VALUES
    (v_task2_id, 'Ordered OEM brake pads', 'Internal'),
    (v_task2_id, 'Customer notified of timeline', 'Internal'),
    (v_task3_id, 'Customer reports rough idling', 'Internal');
END $$;