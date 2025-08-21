import type {
  Exercise,
  WorkoutSet,
  WeightBasedSet,
  TimeBasedSet,
} from '../types/training';
import { isWeightBasedSet, isTimeBasedSet } from '../types/training';

/**
 * Utility functions for working with exercises and sets
 */

/**
 * Format duration from seconds to human readable format
 * @param seconds Duration in seconds
 * @returns Formatted string like "2:30" for 2 minutes 30 seconds
 */
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Parse duration string to seconds
 * @param duration String in format "MM:SS" or number of seconds
 * @returns Duration in seconds
 */
export const parseDuration = (duration: string | number): number => {
  if (typeof duration === 'number') return duration;

  const parts = duration.split(':');
  if (parts.length === 2) {
    const minutes = parseInt(parts[0], 10) || 0;
    const seconds = parseInt(parts[1], 10) || 0;
    return minutes * 60 + seconds;
  }
  return parseInt(duration, 10) || 0;
};

/**
 * Calculate total volume for weight-based exercise
 * @param sets Array of weight-based sets
 * @returns Total volume (weight × reps)
 */
export const calculateWeightVolume = (sets: WeightBasedSet[]): number => {
  return sets.reduce((total, set) => total + set.weight * set.repetitions, 0);
};

/**
 * Calculate total time for time-based exercise
 * @param sets Array of time-based sets
 * @returns Total time in seconds
 */
export const calculateTotalTime = (sets: TimeBasedSet[]): number => {
  return sets.reduce((total, set) => total + set.duration, 0);
};

/**
 * Get exercise summary statistics
 * @param exercise Exercise object
 * @returns Summary with total sets, volume/time, and completion status
 */
export const getExerciseSummary = (exercise: Exercise) => {
  const totalSets = exercise.sets.length;
  const completedSets = exercise.sets.filter((set) => set.completed).length;

  if (exercise.type === 'weight_based') {
    const weightSets = exercise.sets.filter(isWeightBasedSet);
    const totalVolume = calculateWeightVolume(weightSets);
    const maxWeight = Math.max(...weightSets.map((set) => set.weight));

    return {
      totalSets,
      completedSets,
      totalVolume,
      maxWeight,
      type: 'weight_based' as const,
    };
  } else {
    const timeSets = exercise.sets.filter(isTimeBasedSet);
    const totalTime = calculateTotalTime(timeSets);
    const maxDuration = Math.max(...timeSets.map((set) => set.duration));
    const totalDistance = timeSets.reduce(
      (sum, set) => sum + (set.distance || 0),
      0,
    );

    return {
      totalSets,
      completedSets,
      totalTime,
      maxDuration,
      totalDistance,
      type: 'time_based' as const,
    };
  }
};

/**
 * Suggest weight for next set based on previous performance
 * @param previousSets Array of previous weight-based sets
 * @param targetReps Target number of repetitions
 * @returns Suggested weight
 */
export const suggestWeight = (
  previousSets: WeightBasedSet[],
  targetReps: number,
): number => {
  if (previousSets.length === 0) return 0;

  // Find the last set with similar rep range (±2 reps)
  const similarSets = previousSets.filter(
    (set) => Math.abs(set.repetitions - targetReps) <= 2,
  );

  if (similarSets.length > 0) {
    const lastSimilar = similarSets[similarSets.length - 1];
    return lastSimilar.weight;
  }

  // If no similar sets, use the last set's weight
  return previousSets[previousSets.length - 1].weight;
};

/**
 * Suggest duration for next set based on previous performance
 * @param previousSets Array of previous time-based sets
 * @returns Suggested duration in seconds
 */
export const suggestDuration = (previousSets: TimeBasedSet[]): number => {
  if (previousSets.length === 0) return 60; // Default 1 minute

  // Use the average of last 3 sets or all sets if less than 3
  const recentSets = previousSets.slice(-3);
  const averageDuration =
    recentSets.reduce((sum, set) => sum + set.duration, 0) / recentSets.length;

  return Math.round(averageDuration);
};

/**
 * Check if an exercise name represents a typically time-based exercise
 * @param exerciseName Name of the exercise
 * @returns True if it's typically time-based
 */
export const isTypicallyTimeBasedExercise = (exerciseName: string): boolean => {
  const timeBased = [
    'plank',
    'planking',
    'running',
    'bieg',
    'jogging',
    'cycling',
    'rower',
    'walking',
    'chodzenie',
    'swimming',
    'pływanie',
    'hold',
    'trzymanie',
    'wall sit',
    'przysiad przy ścianie',
    'bridge',
    'mostek',
  ];

  const name = exerciseName.toLowerCase();
  return timeBased.some((timeExercise) => name.includes(timeExercise));
};

/**
 * Validate workout set data
 * @param set Workout set to validate
 * @returns Validation result with success flag and error message
 */
export const validateWorkoutSet = (
  set: WorkoutSet,
): { isValid: boolean; error?: string } => {
  if (!set.id || !set.createdAt) {
    return { isValid: false, error: 'Missing required fields (id, createdAt)' };
  }

  if (isWeightBasedSet(set)) {
    if (set.repetitions <= 0) {
      return { isValid: false, error: 'Repetitions must be greater than 0' };
    }
    if (set.weight < 0) {
      return { isValid: false, error: 'Weight cannot be negative' };
    }
  } else if (isTimeBasedSet(set)) {
    if (set.duration <= 0) {
      return { isValid: false, error: 'Duration must be greater than 0' };
    }
    if (set.distance !== undefined && set.distance < 0) {
      return { isValid: false, error: 'Distance cannot be negative' };
    }
  } else {
    return { isValid: false, error: 'Invalid set type' };
  }

  return { isValid: true };
};
