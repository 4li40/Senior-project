"use client";
import React from "react";
import { RoadmapNode } from "@/types/roadmap";

interface NormalViewProps {
  data: Record<string, RoadmapNode[]>;
  viewCourses: (track: string) => void;
  onMarkComplete: (stepId: number, done: boolean) => void;
}

export default function NormalView({
  data,
  viewCourses,
  onMarkComplete,
}: NormalViewProps) {
  return (
    <div className="space-y-6">
      {Object.entries(data).map(([track, nodes]) =>
        nodes.map((node) => (
          <div
            key={node.id}
            className="p-4 border rounded-lg shadow-md bg-white flex flex-col gap-2"
          >
            {/* title + status */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                {node.label}
              </h3>

              {node.completed && (
                <span className="text-sm text-green-600 font-medium">
                  ✓ Completed
                </span>
              )}
            </div>

            {node.description && (
              <p className="text-sm text-gray-600">{node.description}</p>
            )}

            {/* action buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => viewCourses(node.track || "")}
                className="px-4 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm"
              >
                View Courses
              </button>

              <button
                onClick={() => onMarkComplete(node.id, !node.completed)}
                className={`px-4 py-1 rounded text-sm ${
                  node.completed
                    ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {node.completed ? "Undo" : "Mark ✓"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
