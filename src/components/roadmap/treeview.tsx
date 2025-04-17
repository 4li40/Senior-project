/* -------------------------------------------------------------------------- */
/* Tree‑view component (fixed render‑fn signature)                            */
/* -------------------------------------------------------------------------- */
"use client";

import React from "react";
import dynamic from "next/dynamic";
import { RoadmapNode } from "@/app/roadmap/page";
const Tree = dynamic(() => import("react-d3-tree"), { ssr: false });

export interface TreeViewProps {
  data: RoadmapNode[];
  viewCourses: (track: string) => void;
  onMarkComplete: (id: number, done: boolean) => Promise<void>;
}

/* helpers – unchanged ------------------------------------------------------ */
function buildTree(flat: RoadmapNode[]): RoadmapNode[] {
  const map = new Map<number, RoadmapNode>();
  const roots: RoadmapNode[] = [];
  flat.forEach((n) => map.set(n.id, { ...n, children: [] }));
  flat.forEach((n) =>
    n.parent_id && map.has(n.parent_id)
      ? map.get(n.parent_id)!.children!.push(map.get(n.id)!)
      : roots.push(map.get(n.id)!)
  );
  return roots;
}
const toD3 = (nodes: RoadmapNode[]): any[] =>
  nodes.map((n) => ({
    name: n.label,
    children: n.children ? toD3(n.children) : [],
    data: { raw: n }, // keep original node
  }));

/* component ---------------------------------------------------------------- */
export default function TreeView({
  data,
  viewCourses,
  onMarkComplete,
}: TreeViewProps) {
  const nested = buildTree(data);

  /* 1️⃣ Correct signature: receives ONE props object  */
  const renderNode = (rd3Props: any) => {
    const step: RoadmapNode = rd3Props.nodeDatum.data.raw;
    const done = step.completed;

    return (
      <g>
        <circle r={12} fill={done ? "#10b981" : "#4b5563"} />
        <foreignObject x={18} y={-22} width={260} height={90}>
          <div className="flex flex-col space-y-1">
            <p className="font-semibold text-sm">{step.label}</p>
            <p className="text-xs text-gray-500 -mt-0.5">
              Completed: {done ? "Yes" : "No"}
              <br />
              Course: {step.course_title ?? "—"}
            </p>
            <div className="flex gap-2 mt-1">
              <button
                className="px-2 py-0.5 text-xs rounded bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={(e) => {
                  e.stopPropagation();
                  viewCourses(step.track);
                }}
              >
                View&nbsp;Courses
              </button>
              <button
                className={`px-2 py-0.5 text-xs rounded ${
                  done
                    ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkComplete(step.id, !done);
                }}
              >
                {done ? "Undo" : "Mark ✓"}
              </button>
            </div>
          </div>
        </foreignObject>
      </g>
    );
  };

  return (
    <div className="w-full h-[650px] overflow-auto pl-16">
      <style>{`.link-stroke{stroke:#cbd5e1;stroke-width:2px;}`}</style>

      <Tree
        data={toD3(nested)}
        orientation="vertical"
        translate={{ x: 60, y: 60 }}
        nodeSize={{ x: 260, y: 110 }}
        separation={{ siblings: 1.5, nonSiblings: 2 }}
        zoomable={false}
        collapsible={false}
        pathClassFunc={() => "link-stroke"}
        /* 2️⃣ pass render function directly */
        renderCustomNodeElement={renderNode}
      />
    </div>
  );
}
