import * as engine from 'store/src/store-engine';
import * as sessionStorage from 'store/storages/sessionStorage';
import * as localStorage from 'store/storages/localStorage';

const sessionStore = engine.createStore([sessionStorage]);
const localStore = engine.createStore([localStorage]);

import { ApplicationStorageTypeEnum, IApplicationStorage, STORAGE_KEY_SEPARATOR } from '../storage';
import { AnyT } from '../definitions.interface';
import { IApplicationSettings } from '../settings';

export class Storage implements IApplicationStorage {

  constructor(private prefix: string,
              private settingsResolver: () => IApplicationSettings,
              private storageType?: ApplicationStorageTypeEnum) {
  }

  set enabled(value: boolean) {
    this.storage.enabled = value;
  }

  get enabled(): boolean {
    return this.storage.enabled;
  }

  set disabled(value: boolean) {
    this.storage.disabled = value;
  }

  get disabled(): boolean {
    return this.storage.disabled;
  }

  public set(key: string, value: AnyT): Promise<boolean> {
    this.storage.set(this.toKey(key), value);
    return Promise.resolve(true);
  }

  public get(key: string): Promise<AnyT> {
    return Promise.resolve(this.storage.get(this.toKey(key)));
  }

  public remove(key: string, noPrefix?: boolean): Promise<boolean> {
    if (noPrefix) {
      this.storage.remove(key);
    } else {
      this.storage.remove(this.toKey(key));
    }
    return Promise.resolve(true);
  }

  public each(command: (key: string, value: AnyT) => void): void {
    this.storage.each((key, value) => command(this.toKey(key), value));
  }

  private get storage(): IApplicationStorage {
    const settings = this.settingsResolver();
    const storageType = this.storageType || (settings && settings.persistenceStorage);

    switch (storageType) {
      case ApplicationStorageTypeEnum.SESSION:
        return sessionStore;
      default:
        return localStore;
    }
  }

  private toKey(key: string): string {
    return [this.prefix, key].join(STORAGE_KEY_SEPARATOR);
  }
}
