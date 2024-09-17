import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Paper,
  Box,
  Pagination,
} from '@mui/material';

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

const DogsSearch: React.FC = () => {
  const [dogs, setDogs] = useState<any[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof Dog>('name'); // Default sort by name
  const [dogDetails, setDogDetails] = useState<Dog[]>([]);
  const [page, setPage] = useState<number>(1); // Current page for pagination
  const [totalPages, setTotalPages] = useState<number>(1); // Total pages for pagination

  // Fetch available breeds
  const fetchBreeds = async () => {
    try {
      const response = await axiosInstance.get('/dogs/breeds');
      if (response.status === 200) {
        setBreeds(response.data);
      }
    } catch (error) {
      console.error('Error fetching breeds:', error);
    }
  };

  // Fetch dogs by selected breed
  const fetchDogs = async () => {
    try {
      const response = await axiosInstance.get('/dogs/search', {
        params: {
          breeds: selectedBreed ? [selectedBreed] : undefined,
          size: 10, // Number of results per page
          from: (page - 1) * 10, // Calculate offset based on page
          sort: `${orderBy}:${sortDirection}`, // Sort order
        },
      });
      if (response.status === 200) {
        console.log(response.data);
        setDogs(response.data.resultIds);
        setTotalPages(Math.ceil(response.data.total / 10));
      }
    } catch (error) {
      console.error('Error fetching dogs:', error);
    }
  };

  const fetchDogDetails = async () => {
    try {
      const response = await axiosInstance.post(`/dogs/`, dogs);
      console.log(response.data);
      if (response.status === 200) {
        setDogDetails(response.data);
        // Update total pages based on response
      }
    } catch (error) {
      console.error('Error fetching dog details:', error);
    }
  };

  useEffect(() => {
    fetchBreeds();
  }, []);

  useEffect(() => {
    if (breeds.length > 0) {
      fetchDogs();
    }
  }, [selectedBreed, page]);

  useEffect(() => {
    if (dogs.length > 0) {
      fetchDogDetails();
    }
  }, [dogs]);

  // Sort dogs
  const handleSort = (property: keyof Dog) => {
    const isAscending = orderBy === property && sortDirection === 'asc';
    setSortDirection(isAscending ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Sorted dogs based on selected order
  const sortedDogs = [...dogDetails].sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <Box>
      <Typography variant="h4" align="center" gutterBottom>
        Find Your Favorite Dogs
      </Typography>

      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel id="breed-select-label">Select a breed</InputLabel>
        <Select
          labelId="breed-select-label"
          value={selectedBreed}
          onChange={(e) => setSelectedBreed(e.target.value)}
          label="Select a breed"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {breeds.map((breed) => (
            <MenuItem key={breed} value={breed}>
              {breed}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? sortDirection : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Dog's Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'breed'}
                  direction={orderBy === 'breed' ? sortDirection : 'asc'}
                  onClick={() => handleSort('breed')}
                >
                  Breed
                </TableSortLabel>
              </TableCell>
              <TableCell>Photo</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'zip_code'}
                  direction={orderBy === 'zip_code' ? sortDirection : 'asc'}
                  onClick={() => handleSort('zip_code')}
                >
                  Location (Zip Code)
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedDogs.map((dog, index) => (
              <TableRow key={dog.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{dog.name}</TableCell>
                <TableCell>{dog.breed}</TableCell>
                <TableCell>
                  <img
                    src={dog.img}
                    alt={dog.name}
                    style={{ width: '100px', height: 'auto' }}
                  />
                </TableCell>
                <TableCell>{dog.zip_code}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={totalPages}
        page={page}
        onChange={(event, value) => setPage(value)}
        color="primary"
        style={{ marginTop: '16px' }}
      />
    </Box>
  );
};

export default DogsSearch;
