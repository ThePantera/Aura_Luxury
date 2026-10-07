import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/settings";

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div className="grid gap-5">
      <h1 className="font-display text-3xl text-champagne">Ajustes generales</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
