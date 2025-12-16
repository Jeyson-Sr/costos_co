import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Save, X } from 'lucide-react';

// TYPES
type FormData = {
  moneda: string;
  importe: string;
  fechaEmision: string;
  identificador: string;
  categoriaCompra: string;
  proveedor: string;
  codProveedor: string;
  areaSolicitante: string;
  nombre: string;
  apellido: string;
  descripcionCompra: string;
  codigoArticulo: string;
  descArticulo: string;
  familiaMaterial: string;
  unidadMedida: string;
  gerencia: string;
  centroCosto: string;
  partida: string;
  presupuesto: string;
};

type SavedData = FormData & { fechaGuardado: string };

type ExpandedSections = {
  general: boolean;
  solicitante: boolean;
  articulo: boolean;
  contable: boolean;
};

// HELPERS
const generateUniqueId = (): string =>
  Math.floor(100_000 + Math.random() * 900_000).toString();

const getCurrentDate = (): string => {
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];
  const now = new Date();
  return `${now.getDate()}-${months[now.getMonth()]}-${now.getFullYear().toString().slice(-2)}`;
};

const getRandomPresupuesto = (): 'ACEPTADO' | 'DENEGADO' =>
  Math.random() > 0.5 ? 'ACEPTADO' : 'DENEGADO';

