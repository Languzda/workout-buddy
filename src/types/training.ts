export type WorkoutSet = {
  repetitions: number;
  weight: number;
};

export type Exercise = {
  exerciseName: string;
  repetitions: WorkoutSet[];
};

export type Training = {
  id: string;
  date: string;
  exercises: Exercise[];
};

export type TrainingData = {
  trainings: Training[];
};
