/* -------------------------------------------------------------------------- */
/*  PAGE – Roadmap (student)                                                  */
/* -------------------------------------------------------------------------- */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudentNavBar from "@/components/StudentNavBar";
import NormalView from "@/components/roadmap/normalview";
import TreeView from "@/components/roadmap/treeview";
import { Button } from "@/components/ui/button";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */
export interface RoadmapNode {
  id: number;
  label: string;
  description?: string;
  completed: boolean;
  order_index: number;
  course_title?: string;
  track: string;
  parent_id?: number;
  children?: RoadmapNode[];
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */
export default function RoadmapPage() {
  const router = useRouter();

  /* ----------------------------- state ----------------------------------- */
  const [loading, setLoading] = useState(true);
  const [allSteps, setAllSteps] = useState<RoadmapNode[]>([]);
  const [selectedTrack, setSelectedTrack] = useState("");
  const [viewMode, setViewMode] = useState<"normal" | "tree">("normal");

  /* -------------------------- data fetch --------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5003/api/roadmap", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch roadmap");
        const data: RoadmapNode[] = await res.json();

        /* normalise */
        const withDefault = data.map((s) => ({
          ...s,
          completed: !!s.completed,
        }));
        setAllSteps(withDefault);

        /* first track becomes default */
        const uniq = Array.from(
          new Set(withDefault.map((s) => s.track.trim()))
        );
        if (uniq.length) setSelectedTrack(uniq[0]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const trackSlug: Record<string, string> = {
    cybersecurity: "cybersecurity",
    "ai & machine learning": "ai-ml",
    "ai and machine learning": "ai-ml", // handle “and” variant
    "data science": "data-science",
    "web development": "web-dev",
    "mobile development": "mobile-dev",
    "software engineering": "software-eng",
    // add / tweak as you introduce new tracks
  };

  /* ----------------------- derived structures ---------------------------- */
  const grouped: Record<string, RoadmapNode[]> = allSteps.reduce((acc, n) => {
    const t = n.track.trim();
    acc[t] = acc[t] ? [...acc[t], n] : [n];
    return acc;
  }, {} as Record<string, RoadmapNode[]>);

  const currentSteps = grouped[selectedTrack] ?? [];

  /* --------------------------- helpers ----------------------------------- */
  const viewCourses = (track: string) => {
    const key = track.trim().toLowerCase();
    const slug = trackSlug[key] ?? key.replace(/\s+/g, "-"); // fallback
    router.push(`/Explore/${slug}`);
  };

  const handleMarkComplete = async (id: number, done: boolean) => {
    try {
      await fetch("http://localhost:5003/api/roadmap/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ roadmap_step_id: id, completed: done }),
      });

      /* optimistic UI update */
      setAllSteps((prev) =>
        prev.map((s) => (s.id === id ? { ...s, completed: done } : s))
      );
    } catch (e) {
      console.error("Could not update progress", e);
    }
  };

  /* ---------------------------------------------------------------------- */
  /*  render                                                                */
  /* ---------------------------------------------------------------------- */
  return (
    <>
      <StudentNavBar />

      <div className="p-6 max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">
          Your Learning Roadmap
        </h1>

        {/* --------------------- track selector --------------------------- */}
        {Object.keys(grouped).length > 1 && (
          <div className="flex justify-center mb-4">
            <label htmlFor="trackSelect" className="mr-2 font-medium">
              Select Track:
            </label>
            <select
              id="trackSelect"
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="border rounded p-2"
            >
              {Object.keys(grouped).map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        )}

        {/* --------------------- view mode toggle ------------------------ */}
        <div className="flex justify-center mb-6">
          <Button
            onClick={() =>
              setViewMode((m) => (m === "normal" ? "tree" : "normal"))
            }
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            {viewMode === "normal"
              ? "Switch to Tree View"
              : "Switch to List View"}
          </Button>
        </div>

        {/* ----------------------- 2‑column layout ------------------------ */}
        {loading ? (
          <p className="text-center text-gray-500">Loading…</p>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/*  left sidebar */}
            <aside className="w-full lg:w-1/4 space-y-4">
              <div className="bg-white p-4 rounded shadow-sm">
                <h2 className="font-semibold text-lg mb-1">Track Info</h2>
                <p className="text-sm text-muted-foreground">
                  You’re learning <strong>{selectedTrack}</strong>.
                </p>
              </div>

              <div className="bg-white p-4 rounded shadow-sm">
                <h2 className="font-semibold text-lg mb-1">Tips</h2>
                <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-0.5">
                  <li>Complete the steps one‑by‑one</li>
                  <li>Use “View Courses” to dive deeper</li>
                  <li>Mark items as done to track progress</li>
                </ul>
              </div>
            </aside>

            {/*  main panel (tree or list) */}
            <section className="w-full lg:w-3/4">
              {currentSteps.length === 0 ? (
                <p className="text-center text-gray-500">
                  No steps for this track.
                </p>
              ) : viewMode === "normal" ? (
                <NormalView
                  data={{ [selectedTrack]: currentSteps }}
                  viewCourses={viewCourses}
                  onMarkComplete={handleMarkComplete}
                />
              ) : (
                <TreeView
                  data={currentSteps}
                  viewCourses={viewCourses}
                  onMarkComplete={handleMarkComplete}
                />
              )}
            </section>
          </div>
        )}
      </div>
    </>
  );
}
