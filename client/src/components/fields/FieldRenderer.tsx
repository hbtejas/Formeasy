import { Eye, EyeOff, Star } from "lucide-react";
import { useState } from "react";
import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { FormField } from "@/types";

type Props = {
  field: FormField;
  register: UseFormRegister<Record<string, unknown>>;
  setValue: UseFormSetValue<Record<string, unknown>>;
  watch: UseFormWatch<Record<string, unknown>>;
  errors: FieldErrors<Record<string, unknown>>;
};

export const FieldRenderer = ({ field, register, setValue, watch, errors }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const error = errors[field.id]?.message as string | undefined;
  const value = watch(field.id);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-800">
        {field.label}
        {field.required ? <span className="ml-1 text-rose-500">*</span> : null}
      </label>

      {field.type === "short_text" && <Input {...register(field.id)} placeholder={field.placeholder} />}
      {field.type === "long_text" && <Textarea rows={4} {...register(field.id)} placeholder={field.placeholder} />}
      {field.type === "number" && (
        <Input
          type="number"
          min={field.validation.min}
          max={field.validation.max}
          {...register(field.id)}
          placeholder={field.placeholder}
        />
      )}
      {field.type === "email" && <Input type="email" {...register(field.id)} placeholder={field.placeholder} />}
      {field.type === "password" && (
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            {...register(field.id)}
            placeholder={field.placeholder}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-2 text-slate-400"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      )}
      {field.type === "select" && (
        <select className="h-10 w-full rounded-lg border border-slate-200 px-3" {...register(field.id)}>
          <option value="">Select an option</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
      {field.type === "multi_select" && (
        <div className="space-y-2 rounded-lg border border-slate-200 p-3">
          {field.options.map((option) => {
            const selected = Array.isArray(value) ? value.includes(option) : false;
            return (
              <label key={option} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={(e) => {
                    const current = Array.isArray(value) ? [...value] : [];
                    if (e.target.checked) {
                      setValue(field.id, [...current, option]);
                    } else {
                      setValue(
                        field.id,
                        current.filter((item) => item !== option)
                      );
                    }
                  }}
                />
                {option}
              </label>
            );
          })}
        </div>
      )}
      {field.type === "switch" && (
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
          <Switch
            checked={Boolean(value)}
            onCheckedChange={(checked) => setValue(field.id, checked)}
          />
          <span className="text-sm text-slate-600">{Boolean(value) ? "On" : "Off"}</span>
        </div>
      )}
      {field.type === "date" && <Input type="date" {...register(field.id)} />}
      {field.type === "datetime" && <Input type="datetime-local" {...register(field.id)} />}
      {field.type === "time" && <Input type="time" {...register(field.id)} />}
      {field.type === "date_range" && (
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="date"
            value={(value as { start?: string } | undefined)?.start ?? ""}
            onChange={(e) =>
              setValue(field.id, {
                ...(typeof value === "object" && value ? (value as object) : {}),
                start: e.target.value
              })
            }
          />
          <Input
            type="date"
            value={(value as { end?: string } | undefined)?.end ?? ""}
            onChange={(e) =>
              setValue(field.id, {
                ...(typeof value === "object" && value ? (value as object) : {}),
                end: e.target.value
              })
            }
          />
        </div>
      )}
      {field.type === "rich_text" && <Textarea rows={5} {...register(field.id)} placeholder={field.placeholder} />}
      {field.type === "file" && (
        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          <input type="file" onChange={(e) => setValue(field.id, e.target.files?.[0]?.name ?? "")} />
        </div>
      )}
      {field.type === "rating" && (
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-2">
          {Array.from({ length: 5 }).map((_, index) => {
            const score = index + 1;
            const active = Number(value ?? 0) >= score;
            return (
              <button key={score} type="button" onClick={() => setValue(field.id, score)}>
                <Star className={`size-5 ${active ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
              </button>
            );
          })}
        </div>
      )}

      {field.helpText ? <p className="text-xs text-slate-500">{field.helpText}</p> : null}
      {error ? <p className="text-xs text-rose-500">{error}</p> : null}
    </div>
  );
};
