
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Sparkles, Plus } from "lucide-react";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addNote, renameTree } from "@/services/journal-service";
import { useToast } from "@/hooks/use-toast";


// ----- Child Components -----

const TreeVisualizer = ({ health }: { health: string }) => {
  let treeEmoji = "🌱"; // Sprout
  if (health === "healthy") treeEmoji = "🌳"; // Flourishing
  if (health === "weak") treeEmoji = "🍂"; // Weak
  if (health === "withered") treeEmoji = "🪵"; // Withered

  return (
    <motion.div
      className="text-8xl flex justify-center"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ repeat: Infinity, duration: 3 }}
    >
      {treeEmoji}
    </motion.div>
  );
};

const TreeMood = ({ health }: { health: string }) => {
  let mood = "🙂";
  if (health === "healthy") mood = "😄";
  if (health === "weak") mood = "😕";
  if (health === "withered") mood = "😢";

  return (
    <motion.div
      className="text-6xl text-center"
      animate={{ y: [0, -5, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      {mood}
    </motion.div>
  );
};

const GoodNote = ({ text, createdAt }: { text: string; createdAt: string }) => (
    <motion.div
      className="p-3 rounded-xl bg-green-100 border border-green-400 text-sm shadow-sm"
      animate={{ opacity: [1, 0.85, 1] }}
      transition={{ repeat: Infinity, duration: 3 }}
    >
      ✨ {text}
      <div className="text-xs text-gray-600 mt-1">{createdAt}</div>
    </motion.div>
);

const BadNote = ({ text, createdAt }: { text: string; createdAt: string }) => (
    <motion.div
      className="p-3 rounded-xl bg-red-100 border border-red-400 text-sm shadow-sm"
      animate={{ opacity: [1, 0.6, 1], scale: [1, 1.05, 1] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
    >
      🔥 {text}
      <div className="text-xs text-gray-600 mt-1">{createdAt}</div>
    </motion.div>
);

const NotesGraph = ({ notes }: { notes: any[] }) => {
  const good = notes.filter((n) => n.type === "good").length;
  const bad = notes.filter((n) => n.type === "bad").length;
  const data = [
    { name: "Good", value: good },
    { name: "Bad", value: bad },
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
};


// ----- Main Component -----

export default function TreeSection() {
  const [user, loading] = useAuthState(auth);
  const { toast } = useToast();
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<"good" | "bad">("good");
  const [treeName, setTreeName] = useState("My Tree");
  const [editingName, setEditingName] = useState(false);
  const [showMemories, setShowMemories] = useState(false);

  // Load notes
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

  // Load tree name
  useEffect(() => {
    if (!user) return;
    const treeDoc = doc(db, "users", user.uid);
    const unsub = onSnapshot(treeDoc, (snap) => {
      if (snap.exists() && snap.data().treeName) setTreeName(snap.data().treeName);
    });
    return () => unsub();
  }, [user]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      await addNote({ text: newNote, type: noteType });
      toast({
        title: noteType === "good" ? "Note Saved!" : "A challenging moment",
        description: noteType === "good" ? "You've nurtured your tree today." : "It's okay to have tough days. Keep going! 🌟"
      });
      setNewNote("");
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  };

  const handleSaveTreeName = async () => {
    try {
      await renameTree(treeName);
      toast({ title: 'Tree renamed!' });
      setEditingName(false);
    } catch(e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  };
  
  const goodNotes = notes.filter((n) => n.type === "good");
  const badNotes = notes.filter((n) => n.type === "bad");
  const treeAge = notes.length;
  let treeHealth: 'healthy' | 'weak' | 'withered' = 'healthy';
  const healthRatio = goodNotes.length / (notes.length || 1);
  if (healthRatio < 0.4) treeHealth = 'withered';
  else if (healthRatio < 0.7) treeHealth = 'weak';
  const treeProgress = notes.length > 0 ? (goodNotes.length / notes.length) * 100 : 50;

  if (loading) return <div>Loading your tree...</div>;
  if (!user) return <div>You must be logged in to use this feature.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* LEFT COLUMN - BAD NOTES */}
      <div className="space-y-4">
        <Card>
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
                  placeholder="Write a bad note..."
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                />
                <Button onClick={handleAddNote}>Save</Button>
              </div>
            )}
            <ScrollArea className="h-64 pr-4">
                {badNotes.map((n) => (
                    <BadNote key={n.id} text={n.text} createdAt={n.createdAt} />
                ))}
            </ScrollArea>
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

        <Dialog open={showMemories} onOpenChange={setShowMemories}>
            <DialogTrigger asChild>
                <Button className="w-full" variant="outline">
                    <Sparkles className="mr-2 h-4 w-4" /> See All Memories
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>All Memories</DialogTitle>
                    <DialogDescription>A complete history of your good and bad notes.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-96 pr-4 -mr-4 my-4">
                    <div className="space-y-2">
                    {notes.map((n) => (
                        n.type === "good" ? 
                        <GoodNote key={n.id} text={n.text} createdAt={n.createdAt} /> :
                        <BadNote key={n.id} text={n.text} createdAt={n.createdAt} />
                    ))}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button onClick={() => setShowMemories(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

      </div>

      {/* CENTER COLUMN */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <TreeVisualizer health={treeHealth} />
        <div className="text-lg font-semibold">
          {editingName ? (
            <div className="flex space-x-2">
              <Input value={treeName} onChange={(e) => setTreeName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSaveTreeName()}/>
              <Button size="sm" onClick={handleSaveTreeName}>Save</Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {treeName}
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingName(true)}>Rename</Button>
            </div>
          )}
        </div>
        <div className="text-lg font-semibold">Tree Age: {treeAge} days</div>
      </div>

      {/* RIGHT COLUMN - GOOD NOTES */}
      <div className="space-y-4">
        <Card>
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
                  placeholder="Write a good note..."
                   onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                />
                <Button onClick={handleAddNote}>Save</Button>
              </div>
            )}
             <ScrollArea className="h-64 pr-4">
                {goodNotes.map((n) => (
                    <GoodNote key={n.id} text={n.text} createdAt={n.createdAt} />
                ))}
             </ScrollArea>
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
            <CardTitle>Tree Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={treeProgress} className="h-4" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
