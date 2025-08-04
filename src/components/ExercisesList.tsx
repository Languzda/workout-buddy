import ExerciseItem, { type ExerciseType } from "./ExerciseItem";

const ExercisesList = ({ exercises }: { exercises: ExerciseType[] }) => {
  return (
    <ul>
      {exercises.map((exercise) => (
        <ExerciseItem key={exercise.id} item={exercise} />
      ))}
    </ul>
  );
};

export default ExercisesList;
