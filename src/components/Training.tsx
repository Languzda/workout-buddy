import type { Training } from "@/types/training";
import { Card, CardAction, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export interface TrainingProps {
  training: Training;
}

const Training = ({ training }: TrainingProps) => {
  const exercises = training.exercises;

  if (!exercises || exercises.length === 0) {
    return <div>No exercises found for this training.</div>;
  }

  return (
    <Card>
      <CardTitle>Training {training.date}</CardTitle>
      <CardContent>
        <ul className="flex flex-col gap-4">
          {exercises.map((exercise) => (
            <li key={exercise.exerciseName}>
              <p className="text-left text-xl">{exercise.exerciseName}</p>
              <ul className="text-right flex flex-col justify-end gap-2">
                {exercise.repetitions.map((set, index) => (
                  <li key={index}>
                    {set.weight} kg x {set.repetitions} reps
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="mt-10">Total Exercises: {exercises.length}</p>
      </CardContent>
      <CardAction className="flex justify-between">
        <Button className="btn btn-primary">Delete Training</Button>
        <Button className="btn btn-secondary">Edit Training</Button>
      </CardAction>
    </Card>
  );
};

export default Training;
