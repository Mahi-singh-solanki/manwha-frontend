import axios from 'axios';

const apiclient=axios.create({
  baseURL: 'manwha-one.vercel.app', // Your backend's URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiclient;