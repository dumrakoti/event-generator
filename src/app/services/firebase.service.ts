import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private db: AngularFireDatabase
  ) { }

  getAll(path: string) {
    return this.db.list(`${path}`);
  }

  getByKey(path: string, key: any) {
    return this.db.object(`${path}/${key}`);
  }

  create(path: string, player: Player): any {
    return this.db.list(path).push(player);
  }

  updateByKey(path: string, key: string, value: any): Promise<void> {
    return this.db.list(path).update(key, value);
  }

  deleteByKey(path: string, key: string): Promise<void> {
    return this.db.list(path).remove(key);
  }

  deleteAll(path: string): Promise<void> {
    return this.db.list(path).remove();
  }
  
}