import { useTraining } from '@/hooks/useTraining.ts';
import type { Training } from '@/types/training.ts';
import { Card, CardTitle } from '@/components/ui/card.tsx';
import { Link } from 'react-router';

const TrainingList = () => {
  const { data } = useTraining();

  const trainings = data?.trainings;

  return (
    <ul className="w-90 flex flex-col gap-4">
      {trainings?.map((item: Training) => (
        <li key={item.id}>
          <TrainingItem training={item} />
        </li>
      ))}
    </ul>
  );
};

const TrainingItem = ({ training }: { training: Training }) => {
  return (
    <Card>
      <CardTitle className="text-center">
        <Link to={`/trainings/${training.id}`}>
          Training Data: {new Date(training.date).toLocaleString()}
        </Link>
      </CardTitle>
    </Card>
  );
};

export default TrainingList;
