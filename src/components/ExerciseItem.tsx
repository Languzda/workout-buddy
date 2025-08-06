import type { Exercise } from "@/types/training";
import { Button } from "./ui/button";
import { useTraining } from "@/hooks/useTraining";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const ExerciseItem = ({ item }: { item: Exercise }) => {
  const { removeSet } = useTraining();
  const [activeTrainingId, _] = useLocalStorage<string>("activeTrainingId", "");

  const handleDeleteSet = (index: number) => {
    removeSet(activeTrainingId, item.exerciseName, index);
  };

  return (
    <li>
      <span className="font-bold">{item.exerciseName}</span>
      <ul className="flex flex-col gap-1">
        {item.repetitions.map((set, index) => (
          <li key={index}>
            <span>
              Set {index + 1}: {set.repetitions} reps
              {set.weight > 0 && ` | ${set.weight} Kg`}
            </span>
            <Button
              variant="outline"
              className="ml-2"
              onClick={handleDeleteSet.bind(null, index)}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default ExerciseItem;
