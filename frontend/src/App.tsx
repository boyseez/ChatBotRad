import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import Other from '@/pages/Other'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Definiamo i percorsi (rotte) della nostra app */}
        <Route path="/" element={<Home />} />
        <Route path="/other" element={<Other />} />
        
        {/* Rotta di fallback: se l'utente sbaglia URL torna alla Home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
