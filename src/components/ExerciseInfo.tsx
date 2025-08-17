import { useTraining } from '@/hooks/useTraining';
import type { Exercise } from '@/types/training';

interface ExerciseInfoProps {
  exerciseName: string;
}

const ExerciseInfo = ({ exerciseName }: ExerciseInfoProps) => {
  const { getActiveTraining } = useTraining();

  const activeTraining = getActiveTraining();
  const existingExercise = activeTraining?.exercises.find(
    (ex: Exercise) =>
      ex.exerciseName.toLowerCase() === exerciseName.toLowerCase().trim(),
  );

  return existingExercise ? (
    <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
      ✓ Seria zostanie dodana do istniejącego ćwiczenia "
      {existingExercise.exerciseName}"
    </div>
  ) : (
    <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
      + Zostanie utworzone nowe ćwiczenie "{exerciseName.trim()}"
    </div>
  );
};

export default ExerciseInfo;
