"use client";

import {
  createCalculatorStore,
  initCalculatorStore,
  type CalculatorStore,
} from "@/stores/calculator-store";
import { useFortyTwoStore } from "./forty-two-store-provider";
import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStore, type StoreApi } from "zustand";

export const CalculatorStoreContext =
  createContext<StoreApi<CalculatorStore> | null>(null);

export interface CalculatorStoreProviderProps {
  children: ReactNode;
}

export const CalculatorStoreProvider = ({
  children,
}: CalculatorStoreProviderProps) => {
  const level = useFortyTwoStore((state) => state.cursus.level);
  const levels = useFortyTwoStore((state) => state.levels);

  const storeRef = useRef<StoreApi<CalculatorStore>>(null);
  if (!storeRef.current) {
    storeRef.current = createCalculatorStore(
      initCalculatorStore({ level, levels }),
      levels,
    );
  }

  return (
    <CalculatorStoreContext.Provider value={storeRef.current}>
      {children}
    </CalculatorStoreContext.Provider>
  );
};

export const useCalculatorStore = <T,>(
  selector: (store: CalculatorStore) => T,
): T => {
  const calculatorStoreContext = useContext(CalculatorStoreContext);

  if (!calculatorStoreContext) {
    throw new Error(
      "useCalculatorStore must be use within CalculatorStoreProvider",
    );
  }

  return useStore(calculatorStoreContext, selector);
};
