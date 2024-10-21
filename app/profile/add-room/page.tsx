"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  FaBed,
  FaUsers,
  FaDollarSign,
  FaAlignLeft,
  FaMapMarkerAlt,
} from "react-icons/fa"; // Import icons
import { useFieldArray } from "react-hook-form"; // Import useFieldArray

type RoomFormInputs = {
  name: string;
  capacity: number;
  price: number;
  description: string;
  country: string;
  city: string;
  address: string;
  type: string;
};

export default function AddRoomPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RoomFormInputs>();
  const {
    fields: amenitiesFields,
    append: appendAmenity,
    remove: removeAmenity,
  } = useFieldArray<RoomFormInputs>({
    control,
    name: "amenities", 
  });

  const [loading, setLoading] = useState(false); // State for loading

  const onSubmit: SubmitHandler<RoomFormInputs> = async (data) => {
    setLoading(true); // Set loading to true
    let formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'number') {
        formData.append(key, value.toString());
      } else {
        formData.append(key, value);
      }
    });

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append(`images`, images[i]);
      }
    }

    try {
      const response = await fetch('/api/rooms/add', {
        method: 'POST',
        credentials: "include",
        body: formData,
      });

      const data = await response.json()
      if(data.status === 200) {
        router.push('/profile/my-rooms')
      }
      
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const [images, setImages] = useState<FileList | null>(null); // State for images

  const addAmenity = () => {
    appendAmenity(""); // Add a new empty input for amenities
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Add New Room</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 mx-auto bg-white shadow-md rounded-lg p-8"
      >
        <div>
          <label
            htmlFor="name"
            className="block mb-2 font-semibold text-gray-700"
          >
            Room Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaBed className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register("name", { required: "Room name is required" })} // Validation for room name
              type="text"
              id="name"
              className="w-full pl-10 py-2 border border-gray-300 rounded-md"
              placeholder="Deluxe Suite"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="capacity"
              className="block mb-2 font-semibold text-gray-700"
            >
              Capacity
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUsers className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register("capacity", {
                  required: "Capacity is required",
                  min: { value: 1, message: "Capacity must be at least 1" },
                })} // Validation for capacity
                type="number"
                id="capacity"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2"
              />
            </div>
            {errors.capacity && (
              <p className="text-red-500 text-sm mt-1">
                {errors.capacity.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="price"
              className="block mb-2 font-semibold text-gray-700"
            >
              Price per Night
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaDollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be non-negative" },
                })} // Validation for price
                type="number"
                id="price"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="100"
              />
            </div>
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block mb-2 font-semibold text-gray-700"
          >
            Description
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaAlignLeft className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              {...register("description", {
                required: "Description is required",
              })} // Validation for description
              id="description"
              className="w-full pl-10 py-2 border border-gray-300 rounded-md"
              rows={4}
              placeholder="Describe your room..."
            ></textarea>
          </div>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Amenities
          </label>
          {amenitiesFields.map((field, index) => (
            <div key={field.id} className="flex items-center mb-2">
              <input
                type="text"
                {...register(`amenities.${index}`, {
                  required: "Amenity is required",
                })} // Validation for amenities
                className="w-full py-2 border border-gray-300 rounded-md"
                placeholder="Amenity"
              />
              <button
                type="button"
                onClick={() => removeAmenity(index)}
                className="ml-2 text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addAmenity} className="text-blue-500">
            + Add Amenity
          </button>
        </div>

        <div>
          <label
            htmlFor="images"
            className="block mb-2 font-semibold text-gray-700"
          >
            Images
          </label>
          <input
            type="file"
            id="images"
            multiple
            onChange={(e) => setImages(e.target.files)}
            className="border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="country"
            className="block mb-2 font-semibold text-gray-700"
          >
            Country
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register("country", { required: "Country is required" })} // Validation for country
              type="text"
              id="country"
              className="w-full pl-10 py-2 border border-gray-300 rounded-md"
              placeholder="Country"
            />
          </div>
          {errors.country && (
            <p className="text-red-500 text-sm mt-1">
              {errors.country.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="city"
            className="block mb-2 font-semibold text-gray-700"
          >
            City
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register("city", { required: "City is required" })} // Validation for city
              type="text"
              id="city"
              className="w-full pl-10 py-2 border border-gray-300 rounded-md"
              placeholder="City"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="address"
            className="block mb-2 font-semibold text-gray-700"
          >
            Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register("address", { required: "Address is required" })} // Validation for address
              type="text"
              id="address"
              className="w-full pl-10 py-2 border border-gray-300 rounded-md"
              placeholder="Address"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="type"
            className="block mb-2 font-semibold text-gray-700"
          >
            Type
          </label>
          <select
            {...register("type", { required: "Type is required" })}
            id="type"
            className="w-full py-2 border border-gray-300 rounded-md"
          >
            {" "}
            // Validation for type
            <option value="">Select Type</option>
            <option value="single">Single Room</option>
            <option value="house">House</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading} // Disable button while loading
          className={`w-full ${loading ? 'bg-gray-400' : 'bg-blue-500'} text-white px-4 py-3 rounded-md font-semibold hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
        >
          {loading ? 'Adding Room...' : 'Add Room'}
        </button>
      </form>
    </div>
  );
}
