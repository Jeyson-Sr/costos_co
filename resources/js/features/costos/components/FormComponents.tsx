import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ExpandedSections, FormData } from '../types/ordenCompra';
import { formatMoney } from '../utils/formatters';

// Header del Acordeón
export const SectionHeader: React.FC<{
  title: string;
  section: keyof ExpandedSections;
  expandedSections: ExpandedSections;
  toggleSection: (s: keyof ExpandedSections) => void;
}> = ({ title, section, expandedSections, toggleSection }) => (
  <button
    type="button"
    onClick={() => toggleSection(section)}
    className="w-full bg-green-500 text-white px-6 py-4 flex justify-between items-center rounded-t-xl shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-300"
  >
    <h3 className="font-bold text-sm uppercase tracking-wider">{title}</h3>
    {expandedSections[section] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
  </button>
);

// Input Básico
export const InputField: React.FC<{
  label: string;
  value: string;
  field: keyof FormData;
  type?: string;
  onChange: (field: keyof FormData, value: string) => void;
  formatMony?: boolean;
}> = ({ label, value, field, type = 'text', onChange, formatMony = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      onBlur={(e) => {
        if (formatMony) {
          const formatted = formatMoney(e.target.value);
          onChange(field, formatted);
        }
      }}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-shadow shadow-sm hover:shadow"
    />
  </div>
);

// Label (Solo lectura)
export const LabelField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-2">{(label ?? value) || ''}</label>
    <div
      className={`w-full px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-gray-900 font-medium shadow-inner min-h-[44px] flex items-center ${
        value ? '' : 'opacity-0 pointer-events-none'
      }`}
    >
      {value || ''}
    </div>
  </div>
);

// Label de Estado Presupuesto
export const LabelPresupuesto: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <div
      className={`w-full px-4 py-3 rounded-lg font-medium shadow-inner ${
        value === 'ACEPTADO'
          ? 'bg-green-100 border border-green-500 text-green-800'
          : 'bg-red-100 border border-red-500 text-red-800'
      }`}
    >
      {value}
    </div>
  </div>
);

// Select Component
export const SelectField: React.FC<{  
  label: string; 
  value: string; 
  field: keyof FormData; 
  options: { value: string; label: string }[];
  onChange: (field: keyof FormData, value: string) => void;
}> = ({ label , value, field, options, onChange }) => (
  <div className="mb-4">
    <label htmlFor={field} className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <select
      id={field}
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-shadow shadow-sm hover:shadow"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// Input Buscador Especial
import { ArticuloItem } from '../types/ordenCompra';

export const InputBuscador: React.FC<{
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  dataList: ArticuloItem[] | any[];
  onItemFound?: (item: ArticuloItem) => void;
  showDatalist?: boolean;
}> = ({
  label,
  value,
  onChange,
  dataList = [],
  onItemFound,
  showDatalist = true
}) => {
  const listId = `datalist-${label.replaceAll(/\s+/g, '-').toLowerCase()}`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    if (dataList.length > 0) {
      const found = dataList.find((item) => item.codigoArticulo === val);
      if (found && onItemFound) {
        onItemFound(found);
      }
    }
  };
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        list={showDatalist ? listId : undefined}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-shadow shadow-sm hover:shadow"
      />
      {showDatalist && (
        <datalist id={listId}>
          {dataList.map((item) => (
            <option key={item.codigoArticulo} value={item.codigoArticulo} />
          ))}
        </datalist>
      )}
    </div>
  );
};