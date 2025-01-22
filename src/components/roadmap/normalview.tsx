import React from "react";
import { RoadmapNode } from "../../types/roadmap";
interface NormalViewProps {
  data: RoadmapNode[];
}

const NormalView: React.FC<NormalViewProps> = ({ data }) => {
  return (
    <div className="flex flex-col gap-6">
      {data.map((item) => (
        <div
          key={item.id}
          className="border border-gray-300 rounded-lg p-6 shadow-md bg-white"
        >
          <h3 className="text-lg font-semibold mb-2 flex items-center justify-between">
            {item.title}
            {item.progress === 100 && (
              <span className="text-green-600 font-medium text-sm">
                Completed
              </span>
            )}
          </h3>
          <p className="text-gray-600 mb-4">{item.description}</p>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className={`h-full rounded-full ${
                item.progress === 100
                  ? "bg-green-600"
                  : "bg-blue-600"
              }`}
              style={{ width: `${item.progress}%` }}
            ></div>
          </div>
          <div>
            {item.locked ? (
              <button
                className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
                disabled
              >
                Locked
              </button>
            ) : (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                {item.progress > 0 && item.progress < 100
                  ? "Continue Learning"
                  : "Start Learning"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NormalView;
