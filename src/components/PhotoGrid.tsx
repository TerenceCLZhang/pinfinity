"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const PhotoGrid = () => {
  const heights = [200, 250, 300, 350, 400];

  return (
    <div className="columns-4 gap-4 space-y-4">
      {[...Array(20)].map((_, i) => (
        <ImageWithSkeleton
          key={i}
          src={`https://picsum.photos/300/${
            heights[i % heights.length]
          }?random=${i}`}
          alt={`Placeholder ${i}`}
        />
      ))}
    </div>
  );
};

const ImageWithSkeleton = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="w-full break-inside-avoid">
      {!loaded && <Skeleton className="w-full h-[300px] rounded-lg" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`w-full rounded-lg transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0 absolute"
        }`}
      />
    </div>
  );
};

export default PhotoGrid;
