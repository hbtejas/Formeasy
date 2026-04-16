import { createObjectCsvStringifier } from "csv-writer";
import type { HydratedDocument } from "mongoose";
import { ResponseModel } from "../models/Response";
import type { FormDocument } from "../models/Form";

export const buildResponsesCsv = async (form: HydratedDocument<FormDocument>) => {
  const responses = await ResponseModel.find({ formId: form._id, isPartial: false }).sort({ submittedAt: -1 });

  const headers = [
    { id: "submittedAt", title: "Submitted At" },
    ...form.fields.map((field) => ({ id: field._id.toString(), title: field.label }))
  ];

  const csvStringifier = createObjectCsvStringifier({ header: headers });

  const records = responses.map((response) => {
    const row: Record<string, string> = {
      submittedAt: response.submittedAt.toISOString()
    };

    form.fields.forEach((field) => {
      const value = response.data.get(field._id.toString());
      row[field._id.toString()] =
        typeof value === "string" ? value : value !== undefined ? JSON.stringify(value) : "";
    });

    return row;
  });

  return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
};
