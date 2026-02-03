import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Calendar1,
  CalendarMinus2,
  CalendarDays,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { EventModal } from "./EventModal";
import { useUser } from "@/components/auth/user-context";
import { CalendarEvent } from "@/lib/repositories/calendar-repository";
import { getDateInTimezone } from "@/lib/utils/date-utils";
import { useCalendar, ViewMode } from "@/hooks/use-calendar";

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
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
const allHours = Array.from({ length: 24 }, (_, i) => i);

export function CalendarPanel() {
  const { dbUser } = useUser();
  const {
    events,
    loading,
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
  } = useCalendar(dbUser);

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const weekViewRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to business hours when switching to week view
  useEffect(() => {
    if (viewMode === "week" && weekViewRef.current) {
      setTimeout(() => {
        weekViewRef.current?.scrollTo({
          top: 8 * 40, // 8 hours * 40px per hour
          behavior: "smooth",
        });
      }, 100);
    }
  }, [viewMode]);

  const getWeekDays = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentYear, currentMonth, currentWeekStart + i);
      const dateStr = getDateInTimezone(date);
      return {
        day: date.getDate(),
        dayName: daysOfWeek[date.getDay()],
        date: dateStr,
        isToday:
          date.getDate() === new Date().getDate() &&
          date.getMonth() === new Date().getMonth() &&
          date.getFullYear() === new Date().getFullYear(),
      };
    });
  };

  const getMonthDays = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const dateStr = getDateInTimezone(date);
      days.push({
        day: i,
        date: dateStr,
        isToday:
          i === new Date().getDate() &&
          currentMonth === new Date().getMonth() &&
          currentYear === new Date().getFullYear(),
      });
    }

    return days;
  };

  const isBusinessHour = (hour: number) => {
    return hour >= 8 && hour < 17;
  };

  const getEventPosition = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    const totalMinutes = hour * 60 + minute;
    return (totalMinutes / 60) * 40;
  };

  const getEventHeight = (duration: string) => {
    const minutes = duration.includes("h")
      ? (parseInt(duration) || 1) * 60
      : parseInt(duration) || 30;
    return (minutes / 60) * 40;
  };

  const renderDayView = () => {
    const selectedDate = new Date(currentYear, currentMonth, selectedDay);
    const dayName = selectedDate.toLocaleDateString("pt-BR", {
      weekday: "long",
    });

    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-3 border border-gray-200 h-full">
        <div className="flex items-center gap-2 mb-3 text-[#1e3a5f]">
          <CalendarIcon className="w-5 h-5" />
          <h3 className="capitalize text-sm">
            {dayName}, {selectedDay} de {monthNames[currentMonth]}
          </h3>
        </div>

        <div className="space-y-2">
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event.originalEvent)}
              className={`${event.color} rounded-xl p-3 text-white shadow-md hover:shadow-lg transition-all cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h4 className="text-sm">{event.title}</h4>
                  <p className="text-xs opacity-90">{event.patient}</p>
                </div>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                  {event.duration}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CalendarIcon className="w-3 h-3" />
                <span>{event.time}</span>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              Nenhum compromisso para este dia.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();

    return (
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
        <div
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-auto h-full"
          ref={weekViewRef}
        >
          <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
            <div className="p-2 border-r border-gray-200"></div>
            {weekDays.map((day) => (
              <div
                key={day.date}
                className={`p-2 text-center border-r border-gray-200 ${
                  day.isToday ? "bg-[#6eb5d8] text-white" : ""
                }`}
              >
                <div className="text-xs">{day.dayName}</div>
                <div
                  className={`text-lg font-semibold ${
                    day.isToday ? "text-white" : "text-[#1e3a5f]"
                  }`}
                >
                  {day.day}
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="grid grid-cols-8">
              <div className="border-r border-gray-200">
                {allHours.map((hour) => (
                  <div
                    key={hour}
                    className="h-[40px] border-b border-gray-100 p-1 text-xs text-gray-500 bg-gray-50 flex items-center"
                  >
                    {hour.toString().padStart(2, "0")}:00
                  </div>
                ))}
              </div>

              {weekDays.map((day) => (
                <div
                  key={day.date}
                  className="relative border-r border-gray-200"
                >
                  {allHours.map((hour) => (
                    <div
                      key={hour}
                      className={`h-[40px] border-b border-gray-100 transition-colors ${
                        isBusinessHour(hour)
                          ? "bg-blue-100/60 hover:bg-blue-100/80"
                          : "hover:bg-gray-50/50"
                      }`}
                    ></div>
                  ))}

                  <div className="absolute inset-0 pointer-events-none">
                    {events
                      .filter((e) => e.date === day.date)
                      .map((event) => {
                        const top = getEventPosition(event.time);
                        const height = getEventHeight(event.duration);

                        return (
                          <div
                            key={event.id}
                            onClick={() =>
                              setSelectedEvent(event.originalEvent)
                            }
                            className={`${event.color} absolute left-0.5 right-0.5 rounded-lg p-1.5 text-white shadow-md hover:shadow-lg transition-all cursor-pointer pointer-events-auto overflow-hidden`}
                            style={{
                              top: `${top}px`,
                              height: `${height}px`,
                            }}
                          >
                            <div className="text-xs font-semibold truncate">
                              {event.time}
                            </div>
                            <div className="text-xs truncate">
                              {event.patient}
                            </div>
                            <div className="text-xs opacity-90 truncate">
                              {event.title}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthDays = getMonthDays();

    const getEventCountForDay = (date: string) => {
      return events.filter((e) => e.date === date).length;
    };

    return (
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-4 text-[#1e3a5f]">
          <CalendarIcon className="w-5 h-5" />
          <h3>
            {monthNames[currentMonth]} {currentYear}
          </h3>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-gray-600 py-2"
            >
              {day}
            </div>
          ))}

          {monthDays.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const eventCount = getEventCountForDay(day.date);
            const dayEvents = events.filter((e) => e.date === day.date);

            return (
              <div
                key={day.date}
                className={`aspect-square rounded-lg p-2 border transition-all ${
                  day.isToday
                    ? "bg-[#6eb5d8] text-white border-[#6eb5d8] shadow-md"
                    : eventCount > 0
                      ? "bg-white border-gray-300 hover:border-[#6eb5d8] cursor-pointer"
                      : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex flex-col h-full">
                  <span
                    className={`text-sm font-semibold ${
                      day.isToday ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {day.day}
                  </span>

                  {eventCount > 0 && (
                    <div className="flex-1 flex flex-col justify-end gap-0.5 mt-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          onClick={() => setSelectedEvent(event.originalEvent)}
                          className={`${event.color} rounded text-xs px-1 py-0.5 text-white truncate cursor-pointer hover:opacity-80`}
                          title={`${event.time} - ${event.patient}`}
                        >
                          {event.time}
                        </div>
                      ))}
                      {eventCount > 2 && (
                        <span
                          className={`text-xs ${
                            day.isToday ? "text-white/80" : "text-gray-500"
                          }`}
                        >
                          +{eventCount - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#1e3a5f] font-normal">Agenda</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={viewMode === "day"}
            >
              <ChevronLeft
                className={`w-5 h-5 ${
                  viewMode === "day" ? "text-gray-300" : "text-[#1e3a5f]"
                }`}
              />
            </button>
            <span className="text-[#1e3a5f] capitalize min-w-[220px] text-center">
              {headerTitle}
            </span>
            <button
              onClick={handleNext}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={viewMode === "day"}
            >
              <ChevronRight
                className={`w-5 h-5 ${
                  viewMode === "day" ? "text-gray-300" : "text-[#1e3a5f]"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setViewMode("day")}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              viewMode === "day"
                ? "bg-[#6eb5d8] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Calendar1 className="w-4 h-4" />
            Dia
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              viewMode === "week"
                ? "bg-[#6eb5d8] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <CalendarMinus2 className="w-4 h-4" />
            Semana
          </button>
          <button
            onClick={() => setViewMode("month")}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              viewMode === "month"
                ? "bg-[#6eb5d8] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            Mês
          </button>
        </div>

        {viewMode === "day" && (
          <div>
            <div className="grid grid-cols-7 gap-2 mb-1">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-center text-sm text-gray-600">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date(
                  currentYear,
                  currentMonth,
                  currentWeekStart + i,
                );
                const dayNumber = date.getDate();
                const isSelected = dayNumber === selectedDay;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(dayNumber)}
                    className={`aspect-square rounded-lg flex items-center justify-center transition-all text-2xl ${
                      isSelected
                        ? "bg-[#6eb5d8] text-white shadow-md"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {dayNumber}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6eb5d8]"></div>
          </div>
        )}

        {!dbUser?.calendarInfo ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8 text-center">
            <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">Calendário não conectado</p>
            <p className="text-sm">
              Conecte seu Google Calendar nas configurações para ver seus
              compromissos.
            </p>
          </div>
        ) : (
          <>
            {viewMode === "day" && renderDayView()}
            {viewMode === "week" && renderWeekView()}
            {viewMode === "month" && renderMonthView()}
          </>
        )}
      </div>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
