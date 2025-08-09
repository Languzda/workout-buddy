import { useTrainingStore } from '../stores/trainingStore';

export const useTraining = () => {
  const store = useTrainingStore();

  // Provide convenient access to data for backward compatibility
  return {
    ...store,
    data: { trainings: store.trainings },

    // Alias methods for backward compatibility
    editSet: store.updateSet,
    editExercise: store.updateExercise,
    editTraining: store.updateTraining,
    getActiveTrainingId: () => store.activeTrainingId,
    startTraining: store.setActiveTraining,
    syncWithLocalStorage: store.syncFromLocalStorage,
  };
};
