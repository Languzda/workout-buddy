export interface Exercise {
  id: string;
  exerciseName: string;
  repetitions: number;
  weight: number;
}

const ExerciseItem = ({ item }: { item: Exercise }) => {
  return (
    <li>
      {item.exerciseName} - {item.weight} Kg / {item.repetitions}
    </li>
  );
};

export default ExerciseItem;
