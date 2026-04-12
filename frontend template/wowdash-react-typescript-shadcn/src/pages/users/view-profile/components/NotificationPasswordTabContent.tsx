import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const NotificationPasswordTabContent = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
                <Label htmlFor="companyNews" className="font-medium text-sm text-muted-foreground">
                    Company News
                </Label>
                <Switch id="companyNews" />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
                <Label htmlFor="pushNotification" className="font-medium text-sm text-muted-foreground">
                    Push Notification
                </Label>
                <Switch id="pushNotification" defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
                <Label htmlFor="weeklyLetters" className="font-medium text-sm text-muted-foreground">
                    Weekly News Letters
                </Label>
                <Switch id="weeklyLetters" defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
                <Label htmlFor="meetUp" className="font-medium text-sm text-muted-foreground">
                    Meetups Near You
                </Label>
                <Switch id="meetUp" />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
                <Label htmlFor="orderNotification" className="font-medium text-sm text-muted-foreground">
                    Orders Notifications
                </Label>
                <Switch id="orderNotification" defaultChecked />
            </div>
        </div>
    );
};

export default NotificationPasswordTabContent;
