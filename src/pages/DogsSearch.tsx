import React, { useState, useEffect } from 'react';
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
  Typography,
  Paper,
  Box,
  Pagination,
  CircularProgress,
} from '@mui/material';

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
  const [dogs, setDogs] = useState<any[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [dogDetails, setDogDetails] = useState<Dog[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

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

  const fetchDogs = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/dogs/search', {
        params: {
          breeds: selectedBreed ? [selectedBreed] : undefined,
          size: 10,
          from: (page - 1) * 10,
        },
      });
      if (response.status === 200) {
        console.log(response.data);
        setDogs(response.data.resultIds);
        setTotalPages(Math.ceil(response.data.total / 10));
      }
    } catch (error) {
      console.error('Error fetching dogs:', error);
      setLoading(false);
    }
  };

  const fetchDogDetails = async () => {
    try {
      const response = await axiosInstance.post(`/dogs/`, dogs);
      console.log(response.data);
      if (response.status === 200) {
        setDogDetails(response.data);
        setLoading(false);
        // Update total pages based on response
      }
    } catch (error) {
      console.error('Error fetching dog details:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreeds();
  }, []);

  useEffect(() => {
    if (breeds.length > 0) {
      fetchDogs();
    }
  }, [selectedBreed, page, breeds]);

  useEffect(() => {
    if (dogs.length > 0) {
      fetchDogDetails();
    }
  }, [dogs]);

  return (
    <Box paddingX={{ xs: 0, md: 2 }} paddingY={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Find Your Favorite Dogs
      </Typography>

      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel id="breed-select-label">Select a breed</InputLabel>
        <Select
          labelId="breed-select-label"
          value={selectedBreed}
          onChange={(e) => {
            setSelectedBreed(e.target.value);
            setPage(1);
          }}
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
            <TableRow style={{ backgroundColor: '#ebebeb' }}>
              <TableCell>No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Breed</TableCell>
              <TableCell>
                <Typography align="center">Photo</Typography>
              </TableCell>
              <TableCell>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : dogDetails.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No dogs available
                </TableCell>
              </TableRow>
            ) : (
              dogDetails.map((dog, index) => (
                <TableRow
                  key={dog.id}
                  style={{ backgroundColor: index % 2 ? '#f7f7f7' : '#ffffff' }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{dog.name}</TableCell>
                  <TableCell>{dog.breed}</TableCell>
                  <TableCell>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100px',
                      }}
                    >
                      {dog.img ? (
                        <img
                          src={dog.img}
                          alt={dog.name}
                          style={{
                            height: '100px',
                            width: 'auto',
                            opacity: 0,
                            transition: 'opacity 0.5s',
                          }}
                          onLoad={(e) => {
                            e.currentTarget.style.opacity = '1';
                          }}
                          onError={(e) => {
                            e.currentTarget.src = 'images/placeholder.png';
                          }}
                        />
                      ) : (
                        <img
                          src="images/placeholder.png"
                          alt="Loading..."
                          style={{ height: '100px', width: 'auto' }}
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{dog.zip_code}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" marginTop="16px">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default DogsSearch;
