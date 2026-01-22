"use client";

import PatientsPage from "@/components/patients/PatientsPage";

export default function Page() {
  return (
    <PatientsPage
      pacientes={[]}
      onMarcarPagamento={(pacienteId, statusPago) => {}}
      onVoltarParaLead={(leadId) => {}}
    />
  );
}
