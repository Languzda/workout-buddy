import  { useState, useEffect } from 'react';
import { useTraining } from '../hooks/useTraining';
import { ExerciseType, type Exercise } from '../types/training';
import { parseDuration } from '../utils/exerciseHelpers';
import { Button } from './ui/button';
import ExerciseInfo from './ExerciseInfo';
import ExerciseStats from './ExerciseStats';

/**
 * Enhanced Add Exercise component supporting both weight-based and time-based exercises
 *
 * Features:
 * - Automatically detects if exercise with same name already exists in current training
 * - If exists: adds set to existing exercise (case-insensitive matching)
 * - If doesn't exist: creates new exercise with first set
 * - Keeps form values after adding set for easy consecutive set adding
 * - Shows visual feedback about what action will be performed
 */
export const EnhancedAddExercise = () => {
  const {
    addExercise,
    addSetToExercise,
    createExercise,
    createWeightSet,
    createTimeSet,
    getLastMaxWeightForExercise,
    getExerciseStatistics,
    getActiveTraining,
  } = useTraining();
  const trainingId = getActiveTraining()?.id;
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseType, setExerciseType] = useState<ExerciseType>(
    ExerciseType.WEIGHT_BASED,
  );
  const [stats, setStats] = useState<ReturnType<
    typeof getExerciseStatistics
  > | null>(null);

  // Weight-based form fields
  const [repetitions, setRepetitions] = useState<number>(10);
  const [weight, setWeight] = useState<number>(0);

  // Time-based form fields
  const [duration, setDuration] = useState<string>('00:60'); // MM:SS format
  const [distance, setDistance] = useState<number | undefined>();
  const [intensity, setIntensity] = useState<string>('');

  /**
   * Load exercise statistics when exercise name changes
   */
  useEffect(() => {
    if (exerciseName.trim()) {
      const exerciseStats = getExerciseStatistics(exerciseName);
      setStats(exerciseStats);

      // Auto-suggest exercise type based on historical data or name
      if (exerciseStats) {
        setExerciseType(exerciseStats.type);

        if (
          exerciseStats.type === ExerciseType.WEIGHT_BASED &&
          exerciseStats.lastMaxWeight
        ) {
          // FIXME: Improve weight suggestion logic, should suggest in order:
          // 1. Last weight from current training
          // 2. Last weight from any previous training
          // 3. Default to 0 if no previous weights exist
          //   setWeight(exerciseStats.lastMaxWeight);
          console.log('Last max weight:', exerciseStats.lastMaxWeight);
        }
      } else {
        // Auto-detect based on exercise name for new exercises
        // TODO: maybe next feature
      }
    } else {
      setStats(null);
    }
  }, [exerciseName, getExerciseStatistics]);

  const resetForm = () => {
    setExerciseName('');
    setRepetitions(10);
    setWeight(0);
    setDuration('00:60');
    setDistance(undefined);
    setIntensity('');
    setStats(null);
    setExerciseType(ExerciseType.WEIGHT_BASED);
  };

  /**
   * Get suggested weight from last training (excluding current)
   */
  const handleLoadLastWeight = () => {
    const lastWeight = getLastMaxWeightForExercise(exerciseName);
    if (lastWeight) {
      setWeight(lastWeight);
    }
  };

  /**
   * Add exercise with first set or add set to existing exercise
   */
  const handleAddExercise = () => {
    if (!exerciseName.trim()) return;

    // Check if exercise already exists in current training (case-insensitive)
    const activeTraining = getActiveTraining();
    const existingExercise = activeTraining?.exercises.find(
      (ex: Exercise) =>
        ex.exerciseName.toLowerCase() === exerciseName.toLowerCase().trim(),
    );

    let targetExerciseId: string;

    if (existingExercise) {
      // Exercise exists, use its ID
      targetExerciseId = existingExercise.id;
    } else {
      // Create new exercise
      const exercise = createExercise(exerciseName.trim(), exerciseType);
      addExercise(trainingId, exercise);
      targetExerciseId = exercise.id;
    }

    // Add set to exercise (new or existing)
    if (exerciseType === ExerciseType.WEIGHT_BASED) {
      const set = createWeightSet(repetitions, weight);
      addSetToExercise(targetExerciseId, set);
    } else {
      const durationInSeconds = parseDuration(duration);
      const set = createTimeSet(durationInSeconds, distance, intensity);
      addSetToExercise(targetExerciseId, set);
    }

    // DON'T reset form - keep values for easy adding of next set
    // Only reset set-specific values, keep exercise name and type
    // User can manually change exercise name if they want to add different exercise
  };

  return (
    <div className=" bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Dodaj Ćwiczenie</h3>

      {/* Exercise Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nazwa ćwiczenia
        </label>
        <input
          type="text"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          placeholder="np. Wyciskanie sztangi, Plank, Bieg"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {stats && <ExerciseStats stats={stats} />}
      </div>

      {/* Exercise Type Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Typ ćwiczenia
        </label>
        <select
          value={exerciseType}
          onChange={(e) => setExerciseType(e.target.value as ExerciseType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={ExerciseType.WEIGHT_BASED}>
            Ćwiczenie z obciążeniem
          </option>
          <option value={ExerciseType.TIME_BASED}>Ćwiczenie czasowe</option>
        </select>
      </div>

      {/* Weight-based Exercise Form */}
      {exerciseType === ExerciseType.WEIGHT_BASED && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Powtórzenia
              </label>
              <input
                type="number"
                value={repetitions}
                onChange={(e) => setRepetitions(Number(e.target.value))}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Waga (kg)
                {stats?.lastMaxWeight && (
                  <button
                    onClick={handleLoadLastWeight}
                    className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                  >
                    (ostatnia: {stats.lastMaxWeight}kg)
                  </button>
                )}
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                min="0"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Time-based Exercise Form */}
      {exerciseType === ExerciseType.TIME_BASED && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Czas (MM:SS)
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="MM:SS (np. 02:30)"
              pattern="[0-9]{1,2}:[0-9]{2}"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dystans (opcjonalnie)
              </label>
              <input
                type="number"
                value={distance || ''}
                onChange={(e) =>
                  setDistance(
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                placeholder="np. 2000 (metry)"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intensywność (opcjonalnie)
              </label>
              <select
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Wybierz intensywność</option>
                <option value="niska">Niska</option>
                <option value="średnia">Średnia</option>
                <option value="wysoka">Wysoka</option>
                <option value="maksymalna">Maksymalna</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Status Info */}
      {exerciseName.trim() && <ExerciseInfo exerciseName={exerciseName} />}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <Button
          onClick={handleAddExercise}
          disabled={!exerciseName.trim()}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Dodaj Serię
        </Button>

        <Button
          onClick={resetForm}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          title="Wyczyść formularz"
        >
          Wyczyść
        </Button>
      </div>
    </div>
  );
};

export default EnhancedAddExercise;
