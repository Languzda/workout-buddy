import { Card, CardAction, CardContent, CardTitle } from './ui/card';
import { Button } from './ui/button';
import ExerciseItem from './ExerciseItem';
import { useTraining } from '@/hooks/useTraining';
import type { Training } from '@/types/training';
export interface TrainingProps {
  training: Training;
}

const TrainingComponent = ({ training }: TrainingProps) => {
  const { removeTraining } = useTraining();
  const exercises = training.exercises;

  if (!exercises || exercises.length === 0) {
    return (
      <Card className="w-90 text-center">
        <CardTitle>Nie znaleziono ćwiczeń dla tego treningu.</CardTitle>
      </Card>
    );
  }

  const handleTrainingDelete = () => {
    removeTraining(training.id);
  };

  const trainingDateString = new Date(training.date).toLocaleString();

  return (
    <Card className="w-90 text-center">
      <CardTitle>Training {trainingDateString}</CardTitle>

      <CardContent>
        <ul className="flex flex-col gap-4">
          {exercises.map((exercise) => (
            <ExerciseItem item={exercise} key={exercise.exerciseName} />
          ))}
        </ul>
        <p className="mt-10">Total Exercises: {exercises.length}</p>
      </CardContent>
      <CardAction className="w-full px-10">
        <div className="w-full flex justify-center ">
          <Button className="btn btn-primary" onClick={handleTrainingDelete}>
            Delete Training
          </Button>
        </div>
      </CardAction>
    </Card>
  );
};

export default TrainingComponent;
