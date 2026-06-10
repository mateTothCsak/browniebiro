-- ─────────────────────────────────────────────────────────────
-- BrownieBíró — seed: 63 real Hungarian BK locations
-- Run after 002_rls.sql.
-- Scores/reviews are intentionally NOT seeded — they start at
-- zero and build from real user submissions.
-- Sources: burgerking.hu/ettermeink, OpenStreetMap (2026-05-07)
-- ─────────────────────────────────────────────────────────────

insert into public.restaurants (slug, name, city, district, address, lat, lng) values
  -- Budapest (30)
  ('bp-allee',        'Budapest Allee',            'Budapest', 'XI. kerület',    'Október huszonharmadika utca 8-10, 1117', 47.4743, 19.0491),
  ('bp-anna',         'Budapest Anna',             'Budapest', 'V. kerület',     'Váci utca 7, 1051',                       47.4954, 19.0514),
  ('bp-arany',        'Budapest Arany',            'Budapest', 'V. kerület',     'Arany János utca 34, 1051',               47.5026, 19.0540),
  ('bp-arena',        'Budapest Aréna',            'Budapest', 'VIII. kerület',  'Kerepesi út 9, 1087',                     47.4982, 19.0917),
  ('bp-arkad',        'Budapest Árkád',            'Budapest', 'X. kerület',     'Örs vezér tere 25a, 1106',                47.5027, 19.1389),
  ('bp-astoria',      'Budapest Astoria',          'Budapest', 'VIII. kerület',  'Rákóczi út 1-3, 1088',                    47.4938, 19.0607),
  ('bp-becsi',        'Budapest Bécsi',            'Budapest', 'III. kerület',   'Bécsi út 268, 1037',                      47.5644, 19.0221),
  ('bp-campona',      'Budapest Campona',          'Budapest', 'XXII. kerület',  'Nagytétényi út 37, 1222',                 47.4074, 19.0187),
  ('bp-corvin',       'Budapest Corvin',           'Budapest', 'VIII. kerület',  'Futó utca 37, 1083',                      47.4863, 19.0745),
  ('bp-csepel',       'Budapest Csepel',           'Budapest', 'XXI. kerület',   'Petz Ferenc utca 68, 1211',               47.4267, 19.0691),
  ('bp-cserto',       'Budapest Csertő utca',      'Budapest', 'XIV. kerület',   'Csertő utca 24, 1144',                    47.5541, 19.1428),
  ('bp-emke',         'Budapest Emke',             'Budapest', 'VII. kerület',   'Akácfa utca 1-3, 1072',                   47.4972, 19.0698),
  ('bp-etele',        'Budapest Etele Pláza',      'Budapest', 'XI. kerület',    'Etele út 68, 1115',                       47.4644, 19.0244),
  ('bp-hungaria',     'Budapest Hungária',         'Budapest', 'XIV. kerület',   'Hungária körút 116, 1143',                47.5085, 19.1012),
  ('bp-keleti',       'Budapest Keleti',           'Budapest', 'VII. kerület',   'Baross tér 14, 1077',                     47.5009, 19.0816),
  ('bp-kerepesi',     'Budapest Kerepesi',         'Budapest', 'XIV. kerület',   'Kerepesi út 42-46, 1148',                 47.5011, 19.1130),
  ('bp-koki',         'Budapest Köki',             'Budapest', 'XIX. kerület',   'Vak Bottyán utca 75/A-C, 1191',           47.4626, 19.1478),
  ('bp-mammut',       'Budapest Mammut',           'Budapest', 'II. kerület',    'Lövőház utca 2-6, 1024',                  47.5091, 19.0265),
  ('bp-mexikoi',      'Budapest Mexikói út',       'Budapest', 'XIV. kerület',   'Mexikói út 70, 1142',                     47.5197, 19.0912),
  ('bp-oktogon',      'Budapest Oktogon',          'Budapest', 'VI. kerület',    'Oktogon 1, 1066',                         47.5052, 19.0627),
  ('bp-pesti',        'Budapest Pesti út',         'Budapest', 'XVII. kerület',  'Pesti út 5-7, 1173',                      47.4839, 19.2300),
  ('bp-polus',        'Budapest Pólus',            'Budapest', 'XV. kerület',    'Szentmihályi út 131, 1152',               47.5525, 19.1401),
  ('bp-soroksar',     'Budapest Soroksár',         'Budapest', 'XXIII. kerület', 'Bevásárló utca 4, 1238',                  47.4153, 19.1598),
  ('bp-szena',        'Budapest Széna tér',        'Budapest', 'I. kerület',     'Széna tér 7, 1015',                       47.5073, 19.0269),
  ('bp-tetenyi',      'Budapest Tétényi',          'Budapest', 'XI. kerület',    'Etele út 53, 1113',                       47.4641, 19.0321),
  ('bp-ubc',          'Budapest UBC',              'Budapest', 'XI. kerület',    'Hengermalom út 19-21, 1117',              47.4608, 19.0519),
  ('bp-ujpest',       'Budapest Újpest',           'Budapest', 'IV. kerület',    'Árpád út 73, 1042',                       47.5602, 19.0905),
  ('bp-ulloi',        'Budapest Üllői',            'Budapest', 'X. kerület',     'Üllői út 110, 1101',                      47.4721, 19.1097),
  ('bp-vamhaz',       'Budapest Vámház',           'Budapest', 'V. kerület',     'Vámház körút 2, 1052',                    47.4875, 19.0580),
  ('bp-westend',      'Budapest WestEnd',          'Budapest', 'VI. kerület',    'Váci út 1-3, 1069',                       47.5142, 19.0599),
  -- Budapest agglomeration (6)
  ('budakalasz',      'Budakalász',                'Budakalász',      null, 'Omszk park 1, 2011',                     47.6160, 19.0646),
  ('budaors',         'Budaörs',                   'Budaörs',         null, 'Sport utca 2, 2040',                      47.4555, 18.9465),
  ('dunakeszi',       'Dunakeszi',                 'Dunakeszi',       null, 'Pallag utca 68, 2120',                    47.6234, 19.1206),
  ('erd',             'Érd',                       'Érd',             null, 'Erika utca 2, 2030',                      47.3779, 18.9339),
  ('solymar',         'Solymár',                   'Solymár',         null, 'Szent Flórián utca 2-4, 2083',            47.5977, 18.9645),
  ('vecses-airport',  'Vecsés Airport',            'Vecsés',          null, 'Fő út 246-248, 2220',                     47.4164, 19.2485),
  -- Western Hungary (8)
  ('gyor',            'Győr Árkád',                'Győr',            null, 'Budai út 1, 9027',                        47.6824, 17.9809),
  ('sopron',          'Sopron',                    'Sopron',          null, 'Határdomb út 1-3, 9400',                  47.6721, 16.6124),
  ('szombathely',     'Szombathely',               'Szombathely',     null, 'Bálványkő utca 1, 9700',                 47.2423, 16.6545),
  ('zalaegerszeg',    'Zalaegerszeg',              'Zalaegerszeg',    null, 'Balatoni út 6, 8900',                     46.8450, 16.8621),
  ('nagykanizsa',     'Nagykanizsa',               'Nagykanizsa',     null, 'Teleki utca 8, 8800',                     46.4541, 16.9985),
  ('veszprem',        'Veszprém',                  'Veszprém',        null, 'Budapest út 68, 8200',                    47.0985, 17.9262),
  ('szekes-arkad',    'Székesfehérvár Árkád',      'Székesfehérvár',  null, 'Jancsár köz 5, 8000',                    47.1826, 18.4074),
  ('szekes-nextstop', 'Székesfehérvár Next Stop',  'Székesfehérvár',  null, 'Holland fasor 1, 8000',                   47.1512, 18.4319),
  -- Central Hungary / M1 (2)
  ('tatabanya',       'Tatabánya',                 'Tatabánya',       null, 'Határ út 1, 2800',                        47.6033, 18.3869),
  ('m1-acs',          'M1 Ács',                    'Ács',             null, 'M1 autópálya 94 km pihenő, 2941',         47.6950, 18.0250),
  -- Southern Hungary (7)
  ('pecs-arkad',      'Pécs Árkád',                'Pécs',            null, 'Bajcsy-Zsilinszky utca 11, 7622',         46.1244, 18.3068),
  ('pecs-drive',      'Pécs Drive',                'Pécs',            null, 'Tüzér utca 5, 7623',                      46.0716, 18.2316),
  ('pecs-banyavasut', 'Pécs Bányavasút',           'Pécs',            null, 'Bányavasút utca 2, 7630',                 46.0847, 18.2687),
  ('kaposvar',        'Kaposvár',                  'Kaposvár',        null, 'Budai Nagy Antal utca 7, 7400',           46.3537, 17.7942),
  ('siofok',          'Siófok',                    'Siófok',          null, 'Vak Bottyán utca 27, 8600',               46.8930, 18.0583),
  ('szeged-arkad',    'Szeged Árkád',              'Szeged',          null, 'Londoni körút 3, 6724',                   46.2548, 20.1380),
  ('szeged-drive',    'Szeged Drive',              'Szeged',          null, 'Makkosházi körút 2, 6723',                46.2723, 20.1576),
  -- Eastern Hungary (7)
  ('debrecen',        'Debrecen',                  'Debrecen',        null, 'Csapó utca 30, 4024',                     47.5323, 21.6288),
  ('debrecen-drive',  'Debrecen Drive',            'Debrecen',        null, 'Böszörményi út 24, 4027',                 47.5331, 21.6282),
  ('nyiregyhaza',     'Nyíregyháza',               'Nyíregyháza',     null, 'Pazonyi út 32, 4400',                     47.9697, 21.7365),
  ('miskolc-plaza',   'Miskolc Plaza',             'Miskolc',         null, 'Szentpáli utca 2, 3525',                  48.1062, 20.7894),
  ('miskolc-szentpeter','Miskolc Szentpéter',      'Miskolc',         null, 'Szentpéteri kapu 103, 3526',              48.1277, 20.7835),
  ('miskolc-jozsef',  'Miskolc József A.',         'Miskolc',         null, 'József Attila utca 87, 3527',             48.1069, 20.8375),
  ('eger',            'Eger',                      'Eger',            null, 'Törvényház utca 4, 3300',                  47.9006, 20.3676),
  -- Central-South (3)
  ('bekescsaba',      'Békéscsaba',                'Békéscsaba',      null, 'Andrássy út 37-43, 5600',                  46.6771, 21.0902),
  ('kecskemet',       'Kecskemét',                 'Kecskemét',       null, 'Dunaföldvári út 2, 6000',                  46.8881, 19.6403),
  ('szolnok',         'Szolnok',                   'Szolnok',         null, 'Felső Szandai rét 1, 5000',               47.1582, 20.1987);
