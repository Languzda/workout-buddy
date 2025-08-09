import { useTraining } from '@/hooks/useTraining';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import type { Exercise } from '@/types/training';

/**
 * TypeScript interfaces for typing exercise addition form
 */
interface AddExerciseFormElements extends HTMLFormControlsCollection {
  exerciseName: HTMLInputElement;
  repetitions: HTMLInputElement;
  weight: HTMLInputElement;
}

interface AddExerciseForm extends HTMLFormElement {
  elements: AddExerciseFormElements;
}

/**
 * Form component for adding new exercises to training
 * Handles both adding new exercises and sets to existing exercises
 */
const AddExercise = () => {
  const {
    addExercise,
    data,
    startNewTraining,
    addSetToExercise,
    getActiveTrainingId,
  } = useTraining();

  /**
   * Handles form submit - adds new exercise or set to existing exercise
   * Automatically creates new training if none is active
   *
   * @param event - form submit event
   */
  const handleAddExercise = (event: React.FormEvent<AddExerciseForm>): void => {
    event.preventDefault();

    const form = event.currentTarget.elements;
    const exerciseName = form.exerciseName.value;
    const repetitions = parseInt(form.repetitions.value);
    const weight = parseFloat(form.weight.value);

    if (!exerciseName.trim() || isNaN(repetitions) || isNaN(weight)) {
      alert('All fields are required and must be valid');
      return;
    }

    let currentTrainingId = getActiveTrainingId();

    // Create new training if no active training exists
    if (!data.trainings.length || !currentTrainingId) {
      currentTrainingId = startNewTraining();
    }

    const newExercise: Exercise = {
      exerciseName,
      repetitions: [{ repetitions, weight }],
    };

    const activeTraining = data.trainings.find(
      (training) => training.id === currentTrainingId,
    );

    const isExistingExercise = activeTraining?.exercises.some(
      (exercise) => exercise.exerciseName === newExercise.exerciseName,
    );

    if (isExistingExercise) {
      addSetToExercise(
        currentTrainingId,
        newExercise.exerciseName,
        newExercise.repetitions[0],
      );
    } else {
      addExercise(currentTrainingId, newExercise);
    }
  };

  return (
    <Card>
      <form onSubmit={handleAddExercise} className="flex flex-col gap-4 px-10">
        <Input
          type="text"
          name="exerciseName"
          placeholder="Nazwa ćwiczenia"
          required
        />

        <Input
          type="number"
          name="repetitions"
          min={1}
          placeholder="Ilość powtórzeń"
          required
        />

        <Input
          type="number"
          name="weight"
          min={0}
          step={0.5}
          placeholder="Ciężar w Kg"
          required
        />
        <Button type="submit" variant="default">
          Dodaj ćwiczenie / Serie
        </Button>
        <Button type="button" variant="secondary" onClick={startNewTraining}>
          Rozpocznij nowy trening
        </Button>
      </form>
    </Card>
  );
};

export default AddExercise;
