import { Buffer } from 'buffer';

export enum ClockInType {
  Entry = 'E',
  Exit = 'S',
}

export const ClockInTypeDescription = {
  [ClockInType.Entry]: 'Entrada',
  [ClockInType.Exit]: 'Saída',
};

export class ClockIn {
  #id: string;

  constructor(
    public date: string,
    public time: string,
    public type: ClockInType,
  ) {
    this.#id = new Buffer(`${date}-${time}-${type}`).toString('base64');
  }

  get id() {
    return this.#id;
  }
}
