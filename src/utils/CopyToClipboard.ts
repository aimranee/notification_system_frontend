import { useToast } from "@/components/ui/use-toast";

export const copyToClipboard = (text: string) => {
  const { toast } = useToast();
  navigator.clipboard.writeText(text);
  toast({ description: "Copied to clipboard" });
};
