import './App.css';
import EnhancedAddExercise from '@/components/EnhancedAddExercise';
import TrainingComponent from '@/components/Training.tsx';
import { useTraining } from '@/hooks/useTraining.ts';

function App() {
  const { getActiveTraining } = useTraining();

  const activeTraining = getActiveTraining();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Witaj w Workout Buddy
        </h1>
        <p className="text-muted-foreground">
          Zarządzaj swoimi treningami i ćwiczeniami
        </p>
      </div>

      <EnhancedAddExercise />

      {activeTraining ? (
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Aktywny trening
          </h2>
          <TrainingComponent training={activeTraining} />
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          <p>
            Brak aktywnego treningu. Dodaj ćwiczenie, aby rozpocząć nowy
            trening.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
