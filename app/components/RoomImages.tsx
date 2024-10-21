'use client'

import { useState } from 'react';
import Image from 'next/image';

interface RoomImagesProps {
  images: string[];
  alt: string;
}

export default function RoomImages({ images, alt }: RoomImagesProps) {
  const [mainImage, setMainImage] = useState(images?.[0]);

  return (
    <div className="space-y-2">
      <div className="relative h-64 md:h-96 w-full">
        <Image
          src={mainImage}
          alt={alt}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {images?.slice(0, 3).map((image, index) => (
          <div
            key={index}
            className="relative h-20 md:h-32 cursor-pointer"
            onClick={() => setMainImage(image)}
          >
            <Image
              src={image}
              alt={`${alt} ${index + 1}`}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
