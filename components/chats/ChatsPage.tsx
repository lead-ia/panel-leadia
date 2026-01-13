import { Search } from 'lucide-react';
import { useState } from 'react';

interface Message {
  id: number;
  text: string;
  time: string;
  sender: 'user' | 'contact';
}

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  tag: string;
  tagColor: string;
  messages: Message[];
}

export function ChatsPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState('');

  const chats: Chat[] = [
    {
      id: 1,
      name: 'Maria Silva',
      lastMessage: 'Obrigada! Até amanhã.',
      time: '14:23',
      unread: 2,
      avatar: 'https://i.pravatar.cc/150?img=1',
      tag: 'Agendamento',
      tagColor: 'bg-blue-500',
      messages: [
        { id: 1, text: 'Boa tarde! Gostaria de agendar uma consulta.', time: '14:15', sender: 'contact' },
        { id: 2, text: 'Olá! Claro, temos disponibilidade amanhã às 10h. Pode ser?', time: '14:18', sender: 'user' },
        { id: 3, text: 'Perfeito! Pode confirmar para mim?', time: '14:20', sender: 'contact' },
        { id: 4, text: 'Confirmado! Consulta agendada para amanhã às 10h.', time: '14:22', sender: 'user' },
        { id: 5, text: 'Obrigada! Até amanhã.', time: '14:23', sender: 'contact' },
      ],
    },
    {
      id: 2,
      name: 'João Santos',
      lastMessage: 'Preciso remarcar minha consulta',
      time: '13:45',
      unread: 0,
      avatar: 'https://i.pravatar.cc/150?img=12',
      tag: 'Urgente',
      tagColor: 'bg-red-500',
      messages: [
        { id: 1, text: 'Olá, preciso remarcar minha consulta de amanhã', time: '13:40', sender: 'contact' },
        { id: 2, text: 'Sem problemas! Qual horário prefere?', time: '13:42', sender: 'user' },
        { id: 3, text: 'Preciso remarcar minha consulta', time: '13:45', sender: 'contact' },
      ],
    },
    {
      id: 3,
      name: 'Ana Oliveira',
      lastMessage: 'Qual o valor da consulta?',
      time: '12:30',
      unread: 1,
      avatar: 'https://i.pravatar.cc/150?img=5',
      tag: 'Informação',
      tagColor: 'bg-yellow-500',
      messages: [
        { id: 1, text: 'Boa tarde! Gostaria de saber o valor da consulta.', time: '12:25', sender: 'contact' },
        { id: 2, text: 'Olá! A consulta custa R$ 200,00.', time: '12:28', sender: 'user' },
        { id: 3, text: 'Qual o valor da consulta?', time: '12:30', sender: 'contact' },
      ],
    },
    {
      id: 4,
      name: 'Carlos Mendes',
      lastMessage: 'Recebi o resultado do exame',
      time: '11:15',
      unread: 0,
      avatar: 'https://i.pravatar.cc/150?img=13',
      tag: 'Concluído',
      tagColor: 'bg-green-500',
      messages: [
        { id: 1, text: 'Bom dia! Recebi o resultado do meu exame.', time: '11:10', sender: 'contact' },
        { id: 2, text: 'Ótimo! Vou analisar e entro em contato.', time: '11:12', sender: 'user' },
        { id: 3, text: 'Recebi o resultado do exame', time: '11:15', sender: 'contact' },
      ],
    },
    {
      id: 5,
      name: 'Beatriz Costa',
      lastMessage: 'Confirmado! Obrigada',
      time: '10:50',
      unread: 0,
      avatar: 'https://i.pravatar.cc/150?img=9',
      tag: 'Agendamento',
      tagColor: 'bg-blue-500',
      messages: [
        { id: 1, text: 'Olá! Gostaria de confirmar minha consulta de sexta.', time: '10:45', sender: 'contact' },
        { id: 2, text: 'Olá Beatriz! Sua consulta está confirmada para sexta às 15h.', time: '10:48', sender: 'user' },
        { id: 3, text: 'Confirmado! Obrigada', time: '10:50', sender: 'contact' },
      ],
    },
    {
      id: 6,
      name: 'Pedro Alves',
      lastMessage: 'Posso levar os exames anteriores?',
      time: '09:20',
      unread: 3,
      avatar: 'https://i.pravatar.cc/150?img=14',
      tag: 'Informação',
      tagColor: 'bg-yellow-500',
      messages: [
        { id: 1, text: 'Bom dia! Tenho consulta amanhã.', time: '09:15', sender: 'contact' },
        { id: 2, text: 'Bom dia Pedro! Sim, sua consulta é às 14h.', time: '09:17', sender: 'user' },
        { id: 3, text: 'Posso levar os exames anteriores?', time: '09:20', sender: 'contact' },
      ],
    },
  ];

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Aqui você adicionaria a lógica para enviar a mensagem
      setMessageInput('');
    }
  };

  return (
    <div className="flex h-full bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      {/* Lista de conversas - Lado Esquerdo */}
      <div className="w-[380px] border-r border-gray-200 flex flex-col bg-white">
        {/* Header da lista */}
        <div className="p-4 bg-[#f0f2f5] border-b border-gray-200">
          <h2 className="text-[#1e3a5f] mb-3">Conversas</h2>
          
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar ou começar uma nova conversa"
              className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#6eb5d8]"
            />
          </div>
        </div>

        {/* Lista de conversas */}
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-[#f5f6f6] transition-colors ${
                selectedChat === chat.id ? 'bg-[#f0f2f5]' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate flex-1">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <span className="ml-2 bg-[#25d366] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <div className="mt-1">
                    <span className={`${chat.tagColor} text-white text-xs px-2 py-0.5 rounded-full`}>
                      {chat.tag}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área de conversa - Lado Direito */}
      <div className="flex-1 flex flex-col">
        {selectedChatData ? (
          <>
            {/* Header da conversa */}
            <div className="p-4 bg-[#f0f2f5] border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                  {selectedChatData.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedChatData.name}</h3>
                  <p className="text-xs text-gray-500">online</p>
                </div>
              </div>
            </div>

            {/* Mensagens */}
            <div 
              className="flex-1 overflow-y-auto p-6 bg-[#efeae2]"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h100v100H0z\' fill=\'%23efeae2\'/%3E%3Cpath d=\'M20 20l5 5-5 5M80 20l-5 5 5 5M20 80l5-5-5-5M80 80l-5-5 5-5\' stroke=\'%23d5d0c8\' stroke-width=\'0.5\' fill=\'none\' opacity=\'0.1\'/%3E%3C/svg%3E")',
              }}
            >
              <div className="space-y-3 max-w-4xl mx-auto">
                {selectedChatData.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[65%] rounded-lg px-4 py-2 shadow-sm ${
                        message.sender === 'user'
                          ? 'bg-[#d9fdd3]'
                          : 'bg-white'
                      }`}
                    >
                      <p className="text-sm text-gray-800">{message.text}</p>
                      <span className="text-xs text-gray-500 mt-1 block text-right">
                        {message.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer - Read Only Notice */}
            <div className="p-4 bg-[#f0f2f5] border-t border-gray-200">
              <p className="text-center text-sm text-gray-500">
                Modo visualização - Apenas leitura
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#f0f2f5]">
            <div className="text-center">
              <div className="w-64 h-64 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                <svg
                  viewBox="0 0 303 172"
                  width="200"
                  preserveAspectRatio="xMidYMid meet"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M229.565 160.527c32.647-5.23 58.5-33.075 58.5-66.95 0-37.555-30.444-68-68-68-14.636 0-28.198 4.622-39.283 12.48C167.801 15.958 143.488 0 115.5 0 79.056 0 49 30.056 49 66.5c0 11.82 3.108 22.916 8.555 32.52C23.833 104.116 0 130.456 0 162.5c0 37.555 30.444 68 68 68h153.5c37.556 0 68-30.445 68-68 0-33.947-24.883-62.078-57.435-66.973z"
                    fill="#DFE5E7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl text-gray-800 mb-2">WhatsApp Web</h2>
              <p className="text-gray-600 mb-4">
                Selecione uma conversa para começar a enviar mensagens
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}