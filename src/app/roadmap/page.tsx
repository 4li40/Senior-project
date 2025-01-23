"use client";
import React, { useState } from "react";
import { dummyRoadmap } from "../../data/dummyroadmap";
import NormalView from "@/components/roadmap/normalview";
import TreeView from "@/components/roadmap/treeview";
import StudentNavBar from "@/components/StudentNavBar";

function RoadmapPage() {
  const [viewMode, setViewMode] = useState("normal");

  const handleToggleView = () => {
    setViewMode((prevMode) => (prevMode === "normal" ? "tree" : "normal"));
  };

  return (
    <div>
      {/* Student Navigation Bar */}
      <StudentNavBar />

      {/* Roadmap Content */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Your Learning Roadmap</h2>
        
        {/* Toggle View Button */}
        <button
          onClick={handleToggleView}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {viewMode === "normal" ? "View as Tree" : "View as List/Normal"}
        </button>

        {/* Conditional Rendering of NormalView and TreeView */}
        <div>
          {viewMode === "normal" ? (
            <NormalView data={dummyRoadmap} />
          ) : (
            <TreeView data={dummyRoadmap} />
          )}
        </div>
      </div>
    </div>
  );
}

export default RoadmapPage;
