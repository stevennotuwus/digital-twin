import { useState, useEffect } from 'react';
import { X, Activity, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Device } from '../lib/database.types';

interface DeviceManagementModalProps {
  device?: Device;
  onClose: () => void;
  onSave: () => void;
}

const DEVICE_TYPES = [
  { value: 'temperature_sensor', label: 'Temperature Sensor' },
  { value: 'humidity_sensor', label: 'Humidity Sensor' },
  { value: 'pressure_sensor', label: 'Pressure Sensor' },
  { value: 'motion_detector', label: 'Motion Detector' },
  { value: 'smart_meter', label: 'Smart Meter' },
  { value: 'gateway', label: 'Gateway' },
  { value: 'actuator', label: 'Actuator' },
  { value: 'camera', label: 'Camera' },
];

export function DeviceManagementModal({ device, onClose, onSave }: DeviceManagementModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState(device?.name || '');
  const [type, setType] = useState(device?.type || 'temperature_sensor');
  const [location, setLocation] = useState(device?.location || '');
  const [status, setStatus] = useState(device?.status || 'online');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditing = !!device;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('devices')
          .update({
            name,
            type,
            location,
            status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', device.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('devices')
          .insert({
            name,
            type,
            location,
            status,
            user_id: user?.id,
            metadata: {},
          });

        if (error) throw error;
      }

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!device || !confirm('Are you sure you want to delete this device? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('devices')
        .delete()
        .eq('id', device.id);

      if (error) throw error;

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Device' : 'Add New Device'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Device Name *
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., Living Room Temperature Sensor"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Device Type *
            </label>
            <select
              id="type"
              required
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {DEVICE_TYPES.map((dt) => (
                <option key={dt.value} value={dt.value}>
                  {dt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., Building A, Floor 2"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              id="status"
              required
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="warning">Warning</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete Device
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
              >
                {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Device'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
