import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Save, Ticket, X } from 'lucide-react';

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
  cuentaContable: string;
};

type SavedData = FormData & { fechaGuardado: string };

type ExpandedSections = {
  general: boolean;
  solicitante: boolean;
  articulo: boolean;
  contable: boolean;
};


// TYPES para las respuestas de la API
type PartidaPresupuestal = {
  gerencia: string;
  centrosCosto: {
    ccosto: string;
    desc_cc: string;
    cuentas: {
      ccontable: string;
      desc_contable: string;
      partida: string;
    }[];
  }[];
};



type CategoriaCompraItem = { name_categoria: string; };


// MONEDA
const MONEDA = [
  { value: 'SOLES', label: 'SOLES' },
  { value: 'DOLARES', label: 'DOLARES' }
];


const getCurrentDate = (): string => {
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];
  const now = new Date();
  return `${now.getDate()}-${months[now.getMonth()]}-${now.getFullYear().toString().slice(-2)}`;
};



/*
* @description: Se generar la logica para el presupuesto9
*/
const getRandomPresupuesto = (): 'ACEPTADO' | 'DENEGADO' =>
  Math.random() > 0.5 ? 'ACEPTADO' : 'DENEGADO';




// utils/formatters.ts

 const formatMoney = (amount: string | number): string => {
  if (!amount) return '';

  // 1. Limpiamos el input para que solo queden números y puntos decimales
  // (Quitamos comas previas para evitar errores al convertir)
  const numericValue = typeof amount === 'string' 
    ? Number.parseFloat(amount.replaceAll(',', ''))
    : amount;

  if (Number.isNaN(numericValue)) return '';

  // 2. Usamos Intl.NumberFormat
  // 'en-US' pone comas en miles y punto en decimales (30,000.00)
  // 'es-PE' o 'es-ES' pone puntos en miles y coma en decimales (30.000,00)
  return new Intl.NumberFormat('en-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
};



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

const LabelField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <div className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-gray-900 font-medium shadow-inner">
      {value}
    </div>
  </div>
);

