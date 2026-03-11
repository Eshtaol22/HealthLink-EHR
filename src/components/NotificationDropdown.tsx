import { useState } from 'react';
import { UserRole } from '../App';
import { Bell, X, AlertCircle, Calendar, Pill, FileText, UserCheck, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface Notification {
  id: string;
  type: 'appointment' | 'prescription' | 'alert' | 'system' | 'lab' | 'admin';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationDropdownProps {
  userRole: UserRole;
}

// Generate role-specific mock notifications
const generateNotifications = (role: UserRole): Notification[] => {
  const baseDate = new Date();
  
  if (role === 'doctor') {
    return [
      {
        id: '1',
        type: 'alert',
        title: 'Drug Interaction Alert',
        message: 'Patient Sarah Williams: Warfarin interaction detected with new prescription',
        timestamp: new Date(baseDate.getTime() - 15 * 60000),
        read: false,
        priority: 'high',
      },
      {
        id: '2',
        type: 'appointment',
        title: 'Upcoming Appointment',
        message: 'John Doe scheduled for consultation in 30 minutes',
        timestamp: new Date(baseDate.getTime() - 45 * 60000),
        read: false,
        priority: 'medium',
      },
      {
        id: '3',
        type: 'lab',
        title: 'Lab Results Ready',
        message: 'Blood work results available for Michael Johnson',
        timestamp: new Date(baseDate.getTime() - 2 * 60 * 60000),
        read: true,
        priority: 'medium',
      },
      {
        id: '4',
        type: 'prescription',
        title: 'Prescription Approved',
        message: 'Prescription for Emily Davis has been dispensed',
        timestamp: new Date(baseDate.getTime() - 4 * 60 * 60000),
        read: true,
        priority: 'low',
      },
      {
        id: '5',
        type: 'system',
        title: 'System Update',
        message: 'New clinical guidelines added to the reference library',
        timestamp: new Date(baseDate.getTime() - 24 * 60 * 60000),
        read: true,
        priority: 'low',
      },
    ];
  }
  
  if (role === 'nurse') {
    return [
      {
        id: '1',
        type: 'appointment',
        title: 'Patient Check-in',
        message: 'Sarah Williams has checked in for her appointment',
        timestamp: new Date(baseDate.getTime() - 10 * 60000),
        read: false,
        priority: 'medium',
      },
      {
        id: '2',
        type: 'alert',
        title: 'Vitals Alert',
        message: 'Elevated blood pressure recorded for John Doe (160/95)',
        timestamp: new Date(baseDate.getTime() - 30 * 60000),
        read: false,
        priority: 'high',
      },
      {
        id: '3',
        type: 'prescription',
        title: 'Medication Due',
        message: 'Morning medications due for Room 204',
        timestamp: new Date(baseDate.getTime() - 1 * 60 * 60000),
        read: true,
        priority: 'medium',
      },
      {
        id: '4',
        type: 'lab',
        title: 'Sample Collection',
        message: 'Lab samples needed for Michael Johnson at 2 PM',
        timestamp: new Date(baseDate.getTime() - 3 * 60 * 60000),
        read: true,
        priority: 'medium',
      },
    ];
  }
  
  if (role === 'patient') {
    return [
      {
        id: '1',
        type: 'appointment',
        title: 'Appointment Reminder',
        message: 'Your appointment with Dr. Smith is tomorrow at 10:00 AM',
        timestamp: new Date(baseDate.getTime() - 20 * 60000),
        read: false,
        priority: 'high',
      },
      {
        id: '2',
        type: 'prescription',
        title: 'Prescription Ready',
        message: 'Your prescription is ready for pickup at the pharmacy',
        timestamp: new Date(baseDate.getTime() - 2 * 60 * 60000),
        read: false,
        priority: 'medium',
      },
      {
        id: '3',
        type: 'lab',
        title: 'Lab Results Available',
        message: 'Your recent lab results are now available to view',
        timestamp: new Date(baseDate.getTime() - 5 * 60 * 60000),
        read: true,
        priority: 'medium',
      },
      {
        id: '4',
        type: 'system',
        title: 'Health Tip',
        message: 'Remember to take your daily medications as prescribed',
        timestamp: new Date(baseDate.getTime() - 24 * 60 * 60000),
        read: true,
        priority: 'low',
      },
    ];
  }
  
  if (role === 'admin') {
    return [
      {
        id: '1',
        type: 'system',
        title: 'System Backup Complete',
        message: 'Daily database backup completed successfully',
        timestamp: new Date(baseDate.getTime() - 30 * 60000),
        read: false,
        priority: 'low',
      },
      {
        id: '2',
        type: 'admin',
        title: 'New User Registration',
        message: '3 new healthcare providers registered and pending approval',
        timestamp: new Date(baseDate.getTime() - 1 * 60 * 60000),
        read: false,
        priority: 'medium',
      },
      {
        id: '3',
        type: 'alert',
        title: 'Security Alert',
        message: 'Unusual login activity detected from IP 192.168.1.100',
        timestamp: new Date(baseDate.getTime() - 2 * 60 * 60000),
        read: false,
        priority: 'high',
      },
      {
        id: '4',
        type: 'admin',
        title: 'Compliance Report',
        message: 'Monthly HIPAA compliance report is ready for review',
        timestamp: new Date(baseDate.getTime() - 6 * 60 * 60000),
        read: true,
        priority: 'medium',
      },
      {
        id: '5',
        type: 'system',
        title: 'System Performance',
        message: 'Server response time is 15% faster this week',
        timestamp: new Date(baseDate.getTime() - 24 * 60 * 60000),
        read: true,
        priority: 'low',
      },
    ];
  }
  
  return [];
};

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'appointment':
      return Calendar;
    case 'prescription':
      return Pill;
    case 'alert':
      return AlertCircle;
    case 'lab':
      return FileText;
    case 'admin':
      return UserCheck;
    case 'system':
      return TrendingUp;
    default:
      return Bell;
  }
};

const getPriorityColor = (priority: Notification['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 border-red-200';
    case 'medium':
      return 'bg-yellow-50 border-yellow-200';
    case 'low':
      return 'bg-blue-50 border-blue-200';
  }
};

const getPriorityIconColor = (priority: Notification['priority']) => {
  switch (priority) {
    case 'high':
      return 'text-red-600';
    case 'medium':
      return 'text-yellow-600';
    case 'low':
      return 'text-blue-600';
  }
};

export function NotificationDropdown({ userRole }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(() => 
    generateNotifications(userRole)
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-40 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-500">{unreadCount} unread</p>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    return (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getPriorityColor(
                              notification.priority
                            )}`}
                          >
                            <Icon
                              className={`w-5 h-5 ${getPriorityIconColor(
                                notification.priority
                              )}`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm text-gray-900">
                                {notification.title}
                              </p>
                              <button
                                onClick={(e) => deleteNotification(notification.id, e)}
                                className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
                              >
                                <X className="w-3 h-3 text-gray-400" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDistanceToNow(notification.timestamp, {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700">
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
