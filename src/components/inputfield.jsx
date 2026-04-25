import React, { useState } from "react";

const InputField = ({ type, placeholder, icon, name, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="auth-inputBox">
      <i className={`auth-leftIcon ${icon}`} aria-hidden="true"></i>

      <input
        type={isPassword ? (showPassword ? "text" : "password") : type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />

      {isPassword && (
        <i
          className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"} auth-rightIcon`}
          onClick={() => setShowPassword(!showPassword)}
          role="button"
          tabIndex={0}
          aria-label={showPassword ? "Hide password" : "Show password"}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setShowPassword(!showPassword);
          }}
        ></i>
      )}
    </div>
  );
};

export default InputField;