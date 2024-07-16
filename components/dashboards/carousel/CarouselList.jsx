import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

const CarouselList = ({ carousels, onDeleteCarousel }) => {
  if (!carousels) {
    console.error("Carousels is null");
    return <p className="text-red-500">Carousel data not available.</p>;
  }

  return (
    <div className="flex flex-col space-y-4 mt-4">
      <h2>Carousel List</h2>
      {carousels.length === 0 ? (
        <p className="text-red-500">Carousel not found.</p>
      ) : (
        carousels.map((carousel) => {
          if (!carousel.image) {
            console.error("Invalid carousel data", carousel);
            return null;
          }
          return (
            <div key={carousel.id} className="p-4 border rounded shadow-md">
              <Image
                src={carousel.image}
                alt={carousel.title || "No Title"}
                priority={true}
                width={1920}
                height={1080}
                style={{ width: "50%", height: "100%", margin: "0 auto" }}
              />
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{carousel.title || "Untitled"}</h3>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => onDeleteCarousel(carousel.id)}
                    className="bg-red-500 hover:bg-red-700 text-white"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default CarouselList;
