"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Sparkles } from "lucide-react";

// 🟢 Dummy Journal Data
const mockJournal = {
  treeAge: 12, // days old
  treeHealth: "healthy", // healthy | weak | withered
  notes: [
    { id: 1, text: "Had a peaceful day ✨", type: "good" },
    { id: 2, text: "Got stressed at work 😓", type: "bad" },
    { id: 3, text: "Meditated for 15 minutes 🧘", type: "good" },
  ],
};

// 🌳 Tree Visualizer (center column)
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

// 😀 Mood Emoji (right column)
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

// 🔥 Burning Effect Note (bad notes only)
function BurningNote({ text }: { text: string }) {
  return (
    <motion.div
      className="p-2 rounded-md bg-red-100 border border-red-400"
      animate={{ opacity: [1, 0.6, 1], scale: [1, 1.05, 1] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
    >
      {text} 🔥
    </motion.div>
  );
}

// 📊 Good vs Bad Pie Graph
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
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
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

// 🌱 Main Tree Section
export default function TreeSection() {
  const [journal] = useState(mockJournal);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* LEFT COLUMN */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Bad Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {journal.notes
              .filter((n) => n.type === "bad")
              .map((n) => (
                <BurningNote key={n.id} text={n.text} />
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Memories Graph</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <NotesGraph notes={journal.notes} />
          </CardContent>
        </Card>

        <Button className="w-full" variant="outline">
          <Sparkles className="mr-2 h-4 w-4" /> Talk to Your Tree
        </Button>
      </div>

      {/* CENTER COLUMN */}
      <div className="flex flex-col items-center justify-center space-y-6">
        <TreeVisualizer health={journal.treeHealth} />
        <div className="text-lg font-semibold">
          Tree Age: {journal.treeAge} days
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Good Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {journal.notes
              .filter((n) => n.type === "good")
              .map((n) => (
                <div
                  key={n.id}
                  className="p-2 rounded-md bg-green-100 border border-green-400"
                >
                  {n.text} 🌟
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tree Mood</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <TreeMood health={journal.treeHealth} />
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
                style={{ width: `${Math.min(journal.treeAge * 5, 100)}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}