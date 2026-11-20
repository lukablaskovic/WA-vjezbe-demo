import api from './axios.js'

// GET /pizze
// asinkrona arrow funkcija
export const getPizze = async () => {
  try {
    const response = await api.get('/pizze')
    return response.data
  } catch (error) {
    console.error('Greška u dohvaćanju pizze:', error)
    throw error
  }
}

// GET /pizze/:naziv
// asinkrona arrow funkcija
export const getPizzaByNaziv = async (naziv) => {
  try {
    const response = await api.get(`/pizze/${naziv}`)
    return response.data
  } catch (error) {
    console.error(`Greška u dohvaćanju pizze ${naziv}:`, error)
    throw error
  }
}
