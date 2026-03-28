import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Definiamo la base API. 
// Gli endpoint verranno iniettati qui dal generatore.
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/v1', // Prefisso per le chiamate (gestito dal proxy di Vite o BFF)
    prepareHeaders: (headers) => {
      // Qui potremo gestire CSRF token o altri headers comuni in futuro
      return headers
    },
  }),
  endpoints: () => ({}),
})
