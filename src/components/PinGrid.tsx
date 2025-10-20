"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { Pin } from "@/generated/prisma";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";

const PinGrid = ({
  endpoint,
  search,
  sort = "latest",
}: {
  endpoint: string;
  search?: string;
  sort?: string;
}) => {
  const [pins, setPins] = useState<Pin[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const loadingRef = useRef(false); // prevents duplicate fetches

  // Reset when search changes
  useEffect(() => {
    setLoading(true);
    setPins([]);
    setPage(1);
    setHasMore(true);
  }, [search, endpoint, sort]);

  useEffect(() => {
    const fetchPins = async () => {
      if (loadingRef.current || !hasMore) return;

      setLoading(true);
      loadingRef.current = true;

      try {
        const res = await axios.get(`${endpoint}?page=${page}&sort=${sort}`);

        const newPins = res.data.pins || [];

        setPins((prev) => [...prev, ...newPins]);

        if (page >= res.data.totalPages || newPins.length === 0) {
          setHasMore(false);
        }
      } catch {
        toast.error("Failed to fetch pins.");
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    };

    fetchPins();
  }, [page, endpoint, sort, hasMore]);

  // Handle infinite scroll
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

  // Spinner for initial load
  if (loading && pins.length === 0) {
    return <LoadingSpinner />;
  }

  // Show no pins message when no pins are found after search
  if (!loading && pins.length === 0) {
    return <p>No Pins to Show</p>;
  }

  return (
    <div className="space-y-5 w-full">
      <div className="container flex flex-col gap-15 items-center">
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 0: 1, 349: 2, 767: 3, 1023: 4, 1279: 5 }}
          className="w-full"
        >
          <Masonry>
            {pins.map((pin) => (
              <PinCard key={pin.id} pin={pin} />
            ))}
          </Masonry>
        </ResponsiveMasonry>

        {/* Spinner when fetching next page */}
        {hasMore && loadingRef.current && <LoadingSpinner />}
      </div>
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
