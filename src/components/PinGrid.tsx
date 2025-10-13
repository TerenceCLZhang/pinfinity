"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import axios from "axios";
import { Pin } from "@/generated/prisma";

const PinGrid = () => {
  const [pins, setPins] = useState<Pin[]>([]);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const res = await axios.get("/api/pins/get-all");
        setPins(res.data);
      } catch (error) {
        console.error("Failed to fetch pins", error);
      }
    };

    fetchPins();
  }, []);

  if (!pins) return <p>No Pins to Show</p>;

  return (
    <div className="container columns-5 gap-4 space-y-4">
      {pins.map((pin) => (
        <PinCard key={pin.id} pin={pin} />
      ))}
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
