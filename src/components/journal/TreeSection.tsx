
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { User } from 'firebase/auth';
import { useAuth } from '@/hooks/use-auth';
import { useFirestoreCollection, useFirestoreDocument } from '@/hooks/use-firestore';
import { addNote, renameTree, startNewChat } from '@/services/journal-service';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, Plus, Download, Bot, History, Loader2, Edit, Check, Flame } from 'lucide-react';
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

// ----------------- Tree Visualizer & Mood -----------------
const TreeVisualizer = ({ health }: { health: string }) => {
  let treeEmoji = '🌱';
  if (health === 'healthy') treeEmoji = '🌳';
  if (health === 'weak') treeEmoji = '🍂';
  if (health === 'withered') treeEmoji = '🪵';
  return (
    <motion.div className="text-7xl sm:text-8xl flex justify-center"
      animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3 }}>
      {treeEmoji}
    </motion.div>
  );
};

const TreeMood = ({ health }: { health: string }) => {
  let mood = '🙂';
  if (health === 'healthy') mood = '😄';
  if (health === 'weak') mood = '😕';
  if (health === 'withered') mood = '😢';
  return (
    <motion.div className="text-5xl sm:text-6xl text-center" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
      {mood}
    </motion.div>
  );
};

// ----------------- Note Components -----------------
const BurningNote = ({ text, createdAt }: { text: string; createdAt: string }) => (
  <motion.div className="p-2 rounded-md bg-red-100/60 border border-red-400/50 text-sm" animate={{ opacity: [1, 0.7, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
    {text} 🔥
    <div className="text-xs text-gray-600 mt-1">{createdAt}</div>
  </motion.div>
);

const GoodNote = ({ text, createdAt }: { text: string; createdAt: string }) => (
  <motion.div className="p-2 rounded-md bg-green-100/60 border border-green-400/50 text-sm" animate={{ opacity: [1, 0.85, 1] }} transition={{ repeat: Infinity, duration: 3 }}>
    {text} ✨
    <div className="text-xs text-gray-600 mt-1">{createdAt}</div>
  </motion.div>
);

// ----------------- Notes Graph -----------------
const NotesGraph = ({ notes }: { notes: Note[] }) => {
  const goodCount = notes.filter(n => n.type === 'good').length;
  const badCount = notes.filter(n => n.type === 'bad').length;
  const data = [
    { name: 'Good Notes', value: goodCount, fill: '#4ade80' },
    { name: 'Bad Notes', value: badCount, fill: '#f87171' }
  ];

  if (goodCount === 0 && badCount === 0) {
    return <div className="text-center text-muted-foreground py-10 h-[200px] flex items-center justify-center">No notes yet to display graph.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
          {data.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

// ----------------- Memories Dialog -----------------
function MemoriesDialog({ notes, isOpen, onOpenChange }: { notes: Note[], isOpen: boolean, onOpenChange: (open: boolean) => void }) {
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
          {notes.length > 0 ? notes.map(n => n.type === 'good' ?
            <GoodNote key={n.id} text={n.text} createdAt={n.createdAt?.toDate ? format(n.createdAt.toDate(), 'P p') : ''} /> :
            <BurningNote key={n.id} text={n.text} createdAt={n.createdAt?.toDate ? format(n.createdAt.toDate(), 'P p') : ''} />
          ) : <p className="text-muted-foreground text-center py-8">No memories yet.</p>}
        </div>
        <DialogFooter>
          <Button onClick={downloadPDF} disabled={notes.length === 0}><Download className="mr-2 h-4 w-4" /> Download as PDF</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ----------------- Main TreeSection -----------------
export default function TreeSection({ user }: { user: User }) {
  const { data: notesData, loading: notesLoading } = useFirestoreCollection<Note>(`users/${user.uid}/notes`);
  const { data: treeState, loading: treeStateLoading } = useFirestoreDocument<TreeState>(`users/${user.uid}/journal/state`);
  const [goodNote, setGoodNote] = useState('');
  const [isSavingGood, setIsSavingGood] = useState(false);
  const [badNote, setBadNote] = useState('');
  const [isSavingBad, setIsSavingBad] = useState(false);
  const [burningNote, setBurningNote] = useState<string | null>(null);

  const [editingName, setEditingName] = useState(false);
  const [treeNameInput, setTreeNameInput] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);

  const [isMemoriesOpen, setIsMemoriesOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);

  const { toast } = useToast();

  const notes = useMemo(() => notesData || [], [notesData]);
  const goodNotes = useMemo(() => notes.filter(n => n.type === 'good'), [notes]);
  const totalNotes = notes.length;

  const treeHealthRatio = useMemo(() => totalNotes > 0 ? goodNotes.length / totalNotes : 0.5, [totalNotes, goodNotes]);
  const treeHealth = useMemo(() => treeHealthRatio > 0.66 ? 'healthy' : treeHealthRatio > 0.33 ? 'weak' : 'withered', [treeHealthRatio]);
  const treeProgress = useMemo(() => totalNotes > 0 ? Math.min(100, (totalNotes / 30) * 100) : 0, [totalNotes]);
  const treeAge = useMemo(() => treeState?.createdAt?.toDate ? Math.max(1, Math.ceil((new Date().getTime() - treeState.createdAt.toDate().getTime()) / (1000 * 60 * 60 * 24))) : 1, [treeState]);
  const treeName = useMemo(() => treeState?.treeName || 'My Tree', [treeState]);

  useEffect(() => {
    if (editingName) {
      setTreeNameInput(treeName);
    }
  }, [editingName, treeName]);

  const loading = notesLoading || treeStateLoading;
  if (loading && !notesData) return <div className="flex justify-center items-center h-96"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;

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

  const handleAddGoodNote = async () => {
    if (!goodNote.trim()) return;
    setIsSavingGood(true);
    try { await addNote({ text: goodNote, type: 'good' }); setGoodNote(''); toast({ title: 'Note added!' }); }
    catch (e: any) { toast({ variant: 'destructive', title: 'Error', description: e.message }); }
    finally { setIsSavingGood(false); }
  };

  const handleAddBadNote = async () => {
    if (!badNote.trim()) return;
    setIsSavingBad(true);
    try { 
      await addNote({ text: badNote, type: 'bad' }); 
      setBurningNote(badNote);
      setTimeout(() => setBurningNote(null), 3000);
      setBadNote(''); 
      toast({ title: 'Note released.' }); 
    }
    catch (e: any) { toast({ variant: 'destructive', title: 'Error', description: e.message }); }
    finally { setIsSavingBad(false); }
  };

  return (
    <>
      <AnimatePresence>
        {burningNote && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-red-50 border border-red-200 p-6 rounded-lg shadow-2xl text-center max-w-sm"
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.5, y: 100, opacity: 0, transition: { duration: 0.8, ease: 'easeOut' } }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              <Flame className="w-16 h-16 text-red-500 mx-auto animate-pulse" />
              <p className="mt-4 text-muted-foreground italic">"{burningNote}"</p>
              <p className="mt-4 font-semibold text-red-600">...has been released.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="text-center space-y-2">
          {!editingName ? (
            <h1 className="text-3xl font-bold flex justify-center items-center gap-2">
              {treeName}
              <Button variant="ghost" size="icon" onClick={() => { setEditingName(true); }} className="h-8 w-8"><Edit className="h-5 w-5" /></Button>
            </h1>
          ) : (
            <div className="flex justify-center items-center gap-2">
              <Input value={treeNameInput} onChange={e => setTreeNameInput(e.target.value)} className="text-3xl font-bold h-12 w-auto max-w-sm text-center" disabled={isSavingName} />
              <Button size="icon" onClick={handleSaveTreeName} disabled={isSavingName}>{isSavingName ? <Loader2 className="animate-spin" /> : <Check />}</Button>
            </div>
          )}
          <p className="text-muted-foreground">This is your digital gratitude tree, a place to nurture positive thoughts.</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left - Good/Bad Notes */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader><CardTitle>Good Notes</CardTitle><CardDescription>Cultivate gratitude.</CardDescription></CardHeader>
              <CardContent className="space-y-2">
                <Label htmlFor="good-note" className="sr-only">Good Note</Label>
                <Textarea id="good-note" value={goodNote} onChange={e => setGoodNote(e.target.value)} placeholder="What are you grateful for?" disabled={isSavingGood} />
                <Button onClick={handleAddGoodNote} disabled={isSavingGood || !goodNote.trim()} className="w-full">{isSavingGood ? <Loader2 className="animate-spin" /> : <><Sparkles className="mr-2" />Add Note</>}</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Bad Notes</CardTitle><CardDescription>Acknowledge and release.</CardDescription></CardHeader>
              <CardContent className="space-y-2">
                <Label htmlFor="bad-note" className="sr-only">Bad Note</Label>
                <Textarea id="bad-note" value={badNote} onChange={e => setBadNote(e.target.value)} placeholder="What's weighing on you?" disabled={isSavingBad} />
                <Button onClick={handleAddBadNote} disabled={isSavingBad || !badNote.trim()} variant="destructive" className="w-full">{isSavingBad ? <Loader2 className="animate-spin" /> : 'Release Note'}</Button>
              </CardContent>
            </Card>
          </div>

          {/* Center - Tree */}
          <div className="md:col-span-1 flex flex-col items-center gap-4 order-first md:order-none">
            <TreeVisualizer health={treeHealth} />
            <Card className="w-full text-center">
              <CardHeader><CardTitle>Tree Health: {treeHealth.charAt(0).toUpperCase() + treeHealth.slice(1)}</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <TreeMood health={treeHealth} />
                <Progress value={treeHealthRatio * 100} />
                <p className="text-sm text-muted-foreground">{goodNotes.length} good notes / {totalNotes} total</p>
              </CardContent>
            </Card>
            <Button onClick={() => setIsMemoriesOpen(true)}>View All Memories</Button>
          </div>

          {/* Right - Stats & Actions */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader><CardTitle>Tree Statistics</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Tree Age</Label>
                  <p className="text-2xl font-bold">{treeAge} day{treeAge > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <Label>Progress to next stage</Label>
                  <Progress value={treeProgress} />
                  <p className="text-xs text-muted-foreground">{totalNotes} / 30 notes for full bloom</p>
                </div>
                <NotesGraph notes={notes} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Interact</CardTitle></CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button variant="outline" onClick={() => setIsAiChatOpen(true)}><Bot className="mr-2" /> Talk to Your Tree</Button>
              </CardContent>
            </Card>
          </div>

          {/* Dialogs */}
          <MemoriesDialog notes={notes} isOpen={isMemoriesOpen} onOpenChange={setIsMemoriesOpen} />
        
          <TreeAiChatDialog isOpen={isAiChatOpen} onOpenChange={setIsAiChatOpen} user={user} treeState={{ name: treeName, health: treeHealthRatio * 100, mood: treeHealth }} />
          <ChatHistoryDialog isOpen={isChatHistoryOpen} onOpenChange={setIsChatHistoryOpen} user={user} />
        </div>
      </div>
    </>
  );
}
