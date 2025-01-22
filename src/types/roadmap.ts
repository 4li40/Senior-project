export interface RoadmapNode {
    id: number;
    title: string;
    description: string;
    progress: number;
    locked: boolean;
    children?: RoadmapNode[]; // Recursive type
  }
  