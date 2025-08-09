import { useTrainingStore } from '../stores/trainingStore';

/**
 * Backward compatibility hook for useTraining
 * Provides the same interface as previous Context/Reducer implementation
 * but uses Zustand store underneath
 *
 * @returns Object containing all actions and state with additional aliases for compatibility
 */
export const useTraining = () => {
  const store = useTrainingStore();

  // Provides convenient access to data for backward compatibility
  return {
    ...store,
    data: { trainings: store.trainings },

    // Method aliases for backward compatibility
    editSet: store.updateSet,
    editExercise: store.updateExercise,
    editTraining: store.updateTraining,
    getActiveTrainingId: () => store.activeTrainingId,
    startTraining: store.setActiveTraining,
    syncWithLocalStorage: store.syncFromLocalStorage,
  };
};
