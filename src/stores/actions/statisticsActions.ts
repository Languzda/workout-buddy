import type { IExerciseStats } from '@/types/training';
import { isWeightBasedSet, isTimeBasedSet } from '../../types/training';
import type { TrainingState } from '../trainingStoreTypes';

export const createStatisticsActions = (
  set: (fn: (state: TrainingState) => void) => void,
  get: () => TrainingState,
) => ({
  getExerciseStats: (exerciseName: string): IExerciseStats | null => {
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

    for (const training of trainings.slice().reverse()) {
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

  getLastMaxWeight: (
    exerciseName: string,
    excludeTrainingId?: string,
  ): number | null => {
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

      if (maxWeight > 0) break;
    }

    return maxWeight > 0 ? maxWeight : null;
  },

  getPersonalRecord: (exerciseName: string) => {
    const stats = get().getExerciseStats(exerciseName);
    return stats?.personalRecord || null;
  },

  updateExerciseStats: (exerciseName: string) =>
    set((state: TrainingState) => {
      const exerciseNameCleaned = exerciseName.toLowerCase().trim();
      const freshStats = get().getExerciseStats(exerciseName);
      if (!freshStats) return;

      const existingIndex = state.exerciseStats.findIndex(
        (stat) => stat.exerciseName === exerciseNameCleaned,
      );

      if (existingIndex !== -1) {
        state.exerciseStats[existingIndex] = freshStats;
      } else {
        state.exerciseStats.push(freshStats);
      }
    }),

  refreshAllExerciseStats: () =>
    set((state: TrainingState) => {
      const { trainings } = get();
      const uniqueExerciseNames = new Set<string>();

      trainings.forEach((training) => {
        training.exercises.forEach((exercise) => {
          uniqueExerciseNames.add(exercise.exerciseName.toLowerCase().trim());
        });
      });

      const allStats: IExerciseStats[] = [];
      uniqueExerciseNames.forEach((exerciseName) => {
        const stats = get().getExerciseStats(exerciseName);
        if (stats) {
          allStats.push(stats);
        }
      });

      state.exerciseStats = allStats;
    }),

  getStoredExerciseStats: (exerciseName: string): IExerciseStats | null => {
    const { exerciseStats } = get();
    const exerciseNameCleaned = exerciseName.toLowerCase().trim();
    return (
      exerciseStats.find((stat) => stat.exerciseName === exerciseNameCleaned) ||
      null
    );
  },
});
