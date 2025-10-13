"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import axios from "axios";
import { Pin } from "@/generated/prisma";
import { Spinner } from "./ui/spinner";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const PinGrid = () => {
  const [pins, setPins] = useState<Pin[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch pins on page change
  useEffect(() => {
    const fetchPins = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`/api/pins/get-all/?page=${page}`);
        setPins((prev) => [...prev, ...res.data.pins]);

        // Stop loading if we reached the last page
        if (page >= res.data.totalPages) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Failed to fetch pins", error);
      } finally {
        setLoading(false);
      }
    };

    if (!hasMore) return;

    fetchPins();
  }, [page]);

  // Infinity scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
          document.documentElement.scrollHeight &&
        hasMore &&
        !loading
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!pins) return <p>No Pins to Show</p>;

  return (
    <div className="container flex flex-col gap-15 items-center ">
      <Masonry columnsCount={5} gutter="15px">
        {pins.map((pin) => (
          <PinCard key={pin.id} pin={pin} />
        ))}
      </Masonry>

      {loading && hasMore && (
        <div className="py-10 flex justify-center">
          <Spinner className="size-10 text-primary" />
        </div>
      )}
    </div>
  );
};

const PinCard = ({ pin }: { pin: Pin }) => {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`container w-full break-inside-avoid relative rounded-lg overflow-hidden`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/pin/${pin.id}`}>
        <Image
          src={pin.image}
          alt={pin.title}
          width={500}
          height={500}
          onLoad={() => setLoaded(true)}
          className={`w-full h-auto transition-all duration-500 ${
            loaded ? "opacity-100" : "opacity-0 absolute"
          } group-hover:shadow-inner`}
        />

        {hovered && (
          <div className="absolute top-0 left-0 h-full w-full bg-black/25" />
        )}
      </Link>

      {hovered && (
        <Button type="button" size={"lg"} className="absolute right-2 top-2">
          Like
        </Button>
      )}
    </div>
  );
};

export default PinGrid;
