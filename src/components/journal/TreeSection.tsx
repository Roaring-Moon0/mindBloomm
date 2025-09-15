'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { useFirestoreCollection, useFirestoreDocument } from '@/hooks/use-firestore';
import { addNote, renameTree, startNewChat } from '@/services/journal-service';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, Plus, Download, Bot, History, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { TreeAiChatDialog } from './TreeAiChatDialog';
import { ChatHistoryDialog } from './ChatHistoryDialog';

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

// ==========================
// Tree Visualizer & Mood
// ==========================
const TreeVisualizer = ({ health }: { health: string }) => {
  const emoji = health === 'healthy' ? '🌳' : health === 'weak' ? '🍂' : health === 'withered' ? '🪵' : '🥀';
  return <motion.div className="text-8xl flex justify-center" animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3 }}>{emoji}</motion.div>;
};

const TreeMood = ({ health }: { health: string }) => {
  const mood = health === 'healthy' ? '😄' : health === 'weak' ? '😕' : health === 'withered' ? '😢' : '🥺';
  return <motion.div className="text-6xl text-center" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>{mood}</motion.div>;
};

// ==========================
// Notes Display
// ==========================
const GoodNote = ({ text, createdAt }: { text: string; createdAt: string }) => (
  <motion.div className="p-2 rounded-md bg-green-100/60 border border-green-400/50 text-sm" animate={{ opacity: [1, 0.85, 1] }} transition={{ repeat: Infinity, duration: 3 }}>
    {text} ✨<div className="text-xs text-gray-600 mt-1">{createdAt}</div>
  </motion.div>
);

