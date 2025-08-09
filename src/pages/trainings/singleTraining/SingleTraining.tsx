import { type LoaderFunctionArgs, useLoaderData } from 'react-router';
import { useTraining } from '@/hooks/useTraining.ts';
import Training from '@/components/Training.tsx';

export interface SingleTrainingParams {
  id: string;
}

export const SingleTrainingLoader = async ({
  params,
}: LoaderFunctionArgs<SingleTrainingParams>): Promise<{ id: string }> => {
  return { id: params.id };
};

const SingleTraining = () => {
  const loaderData = useLoaderData();
  const { data } = useTraining();

  const training = data.trainings.filter((t) => t.id === loaderData.id).at(0);
  return <Training training={training} />;
};

export default SingleTraining;
