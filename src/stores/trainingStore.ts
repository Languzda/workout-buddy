import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  Training,
  Exercise,
  WorkoutSet,
  IExerciseStats,
} from '../types/training';
import { isWeightBasedSet, isTimeBasedSet } from '../types/training';

/**
 * Interface defining state and actions for training management store
 * Uses Zustand with Immer middleware for immutable updates and persist for localStorage
 */
export interface TrainingState {
  trainings: Training[];
  activeTrainingId: string;

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

  // New statistics and optimization methods
  getExerciseStats: (exerciseName: string) => IExerciseStats | null;
  getLastMaxWeight: (
    exerciseName: string,
    excludeTrainingId?: string,
  ) => number | null;
  getPersonalRecord: (
    exerciseName: string,
  ) => { value: number; date: string; trainingId: string } | null;

  // Utility actions
  clearAllTrainings: () => void;

  // Helper functions for simplified API
  findExercise: (exerciseId: string) => Exercise | null;
  findTrainingForExercise: (exerciseId: string) => Training | null;
  findSet: (setId: string) => WorkoutSet | null;
}

/**
 * Main application store using Zustand with middleware:
 * - persist: automatic saving to localStorage
 * - immer: enables "mutations" that are immutable
 */
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

      updateExercise: (updatedExercise) =>
        set((state) => {
          // Znajdź trening zawierający ćwiczenie po exerciseId
          for (const training of state.trainings) {
            const exerciseIndex = training.exercises.findIndex(
              (e: Exercise) => e.id === updatedExercise.id,
            );
            if (exerciseIndex !== -1) {
              training.exercises[exerciseIndex] = updatedExercise;
              break;
            }
          }
        }),

      removeExercise: (exerciseId) =>
        set((state) => {
          // Znajdź trening zawierający ćwiczenie i usuń je
          for (const training of state.trainings) {
            const exerciseIndex = training.exercises.findIndex(
              (e: Exercise) => e.id === exerciseId,
            );
            if (exerciseIndex !== -1) {
              training.exercises.splice(exerciseIndex, 1);
              break;
            }
          }
        }),

      // Set operations
      addSetToExercise: (exerciseId, newSet) =>
        set((state) => {
          // Znajdź ćwiczenie po exerciseId w dowolnym treningu
          for (const training of state.trainings) {
            const exercise = training.exercises.find(
              (e: Exercise) => e.id === exerciseId,
            );
            if (exercise) {
              exercise.sets.push(newSet);
              break;
            }
          }
        }),

      updateSet: (setId, updatedSet) =>
        set((state) => {
          // Znajdź set po setId w dowolnym ćwiczeniu w dowolnym treningu
          for (const training of state.trainings) {
            for (const exercise of training.exercises) {
              const setIndex = exercise.sets.findIndex(
                (s: WorkoutSet) => s.id === setId,
              );
              if (setIndex !== -1) {
                exercise.sets[setIndex] = updatedSet;
                return; // Znaleziono i zaktualizowano, można wyjść
              }
            }
          }
        }),

      removeSet: (setId) =>
        set((state) => {
          // Znajdź set po setId w dowolnym ćwiczeniu w dowolnym treningu
          for (const training of state.trainings) {
            for (const exercise of training.exercises) {
              const setIndex = exercise.sets.findIndex(
                (s: WorkoutSet) => s.id === setId,
              );
              if (setIndex !== -1) {
                if (exercise.sets.length === 1) {
                  // If it's the last set, remove the exercise entirely
                  training.exercises = training.exercises.filter(
                    (e: Exercise) => e.id !== exercise.id,
                  );
                } else {
                  exercise.sets.splice(setIndex, 1);
                }
                return; // Znaleziono i usunięto, można wyjść
              }
            }
          }
        }),

      // Active training operations
      setActiveTraining: (id) =>
        set((state) => {
          state.activeTrainingId = id;
        }),

      /**
       * Creates new training and sets it as active
       * Generates unique ID based on timestamp and automatically sets current date
       * @returns ID of newly created training
       */
      startNewTraining: () => {
        const newTraining: Training = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          exercises: [],
          completed: false,
        };

        set((state) => {
          // Complete last training if exists
          const lastTraining = state.trainings.at(-1);
          if (lastTraining && !lastTraining.completed) {
            lastTraining.completed = true;
          }

          // Add new training and set as active
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

      // New statistics and optimization methods
      getExerciseStats: (exerciseName) => {
        const { trainings } = get();
        const exerciseNameCleaned = exerciseName.toLocaleLowerCase().trim();
        const allExercises = trainings.flatMap((training) =>
          training.exercises.filter(
            (ex) => ex.exerciseName.toLowerCase() === exerciseNameCleaned,
          ),
        );

        if (allExercises.length === 0) return null;

        const firstExercise = allExercises[0];
        let lastMaxWeight: number | undefined;
        let lastMaxDuration: number | undefined;
        let personalRecord:
          | { value: number; date: string; trainingId: string }
          | undefined;
        let lastTrainingDate: string | undefined;

        // Znajdź ostatni największy ciężar i rekordy
        for (const training of trainings.slice().reverse()) {
          // odwrotna kolejność - od najnowszych
          const exercise = training.exercises.find(
            (ex) => ex.exerciseName.toLowerCase() === exerciseNameCleaned,
          );
          if (!exercise) continue;

          if (!lastTrainingDate) {
            lastTrainingDate = training.date;
          }

          for (const set of exercise.sets) {
            if (isWeightBasedSet(set)) {
              const currentWeight = set.weight;
              if (!lastMaxWeight || currentWeight > lastMaxWeight) {
                lastMaxWeight = currentWeight;
              }
              if (!personalRecord || currentWeight > personalRecord.value) {
                personalRecord = {
                  value: currentWeight,
                  date: training.date,
                  trainingId: training.id,
                };
              }
            } else if (isTimeBasedSet(set)) {
              const currentDuration = set.duration;
              if (!lastMaxDuration || currentDuration > lastMaxDuration) {
                lastMaxDuration = currentDuration;
              }
              if (!personalRecord || currentDuration > personalRecord.value) {
                personalRecord = {
                  value: currentDuration,
                  date: training.date,
                  trainingId: training.id,
                };
              }
            }
          }
        }

        return {
          exerciseName: exerciseNameCleaned,
          type: firstExercise.type,
          lastMaxWeight,
          lastMaxDuration,
          lastTrainingDate,
          personalRecord,
        } as IExerciseStats;
      },

      getLastMaxWeight: (exerciseName, excludeTrainingId) => {
        const { trainings } = get();
        let maxWeight = 0;

        for (const training of trainings.slice().reverse()) {
          if (excludeTrainingId && training.id === excludeTrainingId) continue;

          const exercise = training.exercises.find(
            (ex) => ex.exerciseName === exerciseName,
          );
          if (!exercise) continue;

          for (const set of exercise.sets) {
            if (isWeightBasedSet(set) && set.weight > maxWeight) {
              maxWeight = set.weight;
            }
          }

          if (maxWeight > 0) break; // Znajdź z ostatniego treningu gdzie było to ćwiczenie
        }

        return maxWeight > 0 ? maxWeight : null;
      },

      getPersonalRecord: (exerciseName) => {
        const stats = get().getExerciseStats(exerciseName);
        return stats?.personalRecord || null;
      },

      // Utility operations
      clearAllTrainings: () =>
        set((state) => {
          state.trainings = [];
          state.activeTrainingId = '';
        }),

      // Helper functions for simplified API
      findExercise: (exerciseId) => {
        const { trainings } = get();
        for (const training of trainings) {
          const exercise = training.exercises.find(
            (e: Exercise) => e.id === exerciseId,
          );
          if (exercise) return exercise;
        }
        return null;
      },

      findTrainingForExercise: (exerciseId) => {
        const { trainings } = get();
        for (const training of trainings) {
          const hasExercise = training.exercises.some(
            (e: Exercise) => e.id === exerciseId,
          );
          if (hasExercise) return training;
        }
        return null;
      },

      findSet: (setId) => {
        const { trainings } = get();
        for (const training of trainings) {
          for (const exercise of training.exercises) {
            const set = exercise.sets.find((s: WorkoutSet) => s.id === setId);
            if (set) return set;
          }
        }
        return null;
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
