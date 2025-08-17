import { ExerciseType, type IExerciseStats } from '@/types/training';
import { formatDuration } from '@/utils/exerciseHelpers';
import { useState } from 'react';

export interface ExerciseStatsProps {
  stats: IExerciseStats;
}

const ExerciseStats = ({ stats }: ExerciseStatsProps) => {
  const [showStats, setShowStats] = useState(false);

  return (
    <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
      <button
        onClick={() => setShowStats(!showStats)}
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Statystyki ćwiczenia {showStats ? '▼' : '▶'}
      </button>

      {showStats && (
        <div className="mt-2">
          {stats.lastMaxWeight && (
            <p>Ostatnia max waga: {stats.lastMaxWeight} kg</p>
          )}
          {stats.lastMaxDuration && (
            <p>Ostatni max czas: {formatDuration(stats.lastMaxDuration)}</p>
          )}
          {stats.personalRecord && (
            <p>
              Rekord osobisty: {stats.personalRecord.value}
              {stats.type === ExerciseType.WEIGHT_BASED ? ' kg' : 's'}(
              {new Date(stats.personalRecord.date).toLocaleDateString()})
            </p>
          )}
          {stats.lastTrainingDate && (
            <p>
              Ostatnio: {new Date(stats.lastTrainingDate).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExerciseStats;
