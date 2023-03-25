import { Configuration, OpenAIApi } from "openai";
import { Action, ActionPanel, Detail, Form, Toast, showToast } from "@raycast/api";
import { concatAllEntries, getEntryForDate } from "./utils/files";
import { useState } from "react";
import { getPreferences } from "./utils/preferences";

function dateWithoutHours() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

interface FormValues {
  prompt: string;
  date?: Date;
}

export default function Command() {
  const { openAiApiKey } = getPreferences();
  const [markdown, setMarkdown] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  if (!openAiApiKey) {
    return <Detail markdown="Please set your OpenAI API key in the preferences to use this feature." />;
  }

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    const configuration = new Configuration({
      apiKey: openAiApiKey,
    });

    const openai = new OpenAIApi(configuration);

    let entriesToQuery = "";

    if (values.date) {
      entriesToQuery = getEntryForDate(values.date);
    } else {
      entriesToQuery = concatAllEntries();
    }

    if (!entriesToQuery) {
      showToast({
        style: Toast.Style.Failure,
        title: "Sorry, something went wrong",
        message: "No entry for today found.",
      });

      setIsLoading(false);

      return;
    }

    openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `The following text is an entry from notes taken throughout the day in a working journal. Discreet entries are separated by ---. Here is the text:\n${entriesToQuery}\n\nNow, answer the question: "${values.prompt}". Answer in complete sentences and in the second person (e.g. use "you", not "I").`,
          },
        ],
      })
      .then((completion) => {
        const text = completion.data.choices[0].message?.content;

        if (text) {
          setMarkdown(`Prompt: ${values.prompt}\n\n${text}`);
        } else {
          setMarkdown("No summary available.");
        }
      })
      .catch((error) => {
        showToast({
          style: Toast.Style.Failure,
          title: "Sorry, something went wrong",
          message: error.message,
        });

        setIsLoading(false);
      });
  };

  if (!markdown) {
    return (
      <Form
        isLoading={isLoading}
        actions={
          <ActionPanel>
            <Action.SubmitForm onSubmit={onSubmit} />
          </ActionPanel>
        }
      >
        <Form.TextField
          id="prompt"
          title="Prompt"
          placeholder="What did I do today?"
          defaultValue="What did I do today?"
        />
        <Form.DatePicker
          id="date"
          title="Date"
          defaultValue={dateWithoutHours()}
          info="Clear this value to query all notes."
        />
      </Form>
    );
  }

  return <Detail markdown={markdown} isLoading={markdown === undefined} />;
}
