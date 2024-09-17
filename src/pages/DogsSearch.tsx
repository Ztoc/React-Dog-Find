import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    const fetchDogs = async () => {
      const response = await axios.get(
        'https://frontend-take-home-service.fetch.com/dogs/search',
        {
          params: { breeds: breed ? [breed] : undefined },
          withCredentials: true,
        }
      );
      setDogs(response.data);
    };

    fetchDogs();
  }, [breed]);

  return (
    <div>
      <select value={breed} onChange={(e) => setBreed(e.target.value)}>
        {/* options generated based on available breeds */}
      </select>
      <div>
        {dogs.map((dog) => (
          <div key={dog.id}>
            <img src={dog.img} alt={dog.name} />
            <p>
              {dog.name} - {dog.breed} - Age: {dog.age}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DogsSearch;
