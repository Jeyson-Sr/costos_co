import { useState, useEffect } from "react";
import axios from 'axios';
import { Search, DollarSign, TrendingUp, FileText, LucideIcon, AlertTriangle, X, Plus, Minus } from "lucide-react";

// TYPES
type OrdenModalProps = {
  abierto: boolean;
  onCerrar: () => void;
  onGuardar: (orden: string) => void;
};

type Partida = {
  id: number;
  ccontable: string;
  desc_contable: string;
  partida: string;
  fondo: number;
};

type Presupuesto = {
  partida: string;
  fondo: number;
};

type Gasto = {
  id: number;
  responsable: string;
  monto: number;
  partida: string;
  centroCosto: string;
  descripcion: string;
  categoria: string;
};

type FormularioPresupuestoProps = {
  onGuardar: (nuevo: Presupuesto) => void;
};

type ListaPartidasProps = {
  partidas: Partida[];
  titulo: string;
  icono: LucideIcon;
  colorBg: string;
  onActualizarFondo: (partidaId: string, nuevoFondo: number) => void;
};

type TablaGastosProps = {
  gastos: Gasto[];
};

type FondoModalProps = {
  abierto: boolean;
  partida: Partida | null;
  onCerrar: () => void;
  onGuardar: (partidaId: string, monto: number, tipo: 'agregar' | 'quitar') => void;
};


// DATA - Simulación de API

// Este proceso consulta dos tablas relacionadas:
// 1. La tabla 'cuenta_contables' proporciona los datos de cada partida.
// 2. Utilizando el campo 'centro_costo_id' de cada registro, se realiza una búsqueda
//    en la tabla 'centros_costos' para obtener el identificador correspondiente.
// 3. Una vez localizada la fila correcta en 'centros_costos', se extrae el valor
//    del campo 'desc_cc', el cual se asigna como 'centro_costo_nombre' en el resultado final.
const partidasInitialData: Partida[] = [
  { id: 1, ccontable: "6251110101", desc_contable: "CELEBRACIONES, AGASAJOS, ACTIVIDADES DEPORTIVAS PARA EL PERSONAL", partida: "76", fondo: 0 },
  { id: 2, ccontable: "6251110102", desc_contable: "GASTOS MEDICOS, MEDICINAS Y OTROS NO CUBIERTOS POR SEGUROS", partida: "78", fondo: 0 },
  { id: 3, ccontable: "6251110103", desc_contable: "MOVILIDAD LOCAL", partida: "119", fondo: 0 },
  { id: 4, ccontable: "6251110104", desc_contable: "PASAJES AEREOS NACIONALES", partida: "120", fondo: 0 },
  { id: 5, ccontable: "6251110105", desc_contable: "PASAJES AEREOS INTERNACIONALES", partida: "121", fondo: 0},
  { id: 6, ccontable: "6251110106", desc_contable: "PASAJES TERRESTRES NACIONALES", partida: "122", fondo: 0 },
  { id: 7, ccontable: "6251110107", desc_contable: "PEAJES Y ESTACIONAMIENTO", partida: "124", fondo: 0},
  { id: 8, ccontable: "6251110108", desc_contable: "CORREOS", partida: "125", fondo: 0},
  { id: 9, ccontable: "6251110109", desc_contable: "ALOJAMIENTO LOCAL", partida: "126", fondo: 0},
  { id: 10, ccontable: "6251110110", desc_contable: "ALOJAMIENTO EXTERIOR", partida: "127", fondo: 0},
  { id: 11, ccontable: "6251110111", desc_contable: "ALIMENTACION LOCAL", partida: "128", fondo: 0},
  { id: 12, ccontable: "6251110112", desc_contable: "ALIMENTACION EXTERIOR", partida: "129", fondo: 0},
  { id: 13, ccontable: "6251110113", desc_contable: "TRAMITES LEGALES Y NOTARIALES", partida: "140", fondo: 0},
  { id: 14, ccontable: "6251110114", desc_contable: "MANT. Y REP. DE EDIFICACIONES E INSTALACIONES", partida: "159", fondo: 0},
  { id: 15, ccontable: "6251110115", desc_contable: "MANT. Y REP. DE EQUIPO DE TRANSPORTE", partida: "161", fondo: 0},
  { id: 16, ccontable: "6251110116", desc_contable: "MANT. Y REP. DE EQUIPOS DIVERSOS", partida: "163", fondo: 0},
  { id: 17, ccontable: "6251110117", desc_contable: "IMPRESION Y FORMATOS", partida: "225", fondo: 0},
  { id: 18, ccontable: "6251110118", desc_contable: "FOTOCOPIAS Y OTROS", partida: "227", fondo: 0  },
  { id: 19, ccontable: "6251110119", desc_contable: "OTROS SERVICIOS PRESTADOS POR TERCEROS", partida: "236", fondo: 0},
  { id: 20, ccontable: "6251110120", desc_contable: "LICENCIA DE FUNCIONAMIENTO", partida: "250", fondo: 0},
  { id: 21, ccontable: "6251110121", desc_contable: "OTROS", partida: "253", fondo: 0},
  { id: 22, ccontable: "6251110122", desc_contable: "GASOLINA", partida: "340", fondo: 0},
  { id: 23, ccontable: "6251110123", desc_contable: "UTILES DE ESCRITORIO, PAPELERIA Y ECONOMATO", partida: "344", fondo: 0},
  { id: 24, ccontable: "6251110124", desc_contable: "PROGRAMAS DE COMPUTADORA (SOFTWARE)", partida: "345", fondo: 0},
  { id: 25, ccontable: "6251110125", desc_contable: "ARTICULOS DE LIMPIEZA", partida: "348", fondo: 0},
  { id: 26, ccontable: "6251110126", desc_contable: "OTROS SUMINISTROS", partida: "357", fondo: 0},
  { id: 27, ccontable: "6251110127", desc_contable: "MULTAS Y SANCIONES", partida: "377", fondo: 0},
  { id: 28, ccontable: "6251110128", desc_contable: "OTROS GASTOS DE GESTION", partida: "409", fondo: 0},
];




