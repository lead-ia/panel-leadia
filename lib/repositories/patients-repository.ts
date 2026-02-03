
export interface Patient {
  id: string;
  name: string;
  document: string; // cpf
  phoneNumber: string;
  email?: string;
  address?: string;
  dateOfBirth?: string;
  isPatient: boolean;
  createdAt: string;
  updatedAt?: string;
  hasAppointment: boolean;
  // UI helper props that might be derived or optional
  pago?: boolean; 
  comprovante?: string;
}

export interface IPatientsRepository {
  getPatients(): Promise<Patient[]>;
  updatePatient(id: string, data: Partial<Patient>): Promise<Patient>;
}

export class PatientsRepository implements IPatientsRepository {
  private baseUrl = "/api/patients";

  async getPatients(): Promise<Patient[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) throw new Error("Failed to fetch patients");
      const patients = await response.json();
      return patients.map((patient: Patient) => ({
        ...patient,
        hasAppointment: patient.hasAppointment || false,
      }));
    } catch (error) {
      console.error("PatientsRepository.getPatients error:", error);
      throw error;
    }
  }

  async updatePatient(id: string, data: Partial<Patient>): Promise<Patient> {
    try {
      const response = await fetch(`${this.baseUrl}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: { id }, data }), // Sending key and data separately as requested
      });
      if (!response.ok) throw new Error("Failed to update patient");
      return await response.json();
    } catch (error) {
      console.error("PatientsRepository.updatePatient error:", error);
      throw error;
    }
  }
}
