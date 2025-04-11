export interface RoadmapNode {
  id: number;
  label: string;        // from step_title
  description?: string; // from step_description
  completed?: boolean;
  course_title?: string;
  track?: string;
  order_index: number;
  onToggle?: () => void;
   children?: RoadmapNode[];
  course_id?: number;
}
