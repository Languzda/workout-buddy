import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Training, Exercise, WorkoutSet } from '../types/training';

export interface TrainingState {
  // Data
  trainings: Training[];
  activeTrainingId: string;

  // Actions
  setTrainings: (trainings: Training[]) => void;
  addTraining: (training: Training) => void;
  updateTraining: (training: Training) => void;
  removeTraining: (id: string) => void;

  // Exercise actions
  addExercise: (trainingId: string, exercise: Exercise) => void;
  updateExercise: (trainingId: string, updatedExercise: Exercise) => void;
  removeExercise: (trainingId: string, exerciseName: string) => void;

  // Set actions
  addSetToExercise: (
    trainingId: string,
    exerciseName: string,
    newSet: WorkoutSet,
  ) => void;
  updateSet: (
    trainingId: string,
    exerciseName: string,
    setIndex: number,
    updatedSet: WorkoutSet,
  ) => void;
  removeSet: (
    trainingId: string,
    exerciseName: string,
    setIndex: number,
  ) => void;

  // Active training actions
  setActiveTraining: (id: string) => void;
  startNewTraining: () => string;
  getActiveTraining: () => Training | null;

  // Utility actions
  clearAllTrainings: () => void;
  syncFromLocalStorage: () => void;
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      trainings: [],
      activeTrainingId: '',

      // Basic training operations
      setTrainings: (trainings) =>
        set((state) => {
          state.trainings = trainings;
        }),

      addTraining: (training) =>
        set((state) => {
          state.trainings.push(training);
        }),

      updateTraining: (updatedTraining) =>
        set((state) => {
          const index = state.trainings.findIndex(
            (t: Training) => t.id === updatedTraining.id,
          );
          if (index !== -1) {
            state.trainings[index] = updatedTraining;
          }
        }),

      removeTraining: (id) =>
        set((state) => {
          state.trainings = state.trainings.filter(
            (t: Training) => t.id !== id,
          );
          // Clear active training if it's the one being removed
          if (state.activeTrainingId === id) {
            state.activeTrainingId = '';
          }
        }),

      // Exercise operations
      addExercise: (trainingId, exercise) =>
        set((state) => {
          const training = state.trainings.find(
            (t: Training) => t.id === trainingId,
          );
          if (training) {
            training.exercises.push(exercise);
          }
        }),

      updateExercise: (trainingId, updatedExercise) =>
        set((state) => {
          const training = state.trainings.find(
            (t: Training) => t.id === trainingId,
          );
          if (training) {
            const exerciseIndex = training.exercises.findIndex(
              (e: Exercise) => e.exerciseName === updatedExercise.exerciseName,
            );
            if (exerciseIndex !== -1) {
              training.exercises[exerciseIndex] = updatedExercise;
            }
          }
        }),

      removeExercise: (trainingId, exerciseName) =>
        set((state) => {
          const training = state.trainings.find(
            (t: Training) => t.id === trainingId,
          );
          if (training) {
            training.exercises = training.exercises.filter(
              (e: Exercise) => e.exerciseName !== exerciseName,
            );
          }
        }),

      // Set operations
      addSetToExercise: (trainingId, exerciseName, newSet) =>
        set((state) => {
          const training = state.trainings.find(
            (t: Training) => t.id === trainingId,
          );
          if (training) {
            const exercise = training.exercises.find(
              (e: Exercise) => e.exerciseName === exerciseName,
            );
            if (exercise) {
              exercise.repetitions.push(newSet);
            }
          }
        }),

      updateSet: (trainingId, exerciseName, setIndex, updatedSet) =>
        set((state) => {
          const training = state.trainings.find(
            (t: Training) => t.id === trainingId,
          );
          if (training) {
            const exercise = training.exercises.find(
              (e: Exercise) => e.exerciseName === exerciseName,
            );
            if (exercise && exercise.repetitions[setIndex]) {
              exercise.repetitions[setIndex] = updatedSet;
            }
          }
        }),

      removeSet: (trainingId, exerciseName, setIndex) =>
        set((state) => {
          const training = state.trainings.find(
            (t: Training) => t.id === trainingId,
          );
          if (training) {
            const exercise = training.exercises.find(
              (e: Exercise) => e.exerciseName === exerciseName,
            );
            if (exercise) {
              exercise.repetitions.splice(setIndex, 1);
            }
          }
        }),

      // Active training operations
      setActiveTraining: (id) =>
        set((state) => {
          state.activeTrainingId = id;
        }),

      startNewTraining: () => {
        const newTraining: Training = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          exercises: [],
        };

        set((state) => {
          state.trainings.push(newTraining);
          state.activeTrainingId = newTraining.id;
        });

        return newTraining.id;
      },

      getActiveTraining: () => {
        const { trainings, activeTrainingId } = get();
        return (
          trainings.find((t: Training) => t.id === activeTrainingId) || null
        );
      },

      // Utility operations
      clearAllTrainings: () =>
        set((state) => {
          state.trainings = [];
          state.activeTrainingId = '';
        }),

      syncFromLocalStorage: () => {
        // This will be handled by persist middleware
        // But we can add custom logic here if needed
      },
    })),
    {
      name: 'training-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        trainings: state.trainings,
        activeTrainingId: state.activeTrainingId,
      }),
    },
  ),
);
