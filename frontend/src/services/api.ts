import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  withCredentials: true,
});

export const isMockEnabled = import.meta.env.VITE_USE_MOCKS === 'true';

if (isMockEnabled) {
  const mock = new MockAdapter(api, { delayResponse: 500 });

  // Mock: /auth/me
  mock.onGet('/auth/me').reply(() => {
    const mockUser = localStorage.getItem('mock_user');
    if (mockUser) return [200, JSON.parse(mockUser)];
    return [401, { message: 'Unauthorized' }];
  });

  // Mock: /auth/login
  mock.onPost('/auth/login').reply((config) => {
    const { username, password } = JSON.parse(config.data);
    if (password === 'password') {
      const user = { 
        username, 
        email: `${username}@example.com`, 
        firstName: username.charAt(0).toUpperCase() + username.slice(1), 
        lastName: 'Demo', 
        roles: username === 'admin' ? ['ROLE_ADMIN', 'ROLE_USER'] : ['ROLE_USER'],
        language: username === 'admin' ? 'en' : 'it' // Admin in inglese, User in italiano
      };
      localStorage.setItem('mock_user', JSON.stringify(user));
      return [200, user];
    }
    return [401, { message: 'Credenziali non valide' }];
  });

  // Mock: /chats
  mock.onGet('/chats').reply(200, [
    { id: '1', title: 'Analisi Manuale PDF X1', date: '2 ore fa' },
    { id: '2', title: 'Domande su Video Formazione', date: 'Ieri' },
    { id: '3', title: 'Procedura Troubleshooting', date: '3 giorni fa' },
  ]);

  // Mock: /chats/:id/messages
  mock.onGet(/\/chats\/\d+\/messages/).reply((config) => {
    const id = config.url?.split('/')[2];
    const messages = [
      { id: 'm1', role: 'user', content: `Ciao, mostrami i dettagli della chat ${id}`, timestamp: new Date().toISOString() },
      { id: 'm2', role: 'assistant', content: `Certamente! Questi sono i messaggi recuperati per la conversazione numero ${id}.`, timestamp: new Date().toISOString() }
    ];
    
    if (id === '1') {
      messages.push({ 
        id: 'm3', role: 'assistant', content: 'In questa chat abbiamo parlato del manuale X1. Vuoi rivedere il video?', 
        timestamp: new Date().toISOString(), type: 'video', videoUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ' 
      });
    }

    return [200, messages];
  });

  mock.onDelete('/chats').reply(200);
  mock.onDelete(/\/chats\/\d+/).reply(200);
  mock.onPost('/auth/logout').reply(() => {
    localStorage.removeItem('mock_user');
    return [200];
  });
}

export default api;
