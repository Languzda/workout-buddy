import { type LoaderFunctionArgs, useLoaderData } from 'react-router';

export interface SingleTrainingParams {
  id: string;
}

export const SingleTrainingLoader = async ({
  params,
}: LoaderFunctionArgs<SingleTrainingParams>): Promise<{ id: string }> => {
  return { id: params.id };
};

const SingleTraining = () => {
  const data = useLoaderData();
  return <h1>Training Id: {data.id}</h1>;
};

export default SingleTraining;
