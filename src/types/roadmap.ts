export type RoadmapNode = {
  id: number;
  label: string;
  description?: string; // Optional description for the node
  completed: boolean;
  progress?: number; // Optional progress percentage
  children?: RoadmapNode[];
};
