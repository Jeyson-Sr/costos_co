import { useState, useEffect } from 'react';
import { FormData, ExpandedSections, SavedData, PartidaPresupuestal } from '../types/ordenCompra';
import { getCurrentDate, getRandomPresupuesto } from '../utils/formatters';

export const useOrdenCompra = () => {
  // --- ESTADOS ---
  const [formData, setFormData] = useState<FormData>({
    moneda: 'SOLES',
    importe: '',
    fechaEmision: getCurrentDate(),
    identificador: '',
    categoriaCompra: '',
    proveedor: '',
    codProveedor: '',
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

  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    general: true,
    solicitante: false,
    articulo: false,
    contable: false
  });

  const [savedData, setSavedData] = useState<SavedData | null>(null);
  
  const [partidasData, setPartidasData] = useState<PartidaPresupuestal[]>([]);
  const [articulosData, setArticulosData] = useState<any[]>([]);
  const [categoriasData, setCategoriasData] = useState<any[]>([]);
  const [proveedorsData, setProveedorsData] = useState<any[]>([]);
  const [cuentaContablesData, setCuentaContablesData] = useState<any[]>([]);

  // --- EFECTOS ---
  useEffect(() => {
      const cargarDatos = async () => {
          try {
              const responsePartidas = await fetch('partidaPresupuestal');
              const dataPartidas = await responsePartidas.json();
              setPartidasData(dataPartidas);

              const responseArticulos = await fetch('articulos');
              const dataArticulos = await responseArticulos.json();
              setArticulosData(dataArticulos);

              const responseCategorias = await fetch('categorias');
              const dataCategorias = await responseCategorias.json();
              setCategoriasData(dataCategorias);

              const responseProveedors = await fetch('proveedors');
              const dataProveedors = await responseProveedors.json();
              setProveedorsData(dataProveedors);

              const responsecuentaContables = await fetch('cuentaContables');
                const dataCuentaContables = await responsecuentaContables.json();
                setCuentaContablesData(dataCuentaContables); // Guardamos la estructura completa

            } catch (error) {
              console.error("Error cargando partidas y / o  artículos:", error);
          }
      };
      cargarDatos();
  }, []);

  // --- HANDLERS ---
  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };



  // --- MÉTODO DE GUARDADO ---
const handleSave = async () => {
  // 1. UTILIDAD INTERNA: Obtener Token
  const getXsrfToken = () => decodeURIComponent(
    document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1] || ''
  );

  // 2. TRANSFORMADOR: Limpia y prepara el objeto (Payload)
  const preparePayload = (data: any) => ({
    oc: null,
    importe: String(data.importe || "0"),
    moneda: data.moneda,
    categoria: data.categoriaCompra,
    proveedor: data.codProveedor || null,
    solicitante: `${data.nombre} ${data.apellido}`,
    descripcion: data.descripcionCompra,
    articulo: data.codigoArticulo,
    gerencia: data.gerencia.replace(/^\d+\s*/, ''),
    centroCosto: data.centroCosto.match(/^\d+/)?.[0] || '',
    partida: data.partida.match(/^\d+/)?.[0] || '',
    presupuesto: data.presupuesto === 'ACEPTADO' ? 1 : 0,
    idx: (data.identificador && data.identificador !== "0") ? Number(data.identificador) : null
  });

  // 3. EJECUCIÓN
  try {
    const payload = preparePayload(formData);

    const response = await fetch('/ordenCompra', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-XSRF-TOKEN': getXsrfToken()
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error desconocido");
    }

    alert("¡Guardado con éxito!");
    setSavedData({ ...formData, fechaGuardado: new Date().toLocaleString() });

  } catch (error: any) {
    console.error("Error detallado:", error);
    alert("Error al guardar: " + error.message);
  }
};
// --- MÉTODO DE FIN DE GUARDADO ---
  
  const handleClear = () => {
    setSavedData(null);
  };

  const verificarPresupuesto = (partida: string, importe: number) => {


    const row = cuentaContablesData.find((o: any) => o.partida === partida);

    if (!row) {
      console.log('No se encontró la partida:', partida);
      return { suficiente: false, diferencia: 0 };
    }

    const fondo = Number(row?.fondo) || 0;
    const suficiente = fondo >= importe;
    const diferencia = fondo - importe;
    return { suficiente, diferencia };
  };

  // Retornamos todo lo que la vista necesita
  return {
    formData,
    expandedSections,
    savedData,
    partidasData,
    articulosData,
    categoriasData,
    proveedorsData,
    cuentaContablesData,
    verificarPresupuesto,
    toggleSection,
    handleChange,
    handleSave,
    handleClear
  };
};