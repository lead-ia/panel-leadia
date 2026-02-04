export interface CalendarOAuthInfo {
  refresh_token: string;
  access_token: string;
  token_expiry: string;
  email: string;
}

export interface CalendarEvent {
  id: string;
  kind: string;
  etag: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  description?: string;
  creator: {
    email: string;
    displayName?: string;
    self?: boolean;
  };
  organizer: {
    email: string;
    displayName?: string;
    self?: boolean;
  };
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  transparency?: string;
  visibility?: string;
  iCalUID: string;
  sequence: number;
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: string;
      minutes: number;
    }>;
  };
  focusTimeProperties?: {
    autoDeclineMode: string;
  };
  eventType?: string;
  location?: string;
  attendees?: {
    email: string;
    responseStatus?: string;
    [key: string]: any;
  }[];
  patientName?: string | null;
  [key: string]: any;
}

export interface ICalendarRepository {
  getEventsForInterval(
    oauth: CalendarOAuthInfo,
    startDate: string,
    endDate: string
  ): Promise<CalendarEvent[]>;
}

export class CalendarRepository implements ICalendarRepository {
  private baseUrl: string;

  constructor() {
    // Note: process.env.URL_API_SERVICE_EXTERNAL must be defined.
    // If used on the client, ensure it's prefixed with NEXT_PUBLIC_ or handled via a proxy.
    this.baseUrl = process.env.URL_API_SERVICE_EXTERNAL || process.env.NEXT_PUBLIC_URL_API_SERVICE_EXTERNAL || "";
  }

  async getEventsForInterval(
    oauth: CalendarOAuthInfo,
    startDate: string,
    endDate: string
  ): Promise<CalendarEvent[]> {
    if (!this.baseUrl) {
      throw new Error("Calendar API URL is not configured");
    }

    try {
      const response = await fetch(`${this.baseUrl}/calendar/events/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oauth: {
            refresh_token: oauth.refresh_token,
            access_token: oauth.access_token,
            token_expiry: oauth.token_expiry,
            email: oauth.email,
          },
          start_date: startDate,
          end_date: endDate,
          max_results: 100,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || `Failed to fetch calendar events: ${response.status}`);
      }

      const data = await response.json();
      // Assuming the API returns an array of events or an object containing them
      const events: CalendarEvent[] = Array.isArray(data) ? data : data.events || [];

      // Extract emails from attendees
      const attendeeEmails = new Set<string>();
      events.forEach((event) => {
        if (event.attendees) {
          event.attendees.forEach((attendee) => {
            if (attendee.email) {
              attendeeEmails.add(attendee.email);
            }
          });
        }
      });

      if (attendeeEmails.size > 0) {
        try {
          // Fetch patients by emails
          const patientsResponse = await fetch("/api/patients", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ emails: Array.from(attendeeEmails) }),
          });

          if (patientsResponse.ok) {
            const patients = await patientsResponse.json();
            
            // Map emails to names
            const emailToNameMap = new Map<string, string>();
            patients.forEach((patient: { email: string; name: string }) => {
              if (patient.email && patient.name) {
                emailToNameMap.set(patient.email, patient.name);
              }
            });

            // Enrich events with patientName
            events.forEach((event) => {
              event.patientName = null; // Default to null
              if (event.attendees) {
                for (const attendee of event.attendees) {
                  if (attendee.email && emailToNameMap.has(attendee.email)) {
                    event.patientName = emailToNameMap.get(attendee.email) || null;
                    break; // Assume one patient per event or take the first found
                  }
                }
              }
            });
          }
        } catch (error) {
           console.error("Failed to enrich events with patient names", error);
           // We do not throw here to allow returning events even if enrichment fails
        }
      }

      return events;
    } catch (error) {
      console.error("CalendarRepository.getEventsForInterval error:", error);
      throw error;
    }
  }
}
