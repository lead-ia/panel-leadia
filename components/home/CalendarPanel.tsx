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

interface Event {
  id: number;
  title: string;
  time: string;
  duration: string;
  color: string;
  patient: string;
  date: string;
}

type ViewMode = "day" | "week" | "month";

export function CalendarPanel() {
  const [selectedDay, setSelectedDay] = useState(10); // Dia atual selecionado
  const [currentWeekStart, setCurrentWeekStart] = useState(5); // Início da semana (5 de Janeiro)
  const [currentMonth, setCurrentMonth] = useState(0); // Janeiro = 0
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const weekViewRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para horário comercial quando mudar para visualização semanal
  useEffect(() => {
    if (viewMode === "week" && weekViewRef.current) {
      // Rolar para 08:00 (início do horário comercial)
      // Cada hora tem 40px de altura, então 8 horas = 320px
      setTimeout(() => {
        weekViewRef.current?.scrollTo({
          top: 8 * 40, // 8 horas * 40px por hora
          behavior: "smooth",
        });
      }, 100); // Pequeno delay para garantir que o DOM foi renderizado
    }
  }, [viewMode]);

  const events: Event[] = [
    {
      id: 1,
      title: "Consulta",
      time: "09:00",
      duration: "1h",
      color: "bg-blue-400",
      patient: "Maria Silva",
      date: "2025-01-10",
    },
    {
      id: 2,
      title: "Retorno",
      time: "10:30",
      duration: "30min",
      color: "bg-green-400",
      patient: "João Santos",
      date: "2025-01-10",
    },
    {
      id: 3,
      title: "Exame",
      time: "14:00",
      duration: "45min",
      color: "bg-yellow-400",
      patient: "Ana Oliveira",
      date: "2025-01-10",
    },
    {
      id: 4,
      title: "Consulta",
      time: "15:30",
      duration: "1h",
      color: "bg-purple-400",
      patient: "Carlos Mendes",
      date: "2025-01-10",
    },
    {
      id: 5,
      title: "Avaliação",
      time: "16:30",
      duration: "1h",
      color: "bg-pink-400",
      patient: "Beatriz Costa",
      date: "2025-01-10",
    },
    {
      id: 11,
      title: "Consulta",
      time: "11:00",
      duration: "1h",
      color: "bg-indigo-400",
      patient: "Ricardo Lima",
      date: "2025-01-10",
    },
    {
      id: 12,
      title: "Retorno",
      time: "13:00",
      duration: "30min",
      color: "bg-teal-400",
      patient: "Patrícia Rocha",
      date: "2025-01-10",
    },
    {
      id: 13,
      title: "Exame",
      time: "17:30",
      duration: "45min",
      color: "bg-orange-400",
      patient: "Gabriel Ferreira",
      date: "2025-01-10",
    },
    {
      id: 14,
      title: "Consulta",
      time: "18:30",
      duration: "1h",
      color: "bg-red-400",
      patient: "Camila Nunes",
      date: "2025-01-10",
    },
    // Eventos de outros dias
    {
      id: 6,
      title: "Consulta",
      time: "10:00",
      duration: "1h",
      color: "bg-blue-400",
      patient: "Pedro Alves",
      date: "2025-01-13",
    },
    {
      id: 7,
      title: "Retorno",
      time: "14:00",
      duration: "30min",
      color: "bg-green-400",
      patient: "Lucia Martins",
      date: "2025-01-13",
    },
    {
      id: 8,
      title: "Exame",
      time: "11:00",
      duration: "45min",
      color: "bg-yellow-400",
      patient: "Roberto Silva",
      date: "2025-01-14",
    },
    {
      id: 9,
      title: "Consulta",
      time: "09:00",
      duration: "1h",
      color: "bg-purple-400",
      patient: "Fernanda Costa",
      date: "2025-01-15",
    },
    {
      id: 10,
      title: "Avaliação",
      time: "16:00",
      duration: "1h",
      color: "bg-pink-400",
      patient: "Marcos Souza",
      date: "2025-01-15",
    },
    {
      id: 15,
      title: "Consulta",
      time: "08:00",
      duration: "1h",
      color: "bg-blue-400",
      patient: "Sandra Oliveira",
      date: "2025-01-13",
    },
    {
      id: 16,
      title: "Retorno",
      time: "16:00",
      duration: "30min",
      color: "bg-green-400",
      patient: "André Campos",
      date: "2025-01-13",
    },
    {
      id: 17,
      title: "Exame",
      time: "15:00",
      duration: "45min",
      color: "bg-yellow-400",
      patient: "Juliana Braga",
      date: "2025-01-14",
    },
    {
      id: 18,
      title: "Consulta",
      time: "13:00",
      duration: "1h",
      color: "bg-purple-400",
      patient: "Thiago Melo",
      date: "2025-01-14",
    },
    {
      id: 19,
      title: "Avaliação",
      time: "11:00",
      duration: "1h",
      color: "bg-pink-400",
      patient: "Vanessa Dias",
      date: "2025-01-15",
    },
    {
      id: 20,
      title: "Consulta",
      time: "14:00",
      duration: "1h",
      color: "bg-indigo-400",
      patient: "Leonardo Pinto",
      date: "2025-01-15",
    },
  ];

  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const hours = Array.from({ length: 24 }, (_, i) => i); // 0h às 23h (para visualização diária)

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

  const handlePrevious = () => {
    if (viewMode === "week") {
      setCurrentWeekStart((prev) => Math.max(1, prev - 7));
    } else if (viewMode === "month") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((prev) => prev - 1);
      } else {
        setCurrentMonth((prev) => prev - 1);
      }
    }
  };

  const handleNext = () => {
    if (viewMode === "week") {
      setCurrentWeekStart((prev) => Math.min(26, prev + 7)); // Máximo 26 para não passar do mês
    } else if (viewMode === "month") {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((prev) => prev + 1);
      } else {
        setCurrentMonth((prev) => prev + 1);
      }
    }
  };

  const getHeaderTitle = () => {
    if (viewMode === "week") {
      const weekEnd = Math.min(currentWeekStart + 6, 31);
      return `${currentWeekStart} - ${weekEnd} de ${monthNames[currentMonth]} ${currentYear}`;
    } else if (viewMode === "month") {
      return `${monthNames[currentMonth]} ${currentYear}`;
    }
    return `${monthNames[currentMonth]} de ${currentYear}`;
  };

  // Filtrar eventos por visualização
  const getFilteredEvents = () => {
    if (viewMode === "day") {
      return events.filter(
        (e) => e.date === `2025-01-${selectedDay.toString().padStart(2, "0")}`
      );
    }
    if (viewMode === "week") {
      // Semana baseada no currentWeekStart
      return events.filter((e) => {
        const eventDate = new Date(e.date);
        const weekEnd = currentWeekStart + 6;
        return (
          eventDate >= new Date(2025, 0, currentWeekStart) &&
          eventDate <= new Date(2025, 0, weekEnd)
        );
      });
    }
    // month - mostrar todos os eventos do mês atual
    return events.filter((e) => {
      const eventDate = new Date(e.date);
      return (
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    });
  };

  const getWeekDays = () => {
    // Semana baseada no currentWeekStart
    return Array.from({ length: 7 }, (_, i) => {
      const day = currentWeekStart + i;
      if (day > 31) return null; // Não passar do mês
      const date = new Date(2025, 0, day);
      return {
        day,
        dayName: daysOfWeek[date.getDay()],
        date: `2025-01-${day.toString().padStart(2, "0")}`,
        isToday: day === 10,
      };
    }).filter((d) => d !== null);
  };

  const getMonthDays = () => {
    // Dias do mês atual
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const days = [];

    // Dias vazios antes do início do mês
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Dias do mês
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        date: `${currentYear}-${(currentMonth + 1)
          .toString()
          .padStart(2, "0")}-${i.toString().padStart(2, "0")}`,
        isToday: i === 10 && currentMonth === 0 && currentYear === 2025,
      });
    }

    return days;
  };

  const renderDayView = () => {
    const todayEvents = getFilteredEvents();
    const selectedDate = new Date(2025, 0, selectedDay);
    const dayName = selectedDate.toLocaleDateString("pt-BR", {
      weekday: "long",
    });

    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-3 border border-gray-200 h-full">
        <div className="flex items-center gap-2 mb-3 text-[#1e3a5f]">
          <CalendarIcon className="w-5 h-5" />
          <h3 className="capitalize text-sm">
            {dayName}, {selectedDay} de Janeiro
          </h3>
        </div>

        <div className="space-y-2">
          {todayEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event.id)}
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
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    const weekEvents = getFilteredEvents();

    // Todos os horários do dia (00h às 23h)
    const allHours = Array.from({ length: 24 }, (_, i) => i);

    // Função para calcular a posição e altura do evento baseado no horário
    const getEventPosition = (time: string) => {
      const [hour, minute] = time.split(":").map(Number);
      const totalMinutes = hour * 60 + minute;
      const top = (totalMinutes / 60) * 40; // 40px per hour
      return top;
    };

    const getEventHeight = (duration: string) => {
      const minutes = duration.includes("h")
        ? (parseInt(duration) || 1) * 60
        : parseInt(duration) || 30;
      return (minutes / 60) * 40; // 40px per hour
    };

    // Verificar se o horário está no período comercial (08:00 - 17:00)
    const isBusinessHour = (hour: number) => {
      return hour >= 8 && hour < 17;
    };

    return (
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
        <div
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-auto h-full"
          ref={weekViewRef}
        >
          {/* Header com dias da semana */}
          <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
            <div className="p-2 border-r border-gray-200"></div>
            {weekDays.map((day) => (
              <div
                key={day.day}
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

          {/* Grid de horários */}
          <div className="relative">
            <div className="grid grid-cols-8">
              {/* Coluna de horários */}
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

              {/* Colunas dos dias */}
              {weekDays.map((day) => (
                <div
                  key={day.day}
                  className="relative border-r border-gray-200"
                >
                  {/* Linhas de horário */}
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

                  {/* Eventos posicionados absolutamente */}
                  <div className="absolute inset-0 pointer-events-none">
                    {weekEvents
                      .filter((e) => e.date === day.date)
                      .map((event) => {
                        const top = getEventPosition(event.time);
                        const height = getEventHeight(event.duration);

                        return (
                          <div
                            key={event.id}
                            onClick={() => setSelectedEvent(event.id)}
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
    const monthEvents = getFilteredEvents();

    const getEventCountForDay = (date: string) => {
      return monthEvents.filter((e) => e.date === date).length;
    };

    return (
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-4 text-[#1e3a5f]">
          <CalendarIcon className="w-5 h-5" />
          <h3>Janeiro 2025</h3>
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
            const dayEvents = monthEvents.filter((e) => e.date === day.date);

            return (
              <div
                key={day.day}
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
                          onClick={() => setSelectedEvent(event.id)}
                          className={`${event.color} rounded text-xs px-1 py-0.5 text-white truncate cursor-pointer hover:opacity-80`}
                          title={`${event.time} - ${event.patient}`}
                        >
                          {event.time}
                        </div>
                      ))}
                      {eventCount > 2 && (
                        <span className="text-xs text-gray-500">
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
          <h2 className="text-[#1e3a5f] mb-4 font-normal">Agenda</h2>
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
              {getHeaderTitle()}
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

        {/* View Mode Selector - always visible */}
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

        {/* Day selector for day view */}
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
                const dayNumber = 5 + i;
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

      <div className="flex-1 overflow-y-auto">
        {viewMode === "day" && renderDayView()}
        {viewMode === "week" && renderWeekView()}
        {viewMode === "month" && renderMonthView()}
      </div>

      {selectedEvent && (
        <EventModal
          eventId={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
