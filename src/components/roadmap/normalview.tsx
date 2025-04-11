"use client";
import React from "react";
import { RoadmapNode } from "@/types/roadmap";

interface NormalViewProps {
  data: Record<string, RoadmapNode[]>;
  viewCourses: (track: string) => void;
}

const NormalView: React.FC<NormalViewProps> = ({ data, viewCourses }) => {
  return (
    <div className="space-y-6">
      {Object.entries(data).map(([track, nodes]) =>
        nodes.map((node) => (
          <div
            key={node.id}
            className="p-4 border rounded-lg shadow-md bg-white mb-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                {node.label}
              </h3>
              {node.completed && (
                <span className="text-sm text-green-600 font-medium">
                  Completed
                </span>
              )}
            </div>
            {node.description && (
              <p className="text-sm text-gray-600 mb-3">{node.description}</p>
            )}

            <button
              onClick={() => viewCourses(node.track || "defaultTrack")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition duration-300"
            >
              View Courses
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default NormalView;
