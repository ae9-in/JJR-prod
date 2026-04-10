import { supabase } from "../lib/supabase";

// Import local images from assets
// Mapped based on file list in src/assets/products
import camphorImg from "../src/assets/products/Camphor.png";
import oilImg from "../src/assets/products/PoojaOil.png";
import agarbattiImg from "../src/assets/products/Agarbhatti.png";
import agarbattiRoseImg from "../src/assets/products/Agarbhatti Rose JJ.png";
import agarbatti3in1Img from "../src/assets/products/Agarbhatti-3in1.png";
import agarbattiSandalwoodImg from "../src/assets/products/Agarbhatti-Sandalwood.png";
import sandalwoodImg from "../src/assets/products/Sandalwood.png";
import cottonWicksImg from "../src/assets/products/CottonWicks.png";
import arsinaKunkumaImg from "../src/assets/products/ArsinaKunkuma.png";

// Map slugs to local imports
const LOCAL_IMAGES: Record<string, string> = {
  "camphor": camphorImg,
  "pure-camphor": camphorImg,
  "pooja-oil": oilImg,
  "agarbatti": agarbattiImg,
  "agarbatti-rose": agarbattiRoseImg,
  "agarbatti-3in1": agarbatti3in1Img,
  "agarbatti-sandalwood": agarbattiSandalwoodImg,
  "sandalwood": sandalwoodImg,
  "sandalwood-dhoop": sandalwoodImg,
  "cotton-wicks": cottonWicksImg,
  "arsina-kunkuma": arsinaKunkumaImg,
};

export function getProductImage(product: { image_path?: string; slug?: string } | null | undefined): string | null {
  if (!product) return null;

  // 1. Try Supabase Storage if image_path exists
  if (product.image_path && supabase) {
    const { data } = supabase.storage.from("products").getPublicUrl(product.image_path);
    if (data?.publicUrl) {
      return data.publicUrl;
    }
  }

  // 2. Fallback to local image using slug
  if (product.slug && LOCAL_IMAGES[product.slug]) {
    return LOCAL_IMAGES[product.slug];
  }

  // 3. Fallback to a default placeholder if needed (optional)
  // For now return null so the UI can handle "no image" state if desired, 
  // or return a specific placeholder from local images.
  return null;
}

export function getLocalImage(slug?: string): string | null {
  if (!slug) return null;
  return LOCAL_IMAGES[slug] || null;
}
