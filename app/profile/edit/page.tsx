'use client'

import Spinner from '@/app/components/Spinner';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { FaUser, FaSave } from 'react-icons/fa';

export default function EditProfile() {


  const [loaing, setLoading] = useState(true)
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: '',
      avatar: '',
      bio: '',
      
      phone: ''
    }
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/users/me', { credentials: 'include' });
        const data = await res.json();
        if (data.user) {
          reset({
            name: data.user.name,
            avatar: data.user.avatar,
            bio: data.user.bio,
            phone: data.user.phone
          });
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [reset]);

  const router = useRouter()

  const onSubmit = async (data: any) => {
    let formData = new FormData()

    const avatarInput = document.getElementById('avatar') as HTMLInputElement;
    const avatarFile = avatarInput.files?.[0];
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    // Append other form data
    formData.append('name', data.name)
    formData.append('bio', data.bio)
    formData.append('phone', data.phone)

    setLoading(true)
    const response = await fetch('/api/users/edit', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (result.status == 201) {
      setLoading(false)
      router.push("/profile")
    }

  };

 if(loaing) return <Spinner/>

  return (
    <div className="mx-auto bg-white shadow-xl rounded-lg ">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          
            <div className='my-5'>
              <input
                {...register("avatar")}
                type="file"
                id="avatar"
                className="hidden"
                accept="image/*"
              
              />
              <label htmlFor="avatar" className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-200 cursor-pointer">
                Change Avatar
              </label>
            </div>
          

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.name && <p className="mt-2 text-sm text-red-600">{errors?.name?.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              {...register("bio", { required: "Bio is required" })}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.bio && <p className="mt-2 text-sm text-red-600">{errors.bio.message}</p>}
          </div>


          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              {...register("phone")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button type="submit" disabled={loaing} className="w-full bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-200 disabled:cursor-not-allowed">
            {
              loaing ? "Saving..." : (
                <>
                <FaSave className="inline-block mr-2" />
                Save Changes
                </>
            )
            }
          </button>
        </form>
      </div>
    </div>
  );
}
