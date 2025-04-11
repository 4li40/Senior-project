"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudentNavBar from "@/components/StudentNavBar";
import NormalView from "@/components/roadmap/normalview";
import TreeView from "@/components/roadmap/treeview";
import { Button } from "@/components/ui/button";

// Ensure your RoadmapNode type has a default completed value (if not provided, assume false)
export interface RoadmapNode {
  id: number;
  label: string;
  description?: string;
  completed: boolean;
  order_index: number;
  course_title?: string;
  track: string;
  children?: RoadmapNode[];
}

export default function RoadmapPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [roadmapItems, setRoadmapItems] = useState<RoadmapNode[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<string>("");
  const [viewMode, setViewMode] = useState<"normal" | "tree">("normal");

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await fetch("http://localhost:5003/api/roadmap", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch roadmap");
        const data: RoadmapNode[] = await res.json();

        // Ensure every item has completed defined
        const dataWithDefaults = data.map((item) => ({
          ...item,
          completed:
            typeof item.completed === "boolean" ? item.completed : false,
        }));

        setRoadmapItems(dataWithDefaults);

        // Extract unique tracks from the roadmap data
        const uniqueTracks = Array.from(
          new Set(dataWithDefaults.map((item) => item.track.trim()))
        );
        if (uniqueTracks.length > 0) {
          setSelectedTrack(uniqueTracks[0]);
        }
      } catch (err) {
        console.error("Error fetching roadmap:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  // Group roadmap items by track
  const groupedRoadmap: Record<string, RoadmapNode[]> = roadmapItems.reduce(
    (acc, item) => {
      const track = item.track.trim();
      if (!acc[track]) {
        acc[track] = [];
      }
      acc[track].push(item);
      return acc;
    },
    {} as Record<string, RoadmapNode[]>
  );

  // Get the data for the selected track
  const selectedData: Record<string, RoadmapNode[]> = {
    [selectedTrack]: groupedRoadmap[selectedTrack] || [],
  };

  // Navigate to the Explore page for the given track.
  const viewCoursesForTrack = (track: string) => {
    // Lowercase and replace spaces with hyphens.
    const lowerTrack = track.toLowerCase();
    // If you need to map "Software Engineer" to "software-engineering", add a mapping:
    const trackMap: Record<string, string> = {
      "software engineer": "software-engineering",
      // add other mappings as needed
    };
    const normalizedTrack =
      trackMap[lowerTrack] || lowerTrack.replace(/\s+/g, "-");
    router.push(`/Explore/${normalizedTrack}`);
  };

  return (
    <div>
      <StudentNavBar />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">
          Your Learning Roadmap
        </h1>
        {loading ? (
          <p className="text-center text-gray-500">Loading roadmap...</p>
        ) : (
          <>
            {/* Dropdown for selecting track */}
            {Object.keys(groupedRoadmap).length > 1 && (
              <div className="mb-6 text-center">
                <label htmlFor="trackSelect" className="mr-2 font-medium">
                  Select Track:
                </label>
                <select
                  id="trackSelect"
                  value={selectedTrack}
                  onChange={(e) => setSelectedTrack(e.target.value)}
                  className="border rounded p-2"
                >
                  {Object.keys(groupedRoadmap).map((track) => (
                    <option key={track} value={track}>
                      {track}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Toggle between Normal (list) and Tree views */}
            <div className="flex justify-center mb-6">
              <Button
                onClick={() =>
                  setViewMode((prev) => (prev === "normal" ? "tree" : "normal"))
                }
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
              >
                {viewMode === "normal"
                  ? "Switch to Tree View"
                  : "Switch to List View"}
              </Button>
            </div>

            {/* Display roadmap based on view mode */}
            {Object.keys(selectedData).length === 0 ||
            selectedData[selectedTrack].length === 0 ? (
              <p className="text-center text-gray-500">
                No roadmap steps available for the selected track.
              </p>
            ) : viewMode === "normal" ? (
              <NormalView
                data={selectedData}
                viewCourses={viewCoursesForTrack}
              />
            ) : (
              <TreeView
                data={selectedData[selectedTrack]}
                viewCourses={viewCoursesForTrack}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
