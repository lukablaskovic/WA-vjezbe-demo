import axios from 'axios'

const api = axios.create({
  // environment varijabla tj. varijabla okruženja
  baseURL: import.meta.env.VITE_EXPRESS_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
