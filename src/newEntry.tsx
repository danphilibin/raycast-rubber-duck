import { Action, ActionPanel, Form, LaunchProps, closeMainWindow, popToRoot, showHUD } from "@raycast/api";
import { writeMarkdownEntry } from "./utils/files";

interface FormValues {
  note: string;
}

export default function Command(props: LaunchProps<{ draftValues: FormValues }>) {
  const { draftValues } = props;

  return (
    <Form
      enableDrafts
      actions={
        <ActionPanel>
          <Action.SubmitForm
            onSubmit={async (values: FormValues) => {
              writeMarkdownEntry(values.note);
              await showHUD("Note saved.");
              closeMainWindow();
              popToRoot();
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextArea id="note" title="Note" defaultValue={draftValues?.note} />
    </Form>
  );
}
