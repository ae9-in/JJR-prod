import { supabase } from '../lib/supabase';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  image_path?: string;
  created_at: string;
}

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return data as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
