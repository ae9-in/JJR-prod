import { useState, useEffect } from "react";
import { getProductImage, getLocalImage } from "@/utils/productImage";
import { Package } from "lucide-react";

type Props = {
    product?: {
        image_path?: string;
        slug?: string;
        name?: string;
    };
    imagePath?: string; // Backwards compatibility & overrides
    slug?: string;      // Override for variants
    alt: string;
    className?: string;
};

export default function ProductImage({ product, imagePath, slug, alt, className }: Props) {
    // Construct an effective product taking overrides first, then product fallback
    const effectiveProduct = { 
        image_path: imagePath || product?.image_path, 
        slug: slug || product?.slug 
    };

    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const url = getProductImage(effectiveProduct);
        setImgSrc(url);
        setHasError(false);
    }, [effectiveProduct.image_path, effectiveProduct.slug]);

    const handleError = () => {
        if (!hasError && effectiveProduct.slug) {
            // If primary source failed, try forced local fallback
            const localUrl = getLocalImage(effectiveProduct.slug);
            if (localUrl && localUrl !== imgSrc) {
                setImgSrc(localUrl);
                setHasError(true); // Prevent infinite loops
                return;
            }
        }
        // If already tried local or no slug, validation failed completely
        setImgSrc(null);
    };

    if (!imgSrc) {
        return (
            <div className={`flex items-center justify-center bg-[#1A0303]/5 w-full h-full ${className || ""}`}>
                <Package className="opacity-20 text-[#C5A059]" />
            </div>
        );
    }

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={`w-full h-full object-cover ${className ?? ""}`}
            loading="lazy"
            onError={handleError}
        />
    );
}
