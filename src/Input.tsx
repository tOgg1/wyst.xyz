export interface InputProps {
  id: string;
  placeholder: string;
  value: string;
  onChange: (newValue: string) => void
}

const Input: React.FC<InputProps> = ({ id, value, placeholder, onChange }) => {
  return (
    <input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type="text"
      placeholder={placeholder}
      className="w-full block rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-200 focus:ring-opacity-20 "
    />
  );
};

export default Input
