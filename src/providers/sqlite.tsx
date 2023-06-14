import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import SQLite from 'react-native-sqlite-storage';
import dbConfig from '../config/db';
import {
  ClockInRepository,
  SQLiteClockInRepository,
} from '../repositories/ClockInRepository';

SQLite.enablePromise(true);

interface SQLiteContextData {
  clockInRepository: ClockInRepository;
}

const SQLiteContext = createContext<SQLiteContextData>({} as SQLiteContextData);

export function SQLiteProvider({ children }: PropsWithChildren) {
  const [db, setDb] = useState<SQLite.SQLiteDatabase>();

  useEffect(() => {
    SQLite.openDatabase({ name: 'checkponto.db', location: 'default' })
      .then(conn => {
        setDb(conn);

        conn
          .executeSql(dbConfig.createTableStatement)
          .then(() => {
            console.info('[CheckPonto] Clock-Ins table created successfully');
          })
          .catch(err =>
            console.error('[CheckPonto] Error creating clock-ins table', {
              err,
            }),
          );
      })
      .catch(err => {
        console.error('[CheckPonto] Error creating local database', { err });
      });
  }, []);

  const clockInRepository = useMemo<ClockInRepository>(() => {
    return db
      ? new SQLiteClockInRepository(db)
      : { findAll: async () => [], insert: async () => {} };
  }, [db]);

  return (
    <SQLiteContext.Provider value={{ clockInRepository }}>
      {children}
    </SQLiteContext.Provider>
  );
}

export function useDatabase() {
  return useContext(SQLiteContext);
}
