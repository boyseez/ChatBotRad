

import {useEffect, useState} from "react"
import { UploadZone } from "@/components/upload-zone"
import { YouTubeInput } from "@/components/youtube-input"

export interface Resource {
    id: string
    name: string
    type: "pdf" | "video" | "youtube"
    uploadedAt: Date
}

function generateId() {
    return Math.random().toString(36).substring(2, 9)
}


function extractYouTubeTitle(url: string): string {
    const match = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    )
    if (match) {
        return `YouTube Video (${match[1]})`
    }
    return "YouTube Video"
}

export default function SectionUpload(){


    const [resources, setResources] = useState<Resource[]>([])

    useEffect(() => {
            console.log("Risorse caricate:", resources)
    }, []);


    const handleFileUpload = (file: File, type: "pdf" | "video") => {
        const newResource: Resource = {
            id: generateId(),
            name: file.name,
            type,
            uploadedAt: new Date(),
        }
        setResources((prev) => [newResource, ...prev])
    }


    const handleYouTubeSubmit = (url: string) => {
        const newResource: Resource = {
            id: generateId(),
            name: extractYouTubeTitle(url),
            type: "youtube",
            uploadedAt: new Date(),
        }
        setResources((prev) => [newResource, ...prev])
    }
    return(
    <section className="mb-8 px-4">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
            Carica Risorse
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <UploadZone
                accept=".pdf"
                type="pdf"
                onFileSelect={(file) => handleFileUpload(file,"pdf")}

            />
            <UploadZone
                accept="video/mp4"
                type="video"
                onFileSelect={(file) =>handleFileUpload(file,"video")}
            />
            <div className="md:col-span-2 lg:col-span-1">
                <YouTubeInput onSubmit={handleYouTubeSubmit} />
            </div>
        </div>
    </section>)

}