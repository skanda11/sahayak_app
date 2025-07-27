
'use client';

import type { Material } from "@/lib/types";
import { useEffect, useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

export default function ExistingMaterials({ classId, subjectId }: { classId: string, subjectId: string }) {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // if (!classId || !subjectId) {
        //     setMaterials([]);
        //     setIsLoading(false);
        //     return;
        // }

        // setIsLoading(true);
        // const materialsRef = collection(db, 'materials', classId, subjectId);
        // const q = query(materialsRef);

        // const unsubscribe = onSnapshot(q, (querySnapshot) => {
        //     const data: Material[] = [];
        //     querySnapshot.forEach((doc) => {
        //         data.push({ id: doc.id, ...doc.data() } as Material);
        //     });
        //     setMaterials(data);
        //     setIsLoading(false);
        // }, (error) => {
        //     console.error("Failed to fetch materials:", error);
        //     setIsLoading(false);
        // });
        
        // // Cleanup subscription on unmount
        // return () => {
        //     unsubscribe();
        // };
        setIsLoading(false);
    }, [classId, subjectId]);

    return (
        <div className="rounded-lg border p-4">
            <h4 className="font-semibold mb-2 text-center md:text-left">Existing Materials</h4>
            {isLoading ? (
                 <div className="flex items-center justify-center h-24">
                    <Loader2 className="animate-spin text-muted-foreground" />
                 </div>
            ) : materials.length > 0 ? (
                <div className="space-y-2">
                    {materials.map(material => (
                        <a href={material.url} key={material.id} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors">
                            <FileText className="h-6 w-6 text-primary flex-shrink-0" />
                            <div className="flex-grow truncate">
                                <p className="font-medium truncate">{material.name}</p>
                                <Badge variant="outline" className="text-xs">{material.type}</Badge>
                            </div>
                        </a>
                    ))}
                </div>
            ) : (
                <div className="text-center text-sm text-muted-foreground py-4">
                    No materials found for this subject.
                </div>
            )}
        </div>
    )
}