const BadNote = ({ text, createdAt }: { text: string; createdAt: string }) => (
  <motion.div className="p-2 rounded-md bg-red-100/60 border border-red-400/50 text-sm" animate={{ opacity: [1, 0.7, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
    {text} 🔥<div className="text-xs text-gray-600 mt-1">{createdAt}</div>
  </motion.div>
);

const NotesGraph = ({ notes }: { notes: Note[] }) => {
  const goodCount = notes.filter(n => n.type === 'good').length;
  const badCount = notes.filter(n => n.type === 'bad').length;
  if (!goodCount && !badCount) return <div className="text-center text-muted-foreground py-10 h-[200px] flex items-center justify-center">No notes yet to display graph.</div>;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={[{ name: 'Good Notes', value: goodCount, fill: '#4ade80' }, { name: 'Bad Notes', value: badCount, fill: '#f87171' }]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
          <Cell key="good" fill="#4ade80"/>
          <Cell key="bad" fill="#f87171"/>
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

// ==========================
// Memories Dialog
// ==========================
function MemoriesDialog({ notes, isOpen, onOpenChange }: { notes: Note[]; isOpen: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Your Memories', 10, 10);
    notes.forEach((n, i) => {
      const date = n.createdAt?.toDate ? format(n.createdAt.toDate(), 'P p') : 'N/A';
      doc.text(`[${n.type.toUpperCase()}] ${n.text} (${date})`, 10, 20 + i * 10);
    });
    doc.save('memories.pdf');
    toast({ title: 'Downloading PDF...' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>All Memories</DialogTitle>
          <DialogDescription>A complete history of your thoughts.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 max-h-96 overflow-y-auto p-1">
          {notes.length > 0 ? notes.map((n) => n.type === 'good' ? <GoodNote key={n.id} text={n.text} createdAt={n.createdAt?.toDate ? format(n.createdAt.toDate(), 'P p') : ''} /> : <BadNote key={n.id} text={n.text} createdAt={n.createdAt?.toDate ? format(n.createdAt.toDate(), 'P p') : ''} />) : <p className="text-muted-foreground text-center py-8">No memories yet.</p>}
        </div>
        <DialogFooter>
          <Button onClick={downloadPDF} disabled={!notes.length}><Download className="mr-2 h-4 w-4"/> Download PDF</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==========================
// Main TreeSection Component
// ==========================
export default function TreeSection() {
  const { user, loading: authLoading } = useAuth();
  const { data: notesData, loading: notesLoading } = useFirestoreCollection<Note>(user ? `users/${user.uid}/notes` : '');
  const { data: treeState, loading: treeStateLoading } = useFirestoreDocument<TreeState>(user ? `users/${user.uid}` : '');
  const { toast } = useToast();

  const [goodNote, setGoodNote] = useState('');
  const [badNote, setBadNote] = useState('');
  const [isSavingGood, setIsSavingGood] = useState(false);
  const [isSavingBad, setIsSavingBad] = useState(false);

  const [editingName, setEditingName] = useState(false);
  const [treeNameInput, setTreeNameInput] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);

  const [isMemoriesOpen, setIsMemoriesOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);

  const notes = notesData || [];
  const goodNotes = useMemo(() => notes.filter(n => n.type === 'good'), [notes]);
  const badNotes = useMemo(() => notes.filter(n => n.type === 'bad'), [notes]);
  const totalNotes = notes.length;

  const treeHealthRatio = totalNotes > 0 ? goodNotes.length / totalNotes : 0.5;
  let treeHealth = treeHealthRatio > 0.66 ? 'healthy' : treeHealthRatio > 0.33 ? 'weak' : 'withered';
  const treeProgress = totalNotes > 0 ? Math.min(100, (totalNotes / 30) * 100) : 0;

  const treeAge = treeState?.createdAt?.toDate ? Math.max(1, Math.ceil((new Date().getTime() - treeState.createdAt.toDate().getTime()) / (1000 * 60 * 60 * 24))) : 1;
  const treeName = treeState?.treeName || 'My Tree';

  const lastNoteDate = notes.length ? notes.reduce((latest, n) => (n.createdAt?.toDate ? n.createdAt.toDate() : new Date(0)) > latest ? (n.createdAt?.toDate ? n.createdAt.toDate() : new Date(0)) : latest, new Date(0)) : null;
  const daysSinceLastNote = lastNoteDate ? Math.ceil((new Date().getTime() - lastNoteDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  if (daysSinceLastNote >= 3) {
    treeHealth = 'missing';
  }

  useEffect(() => { setTreeNameInput(treeName); }, [treeName]);

  useEffect(() => {
    if (daysSinceLastNote >= 3) {
      toast({ title: 'Your tree misses you!', description: `It's been ${daysSinceLastNote} days since your last note.` });
    }
  }, [daysSinceLastNote, toast]);

  if (authLoading || notesLoading || treeStateLoading) return <div className="flex justify-center items-center h-96"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  if (!user) return <div className="p-4 text-center text-destructive font-medium">You must be logged in to view this section.</div>;

  const handleSaveTreeName = async () => {
    if (!treeNameInput.trim()) return toast({ variant: 'destructive', title: 'Name cannot be empty.' });
    setIsSavingName(true);
    try { await renameTree(treeNameInput); toast({ title: 'Tree renamed successfully!' }); setEditingName(false); }
    catch (e: any) { toast({ variant: 'destructive', title: 'Error', description: e.message }); }
    finally { setIsSavingName(false); }
  };

  const handleNewChat = async () => {
    try { await startNewChat(); toast({ title: 'New chat started!' }); setIsChatHistoryOpen(true); }
    catch (e: any) { toast({ variant: 'destructive', title: 'Error starting chat' }); }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* LEFT COLUMN: Bad Notes & Graph */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Bad Notes</CardTitle>
            <CardDescription>Acknowledge and release.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex space-x-2">
              <Input value={badNote} onChange={(e) => setBadNote(e.target.value)} placeholder="What's weighing on you?" disabled={isSavingBad} />
              <Button disabled={isSavingBad || !badNote} onClick={async () => {
                if (!badNote.trim()) return;
                setIsSavingBad(true);
                try { await addNote({ text: badNote, type: 'bad' }); setBadNote(''); toast({ title: 'Note released.' }); }
                catch (e: any) { toast({ variant: 'destructive', title: 'Error', description: e.message }); }
                finally { setIsSavingBad(false); }
              }}>{isSavingBad ? <Loader2 className="animate-spin"/> : 'Release'}</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Memories Graph</CardTitle></CardHeader>
          <CardContent className="flex justify-center"><NotesGraph notes={notes} /></CardContent>
        </Card>

        <Button className="w-full" variant="outline" onClick={() => setIsMemoriesOpen(true)}><Sparkles className="mr-2 h-4 w-4" /> See All Memories</Button>
      </div>

      {/* CENTER COLUMN: Tree */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <TreeVisualizer health={treeHealth} />
        {editingName ? (
          <div className="flex items-center space-x-2">
            <Input value={treeNameInput} onChange={(e) => setTreeNameInput(e.target.value)} disabled={isSavingName} onKeyDown={(e) => e.key === 'Enter' && handleSaveTreeName()}/>
            <Button size="sm" onClick={handleSaveTreeName} disabled={isSavingName}>{isSavingName ? <Loader2 className="animate-spin"/> : 'Save'}</Button>
            <Button size="sm" variant="ghost" onClick={() => setEditingName(false)} disabled={isSavingName}>Cancel</Button>
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

      {/* RIGHT COLUMN: Good Notes & Interact */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Good Notes</CardTitle>
            <CardDescription>Cultivate gratitude.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex space-x-2">
              <Input value={goodNote} onChange={(e) => setGoodNote(e.target.value)} placeholder="What are you grateful for?" disabled={isSavingGood} />
              <Button disabled={isSavingGood || !goodNote} onClick={async () => {
                if (!goodNote.trim()) return;
                setIsSavingGood(true);
                try { await addNote({ text: goodNote, type: 'good' }); setGoodNote(''); toast({ title: 'Note added!' }); }
                catch (e: any) { toast({ variant: 'destructive', title: 'Error', description: e.message }); }
                finally { setIsSavingGood(false); }
              }}>{isSavingGood ? <Loader2 className="animate-spin"/> : 'Add'}</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tree Mood</CardTitle></CardHeader>
          <CardContent className="flex justify-center"><TreeMood health={treeHealth} /></CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interact</CardTitle>
            <CardDescription>Chat with your tree or review past conversations.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2">
            <Button variant="outline" onClick={() => setIsAiChatOpen(true)}><Bot className="mr-2 h-4 w-4"/> Talk to Your Tree</Button>
            <Button variant="outline" onClick={handleNewChat}><Plus className="mr-2 h-4 w-4"/> Start New Chat</Button>
            <Button variant="outline" onClick={() => setIsChatHistoryOpen(true)}><History className="mr-2 h-4 w-4"/> Chat History</Button>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <MemoriesDialog notes={notes} isOpen={isMemoriesOpen} onOpenChange={setIsMemoriesOpen} />
      <TreeAiChatDialog isOpen={isAiChatOpen} onOpenChange={setIsAiChatOpen} treeState={{ name: treeName, health: treeHealthRatio * 100, mood: treeHealth }} />
      <ChatHistoryDialog isOpen={isChatHistoryOpen} onOpenChange={setIsChatHistoryOpen} />
    </div>
  );
}
