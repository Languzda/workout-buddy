import { useState } from "react";
import "./App.css";
import AddExercise from "./components/AddExercise";
import type { ExerciseType } from "./components/ExerciseItem";
import ExercisesList from "./components/ExercisesList";

function App() {
  const [exercises, setExercises] = useState<ExerciseType[]>([]);

  const addExercise = (exercise: ExerciseType) => {
    setExercises((prevExercises) => [...prevExercises, exercise]);
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
