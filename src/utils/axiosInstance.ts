import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Use the environment variable for the base URL
  withCredentials: true, // Include credentials (cookies) with requests
});

export default axiosInstance;
