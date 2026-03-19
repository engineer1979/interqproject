export type PermissionAction = 'view' | 'create' | 'edit' | 'delete';
export type ModuleType = 'jobOpenings' | 'candidates' | 'interviews' | 'offers' | 'reports' | 'settings';
export type RoleStatus = 'active' | 'inactive';
export type UserStatus = 'active' | 'inactive' | 'pending';

export interface Permission {
  module: ModuleType;
  actions: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
}

export interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  status: RoleStatus;
  userCount: number;
  permissions: Permission[];
  parentRoleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  department: string;
  roles: string[];
  status: UserStatus;
  lastActive: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: 'role' | 'user' | 'permission';
  entityId: string;
  entityName: string;
  userId: string;
  userName: string;
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  timestamp: string;
}

export interface Team {
  id: string;
  name: string;
  leadRoleId: string;
  memberRoleIds: string[];
}

export interface RoleMetrics {
  totalRoles: number;
  activeRoles: number;
  inactiveRoles: number;
  totalUsers: number;
  permissionGaps: number;
}

export const MODULES: { key: ModuleType; label: string; icon: string }[] = [
  { key: 'jobOpenings', label: 'Job Openings', icon: 'Briefcase' },
  { key: 'candidates', label: 'Candidates', icon: 'Users' },
  { key: 'interviews', label: 'Interviews', icon: 'Calendar' },
  { key: 'offers', label: 'Offers', icon: 'FileText' },
  { key: 'reports', label: 'Reports', icon: 'BarChart' },
  { key: 'settings', label: 'Settings', icon: 'Settings' },
];

export const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-500',
  recruiter: 'bg-blue-500',
  hiringManager: 'bg-green-500',
  hrAssistant: 'bg-yellow-500',
  interviewer: 'bg-purple-500',
  default: 'bg-gray-500',
};