// La tabla `orden_compras` almacena la información de cada orden de compra.
// Se consulta esta tabla para obtener los siguientes campos:
// - id: identificador único de la orden
// - solicitante → mapeado como responsable
// - importe → mapeado como monto
// - partida: código de partida presupuestal
// - centroCosto: nombre del centro de costo
// - descripción: detalle del gasto
// - categoría: clasificación del gasto
const mockGastos: Gasto[] = [
  {
    id: 0,
    responsable: "Juan Pérez",
    monto: 1200,
    partida: "76",
    centroCosto: "Centro 1",
    descripcion: "Compra de materiales de oficina",
    categoria: "Oficina",
  },
  {
    id: 2,
    responsable: "María López",
    monto: 800,
    partida: "119",
    centroCosto: "Centro 2",
    descripcion: "Pasajes locales",
    categoria: "Transporte",
  },
];

// MODAL PARA ORDEN
function OrdenModal({ abierto, onCerrar, onGuardar }: OrdenModalProps) {
  const [orden, setOrden] = useState("");

  const handleGuardar = () => {
    if (!orden.trim()) return;
    onGuardar(orden.trim());
    setOrden("");
    onCerrar();
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Ingresar Número de ID</h3>
          <button
            onClick={onCerrar}
            className="p-1 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de ID
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="Ej: 1234"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGuardar()}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onCerrar}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 transition"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// MODAL PARA GESTIONAR FONDOS
function FondoModal({ abierto, partida, onCerrar, onGuardar }: FondoModalProps) {
  const [monto, setMonto] = useState("");
  const [tipo, setTipo] = useState<'agregar' | 'quitar'>('agregar');

  const handleGuardar = () => {
    if (!monto || !partida) return;
    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) return;
    
    onGuardar(partida.partida, montoNum, tipo);
    setMonto("");
    onCerrar();
  };

  if (!abierto || !partida) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Gestionar Fondo</h3>
          <button
            onClick={onCerrar}
            className="p-1 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500">Partida</p>
            <p className="font-semibold text-gray-900">{partida.partida} - {partida.desc_contable}</p>
            <p className="text-sm text-gray-600 mt-1">Fondo actual: S/ {partida.fondo.toLocaleString()}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Operación
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setTipo('agregar')}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition ${
                  tipo === 'agregar'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Plus className="w-4 h-4 inline mr-1" />
                Agregar
              </button>
              <button
                onClick={() => setTipo('quitar')}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition ${
                  tipo === 'quitar'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Minus className="w-4 h-4 inline mr-1" />
                Quitar
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto (S/)
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="0.00"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGuardar()}
            />
          </div>

          {monto && (
            <div className="p-3 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-800">
                Nuevo fondo: S/ {
                  tipo === 'agregar' 
                    ? (partida.fondo + parseFloat(monto || '0')).toLocaleString()
                    : (partida.fondo - parseFloat(monto || '0')).toLocaleString()
                }
              </p>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              onClick={onCerrar}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition ${
                tipo === 'agregar' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente: Formulario de Presupuesto
function FormularioPresupuesto({ onGuardar }: FormularioPresupuestoProps) {
  const [filtro, setFiltro] = useState<string>("");
  const [partida, setPartida] = useState<string>("");
  const [monto, setMonto] = useState<string>("");

  const partidasFiltradas = partidasInitialData.filter((p) =>
    p.desc_contable.toLowerCase().includes(filtro.toLowerCase()) ||
    p.partida.includes(filtro) ||
    p.ccontable.includes(filtro)
  );

  const handleGuardar = () => {
    if (!partida || !monto) return;
    const montoNum = parseFloat(monto);
    
    onGuardar({ 
      partida, 
      fondo: montoNum
    });
    setPartida("");
    setMonto("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <DollarSign className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Asignar Fondo</h2>
          <p className="text-sm text-gray-500">Asigne fondo a una partida</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Search className="w-4 h-4 inline mr-1" />
            Buscar Partida
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            placeholder="Escriba para buscar..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Partida</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              value={partida}
              onChange={(e) => setPartida(e.target.value)}
            >
              <option value="">Seleccione una partida</option>
              {partidasFiltradas.map((p) => (
                <option key={p.id} value={p.partida}>
                  {p.partida} - {p.desc_contable}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fondo Asignado (S/)</label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="0.00"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleGuardar}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 active:scale-95 transition font-medium shadow-sm"
          >
            Asignar Fondo
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente: Lista de Partidas
function ListaPartidas({ partidas, titulo, icono: Icono, colorBg, onActualizarFondo }: ListaPartidasProps) {
  const [expandido, setExpandido] = useState<string | null>(null);
  const [abierto, setAbierto] = useState<boolean>(false);
  const [modalFondoAbierto, setModalFondoAbierto] = useState(false);
  const [partidaSeleccionada, setPartidaSeleccionada] = useState<Partida | null>(null);

  const getEstadoPresupuesto = (fondo: number): string => {
    if (fondo === 0) return "Sin presupuesto";
    if (fondo <= 100) return "Con presupuesto al límite";
    return "Con presupuesto";
  };

  const handleAbrirModalFondo = (partida: Partida) => {
    setPartidaSeleccionada(partida);
    setModalFondoAbierto(true);
  };

  const handleGuardarFondo = (partidaId: string, monto: number, tipo: 'agregar' | 'quitar') => {
    const partida = partidas.find(p => p.partida === partidaId);
    if (!partida) return;
    
    const nuevoFondo = tipo === 'agregar' 
      ? partida.fondo + monto 
      : Math.max(0, partida.fondo - monto);
    
    onActualizarFondo(partidaId, nuevoFondo);
  };

  return (
    <>
      <FondoModal
        abierto={modalFondoAbierto}
        partida={partidaSeleccionada}
        onCerrar={() => {
          setModalFondoAbierto(false);
          setPartidaSeleccionada(null);
        }}
        onGuardar={handleGuardarFondo}
      />
      
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <button
          onClick={() => setAbierto(!abierto)}
          className="w-full p-6 flex items-center gap-3 hover:bg-gray-50 transition"
        >
          <div className={`p-2 ${colorBg} rounded-lg`}>
            <Icono className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{titulo}</h3>
          <span className="ml-auto bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
            {partidas.length}
          </span>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${abierto ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {abierto && (
          <div className="px-6 pb-6 space-y-2 max-h-96 overflow-y-auto border-t border-gray-100">
            {partidas.map((p) => (
              <div
                key={p.id}
                className="border border-gray-200 rounded-xl overflow-hidden hover:border-green-300 transition"
              >
                <button
                  onClick={() => setExpandido(expandido === p.id.toString() ? null : p.id.toString())}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="font-semibold text-green-600">{p.partida}</span>
                      <span className="text-sm text-gray-700 ml-2">{p.desc_contable}</span>
                    </div>
                    <span className="text-blue-600 font-semibold">
                      S/ {p.fondo.toLocaleString()}
                    </span>
                  </div>
                </button>

                  {expandido === p.id.toString() && (
                    <div className="px-4 py-3 bg-gray-50 border-t text-sm space-y-2">
                      {/*Poxima funciona sera que busque en las utimas orden de comparacion y muestre 
                      donde se gasto  se hizo el utimo movinete con esa paratida */}
                      {/* <p className="text-gray-600">
                        <span className="font-medium">Cuenta Contable:</span> {p.ccontable ?? 'No asignado'}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Centro de Costo:</span> {p.centro_costo_nombre ?? 'No asignado'}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Fondo Disponible:</span> S/ {p.fondo.toLocaleString() ?? 'No asignado'}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Estado:</span>{" "}
                        {getEstadoPresupuesto(p.fondo)}
                      </p> */}
                      <div className="pt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAbrirModalFondo(p);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        >
                          Gestionar Fondo
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// Componente: Tabla de Gastos
function TablaGastos({ gastos }: TablaGastosProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [ordenGuardada, setOrdenGuardada] = useState("");

  const procesarGuardado = (numeroDeOrden: string) => {
    console.log("Se recibió la orden:", numeroDeOrden);
    setOrdenGuardada(numeroDeOrden);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <OrdenModal 
        abierto={modalVisible} 
        onCerrar={() => setModalVisible(false)} 
        onGuardar={procesarGuardado} 
      />
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Registro de Gastos</h3>
          <p className="text-sm text-gray-500">Detalle de todas las órdenes de compra</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Responsable</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Monto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Partida</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Centro Costo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Descripción</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Categoría</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {gastos.map((g, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition">
                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                  {g.id ? g.id.toString() : 
                  <button
                    onClick={() => setModalVisible(true)}
                    className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Pendiente
                  </button>}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">{g.responsable}</td>
                <td className="px-4 py-4 text-sm font-semibold text-green-600">S/ {g.monto.toFixed(2)}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{g.partida}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{g.centroCosto}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{g.descripcion}</td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    {g.categoria}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Componente Principal
export default function PresupuestoApp() {
    // 1. Estados principales
    const [cuentaContablesData, setCuentaContablesData] = useState<Partida[]>([]);
  
    // 2. Cargar los datos al montar el componente
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const responsecuentaContables = await fetch('cuentaContables');
                const dataCuentaContables = await responsecuentaContables.json();
                setCuentaContablesData(dataCuentaContables); // Guardamos la estructura completa
              } catch (error) {
                console.error("Error cargando Cuentas Contables", error);
            }
        };
        cargarDatos();
    }, []);


    const actualizarMontoFondo = async (partida: string, nuevoFondo: number) => {
    try {
        // 1. Realizamos la petición PUT a la ruta dinámica
        const response = await axios.put(`/cuentaContables/${partida}`, {
            fondo: nuevoFondo
        });

        // 2. Si todo sale bien, puedes retornar un mensaje o el dato actualizado
        console.log("Éxito:", response.data.message);
        return { success: true };

    } catch (error: any) {
        // 3. Manejo de errores (validación de Laravel, etc)
        console.error("Error al actualizar:", error.response?.data || error.message);
        return { success: false, error: error.response?.data };
    }
};


  // Actualizar fondo directamente en cuentaContablesDataz
  const handleGuardarPresupuesto = (nuevo: Presupuesto) => {
    // Pendiente a concecion POST para guardar los nuevos fondos al servidor
    setCuentaContablesData(prev =>
      prev.map(p => p.partida === nuevo.partida ? { ...p, fondo: nuevo.fondo } : p )
    );
    actualizarMontoFondo(nuevo.partida, nuevo.fondo);
  };

  const handleActualizarFondo = (partidaId: string, nuevoFondo: number) => {

    // Pendiente a concecion POST para guardar los nuevos fondos al servidor
    setCuentaContablesData(prev =>
      prev.map(p => p.partida === partidaId ? { ...p, fondo: nuevoFondo } : p)
    );
    actualizarMontoFondo(partidaId, nuevoFondo);
  };

  // Filtrar partidas por estado de fondo
  const conPresupuesto = cuentaContablesData.filter(p => p.fondo > 100);
  const conLimitePresupuesto = cuentaContablesData.filter(p => p.fondo > 0 && p.fondo <= 100);
  const sinPresupuesto = cuentaContablesData.filter(p => p.fondo === 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <FormularioPresupuesto onGuardar={handleGuardarPresupuesto} />

        <div className="grid md:grid-cols-2 gap-6">
          <ListaPartidas
            partidas={conPresupuesto}
            titulo="Con Presupuesto"
            icono={TrendingUp}
            colorBg="bg-green-100 text-green-600"
            onActualizarFondo={handleActualizarFondo}
          />
          <ListaPartidas
            partidas={conLimitePresupuesto}
            titulo="Con Presupuesto al Límite"
            icono={AlertTriangle}
            colorBg="bg-yellow-100 text-yellow-600"
            onActualizarFondo={handleActualizarFondo}
          />
          <ListaPartidas
            partidas={sinPresupuesto}
            titulo="Sin Presupuesto"
            icono={FileText}
            colorBg="bg-gray-100 text-gray-600"
            onActualizarFondo={handleActualizarFondo}
          />
        </div>

        <TablaGastos gastos={mockGastos} />
      </div>
    </div>
  );
}