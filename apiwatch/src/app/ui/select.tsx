import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Select({ value, onValueChange, children }: any) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="w-full border rounded px-2 py-1"
    >
      {React.Children.map(children, (child: any) =>
        child ? <option value={child.props.value}>{child.props.children}</option> : null
      )}
    </select>
  );
}

export function SelectItem({ value, children }: any) {
  return <option value={value}>{children}</option>;
}

export default Select;
