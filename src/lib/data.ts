import type { Restaurant, Review } from '@/types';

export const HU_RESTAURANTS: Restaurant[] = [
  { id: 'bp-westend',  name: 'Budapest WestEnd',       city: 'Budapest',         district: 'VI. kerület',   lat: 47.5106, lng: 19.0560, score: 4.7, reviews: 142 },
  { id: 'bp-deak',     name: 'Budapest Deák tér',      city: 'Budapest',         district: 'V. kerület',    lat: 47.4979, lng: 19.0552, score: 4.5, reviews: 218 },
  { id: 'bp-blaha',    name: 'Budapest Blaha Lujza',   city: 'Budapest',         district: 'VIII. kerület', lat: 47.4965, lng: 19.0703, score: 3.9, reviews: 88  },
  { id: 'bp-arena',    name: 'Budapest Aréna Mall',    city: 'Budapest',         district: 'XIV. kerület',  lat: 47.5018, lng: 19.0900, score: 4.2, reviews: 167 },
  { id: 'bp-mom',      name: 'Budapest MOM Park',      city: 'Budapest',         district: 'XII. kerület',  lat: 47.4925, lng: 19.0220, score: 4.8, reviews: 96  },
  { id: 'bp-corvin',   name: 'Budapest Corvin Plaza',  city: 'Budapest',         district: 'VIII. kerület', lat: 47.4859, lng: 19.0738, score: 4.1, reviews: 73  },
  { id: 'bp-arkad',    name: 'Budapest Árkád',         city: 'Budapest',         district: 'X. kerület',    lat: 47.4986, lng: 19.1410, score: 4.4, reviews: 119 },
  { id: 'bp-buda',     name: 'Budapest Mammut',        city: 'Budapest',         district: 'II. kerület',   lat: 47.5100, lng: 19.0270, score: 4.0, reviews: 64  },
  { id: 'debrecen',    name: 'Debrecen Fórum',         city: 'Debrecen',         district: '',              lat: 47.5316, lng: 21.6273, score: 4.6, reviews: 81  },
  { id: 'szeged',      name: 'Szeged Árkád',           city: 'Szeged',           district: '',              lat: 46.2530, lng: 20.1414, score: 4.3, reviews: 54  },
  { id: 'pecs',        name: 'Pécs Árkád',             city: 'Pécs',             district: '',              lat: 46.0727, lng: 18.2329, score: 3.7, reviews: 41  },
  { id: 'gyor',        name: 'Győr Árkád',             city: 'Győr',             district: '',              lat: 47.6849, lng: 17.6504, score: 4.4, reviews: 67  },
  { id: 'miskolc',     name: 'Miskolc Plaza',          city: 'Miskolc',          district: '',              lat: 48.1023, lng: 20.7800, score: 3.8, reviews: 38  },
  { id: 'nyiregy',     name: 'Nyíregyháza',            city: 'Nyíregyháza',      district: '',              lat: 47.9554, lng: 21.7270, score: 4.0, reviews: 29  },
  { id: 'kecskemet',   name: 'Kecskemét Malom',        city: 'Kecskemét',        district: '',              lat: 46.9077, lng: 19.6920, score: 4.2, reviews: 33  },
  { id: 'szekes',      name: 'Székesfehérvár Alba',    city: 'Székesfehérvár',   district: '',              lat: 47.1860, lng: 18.4221, score: 4.5, reviews: 47  },
  { id: 'veszprem',    name: 'Veszprém Balaton Plaza', city: 'Veszprém',         district: '',              lat: 47.0930, lng: 17.9093, score: 3.6, reviews: 22  },
  { id: 'sopron',      name: 'Sopron Plaza',           city: 'Sopron',           district: '',              lat: 47.6817, lng: 16.5845, score: 4.1, reviews: 26  },
  { id: 'szombat',     name: 'Szombathely',            city: 'Szombathely',      district: '',              lat: 47.2307, lng: 16.6218, score: 3.9, reviews: 19  },
  { id: 'szolnok',     name: 'Szolnok Plaza',          city: 'Szolnok',          district: '',              lat: 47.1747, lng: 20.1820, score: 4.3, reviews: 31  },
  { id: 'eger',        name: 'Eger Agria Park',        city: 'Eger',             district: '',              lat: 47.9025, lng: 20.3772, score: 4.7, reviews: 44  },
  { id: 'tatabanya',   name: 'Tatabánya Vértes',       city: 'Tatabánya',        district: '',              lat: 47.5692, lng: 18.4040, score: 3.5, reviews: 16  },
];

export const MOCK_REVIEWS: Record<string, Review[]> = {
  'bp-mom': [
    { id: 1, author: 'Réka N.',  avatar: 'RN', score: 5, date: '2026-04-22', body: 'Tökéletes! Kívül kissé ropogós, belül szaftos és csokis. Ez a legjobb, amit valaha kóstoltam itthon.', tags: ['szaftos', 'csokis'], likes: 24, hasPhoto: true },
    { id: 2, author: 'Marci T.', avatar: 'MT', score: 5, date: '2026-04-15', body: 'Friss volt, meleg, és a csoki rétegek határozottan érezhetők. 10/10.', tags: ['friss', 'meleg'], likes: 18, hasPhoto: false },
    { id: 3, author: 'Anna K.',  avatar: 'AK', score: 4, date: '2026-03-30', body: 'Nagyon finom, de egy kicsit kicsinek éreztem ehhez az árhoz.', tags: ['drága'], likes: 9, hasPhoto: true },
  ],
  'bp-westend': [
    { id: 1, author: 'Bence H.', avatar: 'BH', score: 5, date: '2026-04-28', body: 'Mindig friss, mindig csokis. A WestEnd-i a kedvencem a városban.', tags: ['friss'], likes: 31, hasPhoto: true },
    { id: 2, author: 'Lili V.',  avatar: 'LV', score: 4, date: '2026-04-10', body: 'Jó, de néha kicsit száraz. Délután 4 előtt érdemes menni.', tags: ['száraz'], likes: 12, hasPhoto: false },
  ],
  'bp-blaha': [
    { id: 1, author: 'Gergő F.', avatar: 'GF', score: 3, date: '2026-04-19', body: 'Átlagos. Ettem már sokkal jobbat is, sokkal rosszabbat is.', tags: ['átlagos'], likes: 4, hasPhoto: false },
    { id: 2, author: 'Petra S.', avatar: 'PS', score: 4, date: '2026-04-02', body: 'Meglepően jó volt aznap, szaftos és nem száraz.', tags: ['szaftos'], likes: 7, hasPhoto: true },
  ],
};

export const BROWNIE_TAGS = [
  'szaftos', 'csokis', 'friss', 'meleg', 'száraz', 'kemény', 'drága', 'olcsó', 'nagy adag', 'átlagos',
];

export function scoreClass(score: number): string {
  if (score >= 4.7) return 'score-best';
  if (score >= 4.4) return 'score-high';
  if (score >= 4.0) return 'score-mid';
  return 'score-low';
}
