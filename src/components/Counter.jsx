import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button
      onClick={() => setCount(count + 1)}
      className='bg-gradient-to-r from-teal-400 to-purple-500 text-white px-4 py-2 rounded-md relative overflow-hidden group'>
      Clicks: <span className='font-bold'>{count}</span>
      <span className='absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
    </button>
  );
}
