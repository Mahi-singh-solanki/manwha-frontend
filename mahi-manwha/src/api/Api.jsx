import axios from 'axios';

const apiclient=axios.create({
  baseURL: 'https://mahi-manwha.onrender.com', // Your backend's URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiclient;