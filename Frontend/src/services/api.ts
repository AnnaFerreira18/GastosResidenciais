import axios from 'axios';

// Conexão apontando para API 
const api = axios.create({
  baseURL: 'https://localhost:44324/api', // URL
});

export default api;