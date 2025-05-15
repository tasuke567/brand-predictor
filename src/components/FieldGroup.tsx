import React, { useEffect, useRef, useState } from "react";

/* ---------- Types ---------- */
export type FieldProps = {
  label: string;
  name: string;
  multiple?: boolean;
  value: string | string[];
  options: string[];
  error?: boolean;
  fullWidth?: boolean;                // ช่องยาวเต็มแถว
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
};

/* ---------- Hook: click outside → close ---------- */
function useClickAway(
  ref: React.RefObject<HTMLElement | null>,
  onAway: () => void
) {
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onAway();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, onAway]);
}

/* ---------- Component: Multi-select dropdown ---------- */
type MultiSelectProps = {
  name: string;
  value: string[];
  options: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
};

const MultiSelectDropdown: React.FC<MultiSelectProps> = ({
  name,
  value,
  options,
  onChange,
  placeholder = "เลือก...",
}) => {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  useClickAway(boxRef, () => setOpen(false));

  const toggle = (opt: string) => {
    const next = value.includes(opt)
      ? value.filter((v) => v !== opt)
      : [...value, opt];
    onChange(next);
  };

  return (
    <div className="ms-container" ref={boxRef}>
      {/* trigger  */}
      <button
        type="button"
        className="ms-trigger form-select"
        onClick={() => setOpen((o) => !o)}
      >
        {value.length ? value.join(", ") : placeholder}
        <span className="ms-caret">▾</span>
      </button>

      {/* dropdown */}
      {open && (
        <div className="ms-menu">
          {options.map((opt) => (
            <label key={opt} className="ms-option">
              <input
                type="checkbox"
                name={name}
                value={opt}
                checked={value.includes(opt)}
                onChange={() => toggle(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

/* ---------- Main FieldGroup ---------- */
const FieldGroup: React.FC<FieldProps> = ({
  label,
  name,
  multiple = false,
  value,
  options,
  error,
  fullWidth = false,
  onChange,
}) => {
  /* helper: dispatch synthetic event so handler ฝั่ง Form ใช้โค้ดเดิมได้ */
  const dispatch = (nextVal: string[]) => {
    const synthetic = {
      target: { name, value: nextVal },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    onChange(synthetic);
  };

  return (
    <div className={`form-group fade-in ${fullWidth ? "full-width" : ""}`}>
      <label className="form-label">
        {label} <span className="text-red-500">*</span>
      </label>

      {/* --- single select --- */}
      {!multiple ? (
        <select
          name={name}
          value={value as string}
          onChange={onChange}
          className={`form-select ${error ? "form-error" : ""}`}
        >
          <option value="">เลือก</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        /* --- multi-select dropdown --- */
        <MultiSelectDropdown
          name={name}
          value={value as string[]}
          options={options}
          onChange={dispatch}
        />
      )}
    </div>
  );
};

export default FieldGroup;
