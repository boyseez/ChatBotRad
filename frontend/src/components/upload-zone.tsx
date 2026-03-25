import { useCallback, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Video, Upload } from "lucide-react"

interface UploadZoneProps {
    accept: string
    type: "pdf" | "video"
    onFileSelect: (file: File) => void
}

export function UploadZone({ accept, type, onFileSelect }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false)

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragging(false)
            const file = e.dataTransfer.files[0]
            if (file) {
                onFileSelect(file)
            }
        },
        [onFileSelect]
    )

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (file) {
                onFileSelect(file)
            }
            e.target.value = ""
        },
        [onFileSelect]
    )

    const Icon = type === "pdf" ? FileText : Video
    const label = type === "pdf" ? "PDF" : "MP4"
    const iconColor = type === "pdf" ? "text-orange-500" : "text-blue-500"

    return (
        <Card
            className={`relative cursor-pointer transition-all duration-200 ${
                isDragging
                    ? "border-primary border-2 bg-primary/10"
                    : "border-border hover:border-primary/50 hover:bg-secondary/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <CardContent className="flex flex-col items-center justify-center p-8">
                <input
                    type="file"
                    accept={accept}
                    onChange={handleFileInput}
                    className="absolute inset-0 cursor-pointer opacity-0"
                />
                <div
                    className={`mb-4 rounded-full p-4 ${
                        isDragging ? "bg-primary/20" : "bg-secondary"
                    }`}
                >
                    <Icon className={`h-8 w-8 ${iconColor}`} />
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm">
            Trascina un file {label} o clicca per selezionare
          </span>
                </div>
            </CardContent>
        </Card>
    )
}
