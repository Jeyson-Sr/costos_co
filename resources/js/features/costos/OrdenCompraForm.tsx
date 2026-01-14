import React from 'react';
import { Ticket, X } from 'lucide-react';

// Imports de nuestros nuevos módulos
import { useOrdenCompra } from './hooks/useOrdenCompra';
import { MONEDA, formatMoney } from './utils/formatters';
import { 
  SectionHeader, 
  InputField, 
  LabelField, 
  SelectField, 
  LabelPresupuesto, 
  InputBuscador 
} from './components/FormComponents';

export default function OrdenCompraForm() {
  
  // Instanciamos el hook que contiene toda la lógica
  const {
    formData,
    expandedSections,
    savedData,
    partidasData,
    articulosData,
    categoriasData,
    proveedorsData,
    // cuentaContablesData,
    verificarPresupuesto,
    toggleSection,
    handleChange,
    handleSave,
    handleClear
  } = useOrdenCompra();

  // CAMBIO 1: Mapeo ultra-seguro para categorías.
  // Esto evita el error "Objects are not valid as a React child" al extraer strings.
  const categoriasOptions = categoriasData.map((c: any) => {
    const isObj = typeof c === 'object' && c !== null;
    return {
      // Usamos id o el nombre como key única (evita advertencia SonarQube)
      id: isObj ? (c.id || c.name_categoria || Math.random()) : c,
      value: isObj ? (c.name_categoria || c.value || "") : c,
      label: isObj ? (c.name_categoria || c.label || "") : c
    };
  });

  const handlePresupuesto = (paratida: string) => {

    // Extrae la parte numérica del string de partida (por ejemplo, "1234 - compra por fera del estado" -> "1234")
    const partidaNumber = paratida.split(' ')[0];
    const { suficiente, diferencia } = verificarPresupuesto(partidaNumber, Number(formData.importe));
    return suficiente ? 'ACEPTADO' : 'DENEGADO';
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
                  
                  {/* Categoría de Compra CORREGIDA */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría de Compra</label>
                    <select
                        value={formData.categoriaCompra}
                        onChange={(e) => handleChange("categoriaCompra", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                        <option value="">Seleccione...</option>
                        {categoriasOptions.map((cat: any) => (
                            // CAMBIO 2: Usamos cat.id en lugar de índice para SonarQube
                            <option key={cat.id} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {formData.categoriaCompra === 'EMERGENCIA' ? (
                      <>
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Proveedor</label>   
                            <select
                            value={formData.proveedor}
                            onChange={(e) => {
                                const selected = proveedorsData.find((p: any) => p.descProveedor === e.target.value);
                                handleChange("proveedor", e.target.value);
                                handleChange("codProveedor", selected?.codProveedor || "");
                            }}
                            className="h-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            >
                            <option value="">Seleccione proveedor...</option>
                            {proveedorsData.map((p: any) => (
                                <option key={p.codProveedor} value={p.descProveedor}>
                                {p.descProveedor}
                                </option>
                            ))}
                            </select>
                        </div>
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
                      dataList={articulosData} 
                      showDatalist={true}      
                      onChange={(val) => handleChange("codigoArticulo", val)}
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

            {/* Sección Contable CORREGIDA */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <SectionHeader
                title="Datos Contables"
                section="contable"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              />
              {expandedSections.contable && (
                <div className="p-6">
                  {/* Gerencia */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gerencia</label>
                    <input
                      list="gerencia-list"
                      value={formData.gerencia}
                      onChange={(e) => handleChange("gerencia", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <datalist id="gerencia-list">
                    {partidasData.map((g: any) => (
                        // CAMBIO 3: Key única (g.id) y value validado como string
                        <option 
                          key={g.id || (typeof g === 'object' ? g.gerencia : g)} 
                          value={typeof g === 'object' ? g.gerencia : g} 
                        />
                    ))}
                    </datalist>
                  </div>

                  {/* Centro de Costo */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Centro de Costo</label>
                    <input
                      list="centro-costo-list"
                      value={formData.centroCosto}
                      onChange={(e) => handleChange("centroCosto", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <datalist id="centro-costo-list">
                        {partidasData
                            .find((g: any) => g.gerencia === formData.gerencia)
                            ?.centrosCosto.map((cc: any) => (
                            // CAMBIO 4: Key única estable
                            <option key={cc.id || cc.ccosto} value={`${cc.ccosto} - ${cc.desc_cc}`} />
                            )) ?? []}
                        </datalist>
                  </div>

                  {/* Partida */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Partida</label>
                    <input
                      list="partida-list"
                      value={formData.partida}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        
                        // 1. Actualizamos el valor del input normalmente
                        handleChange("partida", newValue);

                        // 2. Buscamos la cuenta contable asociada de forma manual
                        const partidaNumber = newValue.split(' ')[0];
                        
                        // Buscamos dentro de tu estructura de datos
                        const gerenciaFound = partidasData.find((g) => g.gerencia === formData.gerencia);
                        const centroCostoFound = gerenciaFound?.centrosCosto.find((cc) => 
                          formData.centroCosto.startsWith(cc.ccosto)
                        );
                        const cuentaEncontrada = centroCostoFound?.cuentas.find((c: any) => 
                          c.partida === partidaNumber
                        );

                        // 3. Si encontramos la cuenta, la actualizamos aquí (fuera del render)
                        if (cuentaEncontrada) {
                          handleChange("cuentaContable", cuentaEncontrada.ccontable || '');
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    />

                    <datalist id="partida-list">
                      {partidasData
                        .find((g) => g.gerencia === formData.gerencia)
                        ?.centrosCosto.find((cc) =>
                          formData.centroCosto.startsWith(cc.ccosto)
                        )
                        ?.cuentas.map((c: any) => (
                          /* El .map ahora es LIMPIO: solo retorna el componente <option> */
                          <option key={c.id || c.partida} value={`${c.partida} - ${c.desc_contable}`} />
                        )) ?? []}
                    </datalist>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <LabelPresupuesto label="Presupuesto" value={handlePresupuesto(formData.partida)} />
                    <div className="mb-4">
                      <LabelField label="Cuenta Contable" value={formData.cuentaContable}  />
                    </div>
                  </div>
                </div>
              )}
            </div>
              
            {/* Botones de Acción */}
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                disabled={handlePresupuesto(formData.partida) !== 'ACEPTADO'}
                className={`flex-1 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md ${
                  handlePresupuesto(formData.partida) === 'ACEPTADO'
                    ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Ticket size={20} />
                Generar Orden
              </button>
              <button
                onClick={handleClear}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
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
                <p className="text-sm mt-2">Complete el formulario y presione "Generar Orden"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}