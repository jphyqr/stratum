// app/(dashboard)/projects/[projectId]/_components/InstructionDialog.tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomDark, coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';

interface InstructionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instructions: string;
  isCompiling?: boolean;
}

export function InstructionDialog({ open, onOpenChange, instructions, isCompiling }: InstructionDialogProps) {
  const [copied, setCopied] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; left: string; top: string }[]>([]);
  const customTheme = {
    ...atomDark,
    'code[class*="language-"]': {
      ...atomDark['code[class*="language-"]'],
      color: '#ffffff', // Brighter text
    },
    'pre[class*="language-"]': {
      ...atomDark['pre[class*="language-"]'],
      background: '#1a1a1a', // Darker background
    },
    'comment': {
      ...atomDark.comment,
      color: '#666666', // Brighter comments
    },
    'function': {
      ...atomDark.function,
      color: '#61afef', // Brighter blue
    },
    'keyword': {
      ...atomDark.keyword,
      color: '#c678dd', // Brighter purple
    },
    'string': {
      ...atomDark.string,
      color: '#98c379', // Brighter green
    },
    'number': {
      ...atomDark.number,
      color: '#d19a66', // Brighter orange
    },
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(instructions);
    setCopied(true);
    
    const newSparkles = Array.from({ length: 10 }, () => ({
      id: Date.now() + Math.random(),
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`
    }));
    setSparkles(newSparkles);

    setTimeout(() => {
      setSparkles([]);
    }, 1000);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col bg-zinc-950"> {/* Darker background */}
      <DialogHeader className="flex-shrink-0">
      <DialogTitle className="flex items-center gap-2 text-zinc-100"> {/* Brighter text */}
      <Sparkles className="h-5 w-5" />
            Compiled AI Instructions
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 mt-4 relative">
          <AnimatePresence>
            {isCompiling ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10"
              >
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="h-8 w-8 text-primary" />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-muted-foreground"
                  >
                    Compiling AI Instructions...
                  </motion.p>
                </div>
              </motion.div>
            ) : (
              <ScrollArea className="h-[60vh] w-full rounded-md border border-zinc-800 bg-zinc-900"> {/* Darker scroll area */}
                <div className="relative">
                  {sparkles.map(({ id, left, top }) => (
                    <motion.div
                      key={id}
                      initial={{ scale: 0, rotate: 0, opacity: 0 }}
                      animate={{ scale: 1, rotate: 180, opacity: 1 }}
                      exit={{ scale: 0, rotate: 360, opacity: 0 }}
                      className="absolute z-10"
                      style={{ left, top }}
                      transition={{ duration: 0.5 }}
                    >
                      ✨
                    </motion.div>
                  ))}
                  <SyntaxHighlighter
                    language="xml"
                    style={customTheme}
                    customStyle={{
                      margin: 0,
                      padding: '1rem',
                      background: 'transparent',
                      fontSize: '0.875rem',
                      lineHeight: '1.5',
                    }}
                    showLineNumbers
                    lineNumberStyle={{
                      minWidth: '3em',
                      paddingRight: '1em',
                      color: '#666666', // Brighter line numbers
                      backgroundColor: '#1a1a1a', // Darker line number background
                    }}
                  >
                    {instructions}
                  </SyntaxHighlighter>
                </div>
              </ScrollArea>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-shrink-0 mt-4 flex justify-end border-t pt-4">
          <Button
            onClick={handleCopy}
            disabled={isCompiling}
            className={cn(
              "transition-all",
              copied && "bg-green-500 hover:bg-green-600"
            )}
          >
            {copied ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Copied!
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Instructions
              </motion.div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}