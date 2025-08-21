import type {
  Exercise,
  IExerciseStats,
  PersonalRecord,
  TimeBasedSet,
  WeightBasedSet,
} from '@/types/training';
import type { TrainingState } from '../trainingStoreTypes';

export interface UpdateExerciseStatsParams {
  exercise: Exercise;
  trainingId: string;
  trainingDate: string;
}

export interface StatisticsActions {
  getExerciseStats: (exerciseName: string) => IExerciseStats | null;
  getLastMaxWeight: (exerciseName: string) => number | null;
  getPersonalRecord: (exerciseName: string) => PersonalRecord | null;
  updateExerciseStats: (data: UpdateExerciseStatsParams) => void;
  updateStatsAfterTrainingCompletion: (trainingId: string) => void;
  refreshAllExerciseStats: () => void;
  getStoredExerciseStats: (exerciseName: string) => IExerciseStats | null;
}

export const createStatisticsActions = (
  set: (fn: (state: TrainingState) => void) => void,
  get: () => TrainingState,
) => ({
  getExerciseStats: (exerciseName: string): IExerciseStats | null => {
    const { exerciseStats } = get();

    const exerciseNameCleaned = exerciseName.toLowerCase().trim();

    const exerciseStat = exerciseStats.find(
      (stat) => stat.exerciseName.toLowerCase() === exerciseNameCleaned,
    );

    return exerciseStat ?? null;
  },

  // TODO: implement this function to return max duration for the exercise
  getLastMaxWeight: (exerciseName: string): number | null => {
    const { exerciseStats } = get();

    const exerciseNameCleaned = exerciseName.toLowerCase().trim();
    const exerciseStat = exerciseStats.find(
      (stat) => stat.exerciseName.toLowerCase() === exerciseNameCleaned,
    );
    return exerciseStat?.lastMaxWeight ?? null;
  },

  getPersonalRecord: (exerciseName: string): PersonalRecord | null => {
    const stats = get().getExerciseStats(exerciseName);
    return stats?.personalRecord || null;
  },

  updateExerciseStats: ({
    exercise,
    trainingDate,
    trainingId,
  }: UpdateExerciseStatsParams): void => {
    set((state: TrainingState) => {
      const exerciseName = exercise.exerciseName.toLowerCase().trim();
      let stats = state.exerciseStats.find(
        (stat) => stat.exerciseName.toLowerCase() === exerciseName,
      );

      if (!stats) {
        stats = {
          exerciseName,
          lastMaxWeight: undefined,
          lastMaxDuration: undefined,
          lastTrainingDate: trainingDate,
          personalRecord: undefined,
          type: exercise.type,
        };
        state.exerciseStats.push(stats);
      }

      if (exercise.type === 'weight_based') {
        // Update last max weight and duration
        const weightSets = exercise.sets as WeightBasedSet[];
        const currentWeight = Math.max(...weightSets.map((set) => set.weight));

        stats.lastMaxWeight = currentWeight;

        // Update personal record if applicable
        if (
          !stats.personalRecord ||
          currentWeight > stats.personalRecord.value
        ) {
          stats.personalRecord = {
            value: currentWeight,
            date: trainingDate,
            trainingId: trainingId,
          };
        }
      } else if (exercise.type === 'time_based') {
        const timeSets = exercise.sets as TimeBasedSet[];
        const currentDuration = Math.max(
          ...timeSets.map((set) => set.duration),
        );

        stats.lastMaxDuration = currentDuration;

        // Update personal record if applicable
        if (
          !stats.personalRecord ||
          currentDuration > stats.personalRecord.value
        ) {
          stats.personalRecord = {
            value: currentDuration,
            date: trainingDate,
            trainingId: trainingId,
          };
        }
      }
    });
  },

  updateStatsAfterTrainingCompletion: (trainingId: string): void => {
    const { trainings } = get();
    const training = trainings.find((t) => t.id === trainingId);

    if (!training) return;

    for (const exercise of training.exercises) {
      get().updateExerciseStats({
        exercise,
        trainingId,
        trainingDate: training.date,
      });
    }
  },

  // refreshAllExerciseStats: (): void => {},
});
