import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/api/campaigns';

const Campaigns = () => {
  const [campanhas, setCampanhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [sucesso, setSucesso] = useState('');
  const navigate = useNavigate();

  const carregarCampanhas = () => {
    setLoading(true);
    fetch(API_URL, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        if (res.status === 401) {
          setErro('Sessão expirada. Faça login novamente.');
          setCampanhas([]);
          setLoading(false);
          navigate('/login');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setCampanhas(Array.isArray(data) ? data : []);
        }
        setLoading(false);
      })
      .catch(() => {
        setErro('Erro ao carregar campanhas');
        setLoading(false);
      });
  };

  useEffect(() => {
    carregarCampanhas();
  }, []);

  const handleCriar = async (e) => {
    e.preventDefault();
    setErro(''); setSucesso('');
    if (!nome) {
      setErro('Preencha o nome da campanha');
      return;
    }
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ nome, descricao })
    });
    if (res.ok) {
      setNome(''); setDescricao('');
      setSucesso('Campanha criada com sucesso!');
      carregarCampanhas();
    } else {
      const data = await res.json();
      setErro(data.error || 'Erro ao criar campanha');
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta campanha?')) return;
    setErro(''); setSucesso('');
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setSucesso('Campanha removida!');
      carregarCampanhas();
    } else {
      setErro('Erro ao remover campanha');
    }
  };

  const safeCampanhas = Array.isArray(campanhas) ? campanhas : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Campanhas</h1>
        <p className="text-muted-foreground">Gerencie e acompanhe suas campanhas de prospecção aqui.</p>
      </div>
      <form onSubmit={handleCriar} className="flex flex-wrap gap-2 items-end">
        <Input placeholder="Nome da campanha" value={nome} onChange={e => setNome(e.target.value)} />
        <Input placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} />
        <Button type="submit">Adicionar Campanha</Button>
      </form>
      {erro && <div className="text-destructive text-center">{erro}</div>}
      {sucesso && <div className="text-green-600 text-center">{sucesso}</div>}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Campanhas ({safeCampanhas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground">Carregando campanhas...</div>
          ) : (
            <table className="min-w-full border text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">ID</th>
                  <th className="px-4 py-2 border-b">Nome</th>
                  <th className="px-4 py-2 border-b">Descrição</th>
                  <th className="px-4 py-2 border-b">Status</th>
                  <th className="px-4 py-2 border-b">Ações</th>
                </tr>
              </thead>
              <tbody>
                {safeCampanhas.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-2 border-b">{c.id}</td>
                    <td className="px-4 py-2 border-b">{c.nome}</td>
                    <td className="px-4 py-2 border-b">{c.descricao}</td>
                    <td className="px-4 py-2 border-b">{c.status}</td>
                    <td className="px-4 py-2 border-b">
                      <Button variant="destructive" size="sm" onClick={() => handleExcluir(c.id)}>Excluir</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Campaigns; 