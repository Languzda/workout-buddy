import type { LoaderFunctionArgs } from 'react-router';
import { useTrainingStore } from '../stores/trainingStore';
import type { Training } from '../types/training';

/**
 * Loader for loading list of all trainings
 * Uses Zustand store to get current trainings state
 * @returns Object containing list of trainings
 */
export const trainingsLoader = async () => {
  const { trainings } = useTrainingStore.getState();
  return { trainings };
};

/**
 * Loader for loading single training based on URL ID
 * Searches for training in store and returns it with ID
 * @param params - URL parameters from React Router containing training ID
 * @returns Object containing found training (or null) and ID
 */
export const singleTrainingLoader = async ({
  params,
}: LoaderFunctionArgs): Promise<{ training: Training | null; id: string }> => {
  const id = params.id as string;
  const { trainings } = useTrainingStore.getState();
  const training = trainings.find((t) => t.id === id) || null;

  return {
    training,
    id,
  };
};
