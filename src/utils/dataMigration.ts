import type {
  Training as NewTraining,
  Exercise as NewExercise,
} from '../types/training';
import { ExerciseType } from '../types/training';
import { isTypicallyTimeBasedExercise } from './exerciseHelpers';

// Stare typy dla celów migracji
interface OldWorkoutSet {
  repetitions: number;
  weight: number;
}

interface OldExercise {
  exerciseName: string;
  repetitions: OldWorkoutSet[];
}

interface OldTraining {
  id: string;
  date: string;
  exercises: OldExercise[];
}

/**
 * Migrates old training data structure to new enhanced structure
 * Automatically detects exercise types and converts sets appropriately
 */
export const migrateTrainingData = (
  oldTrainings: OldTraining[],
): NewTraining[] => {
  return oldTrainings.map(migrateTraining);
};

/**
 * Migrates a single training from old to new format
 */
export const migrateTraining = (oldTraining: OldTraining): NewTraining => {
  return {
    id: oldTraining.id,
    date: oldTraining.date,
    exercises: oldTraining.exercises.map(migrateExercise),
    completed: true, // Assume old trainings were completed
  };
};

/**
 * Migrates a single exercise from old to new format
 * Automatically determines if exercise should be time-based or weight-based
 */
export const migrateExercise = (oldExercise: OldExercise): NewExercise => {
  const exerciseType = determineExerciseType(oldExercise);

  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    exerciseName: oldExercise.exerciseName,
    type: exerciseType,
    sets: oldExercise.repetitions.map((oldSet, index) =>
      migrateSet(oldSet, exerciseType, index),
    ),
    createdAt: new Date().toISOString(),
  };
};

/**
 * Determines if an exercise should be time-based or weight-based
 * Uses heuristics based on exercise name and set data
 */
const determineExerciseType = (oldExercise: OldExercise): ExerciseType => {
  // Check if exercise name suggests it's time-based
  if (isTypicallyTimeBasedExercise(oldExercise.exerciseName)) {
    return ExerciseType.TIME_BASED;
  }

  // Analyze the data patterns
  const sets = oldExercise.repetitions;

  // If all weights are 0 or very low, might be bodyweight/time exercise
  const averageWeight =
    sets.reduce((sum, set) => sum + set.weight, 0) / sets.length;
  if (averageWeight < 5) {
    return ExerciseType.TIME_BASED;
  }

  // If repetitions are very high (>60), might be time-based (seconds)
  const averageReps =
    sets.reduce((sum, set) => sum + set.repetitions, 0) / sets.length;
  if (averageReps > 60) {
    return ExerciseType.TIME_BASED;
  }

  // Default to weight-based
  return ExerciseType.WEIGHT_BASED;
};

/**
 * Migrates a single set from old to new format
 */
const migrateSet = (
  oldSet: OldWorkoutSet,
  exerciseType: ExerciseType,
  index: number,
) => {
  const baseSet = {
    id:
      Date.now().toString() +
      index.toString() +
      Math.random().toString(36).substr(2, 5),
    createdAt: new Date().toISOString(),
    completed: true, // Assume old sets were completed
  };

  if (exerciseType === ExerciseType.TIME_BASED) {
    return {
      ...baseSet,
      duration: oldSet.repetitions, // Convert repetitions to seconds
      distance: oldSet.weight > 0 ? oldSet.weight : undefined, // Convert weight to distance if applicable
    };
  } else {
    return {
      ...baseSet,
      repetitions: oldSet.repetitions,
      weight: oldSet.weight,
    };
  }
};

/**
 * Checks if training data needs migration
 */
export const needsMigration = (training: unknown): boolean => {
  if (!training || typeof training !== 'object' || !('exercises' in training))
    return false;

  const trainingObj = training as { exercises: unknown[] };
  if (!Array.isArray(trainingObj.exercises)) return false;

  // Check if any exercise has old structure (repetitions array instead of sets)
  return trainingObj.exercises.some((exercise: unknown) => {
    if (typeof exercise !== 'object' || !exercise) return false;
    return 'repetitions' in exercise && !('sets' in exercise);
  });
};

/**
 * Migrates localStorage data if needed
 */
export const migrateLocalStorageData = (): void => {
  try {
    const storedData = localStorage.getItem('training-storage');
    if (!storedData) return;

    const parsed = JSON.parse(storedData);
    if (!parsed.state || !parsed.state.trainings) return;

    const trainings = parsed.state.trainings;

    // Check if any training needs migration
    const needsUpdate = trainings.some(needsMigration);

    if (needsUpdate) {
      console.log('Migrating training data to new structure...');

      const migratedTrainings = trainings.map((training: unknown) => {
        if (needsMigration(training)) {
          return migrateTraining(training as OldTraining);
        }
        return training;
      });

      parsed.state.trainings = migratedTrainings;
      localStorage.setItem('training-storage', JSON.stringify(parsed));

      console.log('Training data migration completed successfully');
    }
  } catch (error) {
    console.error('Error during training data migration:', error);
  }
};

/**
 * Call this function on app startup to ensure data is migrated
 */
export const initializeDataMigration = (): void => {
  migrateLocalStorageData();
};
