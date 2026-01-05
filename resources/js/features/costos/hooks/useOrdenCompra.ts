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

  const sendData = () : void => {
    console.log(formData);
  };

  const handleSave = () => {
    // sendData();
    setSavedData({ ...formData, fechaGuardado: new Date().toLocaleString() });
  };
  
  const handleClear = () => {
    setSavedData(null);
  };

  // Retornamos todo lo que la vista necesita
  return {
    formData,
    expandedSections,
    savedData,
    partidasData,
    articulosData,
    categoriasData,
    toggleSection,
    handleChange,
    handleSave,
    handleClear
  };
};