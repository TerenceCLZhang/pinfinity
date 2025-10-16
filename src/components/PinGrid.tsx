"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { Pin } from "@/generated/prisma";
import { Spinner } from "./ui/spinner";
import Masonry from "react-responsive-masonry";

const PinGrid = ({
  endpoint = "pins",
  search,
}: {
  endpoint?: string;
  search?: string;
}) => {
  const [pins, setPins] = useState<Pin[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadingRef = useRef(false); // prevents duplicate fetches

  // Reset when search changes
  useEffect(() => {
    setPins([]);
    setPage(1);
    setHasMore(true);
  }, [search]);

  useEffect(() => {
    const fetchPins = async () => {
      if (loadingRef.current || !hasMore) return;

      loadingRef.current = true;

      try {
        const res = await axios.get(`/api/${endpoint}?page=${page}`);
        const newPins = res.data.pins || [];

        setPins((prev) => [...prev, ...newPins]);

        if (page >= res.data.totalPages || newPins.length === 0) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Failed to fetch pins", error);
      } finally {
        loadingRef.current = false;
      }
    };

    fetchPins();
  }, [page, endpoint, hasMore]);

  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.scrollHeight;

      if (bottom && hasMore && !loadingRef.current) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  if (pins.length === 0 && !loadingRef.current) return <p>No Pins to Show</p>;

  return (
    <div className="container flex flex-col gap-15 items-center">
      <Masonry columnsCount={5} gutter="15px">
        {pins.map((pin) => (
          <PinCard key={pin.id} pin={pin} />
        ))}
      </Masonry>

      {hasMore && (
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
      className="container w-full break-inside-avoid relative rounded-lg overflow-hidden"
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
          }`}
        />

        {hovered && (
          <div className="absolute top-0 left-0 h-full w-full bg-black/25" />
        )}
      </Link>
    </div>
  );
};

export default PinGrid;
