
'use client';

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { seedDatabase } from "@/lib/mock-data";
import { Button } from "../ui/button";


export function SeedButton() {
    const { toast } = useToast();
    const router = useRouter();

    const handleSeed = async () => {
        const result = await seedDatabase();
        toast({
            title: result.success ? 'Database Seeded' : 'Seeding Skipped',
            description: result.message,
            variant: result.success ? 'default' : 'destructive',
            className: result.success ? "bg-accent text-accent-foreground" : "",
        });
        if (result.success) {
            router.refresh();
        }
    };

    return <Button onClick={handleSeed} size="sm" className="w-full">Seed Database</Button>
}
