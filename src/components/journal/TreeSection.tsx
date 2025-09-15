"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useFirestoreCollection, useFirestoreDocument } from "@/hooks/use-firestore";
import { addNote, renameTree, startNewChat } from "@/services/journal-service";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Sparkles, Plus, Download, Bot, History, BrainCircuit } from "lucide-react";
import jsPDF from "jspdf";
import { TreeAiChatDialog } from "./TreeAiChatDialog";
import { ChatHistoryDialog } from "./ChatHistoryDialog";
import { format } from 'date-fns';

interface Note {
  id: string;
  text: string;
  type: 'good' | 'bad';
  createdAt: any;
}

interface TreeState {
    treeName?: string;
    createdAt?: any;
}

const TreeVisualizer = ({ health }: { health: string }) => {
  let treeEmoji = "🌱"; // Default
  if (health === "healthy") treeEmoji = "🌳";
  if (health === "weak") treeEmoji = "🍂";
  if (health === "withered") treeEmoji = "🪵";
  return (
    <motion.div className="text-8xl flex justify-center" animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3 }}>
      {treeEmoji}
    </motion.div>
  );
};

const TreeMood = ({ health }: { health: string }) => {
  let mood = "🙂"; // Default
  if (health === "healthy") mood = "😄";
  if (health === "weak") mood = "😕";
  if (health === "withered") mood = "😢";
  return (
    <motion.div className="text-6xl text-center" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
      {mood}
    </motion.div>
  );
};

