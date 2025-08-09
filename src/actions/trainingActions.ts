import type { ActionFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import { useTrainingStore } from '../stores/trainingStore';
import type { Exercise, WorkoutSet } from '../types/training';

export const createTrainingAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  if (intent === 'start-new-training') {
    const newTrainingId = useTrainingStore.getState().startNewTraining();
    return redirect(`/trainings/${newTrainingId}`);
  }

  return null;
};

export const trainingAction = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  const trainingId = params.id as string;
  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  switch (intent) {
    case 'add-exercise': {
      const exerciseName = formData.get('exerciseName') as string;
      if (!exerciseName) {
        throw new Error('Exercise name is required');
      }

      const newExercise: Exercise = {
        exerciseName,
        repetitions: [],
      };

      useTrainingStore.getState().addExercise(trainingId, newExercise);
      return { success: true, action: 'add-exercise' };
    }

    case 'add-set': {
      const exerciseName = formData.get('exerciseName') as string;
      const repetitions = parseInt(formData.get('repetitions') as string);
      const weight = parseFloat(formData.get('weight') as string);

      if (!exerciseName || isNaN(repetitions) || isNaN(weight)) {
        throw new Error('All fields are required for adding a set');
      }

      const newSet: WorkoutSet = { repetitions, weight };
      useTrainingStore
        .getState()
        .addSetToExercise(trainingId, exerciseName, newSet);
      return { success: true, action: 'add-set' };
    }

    case 'delete-training': {
      useTrainingStore.getState().removeTraining(trainingId);
      return redirect('/trainings');
    }

    default:
      throw new Error(`Unknown intent: ${intent}`);
  }
};
