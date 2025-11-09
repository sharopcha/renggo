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