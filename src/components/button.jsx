const Button = ({ text, onClick, type = "button", icon }) => {
  return (
    <button className="auth-btn" type={type} onClick={onClick}>
      {icon ? <i className={icon} aria-hidden="true"></i> : null}
      {text}
    </button>
  );
};

export default Button;
