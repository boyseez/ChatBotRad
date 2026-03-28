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
    if (mockUser) {
      return [200, JSON.parse(mockUser)];
    }
    return [401, { message: 'Unauthorized' }];
  });

  // Mock: /auth/login
  mock.onPost('/auth/login').reply((config) => {
    const { username, password } = JSON.parse(config.data);
    
    if (username === 'admin' && password === 'password') {
      const user = { 
        username: 'admin', 
        email: 'admin@example.com', 
        firstName: 'Mario', 
        lastName: 'Rossi', 
        roles: ['ROLE_ADMIN', 'ROLE_USER'] 
      };
      localStorage.setItem('mock_user', JSON.stringify(user));
      return [200, user];
    } 
    
    if (username === 'user' && password === 'password') {
      const user = { 
        username: 'user', 
        email: 'user@example.com', 
        firstName: 'Luigi', 
        lastName: 'Verdi', 
        roles: ['ROLE_USER'] 
      };
      localStorage.setItem('mock_user', JSON.stringify(user));
      return [200, user];
    }

    return [401, { message: 'Credenziali non valide' }];
  });

  // Mock: /auth/logout
  mock.onPost('/auth/logout').reply(() => {
    localStorage.removeItem('mock_user');
    return [200, { success: true }];
  });
}

export default api;
