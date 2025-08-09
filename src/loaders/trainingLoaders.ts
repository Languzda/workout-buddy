import type { LoaderFunctionArgs } from 'react-router';
import { useTrainingStore } from '../stores/trainingStore';
import type { Training } from '../types/training';

// Loader for trainings list
export const trainingsLoader = async () => {
  const { trainings } = useTrainingStore.getState();
  return { trainings };
};

// Loader for single training
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

// Loader for active training
export const activeTrainingLoader = async (): Promise<{
  training: Training | null;
  activeTrainingId: string;
}> => {
  const { getActiveTraining, activeTrainingId } = useTrainingStore.getState();
  const training = getActiveTraining();

  return {
    training,
    activeTrainingId,
  };
};
