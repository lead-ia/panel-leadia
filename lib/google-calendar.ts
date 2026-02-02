import { google } from "googleapis";

export async function getCalendarNextWeek(accessToken: string) {
  if (!accessToken) {
    throw new Error("Missing Google access token");
  }

  const oauth2 = new google.auth.OAuth2();
  oauth2.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: "v3", auth: oauth2 });

  const timeMin = new Date().toISOString();
  const timeMax = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // +10 dias

  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 200,
  });

  return {
    timeMin,
    timeMax,
    events: res.data.items || [],
  };
}
