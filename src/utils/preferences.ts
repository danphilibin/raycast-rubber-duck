import { getPreferenceValues } from "@raycast/api";

interface Preferences {
  storageLocation: string;
  openAiApiKey?: string;
}

export function getPreferences(): Preferences {
  return getPreferenceValues<Preferences>();
}
