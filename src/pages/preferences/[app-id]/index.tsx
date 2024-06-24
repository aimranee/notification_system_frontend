import { BellRing, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import TemplateService from "@/services/TemplateService";
import Spinner from "@/components/spinner";
import PreferencesServices from "@/services/preferencesServices";
import { useToast } from "@/components/ui/use-toast";

type CardProps = React.ComponentProps<typeof Card>;

export function Preferences({ className, ...props }: CardProps) {
  const eventService = new TemplateService("");
  const preferenceService = new PreferencesServices();
  const [preferencesState, setPreferencesState] = useState<{
    [key: string]: boolean;
  }>({});
  const router = useRouter();
  const appId = router.query?.["app-id"];
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();
  const {
    data: events,
    isLoading: eventsLoading,
    error: eventsError,
  } = useQuery(["getAllEventNames"], () => eventService.getAllEventNames());

  const {
    data: preferenceToken,
    isLoading: tokenLoading,
    error: tokenError,
  } = useQuery("findPreferencesByToken", () =>
    preferenceService.findPreferencesByToken(
      (router.query.token as string) || ""
    )
  );

  const email = preferenceToken?.recipient.email;

  const {
    data: preferences,
    isLoading: preferencesLoading,
    error: preferencesError,
  } = useQuery(
    ["findPreferencesByRecipientEmail", email],
    () => preferenceService.findPreferencesByRecipientEmail(email as string),
    { enabled: !!email }
  );

  useEffect(() => {
    if (preferences && events) {
      const initialPreferences = events.reduce(
        (acc: { [key: string]: boolean }, event: any) => {
          const existsInPreferences = preferences.some(
            (pref: any) =>
              pref.recipientEmail === email &&
              pref.eventName === event.eventName
          );
          acc[event.eventName] = !existsInPreferences; // Uncheck existing events
          return acc;
        },
        {}
      );
      setPreferencesState(initialPreferences);
    }
  }, [preferences, events, email]);

  const handleToggle = (eventName: string) => {
    setPreferencesState((prevState) => ({
      ...prevState,
      [eventName]: !prevState[eventName],
    }));
    setHasChanges(true);
  };

  const savePreferences = async () => {
    const eventNamesToSave = Object.entries(preferencesState)
      .filter(([_, checked]) => !checked) // Only unchecked events
      .map(([eventName]) => eventName);

    try {
      await preferenceService.createPreferences({
        recipientEmail: email as string,
        eventNames: eventNamesToSave,
      });
      toast({ description: "Preferences saved successfully!" });
      setHasChanges(false); // Reset hasChanges after successful save
    } catch (error) {
      console.error("Error saving preferences", error);
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "Error saving preferences" + error,
      });
    }
  };

  if (eventsLoading || tokenLoading || preferencesLoading) return <Spinner />;
  if (eventsError) return <div>Error loading events</div>;
  if (preferencesError) return <div>Error loading preferences</div>;
  if (tokenError) return <div>Error loading token</div>;

  return (
    <div className="flex justify-center items-center gap-4 p-4 md:gap-8 md:p-8">
      <Card className={cn("w-[400px]", className)} {...props}>
        <CardHeader>
          <CardTitle>User Email</CardTitle>
          <CardDescription>{email}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center space-x-4 rounded-md p-4">
            <BellRing />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                Preferences of your Notifications
              </p>
              <p className="text-sm text-muted-foreground">
                Change preferences notifications.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            {events?.map((event, index) => (
              <div
                key={index}
                className="flex items-start space-x-2 p-2 rounded-md"
              >
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {event.eventName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                </div>
                {event.editable ? (
                  <Switch
                    checked={preferencesState[event.eventName]}
                    onCheckedChange={() => handleToggle(event.eventName)}
                  />
                ) : (
                  <Switch
                    checked={preferencesState[event.eventName]}
                    disabled
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={savePreferences}
            disabled={!hasChanges}
          >
            <Check className="mr-2 h-4 w-4" /> Save preferences
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Preferences;

// Preferences.pageOptions = {
//   requiresAuth: true,
//   getLayout: (children: ReactNode) => <SiteLayout>{children}</SiteLayout>,
// };