const BurningNote = ({ text, createdAt }: { text: string; createdAt: string }) => (
  <motion.div className="p-2 rounded-md bg-red-100 border border-red-400 text-sm" animate={{ opacity: [1, 0.7, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
    {text} 🔥
    <div className="text-xs text-gray-600 mt-1">{createdAt}</div>
  </motion.div>
);

const GoodNote = ({ text, createdAt }: { text: string; createdAt: string }) => (
  <motion.div className="p-2 rounded-md bg-green-100 border border-green-400 text-sm" animate={{ opacity: [1, 0.85, 1] }} transition={{ repeat: Infinity, duration: 3 }}>
    {text} ✨
    <div className="text-xs text-gray-600 mt-1">{createdAt}</div>
  </motion.div>
);

const NotesGraph = ({ notes }: { notes: Note[] }) => {
  const goodCount = notes.filter((n) => n.type === "good").length;
  const badCount = notes.filter((n) => n.type === "bad").length;
  const data = [
    { name: "Good Notes", value: goodCount, fill: "#4ade80" },
    { name: "Bad Notes", value: badCount, fill: "#f87171" },
  ];
  if (goodCount === 0 && badCount === 0) {
      return <div className="text-center text-muted-foreground py-10">No notes yet to display graph.</div>;
  }
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

function MemoriesDialog({ notes, isOpen, onOpenChange }: { notes: Note[]; isOpen: boolean; onOpenChange: (open: boolean) => void }) {
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Your Memories", 10, 10);
        notes.forEach((n, i) => {
            const date = n.createdAt?.toDate ? format(n.createdAt.toDate(), 'P p') : 'N/A';
            doc.text(`[${n.type.toUpperCase()}] ${n.text} (${date})`, 10, 20 + i * 10);
        });
        doc.save("memories.pdf");
        toast({ title: "Downloading PDF..." });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>All Memories</DialogTitle>
                    <DialogDescription>A complete history of your thoughts.</DialogDescription>
                </DialogHeader>
                <div className="space-y-2 max-h-96 overflow-y-auto p-1">
                    {notes.length > 0 ? notes.map((n) => (n.type === "good" ? <GoodNote key={n.id} text={n.text} createdAt={format(n.createdAt.toDate(), 'P p')} /> : <BurningNote key={n.id} text={n.text} createdAt={format(n.createdAt.toDate(), 'P p')} />)) : <p className="text-muted-foreground text-center py-8">No memories yet.</p>}
                </div>
                <DialogFooter>
                    <Button onClick={downloadPDF} disabled={notes.length === 0}><Download className="mr-2 h-4 w-4" /> Download as PDF</Button>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function TreeSection() {
  const { user } = useAuth();
  const { data: notesData } = useFirestoreCollection<Note>(user ? `users/${user.uid}/notes` : '');
  const { data: treeState } = useFirestoreDocument<TreeState>(user ? `users/${user.uid}` : '');

  const [newNote, setNewNote] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteType, setNoteType] = useState<"good" | "bad">("good");
  const [editingName, setEditingName] = useState(false);
  const [treeNameInput, setTreeNameInput] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);

  const [isMemoriesOpen, setIsMemoriesOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);

  const { toast } = useToast();

  const notes = notesData || [];
  const goodNotes = notes.filter(n => n.type === 'good');
  const badNotes = notes.filter(n => n.type === 'bad');
  const totalNotes = notes.length;

  const treeHealthRatio = totalNotes > 0 ? goodNotes.length / totalNotes : 0.5;
  const treeHealth = treeHealthRatio > 0.66 ? "healthy" : treeHealthRatio > 0.33 ? "weak" : "withered";
  const treeProgress = totalNotes > 0 ? Math.min(100, (totalNotes / 30) * 100) : 0;
  
  const treeAge = treeState?.createdAt?.toDate ? Math.max(1, Math.ceil((new Date().getTime() - treeState.createdAt.toDate().getTime()) / (1000 * 60 * 60 * 24))) : 1;
  const treeName = treeState?.treeName || "My Tree";

  useEffect(() => {
    setTreeNameInput(treeName);
  }, [treeName]);


  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setIsSavingNote(true);
    try {
      await addNote({ text: newNote, type: noteType });
      toast({ title: "Note Saved!", description: "Your tree thanks you." });
      setNewNote("");
    } catch (e: any) {
      toast({ variant: 'destructive', title: "Error", description: e.message });
    } finally {
      setIsSavingNote(false);
    }
  };
  
  const handleSaveTreeName = async () => {
    if (!treeNameInput.trim()) {
        toast({ variant: 'destructive', title: "Name cannot be empty." });
        return;
    };
    setIsSavingName(true);
    try {
        await renameTree(treeNameInput);
        toast({ title: "Tree renamed successfully!" });
        setEditingName(false);
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Error', description: e.message });
    } finally {
        setIsSavingName(false);
    }
  };
  
  const handleNewChat = async () => {
    try {
      await startNewChat();
      toast({ title: "New chat started!" });
      setIsChatHistoryOpen(true);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error starting chat" });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* LEFT COLUMN */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Bad Notes</CardTitle>
            <CardDescription>Acknowledge and release.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex space-x-2 mb-2">
              <Input value={newNote} onChange={(e) => { setNewNote(e.target.value); setNoteType("bad"); }} placeholder="What's weighing on you?" disabled={isSavingNote} />
              <Button onClick={handleAddNote} disabled={isSavingNote || !newNote || noteType !== 'bad'}>{isSavingNote && noteType === 'bad' ? 'Saving...' : 'Release'}</Button>
            </div>
            {badNotes.slice(0, 3).map((n) => <BurningNote key={n.id} text={n.text} createdAt={format(n.createdAt.toDate(), 'P')} />)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Memories Graph</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <NotesGraph notes={notes} />
          </CardContent>
        </Card>
        
        <Button className="w-full" variant="outline" onClick={() => setIsMemoriesOpen(true)}><Sparkles className="mr-2 h-4 w-4" /> See All Memories</Button>

      </div>

      {/* CENTER COLUMN */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <TreeVisualizer health={treeHealth} />
        {editingName ? (
          <div className="flex items-center space-x-2">
            <Input value={treeNameInput} onChange={(e) => setTreeNameInput(e.target.value)} disabled={isSavingName} />
            <Button size="sm" onClick={handleSaveTreeName} disabled={isSavingName}>{isSavingName ? "Saving..." : "Save"}</Button>
            <Button size="sm" variant="ghost" onClick={() => setEditingName(false)}>Cancel</Button>
          </div>
        ) : (
          <div className="group flex items-center gap-2">
            <h2 className="text-2xl font-bold">{treeName}</h2>
            <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100" onClick={() => setEditingName(true)}>Rename</Button>
          </div>
        )}
        <div className="text-lg font-semibold text-muted-foreground">{treeAge} days old</div>
        
        <div className="mt-4 w-full max-w-sm">
            <Label htmlFor="tree-progress" className="text-sm font-medium">Growth Progress</Label>
            <Progress id="tree-progress" value={treeProgress} className="mt-1 h-3"/>
            <p className="text-xs text-muted-foreground mt-1 text-center">More notes help your tree grow strong.</p>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Good Notes</CardTitle>
            <CardDescription>Cultivate gratitude.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex space-x-2 mb-2">
              <Input value={newNote} onChange={(e) => { setNewNote(e.target.value); setNoteType("good"); }} placeholder="What are you grateful for?" disabled={isSavingNote} />
              <Button onClick={handleAddNote} disabled={isSavingNote || !newNote || noteType !== 'good'}>{isSavingNote && noteType === 'good' ? 'Saving...' : 'Add'}</Button>
            </div>
            {goodNotes.slice(0, 3).map((n) => <GoodNote key={n.id} text={n.text} createdAt={format(n.createdAt.toDate(), 'P')} />)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tree Mood</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <TreeMood health={treeHealth} />
          </CardContent>
        </Card>
        
         <Card>
          <CardHeader>
            <CardTitle>Interact</CardTitle>
            <CardDescription>Chat with your tree or review past conversations.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2">
             <Button variant="outline" onClick={() => setIsAiChatOpen(true)}><Bot className="mr-2 h-4 w-4" /> Talk to Your Tree</Button>
             <Button variant="outline" onClick={handleNewChat}><Plus className="mr-2 h-4 w-4" /> Start New Chat</Button>
             <Button variant="outline" onClick={() => setIsChatHistoryOpen(true)}><History className="mr-2 h-4 w-4" /> Chat History</Button>
          </CardContent>
        </Card>

      </div>
        
      {/* DIALOGS */}
      <MemoriesDialog notes={notes} isOpen={isMemoriesOpen} onOpenChange={setIsMemoriesOpen} />
      
      <TreeAiChatDialog
        isOpen={isAiChatOpen}
        onOpenChange={setIsAiChatOpen}
        treeState={{ name: treeName, health: treeHealthRatio * 100, mood: treeHealth }}
      />
      
      <ChatHistoryDialog
        isOpen={isChatHistoryOpen}
        onOpenChange={setIsChatHistoryOpen}
      />
    </div>
  );
}
