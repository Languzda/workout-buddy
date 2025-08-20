import type { Training, Exercise, WorkoutSet } from '@/types/training';
import type { TrainingState } from '../trainingStoreTypes';

export const createUtilityActions = (
  set: (fn: (state: TrainingState) => void) => void,
  get: () => TrainingState,
) => ({
  clearAllTrainings: () =>
    set((state: TrainingState) => {
      state.trainings = [];
      state.activeTrainingId = '';
    }),

  findExercise: (exerciseId: string): Exercise | null => {
    const { trainings } = get();
    for (const training of trainings) {
      const exercise = training.exercises.find(
        (e: Exercise) => e.id === exerciseId,
      );
      if (exercise) return exercise;
    }
    return null;
  },

  findTrainingForExercise: (exerciseId: string): Training | null => {
    const { trainings } = get();
    for (const training of trainings) {
      const hasExercise = training.exercises.some(
        (e: Exercise) => e.id === exerciseId,
      );
      if (hasExercise) return training;
    }
    return null;
  },

  findSet: (setId: string): WorkoutSet | null => {
    const { trainings } = get();
    for (const training of trainings) {
      for (const exercise of training.exercises) {
        const set = exercise.sets.find((s: WorkoutSet) => s.id === setId);
        if (set) return set;
      }
    }
    return null;
  },
});
