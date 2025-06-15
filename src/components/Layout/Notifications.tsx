
import { useNotifications } from '@/hooks/useNotifications';
import { Bell, CheckCheck } from 'lucide-react';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Notification } from '@/hooks/useNotifications';

const NotificationItem = ({ notification, onNotificationClick }: { notification: Notification, onNotificationClick: (id: string) => void }) => {
    return (
        <DropdownMenuItem
            key={notification.id}
            className={cn(
                "flex flex-col items-start gap-1 p-3 cursor-pointer transition-colors hover:bg-gray-100", 
                !notification.read && "bg-blue-50 hover:bg-blue-100"
            )}
            onClick={() => {
                if (!notification.read) {
                    onNotificationClick(notification.id)
                }
            }}
            style={{ whiteSpace: 'normal', height: 'auto' }}
        >
            <p className="font-semibold text-sm">{notification.title}</p>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
            <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: fr })}
            </p>
        </DropdownMenuItem>
    );
}

export const NotificationsDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useNotifications();

  return (
    <DropdownMenuContent className="w-80 md:w-96" align="end">
      <DropdownMenuLabel className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <span className="font-bold text-lg">Notifications</span>
        </div>
        {unreadCount > 0 && (
             <Button variant="ghost" size="sm" onClick={() => markAllAsRead()} className="text-xs">
                <CheckCheck className="mr-1 h-4 w-4" />
                Marquer comme lues
            </Button>
        )}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <ScrollArea className="h-[350px]">
        {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Chargement...</div>
        ) : notifications.length > 0 ? (
          notifications.map((notif) => (
            <NotificationItem key={notif.id} notification={notif} onNotificationClick={markAsRead} />
          ))
        ) : (
          <div className="p-4 flex flex-col items-center justify-center text-center text-sm text-muted-foreground h-full">
            <Bell className="w-10 h-10 text-gray-300 mb-2" />
            <p>Aucune notification pour le moment.</p>
          </div>
        )}
      </ScrollArea>
    </DropdownMenuContent>
  );
};
