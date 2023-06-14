import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { ClockIn } from '../entities/ClockIn';

export interface ClockInRepository {
  findAll(): Promise<ClockIn[]>;
  insert(entity: ClockIn): Promise<void>;
  findLast(limit?: number): Promise<ClockIn[]>;
}

export class SQLiteClockInRepository implements ClockInRepository {
  constructor(private readonly client: SQLiteDatabase) {}

  async findAll(): Promise<ClockIn[]> {
    const [response] = await this.client.executeSql('select * from clock_ins');

    return response.rows.raw().map(r => new ClockIn(r.date, r.time, r.type));
  }

  async insert(entity: ClockIn): Promise<void> {
    const params = [entity.date, entity.time, entity.type];

    const [response] = await this.client.executeSql(
      'select * from clock_ins where date = ? and time = ? and type = ?',
      params,
    );

    // preventing duplicates
    if (response.rows.length) {
      return;
    }

    await this.client.executeSql(
      'insert into clock_ins (date, time, type) values (?, ?, ?)',
      params,
    );
  }

  async findLast(limit = 5): Promise<ClockIn[]> {
    const [response] = await this.client.executeSql(
      `select * from clock_ins order by date desc, time desc, type desc limit ${limit}`,
    );

    return response.rows.raw().map(r => new ClockIn(r.date, r.time, r.type));
  }
}
