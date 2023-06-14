const dbConfig = {
  createTableStatement:
    'create table if not exists clock_ins (date text, time text, type text)',
};

export default dbConfig;
