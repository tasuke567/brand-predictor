import React from "react";

export type FieldProps = {
  label: string;
  name: string;
  multiple: boolean;
  value: any;
  options: string[];
  error?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

const FieldGroup = ({ label, name, multiple, value, options, error, onChange }: FieldProps) => {
  return (
    <div className="form-group fade-in">
      <label className="form-label">{label} *</label>
      {!multiple ? (
        <select
          name={name}
          value={value}
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
        <div className="checkbox-group">
          {options.map((opt) => (
            <label key={opt} className="checkbox-label">
              <input
                type="checkbox"
                name={name}
                value={opt}
                checked={(value as string[]).includes(opt)}
                onChange={onChange}
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default FieldGroup;
