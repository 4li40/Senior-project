// data/dummyRoadmap.ts
import { RoadmapNode } from "../types/roadmap";

export const dummyRoadmap: RoadmapNode[] = [
  {
    id: 1,
    title: "HTML Fundamentals",
    description: "Master the basics of HTML5 and semantic markup",
    progress: 100,
    locked: false,
    children: []
  },
  {
    id: 2,
    title: "CSS & Styling",
    description: "Learn CSS fundamentals and modern layout techniques",
    progress: 45,
    locked: false,
    children: [
      {
        id: 3,
        title: "CSS Layout",
        description: "Master layouts with Flexbox & Grid",
        progress: 0,
        locked: true,
        children: []
      }
    ]
  },
  {
    id: 4,
    title: "JavaScript Basics",
    description: "Introduction to JavaScript programming",
    progress: 0,
    locked: true,
    children: []
  }
];
