
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import YoutubeLogo from "@/assets/YoutubeLogo.tsx";

interface YouTubeInputProps {
    onSubmit: (url: string) => void
}

function extractYouTubeId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    ]
    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
    }
    return null
}

export function YouTubeInput({ onSubmit }: YouTubeInputProps) {
    const [url, setUrl] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = () => {
        if (!url.trim()) {
            setError("Inserisci un link YouTube")
            return
        }
        const videoId = extractYouTubeId(url)
        if (!videoId) {
            setError("Link YouTube non valido")
            return
        }
        setError("")
        onSubmit(url)
        setUrl("")
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSubmit()
        }
    }

    return (
        <Card className="border-border">
            <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-full bg-red-500/10 p-3">
                        <YoutubeLogo className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                        <h3 className="font-medium text-foreground">Link YouTube</h3>
                        <p className="text-sm text-muted-foreground">
                            Incolla un link video di YouTube
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={url}
                        onChange={(e) => {
                            setUrl(e.target.value)
                            setError("")
                        }}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-secondary border-border"
                    />
                    <Button onClick={handleSubmit} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Aggiungi
                    </Button>
                </div>
                {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
            </CardContent>
        </Card>
    )
}
