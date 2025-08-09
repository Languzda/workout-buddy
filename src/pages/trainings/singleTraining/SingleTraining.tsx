import { useLoaderData } from 'react-router';
import { useTraining } from '@/hooks/useTraining.ts';
import Training from '@/components/Training.tsx';
import type { Training as TrainingType } from '@/types/training';

const SingleTraining = () => {
  const loaderData = useLoaderData() as {
    training: TrainingType | null;
    id: string;
  };
  const { trainings } = useTraining();

  // Use loader data if available, fallback to store data
  // FIXME: Ensure loaderData is used correctly
  // This is a temporary fix, ideally we should handle the case where loaderData might not be available
  const training =
    loaderData.training || trainings.find((t) => t.id === loaderData.id);

  if (!training) {
    return <div>Training not found</div>;
  }

  return <Training training={training} />;
};

export default SingleTraining;
