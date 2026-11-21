// Offline-First Classroom Sync Engine for Basement Labs & Hospital Wards
import { AttendanceRecord } from '../types';

export class OfflineSyncService {
  private static queue: AttendanceRecord[] = [];
  private static isOnline: boolean = true;
  private static listeners: Array<(count: number) => void> = [];

  public static addListener(callback: (count: number) => void) {
    this.listeners.push(callback);
    callback(this.queue.length);
  }

  public static removeListener(callback: (count: number) => void) {
    this.listeners = this.listeners.filter(cb => cb !== callback);
  }

  private static notifyListeners() {
    this.listeners.forEach(cb => cb(this.queue.length));
  }

  public static enqueueAttendance(records: AttendanceRecord[]) {
    // If simulated offline or real network drops, buffer into local memory queue
    records.forEach(r => {
      this.queue.push({ ...r, synced: false });
    });
    this.notifyListeners();
  }

  public static getPendingCount(): number {
    return this.queue.filter(r => !r.synced).length;
  }

  public static setOnlineState(online: boolean) {
    this.isOnline = online;
    if (online && this.queue.length > 0) {
      this.syncPendingRecords();
    }
  }

  public static getIsOnline(): boolean {
    return this.isOnline;
  }

  public static async syncPendingRecords(): Promise<{ success: boolean; syncedCount: number }> {
    const pending = this.queue.filter(r => !r.synced);
    if (pending.length === 0) return { success: true, syncedCount: 0 };

    // Simulate batch write to Firestore or Supabase
    await new Promise(resolve => setTimeout(resolve, 800));

    this.queue = [];
    this.notifyListeners();
    return { success: true, syncedCount: pending.length };
  }
}
