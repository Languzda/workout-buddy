import type {
  TrainingData,
  Training,
  Exercise,
  WorkoutSet,
} from '../types/training';

const STORAGE_KEYS = {
  TRAININGS: 'daneTreningowe',
  ACTIVE_TRAINING: 'activeTrainingId',
} as const;

class TrainingService {
  // Metody do odczytu danych (synchroniczne - dla loaderów)
  getTrainingsData(): TrainingData {
    try {
      const json = localStorage.getItem(STORAGE_KEYS.TRAININGS);
      return json ? JSON.parse(json) : { trainings: [] };
    } catch (err) {
      console.error('Błąd odczytu trainings z localStorage:', err);
      return { trainings: [] };
    }
  }

  getTrainingById(id: string): Training | null {
    const data = this.getTrainingsData();
    return data.trainings.find((t) => t.id === id) || null;
  }

  getActiveTrainingId(): string {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_TRAINING) || '';
    } catch (err) {
      console.error('Błąd odczytu activeTrainingId z localStorage:', err);
      return '';
    }
  }

  // Metody do zapisu danych
  saveTrainingsData(data: TrainingData): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TRAININGS, JSON.stringify(data));
    } catch (err) {
      console.error('Błąd zapisu trainings do localStorage:', err);
    }
  }

  saveActiveTrainingId(id: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TRAINING, id);
    } catch (err) {
      console.error('Błąd zapisu activeTrainingId do localStorage:', err);
    }
  }

  // Metody biznesowe
  addTraining(training: Training): TrainingData {
    const data = this.getTrainingsData();
    const updatedData = {
      trainings: [...data.trainings, training],
    };
    this.saveTrainingsData(updatedData);
    return updatedData;
  }

  updateTraining(updatedTraining: Training): TrainingData {
    const data = this.getTrainingsData();
    const updatedData = {
      trainings: data.trainings.map((t) =>
        t.id === updatedTraining.id ? updatedTraining : t,
      ),
    };
    this.saveTrainingsData(updatedData);
    return updatedData;
  }

  deleteTraining(id: string): TrainingData {
    const data = this.getTrainingsData();
    const updatedData = {
      trainings: data.trainings.filter((t) => t.id !== id),
    };
    this.saveTrainingsData(updatedData);
    return updatedData;
  }

  addExerciseToTraining(trainingId: string, exercise: Exercise): TrainingData {
    const data = this.getTrainingsData();
    const updatedData = {
      trainings: data.trainings.map((t) => {
        if (t.id !== trainingId) return t;
        return {
          ...t,
          exercises: [...t.exercises, exercise],
        };
      }),
    };
    this.saveTrainingsData(updatedData);
    return updatedData;
  }

  addSetToExercise(
    trainingId: string,
    exerciseName: string,
    newSet: WorkoutSet,
  ): TrainingData {
    const data = this.getTrainingsData();
    const updatedData = {
      trainings: data.trainings.map((t) => {
        if (t.id !== trainingId) return t;
        return {
          ...t,
          exercises: t.exercises.map((e) => {
            if (e.exerciseName !== exerciseName) return e;
            return {
              ...e,
              repetitions: [...e.repetitions, newSet],
            };
          }),
        };
      }),
    };
    this.saveTrainingsData(updatedData);
    return updatedData;
  }

  startNewTraining(): { trainingData: TrainingData; newTrainingId: string } {
    const newTraining: Training = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      exercises: [],
    };

    const updatedData = this.addTraining(newTraining);
    this.saveActiveTrainingId(newTraining.id);

    return {
      trainingData: updatedData,
      newTrainingId: newTraining.id,
    };
  }
}

// Singleton instance
export const trainingService = new TrainingService();
