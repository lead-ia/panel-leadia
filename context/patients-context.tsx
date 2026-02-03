"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  PatientsRepository,
  Patient,
} from "@/lib/repositories/patients-repository";

interface PatientsContextType {
  allPatients: Patient[];
  patients: Patient[];
  leads: Patient[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updatePatient: (id: string, data: Partial<Patient>) => Promise<Patient>;
}

const PatientsContext = createContext<PatientsContextType | undefined>(
  undefined,
);

export function PatientsProvider({ children }: { children: React.ReactNode }) {
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new PatientsRepository(), []);

  const fetchPatients = useCallback(
    async (isInitial = false) => {
      if (isInitial && allPatients.length === 0) {
        setLoading(true);
      }
      setError(null);
      try {
        const data = await repository.getPatients();
        setAllPatients(data);
      } catch (err) {
        setError("Failed to fetch patients");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [allPatients.length, repository],
  );

  useEffect(() => {
    fetchPatients(true);
  }, []); // Run only once on mount

  const updatePatient = async (id: string, data: Partial<Patient>) => {
    try {
      const updated = await repository.updatePatient(id, data);
      setAllPatients((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updated } : p)),
      );
      return updated;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const patients = useMemo(
    () => allPatients.filter((p) => p.isPatient),
    [allPatients],
  );
  const leads = useMemo(
    () => allPatients.filter((p) => !p.isPatient),
    [allPatients],
  );

  const value = {
    allPatients,
    patients,
    leads,
    loading: loading && allPatients.length === 0,
    error,
    refresh: () => fetchPatients(false),
    updatePatient,
  };

  return (
    <PatientsContext.Provider value={value}>
      {children}
    </PatientsContext.Provider>
  );
}

export function usePatientsContext() {
  const context = useContext(PatientsContext);
  if (context === undefined) {
    throw new Error(
      "usePatientsContext must be used within a PatientsProvider",
    );
  }
  return context;
}