const LabelPresupuesto: React.FC<{ label: string; value: string }> = ({ label, value }) => (
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




// 1. Definimos la forma de los datos de tus artículos
export interface ArticuloItem {
  codigoArticulo: string;
  descArticulo: string;
  familiaMaterial: string;
  unidadMedida: string;
}

export const InputBuscador: React.FC<{
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  dataList: ArticuloItem[] | any[];
  onItemFound?: (item: ArticuloItem) => void;
  showDatalist?: boolean; // Prop opcional (con ?), por defecto será true
}> = ({
  label,
  value,
  onChange,
  dataList = [],
  onItemFound,
  showDatalist = true
}) => {
  // Generamos un ID único y limpio para el datalist basado en el label
  const listId = `datalist-${label.replaceAll(/\s+/g, '-').toLowerCase()}`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // Notificar al padre el cambio de texto
    onChange(val);

    // Lógica de búsqueda automática
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
        // Si showDatalist es false, pasamos undefined para desactivarlo
        list={showDatalist ? listId : undefined}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-shadow shadow-sm hover:shadow"
      />
      
      {/* Renderizado condicional del datalist */}
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



// ==========================================
// COMPONENTE PRINCIPAL (Smart Component)
// Gestiona el estado, la lógica de negocio y el renderizado
// ==========================================
export default function OrdenCompraForm() {
  
  // ESTADO: Almacena los valores de todos los campos del formulario
  const [formData, setFormData] = useState<FormData>({
    moneda: 'SOLES',
    importe: '',
    fechaEmision: getCurrentDate(),
    identificador: '',
    categoriaCompra: '',
    proveedor: 'FABRISEL S.A',
    codProveedor: '40456',
    areaSolicitante: 'MANUFACTURA',
    nombre: 'JHONNIE',
    apellido: 'ENRIQUEZ',
    descripcionCompra: '',
    codigoArticulo: '',
    descArticulo: '',
    familiaMaterial: '',
    unidadMedida: '',
    gerencia: '',
    centroCosto: '',
    partida: '',
    presupuesto: getRandomPresupuesto(),
    cuentaContable: ''
  });

  // ESTADO: Controla qué secciones del acordeón están visibles
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    general: true,
    solicitante: false,
    articulo: false,
    contable: false
  });

  // ESTADO: Almacena la "foto" de los datos al guardar
  const [savedData, setSavedData] = useState<SavedData | null>(null);

  // HANDLER: Alternar visibilidad de secciones
  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // HANDLER: Actualización genérica de campos (Two-way binding)
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // HANDLER: Persistir datos en el estado local de visualización
  const handleSave = () => {
    sendData();
    setSavedData({ ...formData, fechaGuardado: new Date().toLocaleString() });
  };
  
  // HANDLER: Resetear la vista de datos guardados
  const handleClear = () => {
    setSavedData(null);
  };

  const sendData = () : void => {
    console.log(formData);
  };
  
  // 1. Estados principales
  const [partidasData, setPartidasData] = useState([]);
  const [articulosData, setArticulosData] = useState([]);
  const [categoriasData, setCategoriasData] = useState([]);

  // 2. Cargar los datos al montar el componente
  useEffect(() => {
      const cargarDatos = async () => {
          try {
              const responsePartidas = await fetch('partidaPresupuestal');
              const dataPartidas = await responsePartidas.json();
              setPartidasData(dataPartidas); // Guardamos la estructura completa
              console.log(dataPartidas);

              const responseArticulos = await fetch('articulos');
              const dataArticulos = await responseArticulos.json();
              setArticulosData(dataArticulos); // Guardamos la estructura completa
              console.log(dataArticulos);

              const responseCategorias = await fetch('categorias');
              const dataCategorias = await responseCategorias.json();
              setCategoriasData(dataCategorias); // Guardamos la estructura completa
              console.log(dataCategorias);
            } catch (error) {
              console.error("Error cargando partidas y / o  artículos:", error);
          }
      };
      cargarDatos();
  }, []);

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
                      options={MONEDA}
                      onChange={handleChange}
                    />
                  </div>
                    <InputField label="Importe" value={formData.importe} field="importe" onChange={handleChange} formatMony={true} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <LabelField label="Fecha Emisión" value={formData.fechaEmision} />
                    <InputField label="Identificador" value={formData.identificador} field="identificador" onChange={handleChange} />
                  </div>
                  <SelectField
                    label="Categoría de Compra"
                    value={formData.categoriaCompra}
                    field="categoriaCompra"
                    options={categoriasData}
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
                    <InputBuscador
                      label="Código de Artículo"
                      value={formData.codigoArticulo}
                      dataList={articulosData} // Tu array JSON debe coincidir con la interfaz ArticuloItem
                      showDatalist={true}       // <--- TRUE: Muestra lista / FALSE: Solo busca sin mostrar lista
                      
                      // Actualiza el campo de texto
                      onChange={(val) => handleChange("codigoArticulo", val)}
                      
                      // Rellena los otros campos automáticamente (con tipado seguro)
                      onItemFound={(found) => {
                        handleChange("descArticulo", found.descArticulo);
                        handleChange("familiaMaterial", found.familiaMaterial);
                        handleChange("unidadMedida", found.unidadMedida);
                      }}
                    />
                  <LabelField label="Descripción Artículo" value={formData.descArticulo}  />
                  <div className="grid grid-cols-2 gap-4">
                    <LabelField label="Familia Material" value={formData.familiaMaterial}  />
                    <LabelField label="Unidad de Medida" value={formData.unidadMedida}  />
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
                  {/* Gerencia con autocompletable */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gerencia</label>
                    <input
                      list="gerencia-list"
                      value={formData.gerencia}
                      onChange={(e) => handleChange("gerencia", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-shadow shadow-sm hover:shadow"
                    />
                    <datalist id="gerencia-list">
                      {partidasData.map((g) => (
                        <option key={g.gerencia} value={g.gerencia} />
                      ))}
                    </datalist>
                  </div>

                  {/* Centro de Costo con autocompletable */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Centro de Costo</label>
                    <input
                      list="centro-costo-list"
                      value={formData.centroCosto}
                      onChange={(e) => handleChange("centroCosto", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-shadow shadow-sm hover:shadow"
                    />
                    <datalist id="centro-costo-list">
                      {partidasData
                        .find((g) => g.gerencia === formData.gerencia)
                        ?.centrosCosto.map((cc) => (
                          <option key={cc.ccosto} value={`${cc.ccosto} - ${cc.desc_cc}`} />
                        )) ?? []}
                    </datalist>
                  </div>

                  {/* Partida con autocompletable */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Partida</label>
                    <input
                      list="partida-list"
                      value={formData.partida}
                      onChange={(e) => handleChange("partida", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-shadow shadow-sm hover:shadow"
                    />
                    <datalist id="partida-list">
                      {partidasData
                        .find((g) => g.gerencia === formData.gerencia)
                        ?.centrosCosto.find((cc) =>
                          formData.centroCosto.startsWith(cc.ccosto)
                        )
                        ?.cuentas.map((c) => (
                          <option key={c.partida} value={`${c.partida} - ${c.desc_contable}`} />
                        )) ?? []}
                    </datalist>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <LabelPresupuesto label="Presupuesto" value={formData.presupuesto} />
                    {/* Cuenta Contable con autocompletable */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Cuenta Contable</label>
                      <input
                        list="cuenta-contable-list"
                        value={formData.cuentaContable}
                        onChange={(e) => handleChange("cuentaContable", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-shadow shadow-sm hover:shadow"
                      />
                      <datalist id="cuenta-contable-list">
                        {partidasData
                          .find((g) => g.gerencia === formData.gerencia)
                          ?.centrosCosto.find((cc) =>
                            formData.centroCosto.startsWith(cc.ccosto)
                          )
                          ?.cuentas.map((c) => (
                            <option key={c.ccontable} value={c.ccontable} />
                          )) ?? []}
                      </datalist>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                <Ticket size={20} />
                Generar Orden
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
                        <div><span className="font-semibold text-gray-700">Importe:</span> <span className="text-gray-900">{formatMoney(savedData.importe)}</span></div>
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
                      <p><span className="font-semibold text-gray-700">Código:</span> <span className="text-gray-900">{savedData.codigoArticulo}</span></p>
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