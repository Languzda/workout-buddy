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
  startNewTraining: () => string;
  removeSet: (
    trainingId: string,
    exerciseName: string,
    setIndex: number
  ) => void;
  startTraining: (id: string) => void;
  getActiveTrainingId: () => string;
};

const TrainingContext = createContext<TrainingContextType | undefined>(
  undefined
);

export const TrainingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useLocalStorage<TrainingData>("daneTreningowe", {
    trainings: [],
  });
  const [activeTrainingId, setActiveTrainingId] = useLocalStorage<string>(
    "activeTrainingId",
    ""
  );

  const getActiveTrainingId = () => {
    return activeTrainingId;
  };

  const startTraining = (id: string) => {
    setActiveTrainingId(id);
  };

  const addTraining = (training: Training) => {
    setData((prev) => ({
      trainings: [...prev.trainings, training],
    }));
  };

  const startNewTraining = () => {
    const newTraining: Training = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      exercises: [],
    };

    setData((prev) => ({
      trainings: [...prev.trainings, newTraining],
    }));

    startTraining(newTraining.id);

    return newTraining.id;
  };

  const addSetToExercise = (
    trainingId: string,
    exerciseName: string,
    newSet: WorkoutSet
  ) => {
    setData((prev) => ({
      trainings: prev.trainings.map((t) => {
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
      trainings: prev.trainings.map((t) => {
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
      trainings: prev.trainings.map((t) => {
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
      trainings: prev.trainings.map((t) => {
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
      trainings: prev.trainings.map((t) => {
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
      trainings: prev.trainings.filter((t) => t.id !== id),
    }));
  };

  const editTraining = (updated: Training) => {
    setData((prev) => ({
      trainings: prev.trainings.map((t) => (t.id === updated.id ? updated : t)),
    }));
  };

  const removeSet = (
    trainingId: string,
    exerciseName: string,
    setIndex: number
  ) => {
    setData((prev) => ({
      trainings: prev.trainings.map((t) => {
        if (t.id !== trainingId) return t;
        return {
          ...t,
          exercises: t.exercises.map((e) => {
            if (e.exerciseName !== exerciseName) return e;
            return {
              ...e,
              repetitions: e.repetitions.filter((_, idx) => idx !== setIndex),
            };
          }),
        };
      }),
    }));
  };

  const clearAllTrainings = () => {
    setData({ trainings: [] });
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
        removeSet,
        startNewTraining,
        startTraining,
        getActiveTrainingId,
      }}
    >
      {children}
    </TrainingContext.Provider>
  );
};

export { TrainingContext };
