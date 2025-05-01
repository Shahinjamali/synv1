// src/types/oil.ts

export type OilTypeEnum = 'neat' | 'water-mixable' | 'grease';

// OilType: Defines the category and properties of an oil
export interface OilType {
  _id: string;
  name: string;
  brand: string;
  type: OilTypeEnum;
  properties?: { name: string; initialValue: number; unit: string }[]; // Optional default properties
}

export interface TrendData {
  [groupName: string]: {
    labels: string[];
    datasets: {
      label: string;
      data: (number | null)[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
      tension: number;
      pointRadius?: number;
      pointBackgroundColor?: string;
      showLine?: boolean;
    }[];
  };
}

export interface OilNotification {
  _id: string;
  equipmentId?: string; // Added
  userId?: string;
  companyId?: string;
  type: string;
  shortMessage: string;
  detailedMessage?: string;
  relatedData?: {
    entityType?: string;
    entityId?: string;
  };
  status: 'unread' | 'read' | 'archived';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  sentAt: string;
  metadata?: {
    sender?: string;
    senderId?: string;
    actionUrl?: string;
    threshold?: number;
    unit?: string;
    oilName?: string; // Added
  };
  oilTypeId?: string;
  parameter?: string; // Added
  value?: number; // Added
  expiresAt?: string; // Added (as string for JSON compatibility)
}

export interface OilAnalysisResponse {
  analyses: OilAnalysis[];
  total: number;
  pages: number;
  currentPage: number;
  trends: TrendData;
  notifications: OilNotification[];
  equipment?: {
    equipmentId: string;
    name: string;
    oilHistory: {
      oilTypeId: string;
      brand: string;
      name: string;
      fillDate: string;
      volume: number;
      application?: string;
      healthScore?: number; // Added for Phase 2, optional until Phase 3 enforces
      lastHealthUpdate?: string; // Added, optional
      deletedAt?: string | null; // Added for soft deletion
      oilType: 'neat' | 'water-mixable' | 'grease';
    }[];
  };
}

// OilEntry: Represents an instance of oil used in equipment
export interface OilEntry {
  _id?: string;
  oilTypeId: string;
  brand: string;
  name: string;
  oilType: 'neat' | 'water-mixable' | 'grease';
  fillDate: string;
  volume: number;
  application?: string;
  notes?: string;
  healthScore?: number; // Added for Phase 2, optional until Phase 3 enforces
  lastHealthUpdate?: string; // Added, optional
  deletedAt?: string | null; // Added for soft deletion
  labReports?: OilAnalysis[]; // Added for lab report integration
}

export interface OilAnalysis {
  _id?: string;
  id: string; // Required
  companyId: string;
  equipmentId: string;
  oilTypeId: {
    _id: string;
    name: string;
    brand: string;
    type: 'neat' | 'water-mixable' | 'grease';
  };
  source: 'lab' | 'sensor';
  sampleDate: string; // Required
  parameters: { name: string; value: number; unit: string }[];
  submissionDate?: string;
  resultsReceivedDate?: string;
  analystId?: string;
  status: 'pending' | 'completed'; // Lab report state
  condition: 'good' | 'caution' | 'critical' | 'informative'; // Oil health
  oilId?: string;
  submittedBy?: string;
}

// Parameter: Represents a single measurement in a lab report
export interface Parameter {
  name: string;
  value: number;
  unit: string;
  category: string;
  defaultValue?: number; // From OilParameter
  threshold?: { min?: number; max?: number }; // From OilParameter
}
export interface ParameterGroups {
  [key: string]: string[];
  pH: string[];
  Concentration: string[];
  Microbial: string[];
  Viscosity: string[];
  Wear: string[];
  Additives: string[];
  Contaminants: string[];
  Consistency: string[];
  Other: string[];
}
