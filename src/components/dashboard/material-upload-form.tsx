
"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { UploadCloud, File, X } from "lucide-react";
import { createMaterialRef, updateMaterial } from "@/lib/mock-data";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Progress } from "../ui/progress";

export default function MaterialUploadForm({ classId, subjectId }: { classId: string, subjectId: string }) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setUploadProgress(0);
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
        setUploadProgress(0);
        
        try {
            // 1. Create a document reference in Firestore first to get a unique ID
            const materialRef = await createMaterialRef(classId, subjectId);
            const materialId = materialRef.id;

            // 2. Use that unique ID to create the path in Firebase Storage
            const storageRef = ref(storage, `materials/${classId}/${subjectId}/${materialId}-${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error("Upload failed:", error);
                    toast({
                        title: "Upload Failed",
                        description: "Something went wrong during the file upload. Ensure Storage is enabled in Firebase.",
                        variant: "destructive"
                    });
                    setIsUploading(false);
                    setFile(null);
                    setUploadProgress(0);
                },
                async () => {
                    // 3. Get the download URL and update the Firestore document
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    await updateMaterial(materialRef, {
                        name: file.name,
                        url: downloadURL,
                        type: 'reference'
                    });

                    toast({
                        title: "Upload Successful!",
                        description: `${file.name} has been uploaded.`,
                        className: "bg-accent text-accent-foreground"
                    });

                    setIsUploading(false);
                    setFile(null);
                    setUploadProgress(0);
                }
            );
        } catch (error) {
             console.error("Firestore operation failed:", error);
                toast({
                    title: "Upload Failed",
                    description: "Could not create a database record. Ensure Firestore is enabled.",
                    variant: "destructive"
                });
            setIsUploading(false);
            setFile(null);
            setUploadProgress(0);
        }
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
                    <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} disabled={isUploading} />
                </div>
            ) : (
                <div className="w-full">
                    <div className="flex items-center justify-between p-2 rounded-md border bg-muted/50 my-2">
                        <div className="flex items-center gap-2 truncate">
                             <File className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                             <span className="text-sm font-medium truncate">{file.name}</span>
                             <span className="text-xs text-muted-foreground whitespace-nowrap">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setFile(null)} className="h-6 w-6" disabled={isUploading}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    {isUploading && (
                        <div className="space-y-1 text-left my-2">
                            <Progress value={uploadProgress} className="w-full" />
                            <p className="text-xs text-muted-foreground text-center">{Math.round(uploadProgress)}% uploaded</p>
                        </div>
                    )}
                </div>
            )}
            <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full mt-2">
                {isUploading ? `Uploading...` : "Upload Material"}
            </Button>
        </div>
    )
}
