"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Sparkles, Plus } from "lucide-react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { TreeAiChatDialog } from './TreeAiChatDialog';

// 🌳 Tree Visualizer
function TreeVisualizer({ health }: { health: string }) {
  let treeEmoji = "🌱";
  if (health === "healthy") treeEmoji = "🌳";
  if (health === "weak") treeEmoji = "🍂";
  if (health === "withered") treeEmoji = "🪵";

  return (
    <motion.div
      className="text-8xl flex justify-center"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ repeat: Infinity, duration: 3 }}
    >
      {treeEmoji}
    </motion.div>
  );
}

// 😀 Mood Emoji
function TreeMood({ health }: { health: string }) {
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
}

// 🔥 Burning Effect for Bad Notes
function BurningNote({ text, createdAt }: { text: string; createdAt: string }) {
  return (
    <motion.div
      className="p-2 rounded-md bg-red-100 border border-red-400 text-sm"
      animate={{ opacity: [1, 0.6, 1], scale: [1, 1.05, 1] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
    >
      {text} 🔥
      <div className="text-xs text-gray-600">{createdAt}</div>
    </motion.div>
  );
}

// 🌟 Glow Effect for Good Notes
function GoodNote({ text, createdAt }: { text: string; createdAt: string }) {
  return (
    <motion.div
      className="p-2 rounded-md bg-green-100 border border-green-400 text-sm"
      animate={{ opacity: [1, 0.8, 1] }}
      transition={{ repeat: Infinity, duration: 3 }}
    >
      {text} ✨
      <div className="text-xs text-gray-600">{createdAt}</div>
    </motion.div>
  );
}

// 📊 Pie Chart
function NotesGraph({ notes }: { notes: any[] }) {
  const good = notes.filter((n) => n.type === "good").length;
  const bad = notes.filter((n) => n.type === "bad").length;

  const data = [
    { name: "Good", value: good },
    { name: "Bad", value: bad },
  ];
  const COLORS = ["#4ade80", "#f87171"];

  return (
    <PieChart width={200} height={200}>
      <Pie
        data={data}
        cx={100}
        cy={100}
        outerRadius={80}
        dataKey="value"
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}

export default function TreeSection() {
  const [user] = useAuthState(auth);
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<"good" | "bad">("good");
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Load notes from Firestore
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users", user.uid, "notes"),
      orderBy("createdAt", "desc")
    );

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

  // Save new note
  async function addNote() {
    if (!user || !newNote.trim()) return;
    await addDoc(collection(db, "users", user.uid, "notes"), {
      text: newNote,
      type: noteType,
      createdAt: serverTimestamp(),
    });
    setNewNote("");
  }
  
  const treeHealth = notes.filter(n => n.type === 'good').length > notes.filter(n => n.type === 'bad').length ? 'healthy' : 'weak';
  const treeAge = notes.length;

  return (
    <>
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
                  />
                  <Button onClick={addNote}>Save</Button>
                </div>
              )}
              {notes
                .filter((n) => n.type === "bad")
                .map((n) => (
                  <BurningNote key={n.id} text={n.text} createdAt={n.createdAt} />
                ))}
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

          <Button className="w-full" variant="outline" onClick={() => setIsChatOpen(true)}>
            <Sparkles className="mr-2 h-4 w-4" /> Talk to Your Tree
          </Button>
        </div>

        {/* CENTER COLUMN */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <TreeVisualizer health={treeHealth} />
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
                  />
                  <Button onClick={addNote}>Save</Button>
                </div>
              )}
              {notes
                .filter((n) => n.type === "good")
                .map((n) => (
                  <GoodNote key={n.id} text={n.text} createdAt={n.createdAt} />
                ))}
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
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full"
                  style={{ width: `${Math.min(treeAge * 5, 100)}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <TreeAiChatDialog 
        isOpen={isChatOpen} 
        onOpenChange={setIsChatOpen} 
        treeState={{ 
            name: "My Tree", // This could be dynamic in the future
            health: Math.max(10, 100 - (notes.filter(n => n.type === 'bad').length * 10)),
            mood: treeHealth,
        }}
    />
    </>
  );
}
