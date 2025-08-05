import { useTraining } from "@/hooks/useTraining";
import type { ExerciseType } from "./ExerciseItem";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Exercise } from "@/types/training";

interface AddExerciseFormElements extends HTMLFormControlsCollection {
  exerciseName: HTMLInputElement;
  repetitions: HTMLInputElement;
  weight: HTMLInputElement;
}

interface AddExerciseForm extends HTMLFormElement {
  elements: AddExerciseFormElements;
}

const AddExercise = ({
  onAddExercise,
}: {
  onAddExercise: (item: ExerciseType) => void;
}) => {
  const { addExercise, data, startNewTraining, addSetToExercise } =
    useTraining();
  const [trainingId, setTrainingId] = useLocalStorage("activeTrainingId", "");

  const handleAddExercise = (event: React.FormEvent<AddExerciseForm>): void => {
    event.preventDefault();

    const form = event.currentTarget.elements;
    const exerciseName = form.exerciseName.value;
    const repetitions = form.repetitions.value;
    const weight = form.weight.value;
    const id = Math.random().toString(36).substring(2, 15);

    const newExercise = {
      id,
      exerciseName,
      repetitions: parseInt(repetitions),
      weight: parseFloat(weight),
    };

    console.log("New Exercise Added:", newExercise);

    // TODO: temporary
    if (!data.trainings.length || !trainingId || trainingId === "") {
      const newTrainingId = startNewTraining();
      setTrainingId(newTrainingId);
    }

    const newExercise2: Exercise = {
      exerciseName,
      repetitions: [
        { repetitions: parseInt(repetitions), weight: parseFloat(weight) },
      ],
    };

    const activeTraining = data.trainings.find(
      (training) => training.id === trainingId
    );

    const isExistingExercise = activeTraining?.exercises.some(
      (exercise) => exercise.exerciseName === newExercise2.exerciseName
    );

    if (isExistingExercise) {
      addSetToExercise(
        trainingId,
        newExercise2.exerciseName,
        newExercise2.repetitions[0]
      );
    } else {
      addExercise(trainingId, newExercise2);
    }

    onAddExercise(newExercise);
  };

  return (
    <Card>
      <form onSubmit={handleAddExercise} className="flex flex-col gap-4 px-10">
        <Input type="text" name="exerciseName" placeholder="Nazwa ćwiczenia" />

        <Input
          type="number"
          name="repetitions"
          min={0}
          placeholder="Ilość powtórzeń"
        />

        <Input type="number" name="weight" min={0} placeholder="Ciężar w Kg" />
        <Button type="submit" variant="default">
          Dodaj ćwiczenie
        </Button>
      </form>
    </Card>
  );
};

export default AddExercise;
