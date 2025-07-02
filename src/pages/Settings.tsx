import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/api/users';

const Settings = () => {
  const [user, setUser] = useState<any>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Recupera o usuário logado do localStorage (ajuste conforme seu fluxo de autenticação)
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  let userId = undefined;
  try {
    userId = userStr ? JSON.parse(userStr).id : undefined;
  } catch {
    userId = undefined;
  }

  useEffect(() => {
    if (!userId || !token) {
      setErro('Usuário não autenticado. Faça login novamente.');
      setLoading(false);
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    setLoading(true);
    fetch(`${API_URL}/${userId}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status === 401) {
          setErro('Sessão expirada. Faça login novamente.');
          setLoading(false);
          setTimeout(() => navigate('/login'), 2000);
          return null;
        }
        if (res.status === 404) {
          setErro('Usuário não encontrado.');
          setLoading(false);
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setUser(data);
          setNome(data.nome);
          setEmail(data.email);
        }
        setLoading(false);
      })
      .catch(() => {
        setErro('Erro ao buscar dados do usuário.');
        setLoading(false);
      });
  }, [userId, token, navigate]);

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(''); setSucesso('');
    if (!nome || !email) {
      setErro('Nome e e-mail são obrigatórios.');
      return;
    }
    const body: any = { nome, email };
    if (novaSenha) body.senha = novaSenha;
    setLoading(true);
    const res = await fetch(`${API_URL}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(body)
    });
    setLoading(false);
    if (res.ok) {
      setSucesso('Dados atualizados com sucesso!');
      setSenha(''); setNovaSenha('');
    } else {
      const data = await res.json();
      setErro(data.error || 'Erro ao atualizar dados.');
    }
  };

  if (loading) return <div className="text-center text-muted-foreground">Carregando...</div>;
  if (erro) return <div className="text-center text-destructive mt-8">{erro}</div>;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Ajuste as preferências do sistema e do seu perfil.</p>
      </div>
      <form onSubmit={handleSalvar} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block mb-1 font-medium">Nome</label>
          <input className="w-full border rounded px-3 py-2" value={nome} onChange={e => setNome(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">E-mail</label>
          <input className="w-full border rounded px-3 py-2" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Nova senha</label>
          <input className="w-full border rounded px-3 py-2" type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} placeholder="Deixe em branco para não alterar" />
        </div>
        {erro && <div className="text-destructive text-center">{erro}</div>}
        {sucesso && <div className="text-green-600 text-center">{sucesso}</div>}
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Salvar alterações</button>
      </form>
    </div>
  );
};

export default Settings; 