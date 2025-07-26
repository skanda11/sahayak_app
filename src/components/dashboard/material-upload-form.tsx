
"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { UploadCloud, File, X } from "lucide-react";

export default function MaterialUploadForm({ classId, subjectId }: { classId: string, subjectId: string }) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast({
                title: "No file selected",
                description: "Please select a file to upload.",
                variant: "destructive"
            });
            return;
        }

        setIsUploading(true);
        // In a real application, you would upload the file to a service like Firebase Storage.
        // For this mock, we will just simulate a delay.
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock database update
        console.log(`Uploading ${file.name} for class ${classId} and subject ${subjectId}`);
        
        setIsUploading(false);
        setFile(null); // Reset file input

        toast({
            title: "Upload Successful!",
            description: `${file.name} has been uploaded.`,
            className: "bg-accent text-accent-foreground"
        });
    }

    return (
        <div className="rounded-lg border border-dashed p-4 flex flex-col justify-center items-center text-center">
            <h4 className="font-semibold mb-2">Upload New Material</h4>
            {!file ? (
                <div className="flex flex-col items-center justify-center space-y-2 py-4">
                    <UploadCloud className="h-10 w-10 text-muted-foreground" />
                    <label htmlFor="file-upload" className="cursor-pointer text-sm font-medium text-primary hover:underline">
                        Choose a file to upload
                    </label>
                    <p className="text-xs text-muted-foreground">PDF, DOCX, etc. up to 10MB</p>
                    <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                </div>
            ) : (
                <div className="w-full">
                    <div className="flex items-center justify-between p-2 rounded-md border bg-muted/50 my-2">
                        <div className="flex items-center gap-2 truncate">
                             <File className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                             <span className="text-sm font-medium truncate">{file.name}</span>
                             <span className="text-xs text-muted-foreground whitespace-nowrap">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setFile(null)} className="h-6 w-6">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
            <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full mt-2">
                {isUploading ? "Uploading..." : "Upload Material"}
            </Button>
        </div>
    )
}
