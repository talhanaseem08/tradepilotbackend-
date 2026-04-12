import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const settingNofiticationFields = [
    { id: 'settingNofiticationSecretKey', label: 'Setting Nofitication Secret Key', value: 'AAAAxGHw9lE:APA91bHKj...' },
    { id: 'settingNofiticationPublicVapidKey', label: 'Setting Nofitication Public Vapid Key (key pair)', value: 'BKAvKJbnB...' },
    { id: 'settingNofiticationAPIKey', label: 'Setting Nofitication API Key', value: 'AIzaSyDg1xB...' },
    { id: 'settingNofiticationAuthDomain', label: 'Setting Nofitication AUTH Domain', value: 'wowdash.settingNofiticationapp.com' },
    { id: 'settingNofiticationProjectID', label: 'Setting Nofitication Project ID', value: 'wowdash.com' },
    { id: 'settingNofiticationStorageBucket', label: 'Setting Nofitication Storage Bucket', value: 'wowdash.appsport.com' },
    { id: 'settingNofiticationMessageSenderID', label: 'Setting Nofitication Message Sender ID', value: '52362145' },
    { id: 'settingNofiticationAppID', label: 'Setting Nofitication App ID', value: '1:843456771665:web:ac1e3115e9e17ee1582a70' },
    { id: 'settingNofiticationMeasurementID', label: 'Setting Nofitication Measurement ID', value: 'G-GSJPS921XW', colSpan: 2 },
];

const ClientsettingNofiticationWrapper = () => {
    return (
        <form>
            <div className="grid md:grid-cols-2 gap-5">
                {settingNofiticationFields.map(({ id, label, value, colSpan }) => (
                    <div key={id} className={`${colSpan === 2 ? 'md:col-span-2' : ''}`}>
                        <Label htmlFor={id} className="text-sm font-semibold mb-2 block text-foreground">
                            {label}
                        </Label>
                        <Input
                            id={id}
                            name={id}
                            type="text"
                            defaultValue={value}
                            placeholder={label}
                            className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0"
                        />
                    </div>
                ))}

                <div className="flex items-center justify-center gap-4 mt-6 md:col-span-2">
                    <Button
                        type="reset"
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive/10 h-12 px-10"
                    >
                        Reset
                    </Button>
                    <Button type="submit" className="h-12 px-10">
                        Save Changes
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default ClientsettingNofiticationWrapper;
