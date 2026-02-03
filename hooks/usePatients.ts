"use client";

import { usePatientsContext } from '@/context/patients-context';

export function usePatients() {
  const context = usePatientsContext();
  
  return {
    patients: context.patients,
    leads: context.leads,
    allPatients: context.allPatients,
    loading: context.loading,
    error: context.error,
    refetch: context.refresh,
    updatePatient: context.updatePatient
  };
}
