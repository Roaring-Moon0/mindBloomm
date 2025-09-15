"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Plus, Download, Sparkles } from "lucide-react";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import jsPDF from "jspdf";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TreeAiChatDialog } from './TreeAiChatDialog';
import dynamic from 'next/dynamic';
import { Skeleton } from "../ui/skeleton";

const TreeCanvas = dynamic(() => import("./TreeCanvas").then(mod => mod.TreeCanvas), { 
    ssr: false,
    loading: () => <Skeleton className="w-full h-96 rounded-xl bg-white/50" />
});

// -------- UI Components --------

function GoodNote({ text, createdAt }: { text: string; createdAt: string }) {
  return (
    <motion.div
      className="p-3 rounded-xl bg-green-100 border border-green-400 text-sm shadow-md"
      animate={{ opacity: [1, 0.8, 1] }}
      transition={{ repeat: Infinity, duration: 3 }}
    >
      ✨ {text}
      <div className="text-xs text-gray-600 mt-1">{createdAt}</div>
    </motion.div>
  );
}

function BadNote({ text, createdAt }: { text: string; createdAt: string }) {
  return (
    <motion.div
      className="p-3 rounded-xl bg-red-100 border border-red-400 text-sm shadow-md"
      animate={{ opacity: [1, 0.6, 1], scale: [1, 1.05, 1] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
    >
      🔥 {text}
      <div className="text-xs text-gray-600 mt-1">{createdAt}</div>
    </motion.div>
  );
}

function NotesGraph({ notes }: { notes: any[] }) {
  const good = notes.filter((n) => n.type === "good").length;
  const bad = notes.filter((n) => n.type === "bad").length;
  const data = [
    { name: "Good", value: good || 0 },
    { name: "Bad", value: bad || 0 },
  ];
  const COLORS = ["#4ade80", "#f87171"];

  return (
    <PieChart width={200} height={200}>
      <Pie data={data} cx={100} cy={100} outerRadius={80} dataKey="value">
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}

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

  const mood = treeHealth === "healthy" ? "😄" : treeHealth === "weak" ? "😕" : "😢";

  return (
    <>
      <div className="min-h-screen p-6 bg-gradient-to-b from-blue-50 via-green-50 to-pink-50 rounded-xl shadow-inner">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT COLUMN - BAD NOTES & ACTIONS */}
          <div className="space-y-6">
            <Card className="bg-red-50/50 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Bad Notes</CardTitle>
                <Button size="sm" onClick={() => setNoteType("bad")}>
                  <Plus className="mr-1 h-4 w-4" /> Write
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {noteType === "bad" && (
                  <div className="flex space-x-2 mb-2">
                    <Input
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="What's weighing on you?"
                    />
                    <Button onClick={addNote}>Save</Button>
                  </div>
                )}
                {latestBad ? <BadNote text={latestBad.text} createdAt={latestBad.createdAt} /> : <p className="text-sm text-center py-4 text-muted-foreground">No recent challenges logged.</p>}
              </CardContent>
            </Card>
            <Button className="w-full" variant="outline" onClick={() => setIsMemoriesOpen(true)}>
                View All Memories
             </Button>
          </div>

          {/* CENTER TREE */}
          <div className="flex flex-col items-center justify-start space-y-4">
            <TreeCanvas health={treeHealth} />
            <motion.div className="text-lg font-semibold text-gray-700">Tree Age: {treeAge} days</motion.div>
            <motion.div className="text-6xl" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>{mood}</motion.div>
            <Card className="p-4 rounded-xl shadow-md bg-white/80 w-full max-w-sm">
              <CardTitle>Tree Progress</CardTitle>
              <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                 <div
                    className="bg-green-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(treeAge * 5, 100)}%` }}
                ></div>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN - GOOD NOTES & ACTIONS */}
          <div className="space-y-6">
            <Card className="bg-green-50/50 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Good Notes</CardTitle>
                <Button size="sm" onClick={() => setNoteType("good")}>
                  <Plus className="mr-1 h-4 w-4" /> Write
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {noteType === "good" && (
                  <div className="flex space-x-2 mb-2">
                    <Input
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="What are you grateful for?"
                    />
                    <Button onClick={addNote}>Save</Button>
                  </div>
                )}
                {latestGood ? <GoodNote text={latestGood.text} createdAt={latestGood.createdAt} /> : <p className="text-sm text-center py-4 text-muted-foreground">No recent good notes yet.</p>}
              </CardContent>
            </Card>
             <Button className="w-full" variant="outline" onClick={() => setIsChatOpen(true)}>
                <Sparkles className="mr-2 h-4 w-4" /> Talk to Your Tree
            </Button>
          </div>
        </div>
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
                name: "My Tree", // This could be dynamic in the future from journal state
                health: Math.max(10, 100 - (badNotes.length * 5) + (goodNotes.length * 2)),
                mood: treeHealth,
            }}
        />
    </>
  );
}
