// Typ ćwiczenia - czasowe lub wagowe
export type ExerciseType = 'weight_based' | 'time_based'; // ćwiczenia z ciężarami lub czasowe

// Podstawowa struktura serii - wspólne pola
export interface BaseWorkoutSet {
  id: string; // unikalny identyfikator serii
  createdAt: string; // timestamp utworzenia
  completed: boolean; // czy seria została ukończona
}

// Seria dla ćwiczeń wagowych
export interface WeightBasedSet extends BaseWorkoutSet {
  repetitions: number; // liczba powtórzeń
  weight: number; // ciężar w kg
}

// Seria dla ćwiczeń czasowych
export interface TimeBasedSet extends BaseWorkoutSet {
  duration: number; // czas w sekundach
  distance?: number; // opcjonalna odległość (np. dla biegu)
  intensity?: string; // opcjonalna intensywność (np. "średnia", "wysoka")
}

// Union type dla wszystkich typów serii
export type WorkoutSet = WeightBasedSet | TimeBasedSet;

// Struktura ćwiczenia z dodatkowymi metadanymi
export interface Exercise {
  id: string; // unikalny identyfikator ćwiczenia
  exerciseName: string; // nazwa ćwiczenia
  type: ExerciseType; // typ ćwiczenia (wagowe/czasowe)
  sets: WorkoutSet[]; // serie (zmieniona nazwa z 'repetitions')
  notes?: string; // opcjonalne notatki
  restTime?: number; // sugerowany czas odpoczynku w sekundach
  createdAt: string; // timestamp dodania ćwiczenia do treningu
}

// Struktura treningu z dodatkowymi metadanymi
export interface Training {
  id: string;
  date: string; // ISO string daty
  name?: string; // opcjonalna nazwa treningu
  exercises: Exercise[];
  startTime?: string; // czas rozpoczęcia treningu
  endTime?: string; // czas zakończenia treningu
  notes?: string; // notatki dotyczące treningu
  completed: boolean; // czy trening został ukończony
}

// Typ dla danych treningowych z indeksami
export interface TrainingData {
  trainings: Training[];
}

// Typ helper dla statystyk ćwiczenia
export interface IExerciseStats {
  exerciseName: string;
  type: ExerciseType;
  lastMaxWeight?: number; // ostatnia największa waga (dla ćwiczeń wagowych)
  lastMaxDuration?: number; // ostatni najdłuższy czas (dla ćwiczeń czasowych)
  lastTrainingDate?: string; // data ostatniego wykonania
  totalVolume?: number; // całkowity wolumen (waga × powtórzenia lub suma czasu)
  personalRecord?: {
    value: number; // wartość (waga lub czas)
    date: string; // data ustanowienia rekordu
    trainingId: string; // ID treningu w którym ustanowiono rekord
  };
}

// Type guards dla rozróżnienia typów serii
export const isWeightBasedSet = (set: WorkoutSet): set is WeightBasedSet => {
  return 'repetitions' in set && 'weight' in set;
};

export const isTimeBasedSet = (set: WorkoutSet): set is TimeBasedSet => {
  return 'duration' in set;
};

// Type guards dla rozróżnienia typów ćwiczeń
export const isWeightBasedExercise = (exercise: Exercise): boolean => {
  return exercise.type === 'weight_based';
};

export const isTimeBasedExercise = (exercise: Exercise): boolean => {
  return exercise.type === 'time_based';
};
