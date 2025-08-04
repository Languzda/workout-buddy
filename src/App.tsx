import { useState } from "react";
import "./App.css";
import AddExercise from "./components/AddExercise";
import type { ExerciseType } from "./components/ExerciseItem";
import ExercisesList from "./components/ExercisesList";
import { useTraining } from "./hooks/useTraining";
import type { Training } from "./types/training";

function App() {
  const [exercises, setExercises] = useState<ExerciseType[]>([]);
  const { data, addTraining } = useTraining();

  const addExercise = (exercise: ExerciseType) => {
    setExercises((prevExercises) => [...prevExercises, exercise]);

    const newTraining: Training = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      exercises: [
        {
          exerciseName: exercise.exerciseName,
          repetitions: [
            {
              repetitions: exercise.repetitions,
              weight: exercise.weight,
            },
          ],
        },
      ],
    };
    addTraining(newTraining);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold my-10 text-center">
        Witamy w aplikacji Workout Buddy
      </h1>
      <AddExercise onAddExercise={addExercise} />
      <ExercisesList exercises={exercises} />
    </div>
  );
}

export default App;
