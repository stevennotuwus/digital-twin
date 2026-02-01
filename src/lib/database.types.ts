export interface Database {
  public: {
    Tables: {
      devices: {
        Row: {
          id: string;
          name: string;
          type: string;
          status: string;
          location: string | null;
          last_seen: string | null;
          metadata: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          status?: string;
          location?: string | null;
          last_seen?: string | null;
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          status?: string;
          location?: string | null;
          last_seen?: string | null;
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      sensor_readings: {
        Row: {
          id: string;
          device_id: string;
          metric_name: string;
          value: number;
          unit: string;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          device_id: string;
          metric_name: string;
          value: number;
          unit: string;
          timestamp?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          device_id?: string;
          metric_name?: string;
          value?: number;
          unit?: string;
          timestamp?: string;
          created_at?: string;
        };
      };
      device_alerts: {
        Row: {
          id: string;
          device_id: string;
          severity: string;
          message: string;
          resolved: boolean;
          created_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          device_id: string;
          severity: string;
          message: string;
          resolved?: boolean;
          created_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          device_id?: string;
          severity?: string;
          message?: string;
          resolved?: boolean;
          created_at?: string;
          resolved_at?: string | null;
        };
      };
    };
  };
}

export type Device = Database['public']['Tables']['devices']['Row'];
export type SensorReading = Database['public']['Tables']['sensor_readings']['Row'];
export type DeviceAlert = Database['public']['Tables']['device_alerts']['Row'];
