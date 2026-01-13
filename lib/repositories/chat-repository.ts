export interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  tag: string;
  avatar: string;
}

export interface IChatRepository {
  getConversations(): Promise<Conversation[]>;
}

export class ChatRepository implements IChatRepository {
  async getConversations(): Promise<Conversation[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        id: 1,
        name: 'Maria Silva',
        lastMessage: 'Gostaria de remarcar minha consulta',
        time: '10:30',
        unread: 2,
        tag: 'Urgente',
        avatar: 'MS',
      },
      {
        id: 2,
        name: 'João Santos',
        lastMessage: 'Obrigado pelo atendimento!',
        time: '09:45',
        unread: 0,
        tag: 'Concluído',
        avatar: 'JS',
      },
      {
        id: 3,
        name: 'Ana Oliveira',
        lastMessage: 'Qual o horário disponível?',
        time: '08:20',
        unread: 1,
        tag: 'Agendamento',
        avatar: 'AO',
      },
      {
        id: 4,
        name: 'Carlos Mendes',
        lastMessage: 'Preciso dos resultados do exame',
        time: 'Ontem',
        unread: 3,
        tag: 'Exames',
        avatar: 'CM',
      },
      {
        id: 5,
        name: 'Beatriz Costa',
        lastMessage: 'Confirmado para amanhã',
        time: 'Ontem',
        unread: 0,
        tag: 'Confirmado',
        avatar: 'BC',
      },
      {
        id: 6,
        name: 'Pedro Alves',
        lastMessage: 'Preciso agendar uma consulta',
        time: 'Ontem',
        unread: 1,
        tag: 'Agendamento',
        avatar: 'PA',
      },
      {
        id: 7,
        name: 'Lucia Martins',
        lastMessage: 'Pode me enviar o comprovante?',
        time: '2 dias',
        unread: 0,
        tag: 'Confirmado',
        avatar: 'LM',
      },
      {
        id: 8,
        name: 'Roberto Silva',
        lastMessage: 'Esqueci minha carteira de convênio',
        time: '2 dias',
        unread: 2,
        tag: 'Urgente',
        avatar: 'RS',
      },
      {
        id: 9,
        name: 'Fernanda Costa',
        lastMessage: 'Estava sentindo dores ontem',
        time: '2 dias',
        unread: 1,
        tag: 'Urgente',
        avatar: 'FC',
      },
      {
        id: 10,
        name: 'Marcos Souza',
        lastMessage: 'Tenho disponibilidade à tarde',
        time: '3 dias',
        unread: 0,
        tag: 'Agendamento',
        avatar: 'MS',
      },
      {
        id: 11,
        name: 'Sandra Oliveira',
        lastMessage: 'Muito obrigada pela atenção!',
        time: '3 dias',
        unread: 0,
        tag: 'Concluído',
        avatar: 'SO',
      },
      {
        id: 12,
        name: 'André Campos',
        lastMessage: 'Preciso do laudo médico',
        time: '4 dias',
        unread: 1,
        tag: 'Exames',
        avatar: 'AC',
      },
      {
        id: 13,
        name: 'Juliana Braga',
        lastMessage: 'Posso ir pela manhã?',
        time: '4 dias',
        unread: 0,
        tag: 'Agendamento',
        avatar: 'JB',
      },
      {
        id: 14,
        name: 'Thiago Melo',
        lastMessage: 'Confirmei minha presença',
        time: '5 dias',
        unread: 0,
        tag: 'Confirmado',
        avatar: 'TM',
      },
      {
        id: 15,
        name: 'Vanessa Dias',
        lastMessage: 'Quando sai o resultado?',
        time: '5 dias',
        unread: 2,
        tag: 'Exames',
        avatar: 'VD',
      },
    ];
  }
}
