export interface RoadmapNode {
  id: number;
  label: string;
  description?: string;
  completed?: boolean;
  course_title?: string;
  track?: string;
  order_index: number;
  parent_id?: number; // ✅ important for tree hierarchy
  children?: RoadmapNode[];
  course_id?: number;
}
