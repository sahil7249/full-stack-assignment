import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import type { SortConfig } from "../types/types";



interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant? : 'primary' | 'secondary' | 'ghost' | 'danger',
    size?: 'sm' | 'md'
}

export const Button : React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className = '',
  children,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2 text-sm" };

  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-700 focus:ring-slate-500",
    secondary:
      "bg-white text-slate-900 border border-slate-300 hover:bg-slate-100 focus:ring-slate-400",
    ghost: "text-slate-600 hover:bg-slate-100 focus:ring-slate-300",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export const Input: React.FC<InputProps> = ({ label, error, id, className = '', ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label htmlFor={id} className="text-xs font-medium text-slate-600 uppercase tracking-wide">{label}</label>}
    <input
      id={id}
      className={`w-full px-3 py-2 text-sm border rounded bg-white text-slate-900 placeholder-slate-400
        focus:outline-none focus:ring-2 focus:ring-slate-400 transition
        ${error ? 'border-red-400 focus:ring-red-300' : 'border-slate-300'}
        ${className}`}
      {...props}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);


export const Alert: React.FC<{ message: string; type?: 'error' | 'success' }> = ({ message, type = 'error' }) => (
  <div className={`text-sm px-4 py-3 rounded border ${type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
    {message}
  </div>
);


export const PageWrapper: React.FC<{ title: string; children: ReactNode; action?: ReactNode }> = ({ title, children, action }) => (
  <div className="min-h-screen bg-slate-50">
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {action}
      </div>
      {children}
    </div>
  </div>
);

export const Card: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white border border-slate-200 rounded-lg shadow-sm ${className}`}>{children}</div>
);

interface ThProps {
  label: string;
  sortKey?: string;
  sortConfig?: SortConfig | null;
  onSort?: (key: string) => void;
}
export const Th: React.FC<ThProps> = ({ label, sortKey, sortConfig, onSort }) => {
  const active = sortConfig?.key === sortKey;
  const arrow = active ? (sortConfig?.direction === 'asc' ? ' ↑' : ' ↓') : '';
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider
        ${sortKey ? 'cursor-pointer hover:text-slate-800 select-none' : ''}`}
      onClick={() => sortKey && onSort?.(sortKey)}
    >
      {label}{arrow && <span className="text-slate-400">{arrow}</span>}
    </th>
  );
};

export const Td: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <td className={`px-4 py-3 text-sm text-slate-700 ${className}`}>{children}</td>
);

export const StarRating: React.FC<{
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}> = ({ value, onChange, readonly }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        type="button"
        disabled={readonly}
        onClick={() => onChange?.(star)}
        className={`text-xl transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
          ${star <= value ? 'text-amber-400' : 'text-slate-200'}`}
      >
        ★
      </button>
    ))}
  </div>
);

export const Modal: React.FC<{ title: string; onClose: () => void; children: ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl leading-none">&times;</button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  </div>
);


interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}
export const Select: React.FC<SelectProps> = ({ label, error, id, options, className = '', ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label htmlFor={id} className="text-xs font-medium text-slate-600 uppercase tracking-wide">{label}</label>}
    <select
      id={id}
      className={`w-full px-3 py-2 text-sm border rounded bg-white text-slate-900
        focus:outline-none focus:ring-2 focus:ring-slate-400 transition
        ${error ? 'border-red-400' : 'border-slate-300'} ${className}`}
      {...props}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);
