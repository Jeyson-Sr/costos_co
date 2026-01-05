// TYPES DEL FORMULARIO
export type FormData = {
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

export type SavedData = FormData & { fechaGuardado: string };

export type ExpandedSections = {
  general: boolean;
  solicitante: boolean;
  articulo: boolean;
  contable: boolean;
};

// TYPES DE API Y DATOS EXTERNOS
export type PartidaPresupuestal = {
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

export type CategoriaCompraItem = { name_categoria: string; };

export interface ArticuloItem {
  codigoArticulo: string;
  descArticulo: string;
  familiaMaterial: string;
  unidadMedida: string;
}