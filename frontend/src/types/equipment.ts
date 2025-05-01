// File: src/types/equipment.ts
import { OilAnalysis, OilNotification, OilEntry } from './oil';

// Event type for equipment events
export interface EquipmentEvent {
  type: 'oil_change' | 'maintenance' | 'vibration_anomaly' | 'failure';
  timestamp: string;
  details?: string;
  impactOnHealth?: number;
}

export interface Equipment {
  _id: string; // Required, as backend always returns it
  equipmentId?: string; // Optional, legacy compatibility
  name: string;
  companyId: string; // Required per backend schema
  type?: string;
  location?: string;
  status: 'active' | 'inactive'; // Default 'active' in backend, make required with default
  oilHistory: OilEntry[];
  operationalHours?: number;
  hoursPerDay?: number;
  section?: string;
  reportIds?: string[]; // Legacy, may phase out with Lab model
  healthScore: number; // Added from Phase 1
  lastHealthUpdate?: string; // ISO string, optional if not yet updated
  deletedAt?: string | null; // ISO string or null for soft deletion
  events?: EquipmentEvent[]; // Array of events, optional
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface EquipmentTableProps {
  equipmentList: Equipment[];
  notifications: (OilNotification & { equipmentId: string })[];
  analyses: OilAnalysis[];
  onOilChange: (equipmentId: string, oilName: string) => void;
  userRole: string;
  isRouterReady: boolean;
}

export interface EquipmentSummaryProps {
  equipment: Equipment | null;
  selectedOil: string | null;
  onOilChange: (oilName: string) => void;
}

export interface EquipmentFormProps {
  initialData?: Equipment;
  companyId: string;
  onSubmitSuccess: (newEquipment: Equipment) => void;
  onCancel: () => void;
}
