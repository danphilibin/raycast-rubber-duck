import { Detail } from "@raycast/api";
import { getEntryForDate } from "./utils/files";

export default function Command() {
  const todayEntry = getEntryForDate();

  return <Detail markdown={todayEntry} />;
}
