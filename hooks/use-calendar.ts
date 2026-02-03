import { useState, useEffect, useMemo, useCallback } from "react";
import {
  CalendarRepository,
  CalendarEvent,
} from "@/lib/repositories/calendar-repository";
import {
  parseWithTimezone,
  getTimeInTimezone,
  getDateInTimezone,
  getDayRangeInTimezone,
  getWeekRangeInTimezone,
  getMonthRangeInTimezone,
} from "@/lib/utils/date-utils";
import { UserData } from "@/lib/repositories/user-repository";

export interface MappedEvent {
  id: string | number;
  title: string;
  time: string;
  duration: string;
  color: string;
  patient: string;
  date: string;
  originalEvent: CalendarEvent;
}

export type ViewMode = "day" | "week" | "month";

const monthNames = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export function useCalendar(dbUser: UserData | null) {
  const today = useMemo(() => new Date(), []);
  
  // State from view
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  
  // Calculate the start of the current week (Sunday)
  const weekStartDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay());
    return d;
  }, [today]);

  const [currentWeekStart, setCurrentWeekStart] = useState(weekStartDate.getDate());
  const [currentMonth, setCurrentMonth] = useState(weekStartDate.getMonth());
  const [currentYear, setCurrentYear] = useState(weekStartDate.getFullYear());
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [events, setEvents] = useState<MappedEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calendarRepo = useMemo(() => new CalendarRepository(), []);

  const fetchEvents = useCallback(async () => {
    if (!dbUser?.calendarInfo || !dbUser?.email) {
      setEvents([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let startDate: string;
      let endDate: string;

      if (viewMode === "day") {
        const range = getDayRangeInTimezone(currentYear, currentMonth, selectedDay);
        startDate = range.start;
        endDate = range.end;
      } else if (viewMode === "week") {
        const range = getWeekRangeInTimezone(currentYear, currentMonth, currentWeekStart);
        startDate = range.start;
        endDate = range.end;
      } else {
        // month
        const range = getMonthRangeInTimezone(currentYear, currentMonth);
        startDate = range.start;
        endDate = range.end;
      }

      const apiEvents = await calendarRepo.getEventsForInterval(
        {
          refresh_token: dbUser.calendarInfo.refresh_token,
          access_token: dbUser.calendarInfo.access_token,
          token_expiry: dbUser.calendarInfo.token_expiry,
          email: dbUser.email,
        },
        startDate,
        endDate,
      );

      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const mappedEvents: MappedEvent[] = apiEvents.map((e: CalendarEvent) => {
        const startTimeString = e.start.dateTime || e.start.date || "";
        const endTimeString = e.end.dateTime || e.end.date || "";

        const start = parseWithTimezone(startTimeString);
        const end = parseWithTimezone(endTimeString);

        const durationMs = end.getTime() - start.getTime();
        const durationMin = Math.round(durationMs / (1000 * 60));

        return {
          id: e.id,
          title: e.summary,
          time: getTimeInTimezone(start, userTimezone),
          duration:
            durationMin >= 60
              ? `${Math.floor(durationMin / 60)}h`
              : `${durationMin}min`,
          color: "bg-blue-400", // Default color
          patient: e.description || "Sem descrição",
          date: getDateInTimezone(start, userTimezone),
          originalEvent: e,
        };
      });

      setEvents(mappedEvents);
    } catch (err: any) {
      console.error("Error fetching events:", err);
      setError(err.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, [
    dbUser,
    viewMode,
    selectedDay,
    currentWeekStart,
    currentMonth,
    currentYear,
    calendarRepo,
  ]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handlePrevious = useCallback(() => {
    if (viewMode === "week") {
      const newDate = new Date(currentYear, currentMonth, currentWeekStart - 7);
      setCurrentWeekStart(newDate.getDate());
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
    } else if (viewMode === "month") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((prev) => prev - 1);
      } else {
        setCurrentMonth((prev) => prev - 1);
      }
    }
  }, [viewMode, currentYear, currentMonth, currentWeekStart]);

  const handleNext = useCallback(() => {
    if (viewMode === "week") {
      const newDate = new Date(currentYear, currentMonth, currentWeekStart + 7);
      setCurrentWeekStart(newDate.getDate());
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
    } else if (viewMode === "month") {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((prev) => prev + 1);
      } else {
        setCurrentMonth((prev) => prev + 1);
      }
    }
  }, [viewMode, currentYear, currentMonth, currentWeekStart]);

  const headerTitle = useMemo(() => {
    if (viewMode === "week") {
      const weekEndDate = new Date(currentYear, currentMonth, currentWeekStart + 6);
      const weekEndDay = weekEndDate.getDate();
      const weekEndMonth = monthNames[weekEndDate.getMonth()];

      if (currentMonth === weekEndDate.getMonth() && currentYear === weekEndDate.getFullYear()) {
        return `${currentWeekStart} - ${weekEndDay} de ${monthNames[currentMonth]} ${currentYear}`;
      } else {
        return `${currentWeekStart} ${monthNames[currentMonth]} - ${weekEndDay} ${weekEndMonth} ${currentYear}`;
      }
    } else if (viewMode === "month") {
      return `${monthNames[currentMonth]} ${currentYear}`;
    }
    return `${selectedDay} de ${monthNames[currentMonth]} ${currentYear}`;
  }, [viewMode, currentYear, currentMonth, currentWeekStart, selectedDay]);

  const filteredEvents = useMemo(() => {
    if (viewMode === "day") {
      const targetDate = getDateInTimezone(new Date(currentYear, currentMonth, selectedDay));
      return events.filter((e) => e.date === targetDate);
    }
    if (viewMode === "week") {
      return events.filter((e) => {
        const eventDate = new Date(e.date);
        const weekStartDate = new Date(currentYear, currentMonth, currentWeekStart);
        const weekEndDate = new Date(currentYear, currentMonth, currentWeekStart + 6);

        const eventDateStr = getDateInTimezone(eventDate);
        const weekStartStr = getDateInTimezone(weekStartDate);
        const weekEndStr = getDateInTimezone(weekEndDate);

        return eventDateStr >= weekStartStr && eventDateStr <= weekEndStr;
      });
    }
    // month
    return events.filter((e) => {
      const eventDate = new Date(e.date);
      return (
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    });
  }, [events, viewMode, currentYear, currentMonth, currentWeekStart, selectedDay]);

  return {
    events: filteredEvents,
    loading,
    error,
    viewMode,
    setViewMode,
    selectedDay,
    setSelectedDay,
    currentMonth,
    currentYear,
    currentWeekStart,
    handleNext,
    handlePrevious,
    headerTitle,
    refreshEvents: fetchEvents,
  };
}
