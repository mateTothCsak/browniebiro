import type { Restaurant, ScoreClass } from '@/types';

export const HU_RESTAURANTS: Restaurant[] = [
  // Budapest (30)
  { id: 'bp-allee',        name: 'Budapest Allee',            city: 'Budapest', district: 'XI. kerület',    lat: 47.4743, lng: 19.0491, score: 0, reviews: 0 },
  { id: 'bp-anna',         name: 'Budapest Anna',             city: 'Budapest', district: 'V. kerület',     lat: 47.4954, lng: 19.0514, score: 0, reviews: 0 },
  { id: 'bp-arany',        name: 'Budapest Arany',            city: 'Budapest', district: 'V. kerület',     lat: 47.5026, lng: 19.0540, score: 0, reviews: 0 },
  { id: 'bp-arena',        name: 'Budapest Aréna',            city: 'Budapest', district: 'VIII. kerület',  lat: 47.4982, lng: 19.0917, score: 0, reviews: 0 },
  { id: 'bp-arkad',        name: 'Budapest Árkád',            city: 'Budapest', district: 'X. kerület',     lat: 47.5027, lng: 19.1389, score: 0, reviews: 0 },
  { id: 'bp-astoria',      name: 'Budapest Astoria',          city: 'Budapest', district: 'VIII. kerület',  lat: 47.4938, lng: 19.0607, score: 0, reviews: 0 },
  { id: 'bp-becsi',        name: 'Budapest Bécsi',            city: 'Budapest', district: 'III. kerület',   lat: 47.5644, lng: 19.0221, score: 0, reviews: 0 },
  { id: 'bp-campona',      name: 'Budapest Campona',          city: 'Budapest', district: 'XXII. kerület',  lat: 47.4074, lng: 19.0187, score: 0, reviews: 0 },
  { id: 'bp-corvin',       name: 'Budapest Corvin',           city: 'Budapest', district: 'VIII. kerület',  lat: 47.4863, lng: 19.0745, score: 0, reviews: 0 },
  { id: 'bp-csepel',       name: 'Budapest Csepel',           city: 'Budapest', district: 'XXI. kerület',   lat: 47.4267, lng: 19.0691, score: 0, reviews: 0 },
  { id: 'bp-cserto',       name: 'Budapest Csertő utca',      city: 'Budapest', district: 'XIV. kerület',   lat: 47.5541, lng: 19.1428, score: 0, reviews: 0 },
  { id: 'bp-emke',         name: 'Budapest Emke',             city: 'Budapest', district: 'VII. kerület',   lat: 47.4972, lng: 19.0698, score: 0, reviews: 0 },
  { id: 'bp-etele',        name: 'Budapest Etele Pláza',      city: 'Budapest', district: 'XI. kerület',    lat: 47.4644, lng: 19.0244, score: 0, reviews: 0 },
  { id: 'bp-hungaria',     name: 'Budapest Hungária',         city: 'Budapest', district: 'XIV. kerület',   lat: 47.5085, lng: 19.1012, score: 0, reviews: 0 },
  { id: 'bp-keleti',       name: 'Budapest Keleti',           city: 'Budapest', district: 'VII. kerület',   lat: 47.5009, lng: 19.0816, score: 0, reviews: 0 },
  { id: 'bp-kerepesi',     name: 'Budapest Kerepesi',         city: 'Budapest', district: 'XIV. kerület',   lat: 47.5011, lng: 19.1130, score: 0, reviews: 0 },
  { id: 'bp-koki',         name: 'Budapest Köki',             city: 'Budapest', district: 'XIX. kerület',   lat: 47.4626, lng: 19.1478, score: 0, reviews: 0 },
  { id: 'bp-mammut',       name: 'Budapest Mammut',           city: 'Budapest', district: 'II. kerület',    lat: 47.5091, lng: 19.0265, score: 0, reviews: 0 },
  { id: 'bp-mexikoi',      name: 'Budapest Mexikói út',       city: 'Budapest', district: 'XIV. kerület',   lat: 47.5197, lng: 19.0912, score: 0, reviews: 0 },
  { id: 'bp-oktogon',      name: 'Budapest Oktogon',          city: 'Budapest', district: 'VI. kerület',    lat: 47.5052, lng: 19.0627, score: 0, reviews: 0 },
  { id: 'bp-pesti',        name: 'Budapest Pesti út',         city: 'Budapest', district: 'XVII. kerület',  lat: 47.4839, lng: 19.2300, score: 0, reviews: 0 },
  { id: 'bp-polus',        name: 'Budapest Pólus',            city: 'Budapest', district: 'XV. kerület',    lat: 47.5525, lng: 19.1401, score: 0, reviews: 0 },
  { id: 'bp-soroksar',     name: 'Budapest Soroksár',         city: 'Budapest', district: 'XXIII. kerület', lat: 47.4153, lng: 19.1598, score: 0, reviews: 0 },
  { id: 'bp-szena',        name: 'Budapest Széna tér',        city: 'Budapest', district: 'I. kerület',     lat: 47.5073, lng: 19.0269, score: 0, reviews: 0 },
  { id: 'bp-tetenyi',      name: 'Budapest Tétényi',          city: 'Budapest', district: 'XI. kerület',    lat: 47.4641, lng: 19.0321, score: 0, reviews: 0 },
  { id: 'bp-ubc',          name: 'Budapest UBC',              city: 'Budapest', district: 'XI. kerület',    lat: 47.4608, lng: 19.0519, score: 0, reviews: 0 },
  { id: 'bp-ujpest',       name: 'Budapest Újpest',           city: 'Budapest', district: 'IV. kerület',    lat: 47.5602, lng: 19.0905, score: 0, reviews: 0 },
  { id: 'bp-ulloi',        name: 'Budapest Üllői',            city: 'Budapest', district: 'X. kerület',     lat: 47.4721, lng: 19.1097, score: 0, reviews: 0 },
  { id: 'bp-vamhaz',       name: 'Budapest Vámház',           city: 'Budapest', district: 'V. kerület',     lat: 47.4875, lng: 19.0580, score: 0, reviews: 0 },
  { id: 'bp-westend',      name: 'Budapest WestEnd',          city: 'Budapest', district: 'VI. kerület',    lat: 47.5142, lng: 19.0599, score: 0, reviews: 0 },
  // Budapest agglomeration (6)
  { id: 'budakalasz',      name: 'Budakalász',                city: 'Budakalász',      district: '', lat: 47.6160, lng: 19.0646, score: 0, reviews: 0 },
  { id: 'budaors',         name: 'Budaörs',                   city: 'Budaörs',         district: '', lat: 47.4555, lng: 18.9465, score: 0, reviews: 0 },
  { id: 'dunakeszi',       name: 'Dunakeszi',                 city: 'Dunakeszi',       district: '', lat: 47.6234, lng: 19.1206, score: 0, reviews: 0 },
  { id: 'erd',             name: 'Érd',                       city: 'Érd',             district: '', lat: 47.3779, lng: 18.9339, score: 0, reviews: 0 },
  { id: 'solymar',         name: 'Solymár',                   city: 'Solymár',         district: '', lat: 47.5977, lng: 18.9645, score: 0, reviews: 0 },
  { id: 'vecses-airport',  name: 'Vecsés Airport',            city: 'Vecsés',          district: '', lat: 47.4164, lng: 19.2485, score: 0, reviews: 0 },
  // Western Hungary (8)
  { id: 'gyor',            name: 'Győr Árkád',                city: 'Győr',            district: '', lat: 47.6824, lng: 17.9809, score: 0, reviews: 0 },
  { id: 'sopron',          name: 'Sopron',                    city: 'Sopron',          district: '', lat: 47.6721, lng: 16.6124, score: 0, reviews: 0 },
  { id: 'szombathely',     name: 'Szombathely',               city: 'Szombathely',     district: '', lat: 47.2423, lng: 16.6545, score: 0, reviews: 0 },
  { id: 'zalaegerszeg',    name: 'Zalaegerszeg',              city: 'Zalaegerszeg',    district: '', lat: 46.8450, lng: 16.8621, score: 0, reviews: 0 },
  { id: 'nagykanizsa',     name: 'Nagykanizsa',               city: 'Nagykanizsa',     district: '', lat: 46.4541, lng: 16.9985, score: 0, reviews: 0 },
  { id: 'veszprem',        name: 'Veszprém',                  city: 'Veszprém',        district: '', lat: 47.0985, lng: 17.9262, score: 0, reviews: 0 },
  { id: 'szekes-arkad',    name: 'Székesfehérvár Árkád',      city: 'Székesfehérvár',  district: '', lat: 47.1826, lng: 18.4074, score: 0, reviews: 0 },
  { id: 'szekes-nextstop', name: 'Székesfehérvár Next Stop',  city: 'Székesfehérvár',  district: '', lat: 47.1512, lng: 18.4319, score: 0, reviews: 0 },
  // Central (2)
  { id: 'tatabanya',       name: 'Tatabánya',                 city: 'Tatabánya',       district: '', lat: 47.6033, lng: 18.3869, score: 0, reviews: 0 },
  { id: 'm1-acs',          name: 'M1 Ács',                    city: 'Ács',             district: '', lat: 47.6950, lng: 18.0250, score: 0, reviews: 0 },
  // Southern Hungary (7)
  { id: 'pecs-arkad',      name: 'Pécs Árkád',                city: 'Pécs',            district: '', lat: 46.1244, lng: 18.3068, score: 0, reviews: 0 },
  { id: 'pecs-drive',      name: 'Pécs Drive',                city: 'Pécs',            district: '', lat: 46.0716, lng: 18.2316, score: 0, reviews: 0 },
  { id: 'pecs-banyavasut', name: 'Pécs Bányavasút',           city: 'Pécs',            district: '', lat: 46.0847, lng: 18.2687, score: 0, reviews: 0 },
  { id: 'kaposvar',        name: 'Kaposvár',                  city: 'Kaposvár',        district: '', lat: 46.3537, lng: 17.7942, score: 0, reviews: 0 },
  { id: 'siofok',          name: 'Siófok',                    city: 'Siófok',          district: '', lat: 46.8930, lng: 18.0583, score: 0, reviews: 0 },
  { id: 'szeged-arkad',    name: 'Szeged Árkád',              city: 'Szeged',          district: '', lat: 46.2548, lng: 20.1380, score: 0, reviews: 0 },
  { id: 'szeged-drive',    name: 'Szeged Drive',              city: 'Szeged',          district: '', lat: 46.2723, lng: 20.1576, score: 0, reviews: 0 },
  // Eastern Hungary (7)
  { id: 'debrecen',        name: 'Debrecen',                  city: 'Debrecen',        district: '', lat: 47.5323, lng: 21.6288, score: 0, reviews: 0 },
  { id: 'debrecen-drive',  name: 'Debrecen Drive',            city: 'Debrecen',        district: '', lat: 47.5331, lng: 21.6282, score: 0, reviews: 0 },
  { id: 'nyiregyhaza',     name: 'Nyíregyháza',               city: 'Nyíregyháza',     district: '', lat: 47.9697, lng: 21.7365, score: 0, reviews: 0 },
  { id: 'miskolc-plaza',   name: 'Miskolc Plaza',             city: 'Miskolc',         district: '', lat: 48.1062, lng: 20.7894, score: 0, reviews: 0 },
  { id: 'miskolc-szentpeter', name: 'Miskolc Szentpéter',     city: 'Miskolc',         district: '', lat: 48.1277, lng: 20.7835, score: 0, reviews: 0 },
  { id: 'miskolc-jozsef',  name: 'Miskolc József A.',         city: 'Miskolc',         district: '', lat: 48.1069, lng: 20.8375, score: 0, reviews: 0 },
  { id: 'eger',            name: 'Eger',                      city: 'Eger',            district: '', lat: 47.9006, lng: 20.3676, score: 0, reviews: 0 },
  // Central-South (3)
  { id: 'bekescsaba',      name: 'Békéscsaba',                city: 'Békéscsaba',      district: '', lat: 46.6771, lng: 21.0902, score: 0, reviews: 0 },
  { id: 'kecskemet',       name: 'Kecskemét',                 city: 'Kecskemét',       district: '', lat: 46.8881, lng: 19.6403, score: 0, reviews: 0 },
  { id: 'szolnok',         name: 'Szolnok',                   city: 'Szolnok',         district: '', lat: 47.1582, lng: 20.1987, score: 0, reviews: 0 },
];


export const BROWNIE_TAGS = [
  'szaftos', 'csokis', 'friss', 'meleg', 'száraz', 'kemény', 'drága', 'olcsó', 'nagy adag', 'átlagos',
];

export function scoreClass(score: number): ScoreClass {
  if (score <= 0) return 'score-none';
  if (score >= 4.7) return 'score-best';
  if (score >= 4.4) return 'score-high';
  if (score >= 4.0) return 'score-mid';
  return 'score-low';
}
