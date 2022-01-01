export interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (newValue: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ id, checked, onChange }) => {
  return (
    <input
      id={id}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      type="checkbox"
      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
    />
  );
};

export default Checkbox;
