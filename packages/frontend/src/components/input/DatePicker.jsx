import classNames from "classnames";

export default function DatePicker({
  label, value, type = "text", placeholder, onChange, errorMessage, required
}) {
  return (
    <div className="form-group mt-2">
      <label className="form-label">{label} {required && <span className="text-theme-6">*</span>}</label>
      <input
        type={type}
        className={classNames(
          "form-control datepicker",
          errorMessage ? "border-theme-6" : null,
        )}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e)}
        required={required}
        data-ingle-mode={"true"}
      />
      {errorMessage &&
        <div className="text-theme-6 text-xs mt-2">{errorMessage}</div>
      }
    </div>
  )
}