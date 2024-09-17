import React, { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
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
  TableSortLabel,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';

import axiosInstance from '../utils/axiosInstance';
import { ItemsPerPage } from '../const/const';
import { Dog, Order } from '../const/type';

import 'react-toastify/dist/ReactToastify.css';

const DogsSearch: React.FC = () => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<any[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [dogDetails, setDogDetails] = useState<Dog[]>([]);

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [orderDirection, setOrderDirection] = useState<Order>('asc');
  const [orderBy] = useState<keyof Dog>('breed');
  const [itemsPerPage, setItemsPerPage] = useState(ItemsPerPage[0]);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const [loading, setLoading] = useState<boolean>(false);

  const fetchBreeds = async () => {
    try {
      const response = await axiosInstance.get('/dogs/breeds');
      if (response.status === 200) {
        setBreeds(response.data);
      }
    } catch (error) {
      console.error('Error fetching breeds:', error);
      toast.error('Error occured from the server');
    }
  };
  const handleOpenDialog = (imageSrc: string) => {
    setCurrentImage(imageSrc);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const fetchDogs = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/dogs/search', {
        params: {
          breeds: selectedBreed ? [selectedBreed] : [],
          size: itemsPerPage,
          from: (page - 1) * itemsPerPage,
          sort: `${orderBy}:${orderDirection}`,
        },
      });
      if (response.status === 200) {
        console.log(response.data);
        setDogs(response.data.resultIds);
        setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      }
    } catch (error) {
      console.error('Error fetching dogs:', error);
      setLoading(false);
      toast.error('Error occured from the server');
    }
  };

  const fetchDogDetails = async () => {
    try {
      const response = await axiosInstance.post(`/dogs/`, dogs);
      console.log(response.data);
      if (response.status === 200) {
        setDogDetails(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching dog details:', error);
      setLoading(false);
      toast.error('Error occured from the server');
    }
  };

  const handleSort = () => {
    setPage(1);
    setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
  };

  useEffect(() => {
    fetchBreeds();
  }, []);

  useEffect(() => {
    if (breeds.length > 0) {
      fetchDogs();
    }
  }, [selectedBreed, page, breeds, orderDirection, itemsPerPage]);

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
              <TableCell>
                {' '}
                <TableSortLabel
                  active={orderBy === 'breed'}
                  direction={orderBy === 'breed' ? orderDirection : 'asc'}
                  onClick={() => handleSort()}
                >
                  Breed
                </TableSortLabel>
              </TableCell>
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
                  <TableCell>{itemsPerPage * (page - 1) + index + 1}</TableCell>
                  <TableCell>{dog.name}</TableCell>
                  <TableCell>{dog.breed}</TableCell>
                  <TableCell>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100px',
                        cursor: 'pointer',
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
                          onClick={() => handleOpenDialog(dog.img)}
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

      <Box
        display="flex"
        justifyContent="center"
        marginTop="16px"
        alignItems={'center'}
      >
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
        <FormControl variant="outlined" margin="normal">
          <InputLabel id="items-per-page-label"></InputLabel>
          <Select
            labelId="items-per-page-label"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(e.target.value as number);
              setPage(1);
            }}
          >
            {ItemsPerPage.map((number) => (
              <MenuItem key={number} value={number}>
                {number}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <img
          src={currentImage}
          alt="Dog"
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </Dialog>
      <ToastContainer />
    </Box>
  );
};

export default DogsSearch;
