import { X, Calendar, Clock, User, Trash2, Save } from "lucide-react";
import { useState } from "react";
import { CalendarEvent } from "@/lib/repositories/calendar-repository";

interface EventModalProps {
  event: CalendarEvent;
  onClose: () => void;
}

export function EventModal({ event, onClose }: EventModalProps) {
  // Extract initial values from the event object
  const initialDate = event.start.dateTime
    ? new Date(event.start.dateTime).toISOString().split('T')[0]
    : event.start.date || '';

  const initialTime = event.start.dateTime
    ? new Date(event.start.dateTime).toTimeString().substring(0, 5)
    : '00:00'; // Default to 00:00 if no time is specified

  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const [duration, setDuration] = useState("30min");
  const [notes, setNotes] = useState(event.description || "");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleSave = () => {
    // Aqui você adicionaria a lógica para salvar as alterações
    console.log("Salvando alterações:", { date, time, duration, notes });
    onClose();
  };

  const handleCancel = () => {
    // Aqui você adicionaria a lógica para cancelar o agendamento
    console.log("Cancelando agendamento:", event.id);
    setShowCancelConfirm(false);
    onClose();
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-blue-400 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{event.summary}</h3>
                <p className="text-sm opacity-90">ID: #{event.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Event Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <User className="w-5 h-5 text-[#1e3a5f]" />
              <h4 className="text-[#1e3a5f] font-semibold">Evento</h4>
            </div>
            <p className="text-gray-700">{event.summary}</p>
            {event.creator?.email && (
              <p className="text-sm text-gray-500">Criador: {event.creator.email}</p>
            )}
            {event.organizer?.email && (
              <p className="text-sm text-gray-500">Organizador: {event.organizer.email}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6eb5d8] focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">{formatDate(date)}</p>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Horário
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6eb5d8] focus:border-transparent"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Duração</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6eb5d8] focus:border-transparent"
            >
              <option value="15min">15 minutos</option>
              <option value="30min">30 minutos</option>
              <option value="45min">45 minutos</option>
              <option value="1h">1 hora</option>
              <option value="1h30">1 hora e 30 minutos</option>
              <option value="2h">2 horas</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Descrição
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6eb5d8] focus:border-transparent resize-none"
              placeholder="Adicione observações sobre o evento..."
            >
              {event.description}
            </textarea>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t bg-gray-50 rounded-b-2xl flex gap-3">
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Cancelar Evento
          </button>

          <div className="flex-1"></div>

          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
          >
            Fechar
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-[#6eb5d8] text-white rounded-xl hover:bg-[#5aa5c8] transition-colors"
          >
            <Save className="w-5 h-5" />
            Salvar Alterações
          </button>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-4">
            <h3 className="text-xl text-[#1e3a5f] mb-4">
              Confirmar Cancelamento
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja cancelar o evento{" "}
              <strong>{event.summary}</strong> para o dia {formatDate(date)} às{" "}
              {time}?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Não, Manter
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                Sim, Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
