import type { Exercise } from '@/types/training';
import { Button } from './ui/button';
import { useTraining } from '@/hooks/useTraining';

/**
 * Component displaying single exercise with list of sets
 * Allows removing individual sets from exercise
 */
const ExerciseItem = ({ item }: { item: Exercise }) => {
  const { removeSet, getActiveTrainingId } = useTraining();

  /**
   * Handles removing set from exercise
   * @param index - index of set to remove
   */
  const handleDeleteSet = (index: number) => {
    const activeTrainingId = getActiveTrainingId();
    if (activeTrainingId) {
      removeSet(activeTrainingId, item.exerciseName, index);
    }
  };

  return (
    <li>
      <span className="font-bold">{item.exerciseName}</span>
      <ul className="flex flex-col gap-1">
        {item.repetitions.map((set, index) => (
          <li key={index} className="flex items-center justify-between">
            <span>
              Set {index + 1}: {set.repetitions} reps
              {set.weight > 0 && ` | ${set.weight} Kg`}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="ml-2 text-red-600 font-bold"
              onClick={() => handleDeleteSet(index)}
            >
              X
            </Button>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default ExerciseItem;
