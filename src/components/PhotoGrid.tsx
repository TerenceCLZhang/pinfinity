"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

const PhotoGrid = () => {
  const images = Array.from(
    { length: 13 },
    (_, i) => `/test/sample${i + 1}.jpg`
  );

  return (
    <div className="container columns-5 gap-4 space-y-4 ">
      {images.map((v, i) => (
        <ImageCard key={i} src={v} alt={`Placeholder ${i}`} />
      ))}
    </div>
  );
};

const ImageCard = ({ src, alt }: { src: string; alt: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`w-full break-inside-avoid relative rounded-lg overflow-hidden`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!loaded && <Skeleton className="w-full h-[300px] rounded-lg" />}

      <Link href={"/pic/abc"}>
        <Image
          src={src}
          alt={alt}
          width={500}
          height={500}
          onLoad={() => setLoaded(true)}
          className={`w-full h-auto transition-all duration-500 ${
            loaded ? "opacity-100" : "opacity-0 absolute"
          } group-hover:shadow-inner`}
        />

        {hovered && (
          <>
            <Button
              type="button"
              size={"lg"}
              className="absolute right-2 top-2 z-20"
            >
              Save
            </Button>

            <div className="absolute top-0 left-0 h-full w-full bg-black/25" />
          </>
        )}
      </Link>
    </div>
  );
};

export default PhotoGrid;
