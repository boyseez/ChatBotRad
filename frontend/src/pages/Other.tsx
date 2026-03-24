import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useLogger } from '@/hooks/useLogger'
import { useEffect } from 'react'

export default function Other() {
  const navigate = useNavigate()
  const logger = useLogger('Other')

  useEffect(() => {
    logger.info('Pagina Other montata')
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6 text-white text-center">
      <h1 className="text-4xl font-bold tracking-tight">
        Altra Pagina 🐱
      </h1>
      <p className="text-zinc-400 max-w-md">
        Questo è un placeholder per la tua seconda pagina. Qui potrai aggiungere nuovi contenuti in futuro!
      </p>
      
      <Button 
        variant="outline" 
        className="mt-4 border-zinc-800 hover:bg-zinc-900"
        onClick={() => navigate('/')}
      >
        ← Torna alla Home
      </Button>
    </div>
  )
}
