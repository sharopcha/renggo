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