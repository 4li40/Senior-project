"use client";
import React, { useState } from "react";
import { dummyRoadmap } from "../../data/dummyroadmap";
import NormalView from "../../components/roadmap/normalview";
import TreeView from "../../components/roadmap/treeview";
import StudentNavBar from "@/components/StudentNavBar";

function RoadmapPage() {
  const [viewMode, setViewMode] = useState("normal");

  const handleToggleView = () => {
    setViewMode(prevMode => (prevMode === "normal" ? "tree" : "normal"));
  };

  return (
    <div>
            <StudentNavBar />

      <div style={{ padding: "1rem" }}>
        <h2>Your Learning Roadmap</h2>
        <button onClick={handleToggleView} style={{ marginBottom: "1rem" }}>
          {viewMode === "normal" ? "View as Tree" : "View as List/Normal"}
        </button>
        {viewMode === "normal" ? (
          <NormalView data={dummyRoadmap} />
        ) : (
          <TreeView data={dummyRoadmap} />
        )}
      </div>
    </div>
  );
}

export default RoadmapPage;
