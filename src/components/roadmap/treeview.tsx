"use client";

import React, { useEffect, useState } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from "react-flow-renderer";

// RoadmapNode type definition
export interface RoadmapNode {
  id: number;
  label: string;
  description?: string;
  completed: boolean;
  order_index: number;
  track: string;
  children?: RoadmapNode[];
  onViewCourses?: (track: string) => void;
}

// Props for the TreeViewFlow component
interface TreeViewFlowProps {
  data: RoadmapNode[];
  viewCourses: (track: string) => void;
}

// Helper function to generate React Flow nodes and edges from the roadmap data.
const generateFlowElements = (
  data: RoadmapNode[]
): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Recursive traversal function:
  const traverse = (nodesData: RoadmapNode[], parentId?: string, level = 0) => {
    nodesData.forEach((node, index) => {
      const nodeId = node.id.toString();
      // Position calculation – adjust 'x' and 'y' as needed for your layout.
      const position = {
        x: level * 250 + 50,
        y: index * 120 + 50,
      };

      nodes.push({
        id: nodeId,
        data: {
          label: node.label,
          description: node.description,
          completed: node.completed,
          track: node.track,
          onViewCourses: node.onViewCourses,
        },
        position,
      });

      // If there's a parent, create an edge from the parent to this node.
      if (parentId) {
        edges.push({
          id: `e-${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          animated: false,
          // You can also define style here if you want to override default settings.
          style: { stroke: "#333", strokeWidth: 2 },
        });
      }

      // Recursively process children if available.
      if (node.children && node.children.length > 0) {
        traverse(node.children, nodeId, level + 1);
      }
    });
  };

  traverse(data);
  return { nodes, edges };
};

// Custom node renderer for React Flow.
const CustomNode: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="p-3 border rounded bg-white shadow-sm">
      <h4
        className={`text-md font-bold ${
          data.completed ? "text-green-600" : "text-gray-800"
        }`}
      >
        {data.label}
      </h4>
      {data.description && (
        <p className="text-xs text-gray-600 mt-1">{data.description}</p>
      )}
      <button
        onClick={() => data.onViewCourses && data.onViewCourses(data.track)}
        className="mt-2 text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        View Courses
      </button>
    </div>
  );
};

// Register custom node type.
const nodeTypes = {
  custom: CustomNode,
};

const TreeViewFlow: React.FC<TreeViewFlowProps> = ({ data, viewCourses }) => {
  const [flowElements, setFlowElements] = useState<{
    nodes: Node[];
    edges: Edge[];
  }>({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    // Recursively add the viewCourses callback to each roadmap node.
    const addCallbacks = (nodesData: RoadmapNode[]): RoadmapNode[] =>
      nodesData.map((node) => ({
        ...node,
        onViewCourses: viewCourses,
        children: node.children ? addCallbacks(node.children) : [],
      }));

    const dataWithCallbacks = addCallbacks(data);
    setFlowElements(generateFlowElements(dataWithCallbacks));
  }, [data, viewCourses]);

  return (
    <div style={{ height: 600, border: "1px solid #e5e7eb" }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={flowElements.nodes}
          edges={flowElements.edges}
          nodeTypes={nodeTypes}
          fitView
          defaultEdgeOptions={{
            type: "smoothstep",
            style: { stroke: "#333", strokeWidth: 2 },
          }}
        />
      </ReactFlowProvider>
    </div>
  );
};

export default TreeViewFlow;
