import { useCallback } from 'react';
import { useTrainingStore } from '../stores/trainingStore';
import type { ExerciseType, WorkoutSet } from '../types/training';

/**
 * Enhanced useTraining hook with new functionality
 * Provides backward compatibility while adding new features for:
 * - Time-based exercises
 * - Exercise statistics and personal records
 * - Optimized data loading
 *
 * @returns Object containing all actions and state with additional features
 */
export const useTraining = () => {
  const store = useTrainingStore();

  return {
    ...store,
    data: { trainings: store.trainings },

    // Method aliases for backward compatibility (with signature adaptation)
    editSet: (setId: string, updatedSet: WorkoutSet) =>
      store.updateSet(setId, updatedSet),
    editExercise: store.updateExercise,
    editTraining: store.updateTraining,
    getActiveTrainingId: () => store.activeTrainingId,
    startTraining: store.setActiveTraining,

    // New methods for enhanced functionality
    /**
     * Helper to create a new exercise with proper structure
     * @param name Exercise name
     * @param type Exercise type (weight-based or time-based)
     * @param restTime Optional rest time in seconds
     * @param notes Optional notes
     */
    createExercise: (
      name: string,
      type: ExerciseType,
      restTime?: number,
      notes?: string,
    ) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      exerciseName: name,
      type,
      sets: [],
      createdAt: new Date().toISOString(),
      restTime,
      notes,
    }),

    /**
     * Helper to create a new weight-based set
     * @param repetitions Number of repetitions
     * @param weight Weight in kg
     */
    createWeightSet: (repetitions: number, weight: number) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      completed: false,
      repetitions,
      weight,
    }),

    /**
     * Helper to create a new time-based set
     * @param duration Duration in seconds
     * @param distance Optional distance
     * @param intensity Optional intensity description
     */
    createTimeSet: (
      duration: number,
      distance?: number,
      intensity?: string,
    ) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      completed: false,
      duration,
      distance,
      intensity,
    }),

    /**
     * Get the last maximum weight for an exercise (excluding current training)
     * Useful for auto-filling weight suggestions
     * @param exerciseName Name of the exercise
     */
    getLastMaxWeightForExercise: useCallback(
      (exerciseName: string) => {
        return store.getLastMaxWeight(exerciseName);
      },
      [store],
    ),

    /**
     * Get comprehensive statistics for an exercise
     * @param exerciseName Name of the exercise
     */
    getExerciseStatistics: useCallback(
      (exerciseName: string) => {
        return store.getExerciseStats(exerciseName);
      },
      [store],
    ),

    /**
     * Get all cached exercise statistics
     */
    getAllExerciseStats: useCallback(() => {
      return store.exerciseStats;
    }, [store]),
  };
};
