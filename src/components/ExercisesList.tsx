import ExerciseItem, { type Exercise } from "./ExerciseItem";

const ExercisesList = ({ exercises }: { exercises: Exercise[] }) => {
  return (
    <ul>
      {exercises.map((exercise) => (
        <ExerciseItem key={exercise.id} item={exercise} />
      ))}
    </ul>
  );
};

export default ExercisesList;
