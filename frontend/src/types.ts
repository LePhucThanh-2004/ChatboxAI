export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
  }
  
  export interface ScheduleEvent {
    title: string;
    datetime: string;
  }
  
  export interface VoiceInput {
    text: string;
    isSpeaking: boolean;
  }