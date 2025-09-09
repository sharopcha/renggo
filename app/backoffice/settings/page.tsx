import { SettingsContent } from "@/components/settings/settings-content";

export default function SettingsPage() {
  return (
    <main className="flex-1 overflow-auto">
      <div className="container mx-auto p-6">
        <SettingsContent />
      </div>
    </main>
  );
}
