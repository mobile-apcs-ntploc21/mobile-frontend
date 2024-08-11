import { ServersContext } from '@/context/ServersProvider';
import { useContext } from 'react';

const useServers = () => {
  const context = useContext(ServersContext);
  if (context === undefined) {
    throw new Error('useServers must be used within a ServersProvider');
  }
  return context;
};

export default useServers;
