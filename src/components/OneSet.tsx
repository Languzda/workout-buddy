import { useTrainingStore } from '@/stores/trainingStore';
import { Button } from './ui/button';
import {
  isTimeBasedSet,
  type TimeBasedSet,
  type WeightBasedSet,
  type WorkoutSet,
} from '@/types/training';

interface OneSetProps {
  index: number;
  set: WorkoutSet;
}

const WBSet = ({ index, set }: { index: number; set: WeightBasedSet }) => {
  return (
    <span>
      Set {index + 1}: {set.repetitions} reps
      {set.weight > 0 && ` | ${set.weight} Kg`}
    </span>
  );
};

const TBSet = ({ index, set }: { index: number; set: TimeBasedSet }) => {
  return (
    <span>
      Set {index + 1}: {set.duration} sec{' '}
      {set.distance && set.distance > 0 && ` | ${set.distance} m`}
    </span>
  );
};

const OneSet = ({ index, set }: OneSetProps) => {
  const { removeSet } = useTrainingStore();

  const handleDeleteSet = () => {
    removeSet(set.id);
  };

  return (
    <li className="flex items-center justify-between">
      {isTimeBasedSet(set) ? (
        <TBSet index={index} set={set as TimeBasedSet} />
      ) : (
        <WBSet index={index} set={set as WeightBasedSet} />
      )}
      <Button
        variant="outline"
        size="sm"
        className="ml-2 text-red-600 font-bold"
        onClick={handleDeleteSet}
      >
        X
      </Button>
    </li>
  );
};

export default OneSet;
