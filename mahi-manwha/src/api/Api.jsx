import axios from 'axios';

const apiclient=axios.create({
  baseURL: 'https://manwha-production.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiclient;