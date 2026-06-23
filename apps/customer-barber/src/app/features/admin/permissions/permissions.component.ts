import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  color: string;
  icon: string;
  isSystemRole: boolean;
  userCount: number;
  permissions: string[];
  createdAt: Date;
}

interface Permission {
  id: string;
  name: string;
  category: string;
  description: string;
  isEnabled: boolean;
}

interface PermissionCategory {
  name: string;
  icon: string;
  permissions: Permission[];
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  joinedDate: Date;
  lastActive: Date;
  isActive: boolean;
}

type ViewMode = 'roles' | 'permissions' | 'team';

@Component({
  selector: 'app-admin-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {
  roles = signal<Role[]>([]);
  permissionCategories = signal<PermissionCategory[]>([]);
  teamMembers = signal<TeamMember[]>([]);
  loading = signal(true);
  viewMode = signal<ViewMode>('roles');
  selectedRole = signal<Role | null>(null);
  selectedMember = signal<TeamMember | null>(null);
  showRoleModal = signal(false);
  showMemberModal = signal(false);
  showPermissionsModal = signal(false);
  processingAction = signal(false);
  searchQuery = signal('');

  // Filtered team members
  filteredMembers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.teamMembers();
    
    return this.teamMembers().filter(m => 
      m.name.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query) ||
      m.role.toLowerCase().includes(query)
    );
  });

  // Stats
  totalRoles = computed(() => this.roles().length);
  totalPermissions = computed(() => {
    return this.permissionCategories().reduce((sum, cat) => sum + cat.permissions.length, 0);
  });
  enabledPermissions = computed(() => {
    return this.permissionCategories().reduce((sum, cat) => 
      sum + cat.permissions.filter(p => p.isEnabled).length, 0
    );
  });
  totalMembers = computed(() => this.teamMembers().length);
  activeMembers = computed(() => this.teamMembers().filter(m => m.isActive).length);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);

    setTimeout(() => {
      // Load roles
      const mockRoles: Role[] = [
        {
          id: '1',
          name: 'ADMIN',
          displayName: 'Administrator',
          description: 'Full system access with all permissions',
          color: '#dc2626',
          icon: '👑',
          isSystemRole: true,
          userCount: 2,
          permissions: ['*'],
          createdAt: new Date(Date.now() - 365 * 86400000)
        },
        {
          id: '2',
          name: 'BARBER',
          displayName: 'Barber',
          description: 'Access to barber portal and appointment management',
          color: '#3b82f6',
          icon: '✂️',
          isSystemRole: true,
          userCount: 45,
          permissions: ['appointments.manage', 'services.manage', 'reviews.reply', 'earnings.view', 'profile.edit'],
          createdAt: new Date(Date.now() - 365 * 86400000)
        },
        {
          id: '3',
          name: 'CUSTOMER',
          displayName: 'Customer',
          description: 'Basic customer access for bookings and reviews',
          color: '#10b981',
          icon: '👤',
          isSystemRole: true,
          userCount: 328,
          permissions: ['appointments.book', 'appointments.cancel', 'reviews.create', 'profile.edit'],
          createdAt: new Date(Date.now() - 365 * 86400000)
        },
        {
          id: '4',
          name: 'MODERATOR',
          displayName: 'Content Moderator',
          description: 'Can moderate reviews and manage content',
          color: '#f59e0b',
          icon: '🛡️',
          isSystemRole: false,
          userCount: 3,
          permissions: ['reviews.moderate', 'content.manage', 'reports.view'],
          createdAt: new Date(Date.now() - 90 * 86400000)
        },
        {
          id: '5',
          name: 'SUPPORT',
          displayName: 'Customer Support',
          description: 'Can view and assist with customer issues',
          color: '#8b5cf6',
          icon: '💬',
          isSystemRole: false,
          userCount: 5,
          permissions: ['customers.view', 'appointments.view', 'support.manage'],
          createdAt: new Date(Date.now() - 60 * 86400000)
        }
      ];

      // Load permission categories
      const mockPermissions: PermissionCategory[] = [
        {
          name: 'Appointments',
          icon: '📅',
          permissions: [
            { id: 'appointments.view', name: 'View Appointments', category: 'Appointments', description: 'View all appointments', isEnabled: true },
            { id: 'appointments.book', name: 'Book Appointments', category: 'Appointments', description: 'Create new appointments', isEnabled: true },
            { id: 'appointments.manage', name: 'Manage Appointments', category: 'Appointments', description: 'Update and manage appointments', isEnabled: true },
            { id: 'appointments.cancel', name: 'Cancel Appointments', category: 'Appointments', description: 'Cancel appointments', isEnabled: true },
            { id: 'appointments.delete', name: 'Delete Appointments', category: 'Appointments', description: 'Permanently delete appointments', isEnabled: false }
          ]
        },
        {
          name: 'Users',
          icon: '👥',
          permissions: [
            { id: 'users.view', name: 'View Users', category: 'Users', description: 'View user profiles', isEnabled: true },
            { id: 'users.create', name: 'Create Users', category: 'Users', description: 'Create new user accounts', isEnabled: true },
            { id: 'users.edit', name: 'Edit Users', category: 'Users', description: 'Modify user information', isEnabled: true },
            { id: 'users.delete', name: 'Delete Users', category: 'Users', description: 'Delete user accounts', isEnabled: false },
            { id: 'users.block', name: 'Block Users', category: 'Users', description: 'Block/unblock users', isEnabled: true }
          ]
        },
        {
          name: 'Reviews',
          icon: '⭐',
          permissions: [
            { id: 'reviews.view', name: 'View Reviews', category: 'Reviews', description: 'View all reviews', isEnabled: true },
            { id: 'reviews.create', name: 'Write Reviews', category: 'Reviews', description: 'Create new reviews', isEnabled: true },
            { id: 'reviews.reply', name: 'Reply to Reviews', category: 'Reviews', description: 'Respond to reviews', isEnabled: true },
            { id: 'reviews.moderate', name: 'Moderate Reviews', category: 'Reviews', description: 'Flag, remove, or approve reviews', isEnabled: true },
            { id: 'reviews.delete', name: 'Delete Reviews', category: 'Reviews', description: 'Permanently delete reviews', isEnabled: true }
          ]
        },
        {
          name: 'Services',
          icon: '✂️',
          permissions: [
            { id: 'services.view', name: 'View Services', category: 'Services', description: 'View all services', isEnabled: true },
            { id: 'services.manage', name: 'Manage Services', category: 'Services', description: 'Create and edit services', isEnabled: true },
            { id: 'services.delete', name: 'Delete Services', category: 'Services', description: 'Remove services', isEnabled: true }
          ]
        },
        {
          name: 'Content',
          icon: '📝',
          permissions: [
            { id: 'content.view', name: 'View Content', category: 'Content', description: 'View CMS content', isEnabled: true },
            { id: 'content.manage', name: 'Manage Content', category: 'Content', description: 'Edit CMS content', isEnabled: true },
            { id: 'content.publish', name: 'Publish Content', category: 'Content', description: 'Publish content changes', isEnabled: true }
          ]
        },
        {
          name: 'System',
          icon: '⚙️',
          permissions: [
            { id: 'system.settings', name: 'System Settings', category: 'System', description: 'Modify system settings', isEnabled: true },
            { id: 'system.users', name: 'User Management', category: 'System', description: 'Full user management', isEnabled: true },
            { id: 'system.roles', name: 'Role Management', category: 'System', description: 'Manage roles and permissions', isEnabled: true },
            { id: 'system.logs', name: 'View Logs', category: 'System', description: 'Access system logs', isEnabled: true }
          ]
        }
      ];

      // Load team members
      const mockMembers: TeamMember[] = [
        {
          id: '1',
          name: 'John Admin',
          email: 'john.admin@barberly.com',
          role: 'ADMIN',
          avatar: 'https://i.pravatar.cc/150?img=12',
          joinedDate: new Date(Date.now() - 365 * 86400000),
          lastActive: new Date(Date.now() - 2 * 3600000),
          isActive: true
        },
        {
          id: '2',
          name: 'Sarah Manager',
          email: 'sarah.m@barberly.com',
          role: 'ADMIN',
          avatar: 'https://i.pravatar.cc/150?img=45',
          joinedDate: new Date(Date.now() - 180 * 86400000),
          lastActive: new Date(Date.now() - 5 * 3600000),
          isActive: true
        },
        {
          id: '3',
          name: 'Mike Moderator',
          email: 'mike.mod@barberly.com',
          role: 'MODERATOR',
          avatar: 'https://i.pravatar.cc/150?img=33',
          joinedDate: new Date(Date.now() - 90 * 86400000),
          lastActive: new Date(Date.now() - 24 * 3600000),
          isActive: true
        },
        {
          id: '4',
          name: 'Emma Support',
          email: 'emma.s@barberly.com',
          role: 'SUPPORT',
          avatar: 'https://i.pravatar.cc/150?img=47',
          joinedDate: new Date(Date.now() - 60 * 86400000),
          lastActive: new Date(Date.now() - 1 * 3600000),
          isActive: true
        },
        {
          id: '5',
          name: 'David Support',
          email: 'david.s@barberly.com',
          role: 'SUPPORT',
          avatar: 'https://i.pravatar.cc/150?img=51',
          joinedDate: new Date(Date.now() - 45 * 86400000),
          lastActive: new Date(Date.now() - 72 * 3600000),
          isActive: false
        }
      ];

      this.roles.set(mockRoles);
      this.permissionCategories.set(mockPermissions);
      this.teamMembers.set(mockMembers);
      this.loading.set(false);
    }, 800);
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode.set(mode);
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  viewRoleDetails(role: Role): void {
    this.selectedRole.set(role);
    this.showRoleModal.set(true);
  }

  viewMemberDetails(member: TeamMember): void {
    this.selectedMember.set(member);
    this.showMemberModal.set(true);
  }

  openPermissionsModal(role: Role): void {
    this.selectedRole.set(role);
    this.showPermissionsModal.set(true);
  }

  closeModals(): void {
    this.showRoleModal.set(false);
    this.showMemberModal.set(false);
    this.showPermissionsModal.set(false);
    setTimeout(() => {
      this.selectedRole.set(null);
      this.selectedMember.set(null);
    }, 300);
  }

  changeMemberRole(member: TeamMember, newRole: string): void {
    if (confirm(`Change ${member.name}'s role to ${newRole}?`)) {
      this.processingAction.set(true);

      setTimeout(() => {
        const updated = this.teamMembers().map(m =>
          m.id === member.id ? { ...m, role: newRole } : m
        );
        this.teamMembers.set(updated);
        this.processingAction.set(false);
        this.closeModals();
        alert(`${member.name}'s role has been changed to ${newRole}`);
      }, 1000);
    }
  }

  toggleMemberStatus(member: TeamMember): void {
    const action = member.isActive ? 'deactivate' : 'activate';
    if (confirm(`Are you sure you want to ${action} ${member.name}?`)) {
      const updated = this.teamMembers().map(m =>
        m.id === member.id ? { ...m, isActive: !m.isActive } : m
      );
      this.teamMembers.set(updated);
      this.closeModals();
    }
  }

  togglePermission(permission: Permission): void {
    const updated = this.permissionCategories().map(cat => ({
      ...cat,
      permissions: cat.permissions.map(p =>
        p.id === permission.id ? { ...p, isEnabled: !p.isEnabled } : p
      )
    }));
    this.permissionCategories.set(updated);
  }

  hasPermission(role: Role, permissionId: string): boolean {
    if (role.permissions.includes('*')) return true;
    return role.permissions.includes(permissionId);
  }

  getRoleColor(roleName: string): string {
    const role = this.roles().find(r => r.name === roleName);
    return role?.color || '#6b7280';
  }

  getRoleIcon(roleName: string): string {
    const role = this.roles().find(r => r.name === roleName);
    return role?.icon || '👤';
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  getRelativeTime(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    const days = Math.floor(seconds / 86400);
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days}d ago`;
    return this.formatDate(date);
  }
}
