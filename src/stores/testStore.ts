import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { TrainingState } from './trainingStoreTypes';
import { createTrainingActions } from './actions/trainingActions';
import { createExerciseActions } from './actions/exerciseActions';
import { createStatisticsActions } from './actions/statisticsActions';
import { createUtilityActions } from './actions/utilityActions';

export const useTrainingStore = create<TrainingState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      trainings: [],
      activeTrainingId: '',
      exerciseStats: [],

      // Combine all actions
      ...createTrainingActions(set, get),
      ...createExerciseActions(set, get),
      ...createStatisticsActions(set, get),
      ...createUtilityActions(set, get),
    })),
    {
      name: 'test-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        trainings: state.trainings,
        activeTrainingId: state.activeTrainingId,
        exerciseStats: state.exerciseStats,
      }),
    },
  ),
);

// Re-export types for convenience
export type { TrainingState } from './trainingStoreTypes';
