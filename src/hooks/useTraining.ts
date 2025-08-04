import { useContext } from "react";
import { TrainingContext } from "@/context/TrainingProvider";

export const useTraining = () => {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error("useTraining musi być użyty wewnątrz <TrainingProvider>");
  }
  return context;
};
