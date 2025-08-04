import React, { createContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type {
  WorkoutSet,
  Training,
  TrainingData,
  Exercise,
} from "../types/training";

type TrainingContextType = {
  data: TrainingData;
  addTraining: (training: Training) => void;
  addSetToExercise: (
    trainingId: string,
    exerciseName: string,
    newSet: WorkoutSet
  ) => void;
  editSet: (
    trainingId: string,
    exerciseName: string,
    setIndex: number,
    updatedSet: WorkoutSet
  ) => void;
  removeTraining: (id: string) => void;
  editTraining: (updated: Training) => void;
  clearAllTrainings: () => void;
  addExercise: (trainingId: string, newExercise: Exercise) => void;
  editExercise: (trainingId: string, updatedExercise: Exercise) => void;
  removeExercise: (trainingId: string, exerciseName: string) => void;
};

const TrainingContext = createContext<TrainingContextType | undefined>(
  undefined
);

export const TrainingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useLocalStorage<TrainingData>("daneTreningowe", {
    trenings: [],
  });

  const addTraining = (training: Training) => {
    setData((prev) => ({
      trenings: [...prev.trenings, training],
    }));
  };

  const addSetToExercise = (
    trainingId: string,
    exerciseName: string,
    newSet: WorkoutSet
  ) => {
    setData((prev) => ({
      trenings: prev.trenings.map((t) => {
        if (t.id !== trainingId) return t;
        return {
          ...t,
          exercises: t.exercises.map((e) => {
            if (e.exerciseName !== exerciseName) return e;
            return {
              ...e,
              repetitions: [...e.repetitions, newSet],
            };
          }),
        };
      }),
    }));
  };

  const addExercise = (trainingId: string, newExercise: Exercise) => {
    setData((prev) => ({
      trenings: prev.trenings.map((t) => {
        if (t.id !== trainingId) return t;
        return {
          ...t,
          exercises: [...t.exercises, newExercise],
        };
      }),
    }));
  };

  const editExercise = (trainingId: string, updatedExercise: Exercise) => {
    setData((prev) => ({
      trenings: prev.trenings.map((t) => {
        if (t.id !== trainingId) return t;
        return {
          ...t,
          exercises: t.exercises.map((e) =>
            e.exerciseName === updatedExercise.exerciseName
              ? updatedExercise
              : e
          ),
        };
      }),
    }));
  };

  const removeExercise = (trainingId: string, exerciseName: string) => {
    setData((prev) => ({
      trenings: prev.trenings.map((t) => {
        if (t.id !== trainingId) return t;
        return {
          ...t,
          exercises: t.exercises.filter((e) => e.exerciseName !== exerciseName),
        };
      }),
    }));
  };

  const editSet = (
    trainingId: string,
    exerciseName: string,
    setIndex: number,
    updatedSet: WorkoutSet
  ) => {
    setData((prev) => ({
      trenings: prev.trenings.map((t) => {
        if (t.id !== trainingId) return t;
        return {
          ...t,
          exercises: t.exercises.map((e) => {
            if (e.exerciseName !== exerciseName) return e;
            return {
              ...e,
              repetitions: e.repetitions.map((set, idx) =>
                idx === setIndex ? updatedSet : set
              ),
            };
          }),
        };
      }),
    }));
  };

  const removeTraining = (id: string) => {
    setData((prev) => ({
      trenings: prev.trenings.filter((t) => t.id !== id),
    }));
  };

  const editTraining = (updated: Training) => {
    setData((prev) => ({
      trenings: prev.trenings.map((t) => (t.id === updated.id ? updated : t)),
    }));
  };

  const clearAllTrainings = () => {
    setData({ trenings: [] });
  };

  return (
    <TrainingContext.Provider
      value={{
        data,
        addTraining,
        addSetToExercise,
        editSet,
        removeTraining,
        editTraining,
        clearAllTrainings,
        addExercise,
        editExercise,
        removeExercise,
      }}
    >
      {children}
    </TrainingContext.Provider>
  );
};

export { TrainingContext };
