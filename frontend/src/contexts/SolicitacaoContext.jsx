import React, { createContext, useContext, useState, useCallback } from 'react';

const SolicitacaoContext = createContext();

export const useSolicitacao = () => {
  const context = useContext(SolicitacaoContext);
  if (!context) {
    throw new Error('useSolicitacao must be used within a SolicitacaoProvider');
  }
  return context;
};

export const SolicitacaoProvider = ({ children }) => {
  const [refreshHistorico, setRefreshHistorico] = useState(0);
  const [refreshBairro, setRefreshBairro] = useState(0);

  const notifyNovaReclamacao = useCallback(() => {
    // Incrementar para disparar useEffect nos componentes
    setRefreshHistorico(prev => prev + 1);
    setRefreshBairro(prev => prev + 1);
  }, []);

  return (
    <SolicitacaoContext.Provider value={{ refreshHistorico, refreshBairro, notifyNovaReclamacao }}>
      {children}
    </SolicitacaoContext.Provider>
  );
};
