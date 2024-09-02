import { ServerContext } from '@/context/ServerProvider';
import { useContext } from 'react';

const useServer = () => {
  const context = useContext(ServerContext);
  if (context === undefined) {
    throw new Error('useServer must be used within a ServerProvider');
  }
  return context;
};

export default useServer;
