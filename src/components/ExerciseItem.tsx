import { Card } from "./ui/card";

export interface ExerciseType {
  id: string;
  exerciseName: string;
  repetitions: number;
  weight: number;
}

const ExerciseItem = ({ item }: { item: ExerciseType }) => {
  return (
    <li>
      <Card className="p-4 flex flex-row items-center justify-between">
        <span className="font-bold">{item.exerciseName}</span>
        <span>
          {item.weight === 0 ? "" : `Weight: ${item.weight} Kg |`} Reps:{" "}
          {item.repetitions}
        </span>
      </Card>
    </li>
  );
};

export default ExerciseItem;
