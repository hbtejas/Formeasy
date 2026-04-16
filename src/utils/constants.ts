import type { FieldType } from "@/types";

export const FIELD_GROUPS: Array<{
  group: string;
  fields: Array<{ type: FieldType; label: string }>;
}> = [
  {
    group: "Basic",
    fields: [
      { type: "short_text", label: "Short Text" },
      { type: "long_text", label: "Long Text" },
      { type: "number", label: "Number" },
      { type: "email", label: "Email" },
      { type: "password", label: "Password" }
    ]
  },
  {
    group: "Choice",
    fields: [
      { type: "select", label: "Select" },
      { type: "multi_select", label: "Multi-Select" },
      { type: "switch", label: "Switch" }
    ]
  },
  {
    group: "Date & Time",
    fields: [
      { type: "date", label: "Date" },
      { type: "datetime", label: "DateTime" },
      { type: "date_range", label: "Date Range" },
      { type: "time", label: "Time" }
    ]
  },
  {
    group: "Advanced",
    fields: [
      { type: "rich_text", label: "Rich Text" },
      { type: "file", label: "File Upload" },
      { type: "rating", label: "Rating" }
    ]
  }
];

export const FIELD_LABEL_BY_TYPE: Record<FieldType, string> = {
  short_text: "Short Text",
  long_text: "Long Text",
  number: "Number",
  email: "Email",
  password: "Password",
  select: "Select",
  multi_select: "Multi-Select",
  switch: "Switch",
  date: "Date",
  datetime: "DateTime",
  date_range: "Date Range",
  time: "Time",
  rich_text: "Rich Text",
  file: "File Upload",
  rating: "Rating"
};
