
function YoutubeLogo({}) {
    return (
        <div>
            <h1>Il mio SVG dalla cartella public</h1>
            {/* Richiama l'SVG direttamente con il percorso assoluto */}
            <img src="/youtube.svg" alt="Il mio logo" width="100" height="100" />
        </div>
    );
}

export default YoutubeLogo;