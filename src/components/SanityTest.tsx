import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { client } from '../lib/sanity-astro';

// Simple query function using our Sanity client
const fetchSanityData = async () => {
  return client.fetch(`*[_type == "project"][0...3]{
    _id,
    title,
    description,
    "slug": slug.current,
    category,
    featured
  }`);
};

export default function SanityTest() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['sanity-test-projects'],
    queryFn: fetchSanityData,
  });

  if (isLoading) {
    return (
      <div className='animate-pulse p-4'>
        <div className='h-8 bg-gray-200 rounded w-1/3 mb-4'></div>
        <div className='h-40 bg-gray-200 rounded mb-4'></div>
        <div className='h-40 bg-gray-200 rounded'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
        <p>Error fetching data from Sanity: {(error as Error).message}</p>
        <p className='mt-2 text-sm'>
          Make sure your Sanity project is set up with the correct schema and
          has content.
        </p>
      </div>
    );
  }

  return (
    <div className='py-8'>
      <h2 className='text-xl font-semibold mb-4'>
        Projects from Sanity (React Component):
      </h2>

      {!data || data.length === 0 ? (
        <p>
          No projects found. Have you added any projects to your Sanity studio?
        </p>
      ) : (
        <div className='grid grid-cols-1 gap-6'>
          {data.map((project: any) => (
            <div
              key={project._id}
              className='border rounded-lg p-6 bg-white shadow-sm'>
              <h3 className='text-lg font-bold'>{project.title}</h3>
              <p className='text-gray-600 text-sm mt-1'>
                Category: {project.category}
              </p>
              {project.featured && (
                <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2 inline-block'>
                  Featured
                </span>
              )}
              <p className='mt-4'>{project.description}</p>
            </div>
          ))}
        </div>
      )}

      <div className='mt-8 p-4 bg-gray-100 rounded overflow-auto'>
        <h3 className='text-lg font-semibold mb-2'>Raw Response:</h3>
        <pre className='text-xs'>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}
