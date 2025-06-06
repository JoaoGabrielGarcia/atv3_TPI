import { useState } from 'react';
import ServicoModal from '../components/ServicoModal';
import { mockServices } from '../data/mockServices';

const filtros = [
  { label: 'Todos', value: 'todos' },
  { label: 'Top 10 mais consumidos', value: 'top10' },
];

function filtrarServicos(servicos: any[], filtro: string) {
  switch (filtro) {
    case 'top10':
      return [...servicos].sort((a, b) => (b.qtdConsumida || 0) - (a.qtdConsumida || 0)).slice(0, 10);
    default:
      return servicos;
  }
}

export default function ServicosPage() {
  const [servicos, setServicos] = useState<any[]>(mockServices);
  const [modalOpen, setModalOpen] = useState(false);
  const [filtro, setFiltro] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const servicosFiltrados = filtrarServicos(servicos, filtro);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServicos = servicosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(servicosFiltrados.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Serviços</h1>
        <div className="flex gap-2 flex-wrap items-center">
          {filtros.map(f => (
            <button
              key={f.value}
              className={`px-3 py-1 rounded border ${filtro === f.value ? 'bg-blue-700 text-white' : 'bg-gray-950 text-blue-700 border-blue-700'} transition`}
              onClick={() => setFiltro(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition" onClick={() => setModalOpen(true)}>
          Cadastrar Serviço
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-700 rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">Valor</th>
            </tr>
          </thead>
          <tbody>
            {currentServicos.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center text-gray-300 py-8">Nenhum serviço cadastrado.</td>
              </tr>
            ) : (
              currentServicos.map((s, i) => (
                <tr key={i} className="border-t border-gray-600">
                  <td className="px-4 py-2">{s.nome}</td>
                  <td className="px-4 py-2">R$ {s.valor.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {servicosFiltrados.length > itemsPerPage && (
        <div className="flex justify-center mt-6">
          <nav>
            <ul className="inline-flex items-center space-x-1">
              <li>
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <li key={page}>
                  <button
                    onClick={() => paginate(page)}
                    className={`px-3 py-2 leading-tight ${page === currentPage ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700' : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'} border border-gray-300`}
                  >
                    {page}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      <ServicoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={servico => {
          setServicos([...servicos, servico]);
          setModalOpen(false);
        }}
      />
    </div>
  );
} 