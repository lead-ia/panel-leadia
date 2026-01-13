import { X, Send, Tag, Check } from 'lucide-react';
import { useState } from 'react';

interface Message {
  id: number;
  text: string;
  time: string;
  sender: 'patient' | 'clinic';
}

interface ChatModalProps {
  chatId: number;
  onClose: () => void;
}

const chatData: Record<number, {
  name: string;
  avatar: string;
  phone: string;
  currentTag: string;
  messages: Message[];
}> = {
  1: {
    name: 'Maria Silva',
    avatar: 'MS',
    phone: '+55 11 98765-4321',
    currentTag: 'Urgente',
    messages: [
      { id: 1, text: 'Olá, bom dia!', time: '09:15', sender: 'patient' },
      { id: 2, text: 'Bom dia, Maria! Como posso ajudar?', time: '09:16', sender: 'clinic' },
      { id: 3, text: 'Preciso remarcar minha consulta de amanhã', time: '09:17', sender: 'patient' },
      { id: 4, text: 'Claro! Qual seria o melhor dia para você?', time: '09:18', sender: 'clinic' },
      { id: 5, text: 'Teria algum horário na próxima semana?', time: '10:25', sender: 'patient' },
      { id: 6, text: 'Gostaria de remarcar minha consulta', time: '10:30', sender: 'patient' },
    ],
  },
  2: {
    name: 'João Santos',
    avatar: 'JS',
    phone: '+55 11 98765-1234',
    currentTag: 'Concluído',
    messages: [
      { id: 1, text: 'Boa tarde!', time: 'Ontem 14:30', sender: 'patient' },
      { id: 2, text: 'Boa tarde, João! Tudo bem?', time: 'Ontem 14:31', sender: 'clinic' },
      { id: 3, text: 'Vim confirmar minha consulta de amanhã às 10h', time: 'Ontem 14:32', sender: 'patient' },
      { id: 4, text: 'Confirmado! Te esperamos amanhã às 10h.', time: 'Ontem 14:33', sender: 'clinic' },
      { id: 5, text: 'Perfeito, muito obrigado!', time: 'Ontem 14:35', sender: 'patient' },
      { id: 6, text: 'Obrigado pelo atendimento!', time: '09:45', sender: 'patient' },
    ],
  },
  3: {
    name: 'Ana Oliveira',
    avatar: 'AO',
    phone: '+55 11 98765-5678',
    currentTag: 'Agendamento',
    messages: [
      { id: 1, text: 'Olá!', time: '08:15', sender: 'patient' },
      { id: 2, text: 'Olá, Ana! Como posso ajudar?', time: '08:16', sender: 'clinic' },
      { id: 3, text: 'Gostaria de agendar uma consulta', time: '08:17', sender: 'patient' },
      { id: 4, text: 'Ótimo! Temos disponibilidade esta semana. Qual seria o melhor dia?', time: '08:18', sender: 'clinic' },
      { id: 5, text: 'Qual o horário disponível?', time: '08:20', sender: 'patient' },
    ],
  },
  4: {
    name: 'Carlos Mendes',
    avatar: 'CM',
    phone: '+55 11 98765-9012',
    currentTag: 'Exames',
    messages: [
      { id: 1, text: 'Bom dia', time: 'Ontem 10:00', sender: 'patient' },
      { id: 2, text: 'Bom dia, Carlos!', time: 'Ontem 10:05', sender: 'clinic' },
      { id: 3, text: 'Fiz os exames na semana passada', time: 'Ontem 10:06', sender: 'patient' },
      { id: 4, text: 'Sim, estamos aguardando o resultado do laboratório.', time: 'Ontem 10:10', sender: 'clinic' },
      { id: 5, text: 'Preciso dos resultados do exame', time: 'Ontem 15:30', sender: 'patient' },
    ],
  },
  5: {
    name: 'Beatriz Costa',
    avatar: 'BC',
    phone: '+55 11 98765-3456',
    currentTag: 'Confirmado',
    messages: [
      { id: 1, text: 'Oi, tudo bem?', time: 'Ontem 11:00', sender: 'patient' },
      { id: 2, text: 'Tudo ótimo! E você, Beatriz?', time: 'Ontem 11:02', sender: 'clinic' },
      { id: 3, text: 'Vim confirmar minha consulta de amanhã', time: 'Ontem 11:03', sender: 'patient' },
      { id: 4, text: 'Sua consulta está agendada para amanhã às 15h. Confirmado!', time: 'Ontem 11:05', sender: 'clinic' },
      { id: 5, text: 'Confirmado para amanhã', time: 'Ontem 11:06', sender: 'patient' },
    ],
  },
};

const availableTags = [
  { label: 'Urgente', color: 'bg-red-500' },
  { label: 'Agendamento', color: 'bg-[#6eb5d8]' },
  { label: 'Concluído', color: 'bg-green-500' },
  { label: 'Exames', color: 'bg-yellow-500' },
  { label: 'Confirmado', color: 'bg-green-500' },
  { label: 'Pendente', color: 'bg-orange-500' },
  { label: 'Cancelado', color: 'bg-gray-500' },
];

export function ChatModal({ chatId, onClose }: ChatModalProps) {
  const chat = chatData[chatId];
  const [newMessage, setNewMessage] = useState('');
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [selectedTag, setSelectedTag] = useState(chat.currentTag);

  if (!chat) return null;

  const handleSend = () => {
    if (newMessage.trim()) {
      // Aqui você adicionaria a lógica para enviar a mensagem
      setNewMessage('');
    }
  };

  const handleTagSelect = (tagLabel: string) => {
    setSelectedTag(tagLabel);
    setShowTagMenu(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#6eb5d8] text-white p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                {chat.avatar}
              </div>
              <div>
                <h3 className="font-semibold">{chat.name}</h3>
                <p className="text-sm opacity-90">{chat.phone}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Tag Section */}
          <div className="mt-3 relative">
            <button
              onClick={() => setShowTagMenu(!showTagMenu)}
              className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg hover:bg-white/30 transition-colors"
            >
              <Tag className="w-4 h-4" />
              <span className="text-sm">Etiqueta: {selectedTag}</span>
            </button>
            
            {showTagMenu && (
              <div className="absolute top-full mt-2 bg-white rounded-xl shadow-xl p-2 z-10 min-w-[200px]">
                {availableTags.map((tag) => (
                  <button
                    key={tag.label}
                    onClick={() => handleTagSelect(tag.label)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors text-left"
                  >
                    <span className={`${tag.color} w-3 h-3 rounded-full`}></span>
                    <span className="text-gray-700 text-sm">{tag.label}</span>
                    {selectedTag === tag.label && (
                      <Check className="w-4 h-4 text-[#6eb5d8] ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="space-y-4">
            {chat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'clinic' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.sender === 'clinic'
                      ? 'bg-[#6eb5d8] text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-md'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'clinic' ? 'text-white/70' : 'text-gray-500'
                    }`}
                  >
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white rounded-b-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6eb5d8] focus:border-transparent"
            />
            <button
              onClick={handleSend}
              className="bg-[#6eb5d8] text-white px-6 py-3 rounded-xl hover:bg-[#5aa5c8] transition-colors flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
