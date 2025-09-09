import { BsBookHalf } from 'react-icons/bs';
import { Badge, Progress } from '@mantine/core';

export default function StatsCard({ title, current, total, onContinue }) {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div
      className="bg-white shadow rounded-2xl p-6 border border-gray-200 lexend mt-5 cursor-pointer"
      onClick={onContinue}
    >
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="bg-[#C6E7FF] text-[#0367B0] rounded-full w-16 h-16 flex items-center justify-center">
          <BsBookHalf size={32} stroke={1.5} />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-center lexend text-lg font-bold text-gray-800">
        Bài tập đang làm
      </h2>

      {/* Progress */}
      <div className="flex justify-between text-gray-500 text-sm mt-4">
        <span>{title}</span>
        <span>{Math.round(progress)}%</span>
      </div>

      {/* Mantine Progress phải bọc trong div và dùng style */}
      <div className="lexend" style={{ marginTop: '8px' }}>
        <Progress
          value={progress}
          color={progress > 66 ? 'green' : progress > 33 ? 'yellow' : 'red'}
          size="lg"
          radius="xl"
        />
      </div>

      {/* Stats */}
      <div className="flex lexend justify-between items-center mt-4">
        <p className="text-sm text-gray-800">
          {current} / {total}
        </p>
        <Badge color="#0367B0" size="sm">còn {total - current} câu</Badge>
      </div>
    </div>
  );
}
