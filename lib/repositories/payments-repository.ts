export interface Payment {
  id: string;
  eventId: string;
  patientId: string;
  value: string;
  image: string;
  updatedAt: string;
  status:
    | "PENDING"
    | "SUCCESS"
    | "WILL_SEND_LATER"
    | "NOT_PAID"
    | "NO_RECEIPT"
    | "REFUSED";
  createdAt: string;
}

export interface IPaymentsRepository {
  getPayments(): Promise<Payment[]>;
}

export class PaymentsRepository implements IPaymentsRepository {
  private baseUrl = "/api/payments";

  async getPayments(): Promise<Payment[]> {
    try {
      const response = await fetch(this.baseUrl, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Failed to fetch payments");
      return await response.json();
    } catch (error) {
      console.error("PaymentsRepository.getPayments error:", error);
      throw error;
    }
  }
}
