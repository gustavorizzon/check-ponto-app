import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { ClockIn } from '../entities/ClockIn';

export interface ClockInRepository {
  findAll(): Promise<ClockIn[]>;
  insert(entity: ClockIn): Promise<boolean>;
  findLast(limit?: number): Promise<ClockIn[]>;
  delete(entity: ClockIn): Promise<void>;
}

export class SQLiteClockInRepository implements ClockInRepository {
  constructor(private readonly client: SQLiteDatabase) {}

  async findAll(): Promise<ClockIn[]> {
    const [response] = await this.client.executeSql('select * from clock_ins');

    return response.rows.raw().map(r => new ClockIn(r.date, r.time, r.type));
  }

  async insert(entity: ClockIn): Promise<boolean> {
    const params = [entity.date, entity.time, entity.type];

    const [response] = await this.client.executeSql(
      'select * from clock_ins where date = ? and time = ? and type = ?',
      params,
    );

    // preventing duplicates
    if (response.rows.length) {
      return false;
    }

    await this.client.executeSql(
      'insert into clock_ins (date, time, type) values (?, ?, ?)',
      params,
    );

    return true;
  }

  async findLast(limit = 5): Promise<ClockIn[]> {
    const [response] = await this.client.executeSql(
      `select * from clock_ins order by date desc, time desc, type desc limit ${limit}`,
    );

    return response.rows.raw().map(r => new ClockIn(r.date, r.time, r.type));
  }

  async delete(entity: ClockIn): Promise<void> {
    const params = [entity.date, entity.time, entity.type];

    await this.client.executeSql(
      'delete from clock_ins where date = ? and time = ? and type = ?',
      params,
    );
  }
}
