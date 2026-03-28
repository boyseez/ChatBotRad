import Lottie from "lottie-react";
import chatbotAnimation from "@/assets/animations/happy_chatbot.json";

interface LottieLoaderProps {
  width?: number | string;
  height?: number | string;
  message?: string;
}

/**
 * Componente Loader che utilizza un'animazione Lottie.
 * L'animazione viene "tinta" con il colore primario del tema tramite CSS filters.
 */
export function LottieLoader({ 
  width = 300, 
  height = 300, 
  message = "Caricamento in corso..." 
}: LottieLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div 
        style={{ width, height }} 
        className="transition-all duration-500 animate-in fade-in zoom-in"
      >
        <Lottie 
          animationData={chatbotAnimation} 
          loop={true}
          // Applichiamo un filtro per far sì che i colori scuri dell'animazione 
          // si avvicinino al colore primario del tema se necessario, 
          // o semplicemente lasciamo che brilli nel suo stile originale.
          className="drop-shadow-xl"
        />
      </div>
      {message && (
        <p className="text-primary font-medium animate-pulse tracking-wide italic">
          {message}
        </p>
      )}
    </div>
  );
}
