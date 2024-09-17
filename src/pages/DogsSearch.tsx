import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

const DogsSearch: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [breed, setBreed] = useState<string>('');
  const fetchBreeds = async () => {
    const response = await axiosInstance.get('/dogs/breeds');
    console.log(response.data);
  };

  useEffect(() => {
    fetchBreeds();
  }, [breed]);

  return (
    <div>
      <select value={breed} onChange={(e) => setBreed(e.target.value)}>
        {/* options generated based on available breeds */}
      </select>
      <div>dogs</div>
    </div>
  );
};

export default DogsSearch;
