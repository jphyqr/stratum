// EmptyBrand.tsx
'use client'
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface EmptyBrandProps {
 projectId: string;
}

export function EmptyBrand({ projectId }: EmptyBrandProps) {
 const [isLoading, setIsLoading] = useState(false);

 async function initializeBrand() {
   setIsLoading(true);
   try {
     await fetch(`http://localhost:3009/api/extension/ai-projects/${projectId}/brand`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'x-extension-token': process.env.NEXT_PUBLIC_STRATUM_TOKEN || '',
       },
       body: JSON.stringify({
         name: 'Your Brand',
         tagline: 'Your Tagline',
         description: 'Your Description',
         valueProposition: {
           target: 'Target audience',
           product: 'Your Brand',
           category: 'Product category',
           benefit: 'Key benefit',
           differentiator: 'Key differentiator'
         },
         voiceTraits: [{
           name: "Professional",
           application: "Maintain credibility"
         }],
         voiceExamples: [{
           context: "Welcome",
           text: "Example text"
         }],
         tonalityRules: ["Be clear and concise"],
         preferredTerms: [{
           use: "enhance",
           insteadOf: "improve",
           context: "upgrades"
         }],
         prohibitedTerms: [{
           word: "just",
           reason: "minimizes complexity"
         }],
         primaryColor: {
           hex: "#000000",
           usage: "main color",
           meaning: "professional"
         },
         secondaryColor: {
           hex: "#ffffff",
           usage: "supporting color", 
           meaning: "clean"
         },
         fontPrimary: 'Inter',
         fontSecondary: 'Inter',
         targetAudience: [{
           type: "Developers",
           needs: ["Efficiency"]
         }]
       }),
     });
     window.location.reload();
   } catch (error) {
     console.error('Failed to initialize brand:', error);
   } finally {
     setIsLoading(false);
   }
 }

 return (
   <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
     <h2 className="text-2xl font-semibold">Define Your Brand</h2>
     <p className="text-muted-foreground mt-2 text-center max-w-md">
       Set up brand guidelines to ensure consistent communication across your product
     </p>
     <Button onClick={initializeBrand} className="mt-4" disabled={isLoading}>
       {isLoading ? (
         <>
           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
           Creating...
         </>
       ) : (
         'Create Brand Guide'
       )}
     </Button>
   </div>
 );
}