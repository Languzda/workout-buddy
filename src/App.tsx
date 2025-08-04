import { useState } from "react";
import "./App.css";
import AddExercise from "./components/AddExercise";
import type { Exercise } from "./components/ExerciseItem";
import ExercisesList from "./components/ExercisesList";

function App() {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const addExercise = (exercise: Exercise) => {
    setExercises((prevExercises) => [...prevExercises, exercise]);
  };

  return (
    <div>
      <h1>Welcome to the Exercise Tracker</h1>
      <AddExercise onAddExercise={addExercise} />
      <ExercisesList exercises={exercises} />
    </div>
  );
}

export default App;
