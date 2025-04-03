import React from 'react';

// This could later be fetched from the CMS
const features = [
  {
    id: '1',
    title: 'Client-side Creativity',
    description:
      'Development is a canvas that demands creative solutions and endless ways to mould data to build seamless experiences. I choose to express my approach through React (Next.js), TypeScript and SASS.',
    bgColor: 'bg-gray-100',
  },
  {
    id: '2',
    title: 'Server-side Tidiness',
    description:
      'Whilst creative coding is not limited to the frontend, data should be made accessible to all and I like to keep things accurate in Express.js, GraphQL, SQL & non-SQL databases and various CMS.',
    bgColor: 'bg-purple-100',
  },
  {
    id: '3',
    title: 'Inspired by Japan',
    description:
      'Home for almost 5 years, Japan and her culture still hold a lot of influence over my design choices and practices.',
    bgColor: 'bg-orange-100',
  },
  {
    id: '4',
    title: 'Giving Back',
    description:
      "Being able to code and develop apps is like having a superpower and I'd like to be able to use it to give back people and the environment. My first focus is on helping to rebalance the way we live.",
    bgColor: 'bg-yellow-100',
  },
];

export default function HomeFeatures() {
  return (
    <section className='py-12'>
      <div className='container mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`${feature.bgColor} p-6 rounded-lg`}>
              <h3 className='text-xl font-bold mb-4'>{feature.title}</h3>
              <p className='text-gray-700 mb-5'>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
