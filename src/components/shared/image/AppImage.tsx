"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";

const fallbackImage = "/fallback.png";

type Props = {
     src?: string | null;
     alt?: string;
     className?: string;
     width?: number;
     height?: number;
     priority?: boolean;
     loading?: "lazy" | "eager";
} & Omit<ImageProps, "src" | "alt" | "width" | "height" | "loading">;

export const AppImage = ({
     src,
     alt,
     className = "",
     width,
     height,
     priority = false,
     loading = "lazy", // lazy by default for better performance
     ...rest
}: Props) => {
     const [imgSrc, setImgSrc] = useState(src || fallbackImage);

     useEffect(() => {
          setImgSrc(src || fallbackImage);
     }, [src]);

     return (
          <Image
               src={imgSrc}
               alt={alt || "image"}
               width={width || 500}   // default width
               height={height || 300} // default height
               onError={() => setImgSrc(fallbackImage)}
               className={className}
               priority={priority}
               loading={loading}
               {...rest}
          />
     );
};