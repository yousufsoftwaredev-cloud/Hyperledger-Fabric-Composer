interface Props {
  label: string;
  name: string;
  value: string | boolean;
  onChange: (name: string, value: string | boolean) => void;
  type?: 'text' | 'date' | 'checkbox' | 'number';
  required?: boolean;
  placeholder?: string;
}

export default function FormField({ label, name, value, onChange, type = 'text', required, placeholder }: Props) {
  if (type === 'checkbox') {
    return (
      <div className="form-field checkbox-field">
        <label>
          <input
            type="checkbox"
            checked={value as boolean}
            onChange={(e) => onChange(name, e.target.checked)}
          />
          {' '}{label}
        </label>
      </div>
    );
  }
  return (
    <div className="form-field">
      <label>{label}{required && <span className="req">*</span>}</label>
      <input
        type={type}
        value={value as string}
        onChange={(e) => onChange(name, e.target.value)}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}
