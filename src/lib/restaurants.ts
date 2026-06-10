import { createClient } from '@/utils/supabase/server';
import { HU_RESTAURANTS } from '@/lib/data';
import type { Restaurant } from '@/types';

export interface RestaurantData {
  restaurants: Restaurant[];
  /** false → static fallback data (DB unreachable or empty), submissions won't work */
  live: boolean;
}

export async function getRestaurants(): Promise<RestaurantData> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('restaurant_stats').select('*');
    if (error || !data || data.length === 0) {
      return { restaurants: HU_RESTAURANTS, live: false };
    }
    return {
      live: true,
      restaurants: data.map((row) => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        city: row.city,
        district: row.district ?? '',
        lat: row.lat,
        lng: row.lng,
        score: Number(row.score),
        reviews: row.reviewer_count,
        taste_avg: Number(row.taste_avg),
        texture_avg: Number(row.texture_avg),
        ice_cream_avg: Number(row.ice_cream_avg),
      })),
    };
  } catch {
    return { restaurants: HU_RESTAURANTS, live: false };
  }
}
