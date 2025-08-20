import type {
  Training,
  Exercise,
  WorkoutSet,
  IExerciseStats,
} from '@/types/training';

export interface TrainingState {
  trainings: Training[];
  activeTrainingId: string;
  exerciseStats: IExerciseStats[];

  // Basic training operations
  setTrainings: (trainings: Training[]) => void;
  addTraining: (training: Training) => void;
  updateTraining: (training: Training) => void;
  removeTraining: (id: string) => void;

  // Exercise operations
  addExercise: (trainingId: string, exercise: Exercise) => void;
  updateExercise: (updatedExercise: Exercise) => void;
  removeExercise: (exerciseId: string) => void;

  // Exercise set operations
  addSetToExercise: (exerciseId: string, newSet: WorkoutSet) => void;
  updateSet: (setId: string, updatedSet: WorkoutSet) => void;
  removeSet: (setId: string) => void;

  // Active training management
  setActiveTraining: (id: string) => void;
  startNewTraining: () => string;
  getActiveTraining: () => Training | null;

  // Statistics methods
  getExerciseStats: (exerciseName: string) => IExerciseStats | null;
  getLastMaxWeight: (
    exerciseName: string,
    excludeTrainingId?: string,
  ) => number | null;
  getPersonalRecord: (
    exerciseName: string,
  ) => { value: number; date: string; trainingId: string } | null;

  // Exercise statistics management
  updateExerciseStats: (exerciseName: string) => void;
  refreshAllExerciseStats: () => void;
  getStoredExerciseStats: (exerciseName: string) => IExerciseStats | null;

  // Utility actions
  clearAllTrainings: () => void;

  // Helper functions
  findExercise: (exerciseId: string) => Exercise | null;
  findTrainingForExercise: (exerciseId: string) => Training | null;
  findSet: (setId: string) => WorkoutSet | null;
}
