import { useState } from "react";
import "./App.css";
import AddExercise from "./components/AddExercise";
import type { ExerciseType } from "./components/ExerciseItem";
import ExercisesList from "./components/ExercisesList";
import { useTraining } from "./hooks/useTraining";
import { useLocalStorage } from "./hooks/useLocalStorage";
import Training from "./components/Training";

function App() {
  const [exercises, setExercises] = useState<ExerciseType[]>([]);
  const [activeTrainingId, setActiveTrainingId] = useLocalStorage<
    string | null
  >("activeTrainingId", null);
  const { data } = useTraining();

  const addExercise = (exercise: ExerciseType) => {
    setExercises((prevExercises) => [...prevExercises, exercise]);
  };

  const activeTraining = data.trainings.find(
    (training) => training.id === activeTrainingId
  );

  return (
    <div>
      <h1 className="text-2xl font-bold my-10 text-center">
        Witamy w aplikacji Workout Buddy
      </h1>
      <AddExercise onAddExercise={addExercise} />
      {/* <ExercisesList exercises={exercises} /> */}
      {activeTraining && <Training training={activeTraining} />}
    </div>
  );
}

export default App;
