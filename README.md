# 🦆 Duck

[Rubber ducking](https://rubberduckdebugging.com) utility for [Raycast](https://www.raycast.com) with optional AI querying support using OpenAI.

I wanted a stupid easy way to take notes during the day as I'm working. I've tried apps like Drafts and Apple Notes but there's too much friction while creating new entries; I really just want a quick append utility that's always a keystroke away.

Duck is a Raycast utility that appends new text entries to daily markdown files stored on your filesystem. Assign an easy alias like `duck` to the "Add Duck entry" command, then type `duck` in Raycast to begin writing an entry.

This extension has three commands:

- **Add Duck entry** adds a new entry to your daily Markdown file.
- **View today's Duck entry** shows the contents of today's file in Raycast.
- **Query Duck log** uses OpenAI to query any daily entry or your full database. (disclaimer: I haven't tested it with large amounts of text yet) Add your OpenAI API key in the extension's preferences to enable this command.
