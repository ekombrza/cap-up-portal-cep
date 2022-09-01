import dayjs from 'dayjs/esm';

export interface IShortcuts {
  id?: number;
  label?: string;
  description?: string | null;
  icon?: string;
  link?: string;
  useRouter?: boolean | null;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
}

export class Shortcuts implements IShortcuts {
  constructor(
    public id?: number,
    public label?: string,
    public description?: string | null,
    public icon?: string,
    public link?: string,
    public useRouter?: boolean | null,
    public creationDate?: dayjs.Dayjs,
    public updatedDate?: dayjs.Dayjs | null
  ) {
    this.useRouter = this.useRouter ?? false;
  }
}

export function getShortcutsIdentifier(shortcuts: IShortcuts): number | undefined {
  return shortcuts.id;
}