// UI COMPONENTS
const SectionHeader: React.FC<{
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

const InputField: React.FC<{
  label: string;
  value: string;
  field: keyof FormData;
  type?: string;
  onChange: (field: keyof FormData, value: string) => void;
}> = ({ label, value, field, type = 'text', onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-shadow shadow-sm hover:shadow"
    />
  </div>
);

const LabelField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <div className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-gray-900 font-medium shadow-inner">
      {value}
    </div>
  </div>
);



const SelectField: React.FC<{  
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


// MAIN COMPONENT
export default function OrdenCompraForm() {
  const [formData, setFormData] = useState<FormData>({
    moneda: 'SOLES',
    importe: '30,000',
    fechaEmision: getCurrentDate(),
    identificador: generateUniqueId(),
    categoriaCompra: 'EMERGENCIA',
    proveedor: 'FABRISEL S.A',
    codProveedor: '40456',
    areaSolicitante: 'MANUFACTURA',
    nombre: 'JHONNIE',
    apellido: 'ENRIQUEZ',
    descripcionCompra: 'COMPRA DE MATERIALES DE LIMPIEZA, PLANTA CRL',
    codigoArticulo: '1001_49774',
    descArticulo: 'MATERIAL DE LIMPIEZA WVPALL',
    familiaMaterial: 'SUMINISTRO DE LIMPIEZA',
    unidadMedida: 'UM',
    gerencia: '1427_GER_PRODUCCION_AREA_ENVASADO',
    centroCosto: '1001_140060101 - ENVASADO LINEA 01',
    partida: '354 - ARTICULOS DE LIMPIEZA',
    presupuesto: getRandomPresupuesto()
  });

  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    general: true,
    solicitante: false,
    articulo: false,
    contable: false
  });

  const [savedData, setSavedData] = useState<SavedData | null>(null);

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setSavedData({ ...formData, fechaGuardado: new Date().toLocaleString() });
  };

  const handleClear = () => {
    setSavedData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">
            Orden de Compra ‑ Despegable
          </h1>

          {/* Formulario */}
          <div className="space-y-6">
            {/* Sección General */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <SectionHeader
                title="Datos Generales"
                section="general"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              />
              {expandedSections.general && (
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <SelectField
                      label="Moneda"
                      value={formData.moneda}
                      field="moneda"
                      options={[
                        { value: 'SOLES', label: 'SOLES' },
                        { value: 'DOLARES', label: 'DOLARES' }
                      ]}
                      onChange={handleChange}
                    />
                  </div>
                    <InputField label="Importe" value={formData.importe} field="importe" onChange={handleChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <LabelField label="Fecha Emisión" value={formData.fechaEmision} />
                    <InputField label="Identificador" value={formData.identificador} field="identificador" onChange={handleChange} />
                  </div>
                  <SelectField
                    label="Categoría de Compra"
                    value={formData.categoriaCompra}
                    field="categoriaCompra"
                    options={[
                      { value: 'EMERGENCIA', label: 'EMERGENCIA' },
                      { value: 'REGULAR', label: 'REGULAR' },
                      { value: 'ESTRENO', label: 'ESTRENO' }
                    ]}
                    onChange={handleChange}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    {formData.categoriaCompra === 'EMERGENCIA' ? (
                      <>
                        <InputField label="Proveedor" value={formData.proveedor} field="proveedor" onChange={handleChange} />
                        <InputField label="Cód. Proveedor" value={formData.codProveedor} field="codProveedor" onChange={handleChange} />
                      </>
                    ) : (
                      <>
                        <LabelField label="Proveedor" value={formData.proveedor} />
                        <LabelField label="Cód. Proveedor" value={formData.codProveedor} />
                      </>
                    )}
                  </div>
                  <InputField label="Descripción de Compra" value={formData.descripcionCompra} field="descripcionCompra" onChange={handleChange} />
                </div>
              )}
            </div>

            {/* Sección Solicitante */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <SectionHeader
                title="Datos del Solicitante"
                section="solicitante"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              />
              {expandedSections.solicitante && (
                <div className="p-6">
                  <LabelField label="Área Solicitante" value={formData.areaSolicitante}  />
                  <div className="grid grid-cols-2 gap-4">
                    <LabelField label="Nombre" value={formData.nombre}  />
                    <LabelField label="Apellido" value={formData.apellido}  />
                  </div>
                </div>
              )}
            </div>

            {/* Sección Artículo */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <SectionHeader
                title="Datos del Artículo"
                section="articulo"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              />
              {expandedSections.articulo && (
                <div className="p-6">
                  <InputField label="Código de Artículo" value={formData.codigoArticulo} field="codigoArticulo" onChange={handleChange} />
                  <InputField label="Descripción Artículo" value={formData.descArticulo} field="descArticulo" onChange={handleChange} />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Familia Material" value={formData.familiaMaterial} field="familiaMaterial" onChange={handleChange} />
                    <InputField label="Unidad de Medida" value={formData.unidadMedida} field="unidadMedida" onChange={handleChange} />
                  </div>
                </div>
              )}
            </div>

            {/* Sección Contable */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <SectionHeader
                title="Datos Contables"
                section="contable"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              />
              {expandedSections.contable && (
                <div className="p-6">
                  <InputField label="Gerencia" value={formData.gerencia} field="gerencia" onChange={handleChange} />
                  <InputField label="Centro de Costo" value={formData.centroCosto} field="centroCosto" onChange={handleChange} />
                  <InputField label="Partida" value={formData.partida} field="partida" onChange={handleChange} />
                  <LabelField label="Presupuesto" value={formData.presupuesto} />
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                <Save size={20} />
                Guardar Orden
              </button>
              <button
                onClick={handleClear}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                <X size={20} />
                Limpiar
              </button>
            </div>
          </div>

          {/* Vista de Datos Guardados debajo del formulario */}
          <div className="mt-10 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Datos Guardados de la Orden</h2>

            {savedData ? (
              <div className="space-y-6">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <p className="text-sm text-green-800 font-semibold">
                    Guardado el: {savedData.fechaGuardado}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-green-600 mb-3 text-sm uppercase tracking-wide">Información General</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="font-semibold text-gray-700">Moneda:</span> <span className="text-gray-900">{savedData.moneda}</span></div>
                        <div><span className="font-semibold text-gray-700">Importe:</span> <span className="text-gray-900">{savedData.importe}</span></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="font-semibold text-gray-700">Fecha:</span> <span className="text-gray-900">{savedData.fechaEmision}</span></div>
                        <div><span className="font-semibold text-gray-700">ID:</span> <span className="text-gray-900">{savedData.identificador}</span></div>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold text-gray-700">Categoría:</span>
                        <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                          {savedData.categoriaCompra}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-bold text-green-600 mb-3 text-sm uppercase tracking-wide">Proveedor</h3>
                    <div className="text-sm space-y-1">
                      <p><span className="font-semibold text-gray-700">Nombre:</span> <span className="text-gray-900">{savedData.proveedor}</span></p>
                      <p><span className="font-semibold text-gray-700">Código:</span> <span className="text-gray-900">{savedData.codProveedor}</span></p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-bold text-green-600 mb-3 text-sm uppercase tracking-wide">Solicitante</h3>
                    <div className="text-sm space-y-1">
                      <p><span className="font-semibold text-gray-700">Área:</span> <span className="text-gray-900">{savedData.areaSolicitante}</span></p>
                      <p><span className="font-semibold text-gray-700">Nombre:</span> <span className="text-gray-900">{savedData.nombre} {savedData.apellido}</span></p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-bold text-green-600 mb-3 text-sm uppercase tracking-wide">Descripción</h3>
                    <p className="text-sm text-gray-900">{savedData.descripcionCompra}</p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-bold text-green-600 mb-3 text-sm uppercase tracking-wide">Artículo</h3>
                    <div className="text-sm space-y-1">
                      <p><span className="font-semibold text-gray-700">Código (1001_):</span> <span className="text-gray-900">{savedData.codigoArticulo}</span></p>
                      <p><span className="font-semibold text-gray-700">Descripción:</span> <span className="text-gray-900">{savedData.descArticulo}</span></p>
                      <p><span className="font-semibold text-gray-700">Familia:</span> <span className="text-gray-900">{savedData.familiaMaterial}</span></p>
                      <p><span className="font-semibold text-gray-700">UM:</span> <span className="text-gray-900">{savedData.unidadMedida}</span></p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-bold text-green-600 mb-3 text-sm uppercase tracking-wide">Datos Contables</h3>
                    <div className="text-sm space-y-1">
                      <p><span className="font-semibold text-gray-700">Gerencia:</span> <span className="text-gray-900">{savedData.gerencia}</span></p>
                      <p><span className="font-semibold text-gray-700">Centro Costo:</span> <span className="text-gray-900">{savedData.centroCosto}</span></p>
                      <p><span className="font-semibold text-gray-700">Partida:</span> <span className="text-gray-900">{savedData.partida}</span></p>
                      <p>
                        <span className="font-semibold text-gray-700">Presupuesto:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                          savedData.presupuesto === 'ACEPTADO' ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {savedData.presupuesto}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <p className="text-lg font-medium">No hay datos guardados</p>
                <p className="text-sm mt-2">Complete el formulario y presione "Guardar Orden"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}