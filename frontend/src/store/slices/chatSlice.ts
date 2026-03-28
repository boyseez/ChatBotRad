import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  type?: "text" | "video" | "reference";
  references?: string[];
  videoUrl?: string;
}

interface ChatState {
  activeChatId: string | null;
  messages: Message[];
  loading: boolean;
}

const initialState: ChatState = {
  activeChatId: null,
  messages: [],
  loading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveChat: (state, action: PayloadAction<string | null>) => {
      state.activeChatId = action.payload;
      if (action.payload === null) {
        state.messages = []; // Reset per nuova chat
      }
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
      state.loading = false;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setChatLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  },
});

export const { setActiveChat, setMessages, addMessage, setChatLoading } = chatSlice.actions;
export default chatSlice.reducer;
