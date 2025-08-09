import './App.css';
import AddExercise from '@/components/AddExercise.tsx';
import TrainingComponent from '@/components/Training.tsx';
import { useTraining } from '@/hooks/useTraining.ts';

function App() {
  const { data, getActiveTrainingId } = useTraining();

  const activeTrainingId = getActiveTrainingId();
  const activeTraining = data.trainings.find(
    (training) => training.id === activeTrainingId,
  );

  return (
    <div>
      <h1 className="text-2xl font-bold my-10 text-center">
        Welcome to Workout Buddy app
      </h1>
      <AddExercise />
      {activeTraining && <TrainingComponent training={activeTraining} />}
    </div>
  );
}

export default App;
