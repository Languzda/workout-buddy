import { useTraining } from '@/hooks/useTraining.ts';
import type { Training } from '@/types/training.ts';
import { Card, CardTitle } from '@/components/ui/card.tsx';
import { Link } from 'react-router';

const TrainingList = () => {
  const { data } = useTraining();

  const trainings = data?.trainings;

  return (
    <ul>
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
      <CardTitle>
        <Link to={`/trainings/${training.id}`}>
          Training Data: {new Date(training.date).toLocaleTimeString()}
        </Link>
      </CardTitle>
    </Card>
  );
};

export default TrainingList;
