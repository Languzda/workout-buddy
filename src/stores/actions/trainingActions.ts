import type { Training } from '@/types/training';
import type { TrainingState } from '../trainingStoreTypes';

export const createTrainingActions = (
  set: (fn: (state: TrainingState) => void) => void,
  get: () => TrainingState,
) => ({
  setTrainings: (trainings: Training[]) =>
    set((state: TrainingState) => {
      state.trainings = trainings;
    }),

  addTraining: (training: Training) =>
    set((state: TrainingState) => {
      state.trainings.push(training);
    }),

  updateTraining: (updatedTraining: Training) =>
    set((state: TrainingState) => {
      const index = state.trainings.findIndex(
        (t: Training) => t.id === updatedTraining.id,
      );
      if (index !== -1) {
        state.trainings[index] = updatedTraining;
      }
    }),

  removeTraining: (id: string) =>
    set((state: TrainingState) => {
      state.trainings = state.trainings.filter((t: Training) => t.id !== id);
      if (state.activeTrainingId === id) {
        state.activeTrainingId = '';
      }
    }),

  setActiveTraining: (id: string) =>
    set((state: TrainingState) => {
      state.activeTrainingId = id;
    }),

  startNewTraining: (): string => {
    const newTraining: Training = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      exercises: [],
      completed: false,
    };

    let lastTrainingId: string | null = null;

    set((state: TrainingState) => {
      const lastTraining = state.trainings.at(-1);
      console.log(
        `Completing last training training Action 11: ${lastTraining}`,
      );
      if (lastTraining && !lastTraining.completed) {
        lastTraining.completed = true;
        lastTrainingId = lastTraining.id;
        console.log(
          `Completing last training training Action: ${lastTraining.id}`,
        );
      }
      state.trainings.push(newTraining);
      state.activeTrainingId = newTraining.id;
    });

    // Call updateStatsAfterTrainingCompletion AFTER the set() has completed
    if (lastTrainingId) {
      get().updateStatsAfterTrainingCompletion(lastTrainingId);
    }

    return newTraining.id;
  },

  getActiveTraining: (): Training | null => {
    const { trainings, activeTrainingId } = get();
    return trainings.find((t: Training) => t.id === activeTrainingId) || null;
  },
});
