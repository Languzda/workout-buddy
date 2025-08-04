import styles from "./AddExercise.module.css";
import type { Exercise } from "./ExerciseItem";

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
  onAddExercise: (item: Exercise) => void;
}) => {
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

    onAddExercise(newExercise);
  };

  return (
    <form onSubmit={handleAddExercise} className={styles.addExercise}>
      <label htmlFor="exerciseName">Nazwa ćwiczenia:</label>
      <input type="text" name="exerciseName" />
      <label htmlFor="repetitions">Ilość powtórzeń:</label>
      <input
        type="number"
        name="repetitions"
        min={0}
        placeholder="Repetitions"
      />
      <label htmlFor="weight">Ciężar:</label>
      <input type="number" name="weight" min={0} placeholder="KG" />
      <input type="submit" value="Dodaj ćwiczenie" />
    </form>
  );
};

export default AddExercise;
