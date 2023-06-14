import { PropsWithChildren } from 'react';
import { SQLiteProvider } from './sqlite';

export default function AppProvider({ children }: PropsWithChildren) {
  return <SQLiteProvider>{children}</SQLiteProvider>;
}
