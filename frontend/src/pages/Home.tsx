import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useLogger } from '@/hooks/useLogger'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  // Rimosso l'override manuale { minLevel: 'trace' } per rispettare il file .env
  const logger = useLogger('Home') 
  const navigate = useNavigate()

  useEffect(() => {
    logger.group('ChatBootRad – Home inizializzazione', () => {
      logger.trace('useEffect attivato (Home)')
      logger.debug('Risoluzione albero componenti Home')
      logger.info('Pagina Home montata')
      logger.success('Stack Home pronto!')
      logger.warn('Attenzione: questa è una pagina demo, non è ancora completa')
    })

    const stop = logger.time('caricamento-home')
    const raf = requestAnimationFrame(() => { stop() })

    return () => {
      cancelAnimationFrame(raf)
      logger.debug('Home smontata')
    }
  }, [])

  const handleClick = (variant: string) => {
    logger.info(`Pulsante cliccato`, { variant })
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold text-white tracking-tight">
        ChatBootRad 🐱 (Home)
      </h1>
      <p className="text-zinc-400 text-lg">
        Stack operativo e funzionante!
      </p>
      <div className="flex gap-3">
        <Button onClick={() => handleClick('default')}>Predefinito</Button>
        <Button variant="outline" onClick={() => handleClick('outline')}>Bordo</Button>
        <Button variant="destructive" onClick={() => handleClick('destructive')}>Distruttivo</Button>
      </div>
      
      <Button 
        variant="ghost" 
        className="mt-4 text-blue-400 border-blue-900/50 hover:bg-blue-900/20"
        onClick={() => navigate('/other')}
      >
        Vai alla pagina "Altro" →
      </Button>
    </div>
  )
}
