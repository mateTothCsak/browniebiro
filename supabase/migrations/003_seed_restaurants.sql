-- ─────────────────────────────────────────────────────────────
-- BrownieBíró — seed: 22 real Hungarian BK locations
-- Run after 002_rls.sql.
-- Scores/reviews are intentionally NOT seeded — they start at
-- zero and build from real user submissions.
-- ─────────────────────────────────────────────────────────────

insert into public.restaurants (slug, name, city, district, lat, lng) values
  -- Budapest
  ('bp-westend',  'Budapest WestEnd',       'Budapest', 'VI. kerület',   47.5106, 19.0560),
  ('bp-deak',     'Budapest Deák tér',      'Budapest', 'V. kerület',    47.4979, 19.0552),
  ('bp-blaha',    'Budapest Blaha Lujza',   'Budapest', 'VIII. kerület', 47.4965, 19.0703),
  ('bp-arena',    'Budapest Aréna Mall',    'Budapest', 'XIV. kerület',  47.5018, 19.0900),
  ('bp-mom',      'Budapest MOM Park',      'Budapest', 'XII. kerület',  47.4925, 19.0220),
  ('bp-corvin',   'Budapest Corvin Plaza',  'Budapest', 'VIII. kerület', 47.4859, 19.0738),
  ('bp-arkad',    'Budapest Árkád',         'Budapest', 'X. kerület',    47.4986, 19.1410),
  ('bp-mammut',   'Budapest Mammut',        'Budapest', 'II. kerület',   47.5100, 19.0270),
  -- Vidék
  ('debrecen',    'Debrecen Fórum',         'Debrecen',       null, 47.5316, 21.6273),
  ('szeged',      'Szeged Árkád',           'Szeged',         null, 46.2530, 20.1414),
  ('pecs',        'Pécs Árkád',             'Pécs',           null, 46.0727, 18.2329),
  ('gyor',        'Győr Árkád',             'Győr',           null, 47.6849, 17.6504),
  ('miskolc',     'Miskolc Plaza',          'Miskolc',        null, 48.1023, 20.7800),
  ('nyiregy',     'Nyíregyháza',            'Nyíregyháza',    null, 47.9554, 21.7270),
  ('kecskemet',   'Kecskemét Malom',        'Kecskemét',      null, 46.9077, 19.6920),
  ('szekes',      'Székesfehérvár Alba',    'Székesfehérvár', null, 47.1860, 18.4221),
  ('veszprem',    'Veszprém Balaton Plaza', 'Veszprém',       null, 47.0930, 17.9093),
  ('sopron',      'Sopron Plaza',           'Sopron',         null, 47.6817, 16.5845),
  ('szombat',     'Szombathely',            'Szombathely',    null, 47.2307, 16.6218),
  ('szolnok',     'Szolnok Plaza',          'Szolnok',        null, 47.1747, 20.1820),
  ('eger',        'Eger Agria Park',        'Eger',           null, 47.9025, 20.3772),
  ('tatabanya',   'Tatabánya Vértes',       'Tatabánya',      null, 47.5692, 18.4040);
