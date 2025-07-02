import React, { useState } from 'react';

const API_URL = 'http://localhost:4000/api/search';

const Search = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setErro('Erro ao buscar informações.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Busca</h1>
        <p className="text-muted-foreground">Encontre leads, campanhas e informações rapidamente.</p>
      </div>
      <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Digite para buscar em todo o sistema..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Buscar</button>
      </form>
      {erro && <div className="text-destructive text-center">{erro}</div>}
      {loading && <div className="text-center text-muted-foreground">Buscando...</div>}
      {result && (
        <div className="space-y-8 mt-8">
          {['leads', 'campanhas', 'usuarios', 'mensagens'].map(tipo => (
            <div key={tipo}>
              <h2 className="text-xl font-semibold mb-2 capitalize">{tipo}</h2>
              {result[tipo] && result[tipo].length > 0 ? (
                <table className="min-w-full border text-left">
                  <thead>
                    <tr>
                      {Object.keys(result[tipo][0]).map((k) => (
                        <th key={k} className="px-4 py-2 border-b">{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result[tipo].map((item: any) => (
                      <tr key={item.id}>
                        {Object.values(item).map((v, i) => (
                          <td key={i} className="px-4 py-2 border-b">{String(v)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-muted-foreground">Nenhum resultado encontrado.</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search; 