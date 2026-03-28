import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState } from '@/store';
import { setAuthStart, setAuthSuccess, setAuthFailure } from '@/store/slices/authSlice';
import api from '@/services/api';
import { useLogger } from '@/hooks/use-logger';

export const useBffAuth = () => {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const logger = useLogger('useBffAuth');
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      // Evitiamo chiamate multiple se siamo già autenticati
      if (isAuthenticated) return;
      
      dispatch(setAuthStart());
      try {
        logger.debug('Verifica sessione BFF presso /auth/me...');
        const response = await api.get('/auth/me');
        
        if (!isMounted) return;

        if (response.data) {
          logger.success('Sessione valida trovata', response.data);
          dispatch(setAuthSuccess(response.data));
          
          // SINCRONIZZAZIONE LINGUA DAL PROFILO
          if (response.data.language) {
            logger.info(`Sincronizzazione lingua utente: ${response.data.language}`);
            i18n.changeLanguage(response.data.language);
          }
        } else {
          dispatch(setAuthFailure('Nessun dato utente ricevuto'));
        }
      } catch (error: any) {
        if (!isMounted) return;

        if (error.response?.status === 401) {
          logger.info('Utente non autenticato (401)');
          dispatch(setAuthFailure('Unauthorized'));
        } else {
          logger.error('Errore durante il controllo sessione', error);
          dispatch(setAuthFailure(error.message || 'Errore di rete'));
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [dispatch, isAuthenticated, logger, i18n]);

  // Sincronizza lingua anche dopo il login manuale tramite form
  useEffect(() => {
    if (user?.language) {
      i18n.changeLanguage(user.language);
    }
  }, [user, i18n]);

  return { user, isAuthenticated, loading };
};
