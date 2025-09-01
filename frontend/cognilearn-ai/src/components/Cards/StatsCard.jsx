import { IconMath } from '@tabler/icons-react';
import { Badge, Progress } from '@mantine/core';

export default function StatsCard({ current, total }) {
  const progress = (current / total) * 100;

  return (
    <div className="bg-white shadow rounded-2xl p-6 border border-gray-200 mt-5">
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center">
          <IconMath size={32} stroke={1.5} />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-center text-lg font-bold text-gray-800">Bài tập đang làm</h2>

      {/* Progress */}
      <div className="flex justify-between text-gray-500 text-sm mt-4">
        <span>Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress
        value={progress}
        className="mt-2 text-[#0367B0]"
      />

      {/* Stats */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-800">{current} / {total}</p>
        <Badge size="sm">{total - current} questions left</Badge>
      </div>
    </div>
  );
}
