
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface SubscriptionData {
  subscriptionEnd: string | null;
  subscriptionTier: string | null;
  subscribed: boolean;
}

export const useSubscriptionReminder = (subscriptionData: SubscriptionData) => {
  const [reminderShown, setReminderShown] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!subscriptionData.subscribed || !subscriptionData.subscriptionEnd || reminderShown) {
      return;
    }

    const endDate = new Date(subscriptionData.subscriptionEnd);
    const currentDate = new Date();
    const timeDiff = endDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Show reminder if subscription ends in 5 days or less
    if (daysDiff <= 5 && daysDiff > 0) {
      const reminderKey = `reminder_${subscriptionData.subscriptionEnd}`;
      const lastShown = localStorage.getItem(reminderKey);
      const today = new Date().toDateString();

      // Only show once per day
      if (lastShown !== today) {
        toast({
          title: "⚡ Subscription Renewal Reminder",
          description: `Your ${subscriptionData.subscriptionTier} subscription expires in ${daysDiff} day${daysDiff === 1 ? '' : 's'}. Consider renewing to maintain your digital discipline protection.`,
          duration: 10000,
        });

        localStorage.setItem(reminderKey, today);
        setReminderShown(true);
      }
    }
  }, [subscriptionData, reminderShown, toast]);

  const getDaysUntilExpiry = (): number | null => {
    if (!subscriptionData.subscriptionEnd) return null;
    
    const endDate = new Date(subscriptionData.subscriptionEnd);
    const currentDate = new Date();
    const timeDiff = endDate.getTime() - currentDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  return {
    daysUntilExpiry: getDaysUntilExpiry(),
    showReminderBanner: getDaysUntilExpiry() !== null && getDaysUntilExpiry()! <= 5 && getDaysUntilExpiry()! > 0
  };
};
