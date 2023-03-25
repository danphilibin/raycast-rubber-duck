import fs from "fs";
import path from "path";
import os from "os";
import { getPreferences } from "./preferences";

function getStorageLocation() {
  const { storageLocation } = getPreferences();

  const rootPath = storageLocation.replace(/^~(?=$|\/|\\)/, os.homedir());

  if (!fs.existsSync(rootPath)) {
    fs.mkdirSync(rootPath);
  }

  return rootPath;
}

function getFilePathForDate(date: Date): string {
  const storageLocation = getStorageLocation();

  const filename = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
    .getDate()
    .toString()
    .padStart(2, "0")}.md`;
  const filepath = path.join(storageLocation, filename);

  return filepath;
}

export function writeMarkdownEntry(entry: string): void {
  const date = new Date();
  const filepath = getFilePathForDate(date);
  const header = `# ${date.toDateString()}`;

  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, header);
  }

  const timestamp = date.toLocaleTimeString();

  const data = fs.readFileSync(filepath, "utf8");
  const updatedData = `${data}\n\n---\n\n${timestamp}: ${entry}`;

  fs.writeFileSync(filepath, updatedData);
}

export function getEntryForDate(date = new Date()): string {
  const filepath = getFilePathForDate(date);

  if (!fs.existsSync(filepath)) {
    return "";
  }

  const data = fs.readFileSync(filepath, "utf8");

  return data;
}

export function concatAllEntries(): string {
  const storageLocation = getStorageLocation();

  const files = fs.readdirSync(storageLocation);

  let data = "";

  files.forEach((file) => {
    const fileData = fs.readFileSync(path.join(storageLocation, file), "utf8");
    data += fileData + "\n\n";
  });

  return data;
}
