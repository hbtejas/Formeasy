import { create } from "zustand";
import type { Form, FormField } from "@/types";

type SaveState = "idle" | "saving" | "saved";

type BuilderState = {
  form: Form | null;
  selectedFieldId: string | null;
  saveState: SaveState;
  setForm: (form: Form) => void;
  updateForm: (patch: Partial<Form>) => void;
  setFields: (fields: FormField[]) => void;
  selectField: (fieldId: string | null) => void;
  setSaveState: (state: SaveState) => void;
};

export const useFormBuilderStore = create<BuilderState>((set) => ({
  form: null,
  selectedFieldId: null,
  saveState: "idle",
  setForm: (form) => set({ form, selectedFieldId: null }),
  updateForm: (patch) =>
    set((state) =>
      state.form
        ? {
            form: {
              ...state.form,
              ...patch
            }
          }
        : state
    ),
  setFields: (fields) =>
    set((state) =>
      state.form
        ? {
            form: {
              ...state.form,
              fields
            }
          }
        : state
    ),
  selectField: (selectedFieldId) => set({ selectedFieldId }),
  setSaveState: (saveState) => set({ saveState })
}));
