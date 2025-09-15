"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Download, Loader2, PlusCircle, Sparkles } from "lucide-react";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import jsPDF from "jspdf";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TreeAiChatDialog } from './TreeAiChatDialog';
import { Progress } from "@/components/ui/progress";

// ----- Child Components -----

const GoodNote = ({ text, createdAt }: { text: string; createdAt: string }) => (
  <div className="p-3 rounded-xl bg-green-100 border border-green-400 text-sm shadow-sm animate-pulse-slow">
    ✨ {text}
    <div className="text-xs text-gray-600 mt-1">{createdAt}</div>
  </div>
);

const BadNote = ({ text, createdAt }: { text: string; createdAt: string }) => (
  <div className="p-3 rounded-xl bg-red-100 border border-red-400 text-sm shadow-sm animate-pulse-slow">
    🔥 {text}
    <div className="text-xs text-gray-600 mt-1">{createdAt}</div>
  </div>
);

const TreeVisualizer = ({ health }: { health: string }) => {
  let treeEmoji = "🌱"; // Sprout
  if (health === "healthy") treeEmoji = "🌳"; // Flourishing
  if (health === "weak") treeEmoji = "🍂"; // Weak
  if (health === "withered") treeEmoji = "🪵"; // Withered

  return (
    <div className="text-8xl flex justify-center animate-pulse-slow">
      {treeEmoji}
    </div>
  );
};

const TreeMood = ({ health }: { health: string }) => {
  let mood = "🙂";
  if (health === "healthy") mood = "😄";
  if (health === "weak") mood = "😕";
  if (health === "withered") mood = "😢";

  return (
    <div className="text-6xl text-center animate-bounce">
      {mood}
    </div>
  );
};


// ----- Main Component -----

export default function TreeSection() {
  const [user] = useAuthState(auth);
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
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

    setIsSaving(true);
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
    setIsSaving(false);
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
      doc.text(`${i + 1}. [${n.type.toUpperCase()}] ${n.text}\n  - ${n.createdAt}`, 10, yPos);
    });
    doc.save("memories.pdf");
  };

  const goodNotes = notes.filter((n) => n.type === "good");
  const badNotes = notes.filter((n) => n.type === "bad");
  const latestGood = goodNotes[0];
  const latestBad = badNotes[0];

  const treeAge = notes.length;
  let treeHealth: 'healthy' | 'weak' | 'withered' = 'healthy';
  const healthRatio = goodNotes.length / (notes.length || 1);

  if (healthRatio < 0.4) treeHealth = 'withered';
  else if (healthRatio < 0.7) treeHealth = 'weak';
  else treeHealth = 'healthy';
  
  const treeProgress = notes.length > 0 ? (goodNotes.length / notes.length) * 100 : 50;


  return (
    <>
      <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
        
        {/* Header and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold font-headline">My Growth Journal</h1>
                 <p className="text-muted-foreground mt-1">Nurture your tree, nurture your mind.</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setIsMemoriesOpen(true)}>
                    <Brain className="mr-2 h-4 w-4" />
                    Memories
                </Button>
                 <Button onClick={() => setIsChatOpen(true)}>
                    <Sparkles className="mr-2 h-4 w-4" /> Talk to Tree
                </Button>
            </div>
        </div>

        {/* Latest Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {latestGood ? <GoodNote text={latestGood.text} createdAt={latestGood.createdAt} /> : <div className="p-3 text-center text-sm text-muted-foreground bg-secondary rounded-xl flex items-center justify-center h-full">No good notes yet.</div>}
          {latestBad ? <BadNote text={latestBad.text} createdAt={latestBad.createdAt} /> : <div className="p-3 text-center text-sm text-muted-foreground bg-secondary rounded-xl flex items-center justify-center h-full">No challenges logged yet.</div>}
        </div>

        {/* Tree Section */}
        <Card>
           <CardContent className="p-6 flex flex-col md:flex-row items-center gap-8">
                <div className="flex flex-col items-center">
                    <TreeVisualizer health={treeHealth} />
                    <TreeMood health={treeHealth} />
                </div>
                <div className="w-full flex-1">
                     <h3 className="text-lg font-semibold text-center md:text-left">Tree Stats</h3>
                     <div className="text-sm text-muted-foreground text-center md:text-left">
                        <p>Age: {treeAge} {treeAge === 1 ? 'day' : 'days'}</p>
                        <p>Health: <span className="font-medium capitalize">{treeHealth}</span></p>
                    </div>
                    <div className="mt-4">
                        <Label htmlFor="tree-progress" className="text-sm font-medium">Growth Progress</Label>
                        <Progress id="tree-progress" value={treeProgress} className="mt-1 h-3"/>
                        <p className="text-xs text-muted-foreground mt-1 text-center">More good notes will help your tree grow strong.</p>
                    </div>
                </div>
           </CardContent>
        </Card>
        
        {/* Write New Note */}
        <Card>
            <CardHeader>
                <CardTitle>New Entry</CardTitle>
                <CardDescription>
                    What's on your mind? Switch between logging a positive moment or a challenge.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Input 
                        value={newNote} 
                        onChange={e => setNewNote(e.target.value)} 
                        placeholder={`Write a ${noteType} note...`} 
                        className="flex-grow"
                        disabled={isSaving}
                    />
                    <div className="flex gap-2">
                        <Button onClick={addNote} className="w-full sm:w-auto" disabled={isSaving || !newNote.trim()}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <PlusCircle className="mr-2 h-4 w-4"/>} Save
                        </Button>
                        <Button 
                            variant="outline"
                            onClick={() => setNoteType(noteType === "good" ? "bad" : "good")}
                            className="w-full sm:w-auto"
                            disabled={isSaving}
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
          <ScrollArea className="max-h-[60vh] my-4 pr-4 -mr-4">
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
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button onClick={downloadPDF} variant="outline" className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" /> Download as PDF
            </Button>
            <Button onClick={() => setIsMemoriesOpen(false)} className="w-full sm:w-auto">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
        {/* AI Chat Dialog */}
        <TreeAiChatDialog 
            isOpen={isChatOpen} 
            onOpenChange={setIsChatOpen} 
            treeState={{ 
                name: "My Gratitude Tree",
                health: Math.max(10, treeProgress),
                mood: treeHealth,
            }}
        />
    </>
  );
}
