import type { Exercise } from '@/types/training';
import OneSet from './OneSet';

/**
 * Component displaying single exercise with list of sets
 * Allows removing individual sets from exercise
 */
const ExerciseItem = ({ item }: { item: Exercise }) => {
  return (
    <li>
      <span className="font-bold">{item.exerciseName}</span>
      <ul className="flex flex-col gap-1">
        {item.sets.map((set, index) => (
          <OneSet key={index} index={index} set={set} />
        ))}
      </ul>
    </li>
  );
};

export default ExerciseItem;
