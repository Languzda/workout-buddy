import type { Exercise, WorkoutSet } from '@/types/training';
import type { TrainingState } from '../trainingStoreTypes';

export const createExerciseActions = (
  set: (fn: (state: TrainingState) => void) => void,
  get: () => TrainingState,
) => ({
  addExercise: (trainingId: string, exercise: Exercise) =>
    set((state: TrainingState) => {
      const training = state.trainings.find((t) => t.id === trainingId);
      if (training) {
        training.exercises.push(exercise);
      }
    }),

  updateExercise: (updatedExercise: Exercise) =>
    set((state: TrainingState) => {
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

  removeExercise: (exerciseId: string) =>
    set((state: TrainingState) => {
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

  addSetToExercise: (exerciseId: string, newSet: WorkoutSet) =>
    set((state: TrainingState) => {
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

  updateSet: (setId: string, updatedSet: WorkoutSet) =>
    set((state: TrainingState) => {
      for (const training of state.trainings) {
        for (const exercise of training.exercises) {
          const setIndex = exercise.sets.findIndex((s) => s.id === setId);
          if (setIndex !== -1) {
            exercise.sets[setIndex] = updatedSet;
            return;
          }
        }
      }
    }),

  removeSet: (setId: string) =>
    set((state: TrainingState) => {
      for (const training of state.trainings) {
        for (const exercise of training.exercises) {
          const setIndex = exercise.sets.findIndex((s) => s.id === setId);
          if (setIndex !== -1) {
            if (exercise.sets.length === 1) {
              training.exercises = training.exercises.filter(
                (e: Exercise) => e.id !== exercise.id,
              );
            } else {
              exercise.sets.splice(setIndex, 1);
            }
            return;
          }
        }
      }
    }),
});
