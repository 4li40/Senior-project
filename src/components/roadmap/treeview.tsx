import React, { useState } from "react";
import { RoadmapNode } from "@/types/roadmap";

interface TreeViewProps {
  data: RoadmapNode[];
}

const TreeView: React.FC<TreeViewProps> = ({ data }) => {
  const [nodes, setNodes] = useState(data);

  const handleComplete = (nodeId: number) => {
    const updateNodes = (nodes: RoadmapNode[]): RoadmapNode[] =>
      nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, completed: true };
        }
        if (node.children) {
          return { ...node, children: updateNodes(node.children) };
        }
        return node;
      });

    setNodes(updateNodes(nodes));
  };

  const renderTree = (nodes: RoadmapNode[]) => {
    return nodes.map((node) => (
      <div key={node.id} className="relative">
        {/* Node Box */}
        <div
          className={`p-4 border rounded-md shadow-md mb-4 ${
            node.completed ? "bg-blue-500 text-white font-bold" : "bg-white"
          }`}
          style={{ minWidth: "200px", textAlign: "center" }}
        >
          <span>{node.label}</span>
          <div className="text-sm">
            {node.completed ? (
              <span>✔ Completed</span>
            ) : (
              <button
                onClick={() => handleComplete(node.id)}
                className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                Mark Complete
              </button>
            )}
          </div>
        </div>

        {/* Connecting Lines */}
        {node.children && (
          <div className="relative">
            {/* Line from Parent to Children */}
            <div className="w-0.5 h-8 bg-gray-300 mx-auto"></div>
            {/* Children Nodes */}
            <div className="flex justify-around">
              {renderTree(node.children)}
            </div>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="flex flex-col items-center space-y-4">{renderTree(nodes)}</div>
  );
};

export default TreeView;
