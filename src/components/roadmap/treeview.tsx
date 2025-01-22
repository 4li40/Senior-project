import React from "react";
import { RoadmapNode } from "../../types/roadmap";

interface RoadmapTreeProps {
  data: RoadmapNode[];
}

const RoadmapTree: React.FC<RoadmapTreeProps> = ({ data }) => {
  return (
    <div className="flex flex-col items-center">
      {data.map((node, index) => (
        <NodeTree key={index} node={node} />
      ))}
    </div>
  );
};

interface NodeTreeProps {
  node: RoadmapNode;
}

const NodeTree: React.FC<NodeTreeProps> = ({ node }) => {
  return (
    <div className="flex flex-col items-center relative">
      {/* Node */}
      <div
        className={`flex flex-col items-center p-4 rounded-lg shadow-md ${
          node.locked ? "bg-gray-200 border border-gray-300" : "bg-blue-100 border border-blue-500"
        }`}
      >
        <h3 className="font-bold text-lg text-gray-800">{node.title}</h3>
        <p className="text-gray-600">
          {node.progress === 100 ? (
            <span className="text-green-600 font-medium">✓ Completed</span>
          ) : (
            `Step ${node.progress} of 5`
          )}
        </p>
      </div>

      {/* Render children */}
      {node.children && node.children.length > 0 && (
        <div className="flex flex-col items-center mt-4">
          {/* Connector */}
          <svg
            className="absolute top-full left-1/2 transform -translate-x-1/2"
            width="2"
            height="50"
          >
            <line x1="1" y1="0" x2="1" y2="50" stroke="#ccc" strokeWidth="2" />
          </svg>

          <div className="flex space-x-8 mt-8">
            {node.children.map((child, index) => (
              <NodeTree key={index} node={child} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapTree;
