import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
} from 'react';
import {
  trainingReducer,
  type TrainingState,
  type TrainingAction,
} from '../reducers/trainingReducer';
import { trainingService } from '../services/trainingService';
import type { WorkoutSet, Training, Exercise } from '../types/training';

type TrainingContextType = {
  state: TrainingState;
  dispatch: React.Dispatch<TrainingAction>;
  // Convenience methods that handle both dispatch and localStorage
  addTraining: (training: Training) => void;
  addSetToExercise: (
    trainingId: string,
    exerciseName: string,
    newSet: WorkoutSet,
  ) => void;
  editSet: (
    trainingId: string,
    exerciseName: string,
    setIndex: number,
    updatedSet: WorkoutSet,
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
    setIndex: number,
  ) => void;
  startTraining: (id: string) => void;
  getActiveTrainingId: () => string;
  // Method to sync with localStorage data (for loaders)
  syncWithLocalStorage: () => void;
};

const TrainingContext = createContext<TrainingContextType | undefined>(
  undefined,
);

export const TrainingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize state with data from localStorage
  const [state, dispatch] = useReducer(trainingReducer, undefined, () => ({
    data: trainingService.getTrainingsData(),
    activeTrainingId: trainingService.getActiveTrainingId(),
  }));

  // Use ref to track if we're initializing to avoid saving initial data back to localStorage
  const isInitializing = React.useRef(true);
  const lastSavedData = React.useRef<string>('');
  const lastSavedActiveTraining = React.useRef<string>('');

  // Sync with localStorage when state changes (but not on initial load)
  useEffect(() => {
    if (isInitializing.current) {
      isInitializing.current = false;
      lastSavedData.current = JSON.stringify(state.data);
      return;
    }

    const currentDataStr = JSON.stringify(state.data);
    if (currentDataStr !== lastSavedData.current) {
      trainingService.saveTrainingsData(state.data);
      lastSavedData.current = currentDataStr;
    }
  }, [state.data]);

  useEffect(() => {
    if (isInitializing.current) {
      lastSavedActiveTraining.current = state.activeTrainingId;
      return;
    }

    if (state.activeTrainingId !== lastSavedActiveTraining.current) {
      trainingService.saveActiveTrainingId(state.activeTrainingId);
      lastSavedActiveTraining.current = state.activeTrainingId;
    }
  }, [state.activeTrainingId]);

  // Method to sync with fresh localStorage data (useful for loaders)
  const syncWithLocalStorage = useCallback(() => {
    dispatch({
      type: 'SET_TRAINING_DATA',
      payload: trainingService.getTrainingsData(),
    });
    dispatch({
      type: 'SET_ACTIVE_TRAINING',
      payload: trainingService.getActiveTrainingId(),
    });
  }, []);

  const getActiveTrainingId = () => {
    return state.activeTrainingId;
  };

  const startTraining = (id: string) => {
    dispatch({ type: 'SET_ACTIVE_TRAINING', payload: id });
  };

  const addTraining = (training: Training) => {
    dispatch({ type: 'ADD_TRAINING', payload: training });
  };

  const startNewTraining = () => {
    const newTraining: Training = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      exercises: [],
    };

    dispatch({ type: 'ADD_TRAINING', payload: newTraining });
    dispatch({ type: 'SET_ACTIVE_TRAINING', payload: newTraining.id });

    return newTraining.id;
  };

  const addSetToExercise = (
    trainingId: string,
    exerciseName: string,
    newSet: WorkoutSet,
  ) => {
    dispatch({
      type: 'ADD_SET',
      payload: { trainingId, exerciseName, set: newSet },
    });
  };

  const addExercise = (trainingId: string, newExercise: Exercise) => {
    dispatch({
      type: 'ADD_EXERCISE',
      payload: { trainingId, exercise: newExercise },
    });
  };

  const editExercise = (trainingId: string, updatedExercise: Exercise) => {
    dispatch({
      type: 'UPDATE_EXERCISE',
      payload: { trainingId, exercise: updatedExercise },
    });
  };

  const removeExercise = (trainingId: string, exerciseName: string) => {
    dispatch({
      type: 'DELETE_EXERCISE',
      payload: { trainingId, exerciseName },
    });
  };

  const editSet = (
    trainingId: string,
    exerciseName: string,
    setIndex: number,
    updatedSet: WorkoutSet,
  ) => {
    dispatch({
      type: 'UPDATE_SET',
      payload: { trainingId, exerciseName, setIndex, set: updatedSet },
    });
  };

  const removeTraining = (id: string) => {
    dispatch({ type: 'DELETE_TRAINING', payload: id });
  };

  const editTraining = (updated: Training) => {
    dispatch({ type: 'UPDATE_TRAINING', payload: updated });
  };

  const removeSet = (
    trainingId: string,
    exerciseName: string,
    setIndex: number,
  ) => {
    dispatch({
      type: 'DELETE_SET',
      payload: { trainingId, exerciseName, setIndex },
    });
  };

  const clearAllTrainings = () => {
    dispatch({ type: 'CLEAR_ALL_TRAININGS' });
  };

  return (
    <TrainingContext.Provider
      value={{
        state,
        dispatch,
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
        syncWithLocalStorage,
      }}
    >
      {children}
    </TrainingContext.Provider>
  );
};

export { TrainingContext };
