import React from "react";
import { RoadmapNode } from "@/types/roadmap";

interface NormalViewProps {
  data: RoadmapNode[];
}

const NormalView: React.FC<NormalViewProps> = ({ data }) => {
  const renderCards = (nodes: RoadmapNode[]) => {
    return nodes.map((node) => (
      <div
        key={node.id}
        className="p-4 border rounded-lg shadow-sm bg-white mb-4"
      >
        <div className="flex justify-between items-center">
          <h3
            className={`text-lg font-semibold ${
              node.completed ? "text-green-600" : "text-gray-800"
            }`}
          >
            {node.label}
          </h3>
          {node.completed && (
            <span className="text-sm text-green-600 font-medium">Completed</span>
          )}
        </div>
        {node.description && (
          <p className="text-gray-600 text-sm mb-4">{node.description}</p>
        )}
        {/* Progress Bar */}
        {typeof node.progress === "number" && !node.completed && (
          <div className="mb-4">
            <div className="flex justify-between items-center text-sm mb-1">
              <span>Progress</span>
              <span>{node.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full"
                style={{ width: `${node.progress}%` }}
              ></div>
            </div>
          </div>
        )}
        {/* Action Button */}
        {!node.completed && (
          <button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            {node.progress && node.progress > 0 ? "Continue Learning" : "Start Later"}
          </button>
        )}
        {node.children && (
          <div className="ml-6 mt-4">{renderCards(node.children)}</div>
        )}
      </div>
    ));
  };

  return <div>{renderCards(data)}</div>;
};

export default NormalView;
