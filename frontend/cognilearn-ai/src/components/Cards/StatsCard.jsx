import { IconMath } from '@tabler/icons-react';
import { Badge, Progress } from '@mantine/core';

export default function StatsCard({ title, current, total, onContinue }) {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div
      className="bg-white shadow rounded-2xl p-6 border border-gray-200 mt-5 cursor-pointer"
      onClick={onContinue}
    >
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center">
          <IconMath size={32} stroke={1.5} />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-center text-lg font-bold text-gray-800">
        Bài tập đang làm
      </h2>

      {/* Progress */}
      <div className="flex justify-between text-gray-500 text-sm mt-4">
        <span>{title}</span>
        <span>{Math.round(progress)}%</span>
      </div>

      {/* Mantine Progress phải bọc trong div và dùng style */}
      <div style={{ marginTop: '8px' }}>
        <Progress
          value={progress}
          color={progress > 66 ? 'green' : progress > 33 ? 'yellow' : 'red'}
          size="lg"
          radius="xl"
        />
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-800">
          {current} / {total}
        </p>
        <Badge size="sm">còn {total - current} câu</Badge>
      </div>
    </div>
  );
}
