"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Download, Sparkles, Brain } from "lucide-react";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import jsPDF from "jspdf";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TreeAiChatDialog } from './TreeAiChatDialog';
import { Skeleton } from "../ui/skeleton";

const TreeCanvas = dynamic(() => import("./TreeCanvas"), { 
    ssr: false,
    loading: () => <Skeleton className="w-full h-96 rounded-xl bg-white/50" />
});

// -------- UI Components --------

const GoodNote = ({ text, createdAt }: { text: string; createdAt: string }) => (
  <div className="p-3 rounded-xl bg-green-100 border border-green-400 text-sm shadow-md">
    ✨ {text}
    <div className="text-xs text-gray-600 mt-1">{createdAt}</div>
  </div>
);

const BadNote = ({ text, createdAt }: { text: string; createdAt: string }) => (
  <div className="p-3 rounded-xl bg-red-100 border border-red-400 text-sm shadow-md">
    🔥 {text}
    <div className="text-xs text-gray-600 mt-1">{createdAt}</div>
  </div>
);


// -------- Main Component --------

export default function TreeSection() {
  const [user] = useAuthState(auth);
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<"good" | "bad">("good");
  const [isMemoriesOpen, setIsMemoriesOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users", user.uid, "notes"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      setNotes(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toLocaleString() || "",
        }))
      );
    });

    return () => unsub();
  }, [user]);

  const addNote = async () => {
    if (!user || !newNote.trim()) return;

    await addDoc(collection(db, "users", user.uid, "notes"), {
      text: newNote,
      type: noteType,
      createdAt: serverTimestamp(),
    });
    
    toast({
        title: noteType === "good" ? "Note Saved!" : "A challenging moment",
        description: noteType === "good" ? "You've nurtured your tree today." : "It's okay to have tough days. Keep going! 🌟"
    });

    setNewNote("");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("My MindBloom Memories", 10, 15);
    doc.setFontSize(12);
    notes.forEach((n, i) => {
        const yPos = 30 + i * 15;
        if (yPos > 280) { // Add new page if content overflows
            doc.addPage();
        }
      doc.text(`${i + 1}. [${n.type.toUpperCase()}] ${n.text}\n  - ${n.createdAt}`, 10, 30 + i * 15);
    });
    doc.save("memories.pdf");
  };

  const goodNotes = notes.filter((n) => n.type === "good");
  const badNotes = notes.filter((n) => n.type === "bad");
  const latestGood = goodNotes[0];
  const latestBad = badNotes[0];

  const treeAge = notes.length;
  let treeHealth: 'healthy' | 'weak' | 'withered' = 'healthy';
  if (goodNotes.length < badNotes.length) {
    treeHealth = 'weak';
  }
  if (badNotes.length > goodNotes.length + 5) {
      treeHealth = 'withered';
  }

  return (
    <>
      <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
        
        {/* Header and Actions */}
        <div className="flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold font-headline">My Growth Journal</h1>
            <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setIsMemoriesOpen(true)}>
                    <Brain className="mr-2 h-4 w-4" />
                    Memories
                </Button>
                 <Button variant="outline" onClick={() => setIsChatOpen(true)}>
                    <Sparkles className="mr-2 h-4 w-4" /> Talk to Tree
                </Button>
            </div>
        </div>

        {/* 3D Tree Canvas */}
        <div className="my-6">
            <TreeCanvas health={treeHealth} />
        </div>
        
        {/* Latest Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestGood ? <GoodNote text={latestGood.text} createdAt={latestGood.createdAt} /> : <div className="p-3 text-center text-sm text-muted-foreground bg-secondary rounded-xl">No good notes yet.</div>}
            {latestBad ? <BadNote text={latestBad.text} createdAt={latestBad.createdAt} /> : <div className="p-3 text-center text-sm text-muted-foreground bg-secondary rounded-xl">No challenges logged yet.</div>}
        </div>

        {/* Write New Note */}
        <Card>
            <CardHeader>
                <CardTitle>New Entry</CardTitle>
                <CardDescription>
                    What's on your mind? Switch between logging a positive moment or a challenge.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Input 
                        value={newNote} 
                        onChange={e => setNewNote(e.target.value)} 
                        placeholder={`Write a ${noteType} note...`} 
                        className="flex-grow"
                    />
                    <div className="flex gap-2">
                        <Button onClick={addNote} className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4"/> Save
                        </Button>
                        <Button 
                            variant="outline"
                            onClick={() => setNoteType(noteType === "good" ? "bad" : "good")}
                            className="w-full sm:w-auto"
                        >
                            Switch to {noteType === "good" ? "Bad" : "Good"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* All Memories Dialog */}
      <Dialog open={isMemoriesOpen} onOpenChange={setIsMemoriesOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">All Memories</DialogTitle>
            <DialogDescription>
              Here is a complete history of your journal entries.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] my-4 pr-4">
            <div className="space-y-4">
              {notes.length > 0 ? notes.map((n) =>
                n.type === "good" ? (
                  <GoodNote key={n.id} text={n.text} createdAt={n.createdAt} />
                ) : (
                  <BadNote key={n.id} text={n.text} createdAt={n.createdAt} />
                )
              ) : (
                  <p className="text-muted-foreground text-center py-8">No memories recorded yet.</p>
              )}
            </div>
          </ScrollArea>
          <DialogFooter className="sm:justify-between gap-2">
            <Button onClick={downloadPDF} variant="outline">
              <Download className="mr-2 h-4 w-4" /> Download as PDF
            </Button>
            <Button onClick={() => setIsMemoriesOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
        {/* AI Chat Dialog */}
        <TreeAiChatDialog 
            isOpen={isChatOpen} 
            onOpenChange={setIsChatOpen} 
            treeState={{ 
                name: "My Tree", // This could be dynamic in the future
                health: Math.max(10, 100 - (badNotes.length * 5) + (goodNotes.length * 2)),
                mood: treeHealth,
            }}
        />
    </>
  );
}
