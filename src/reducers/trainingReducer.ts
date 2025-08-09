import type {
  TrainingData,
  Training,
  Exercise,
  WorkoutSet,
} from '../types/training';

export type TrainingAction =
  | { type: 'SET_TRAINING_DATA'; payload: TrainingData }
  | { type: 'ADD_TRAINING'; payload: Training }
  | { type: 'UPDATE_TRAINING'; payload: Training }
  | { type: 'DELETE_TRAINING'; payload: string }
  | {
      type: 'ADD_EXERCISE';
      payload: { trainingId: string; exercise: Exercise };
    }
  | {
      type: 'UPDATE_EXERCISE';
      payload: { trainingId: string; exercise: Exercise };
    }
  | {
      type: 'DELETE_EXERCISE';
      payload: { trainingId: string; exerciseName: string };
    }
  | {
      type: 'ADD_SET';
      payload: { trainingId: string; exerciseName: string; set: WorkoutSet };
    }
  | {
      type: 'UPDATE_SET';
      payload: {
        trainingId: string;
        exerciseName: string;
        setIndex: number;
        set: WorkoutSet;
      };
    }
  | {
      type: 'DELETE_SET';
      payload: { trainingId: string; exerciseName: string; setIndex: number };
    }
  | { type: 'SET_ACTIVE_TRAINING'; payload: string }
  | { type: 'CLEAR_ALL_TRAININGS' };

export type TrainingState = {
  data: TrainingData;
  activeTrainingId: string;
};

export function trainingReducer(
  state: TrainingState,
  action: TrainingAction,
): TrainingState {
  switch (action.type) {
    case 'SET_TRAINING_DATA':
      return {
        ...state,
        data: action.payload,
      };

    case 'ADD_TRAINING':
      return {
        ...state,
        data: {
          trainings: [...state.data.trainings, action.payload],
        },
      };

    case 'UPDATE_TRAINING':
      return {
        ...state,
        data: {
          trainings: state.data.trainings.map((t) =>
            t.id === action.payload.id ? action.payload : t,
          ),
        },
      };

    case 'DELETE_TRAINING':
      return {
        ...state,
        data: {
          trainings: state.data.trainings.filter(
            (t) => t.id !== action.payload,
          ),
        },
      };

    case 'ADD_EXERCISE':
      return {
        ...state,
        data: {
          trainings: state.data.trainings.map((t) => {
            if (t.id !== action.payload.trainingId) return t;
            return {
              ...t,
              exercises: [...t.exercises, action.payload.exercise],
            };
          }),
        },
      };

    case 'UPDATE_EXERCISE':
      return {
        ...state,
        data: {
          trainings: state.data.trainings.map((t) => {
            if (t.id !== action.payload.trainingId) return t;
            return {
              ...t,
              exercises: t.exercises.map((e) =>
                e.exerciseName === action.payload.exercise.exerciseName
                  ? action.payload.exercise
                  : e,
              ),
            };
          }),
        },
      };

    case 'DELETE_EXERCISE':
      return {
        ...state,
        data: {
          trainings: state.data.trainings.map((t) => {
            if (t.id !== action.payload.trainingId) return t;
            return {
              ...t,
              exercises: t.exercises.filter(
                (e) => e.exerciseName !== action.payload.exerciseName,
              ),
            };
          }),
        },
      };

    case 'ADD_SET':
      return {
        ...state,
        data: {
          trainings: state.data.trainings.map((t) => {
            if (t.id !== action.payload.trainingId) return t;
            return {
              ...t,
              exercises: t.exercises.map((e) => {
                if (e.exerciseName !== action.payload.exerciseName) return e;
                return {
                  ...e,
                  repetitions: [...e.repetitions, action.payload.set],
                };
              }),
            };
          }),
        },
      };

    case 'UPDATE_SET':
      return {
        ...state,
        data: {
          trainings: state.data.trainings.map((t) => {
            if (t.id !== action.payload.trainingId) return t;
            return {
              ...t,
              exercises: t.exercises.map((e) => {
                if (e.exerciseName !== action.payload.exerciseName) return e;
                return {
                  ...e,
                  repetitions: e.repetitions.map((set, idx) =>
                    idx === action.payload.setIndex ? action.payload.set : set,
                  ),
                };
              }),
            };
          }),
        },
      };

    case 'DELETE_SET':
      return {
        ...state,
        data: {
          trainings: state.data.trainings.map((t) => {
            if (t.id !== action.payload.trainingId) return t;
            return {
              ...t,
              exercises: t.exercises.map((e) => {
                if (e.exerciseName !== action.payload.exerciseName) return e;
                return {
                  ...e,
                  repetitions: e.repetitions.filter(
                    (_, idx) => idx !== action.payload.setIndex,
                  ),
                };
              }),
            };
          }),
        },
      };

    case 'SET_ACTIVE_TRAINING':
      return {
        ...state,
        activeTrainingId: action.payload,
      };

    case 'CLEAR_ALL_TRAININGS':
      return {
        ...state,
        data: { trainings: [] },
      };

    default:
      return state;
  }
}
