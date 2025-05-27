import { useContext } from 'react';
import { NavigationContext } from '../context/NavigationContext.tsx';

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};
