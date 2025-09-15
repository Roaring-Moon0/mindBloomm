"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useFirestoreCollection, useFirestoreDocument } from "@/hooks/use-firestore";
import { addNote, renameTree } from "@/services/journal-service";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Note {
    id: string;
    text: string;
    type: 'good' | 'bad';
    createdAt: any;
}

interface TreeState {
    treeName?: string;
}

// Simple note display component
function NoteCard({ text, type, createdAt }: Note) {
  const style = type === "good" ? "bg-green-100 border-green-400" : "bg-red-100 border-red-400";
  const formattedDate = createdAt?.toDate ? createdAt.toDate().toLocaleString() : 'Just now';

  return (
    <div className={`p-3 border rounded-md ${style} mb-2`}>
      <p className="text-sm">{text}</p>
      <p className="text-xs text-gray-600 mt-1">{formattedDate}</p>
    </div>
  );
}

export default function TreeSection() {
  const { user, loading: authLoading } = useAuth();
  
  const { data: notes, loading: notesLoading } = useFirestoreCollection<Note>(user ? `users/${user.uid}/notes` : '');
  const { data: treeState, loading: treeStateLoading } = useFirestoreDocument<TreeState>(user ? `users/${user.uid}` : '');

  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<"good" | "bad">("good");
  
  const [currentTreeName, setCurrentTreeName] = useState("My Tree");
  const [editingName, setEditingName] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);

  useEffect(() => {
    if (treeState?.treeName) {
      setCurrentTreeName(treeState.treeName);
    }
  }, [treeState]);


  if (authLoading || notesLoading || treeStateLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!user) {
    return <div>You must be logged in to use this feature.</div>;
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setIsSavingNote(true);
    try {
        await addNote({ text: newNote, type: noteType });
        toast({ title: "Note saved!" });
        setNewNote("");
    } catch (e: any) {
        toast({ variant: 'destructive', title: "Error", description: e.message });
    } finally {
        setIsSavingNote(false);
    }
  };

  const handleSaveTreeName = async () => {
    if (!currentTreeName.trim()) {
        toast({ variant: 'destructive', title: "Error", description: "Tree name cannot be empty."});
        return;
    };
    setIsSavingName(true);
    try {
        await renameTree(currentTreeName);
        toast({ title: "Tree renamed successfully!"});
        setEditingName(false);
    } catch(e: any) {
        toast({ variant: 'destructive', title: 'Error', description: e.message });
    } finally {
        setIsSavingName(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Tree Name */}
      <div className="mb-6">
        {editingName ? (
          <div className="flex items-center space-x-2">
            <Input value={currentTreeName} onChange={(e) => setCurrentTreeName(e.target.value)} disabled={isSavingName} />
            <Button onClick={handleSaveTreeName} disabled={isSavingName}>
                {isSavingName ? <Loader2 className="h-4 w-4 animate-spin"/> : "Save"}
            </Button>
            <Button variant="ghost" onClick={() => setEditingName(false)} disabled={isSavingName}>Cancel</Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">{currentTreeName}</h2>
            <Button size="sm" variant="outline" onClick={() => setEditingName(true)}>Rename</Button>
          </div>
        )}
      </div>

      {/* Notes Input */}
      <div className="mb-6 p-4 border rounded-lg bg-card space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
            <Input
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder={`Write a ${noteType} note...`}
            disabled={isSavingNote}
            />
            <Button onClick={handleAddNote} disabled={isSavingNote || !newNote.trim()}>
                 {isSavingNote ? <Loader2 className="h-4 w-4 animate-spin"/> : "Save Note"}
            </Button>
        </div>
        <div className="flex items-center justify-center">
            <Button variant="link" onClick={() => setNoteType(noteType === "good" ? "bad" : "good")}>
                Switch to writing a {noteType === "good" ? "Bad" : "Good"} note
            </Button>
        </div>
      </div>

      {/* Notes List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Your Notes</h3>
        {notes && notes.length > 0 ? (
            notes.map((n) => (
                <NoteCard key={n.id} id={n.id} text={n.text} type={n.type} createdAt={n.createdAt} />
            ))
        ) : (
            <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
                <p>No notes yet. Add one above to get started!</p>
            </div>
        )}
      </div>
    </div>
  );
}
