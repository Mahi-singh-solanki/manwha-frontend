import axios from 'axios';

const apiclient=axios.create({
  baseURL: 'http://localhost:8080', // Your backend's URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiclient;