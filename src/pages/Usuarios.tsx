import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:4000/api/users';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [editando, setEditando] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [sucesso, setSucesso] = useState('');

  const carregarUsuarios = () => {
    setLoading(true);
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setUsuarios(data);
        setLoading(false);
      })
      .catch(() => {
        setErro('Erro ao carregar usuários');
        setLoading(false);
      });
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const handleCriar = async (e) => {
    e.preventDefault();
    setErro(''); setSucesso('');
    if (!nome || !email || !senha) {
      setErro('Preencha todos os campos');
      return;
    }
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    });
    if (res.ok) {
      setNome(''); setEmail(''); setSenha('');
      setSucesso('Usuário criado com sucesso!');
      carregarUsuarios();
    } else {
      const data = await res.json();
      setErro(data.error || 'Erro ao criar usuário');
    }
  };

  const handleEditar = (u) => {
    setEditando(u.id);
    setEditNome(u.nome);
    setEditEmail(u.email);
  };

  const handleSalvarEdicao = async (id) => {
    setErro(''); setSucesso('');
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: editNome, email: editEmail })
    });
    if (res.ok) {
      setEditando(null);
      setSucesso('Usuário atualizado!');
      carregarUsuarios();
    } else {
      const data = await res.json();
      setErro(data.error || 'Erro ao editar usuário');
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    setErro(''); setSucesso('');
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setSucesso('Usuário removido!');
      carregarUsuarios();
    } else {
      setErro('Erro ao remover usuário');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Usuários</h1>
        <p className="text-muted-foreground">Administre os usuários do sistema: crie, edite e remova acessos.</p>
      </div>
      <form onSubmit={handleCriar} className="flex flex-wrap gap-2 items-end">
        <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} className="border rounded px-2 py-1" />
        <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} className="border rounded px-2 py-1" />
        <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} className="border rounded px-2 py-1" />
        <button type="submit" className="bg-primary text-white px-4 py-1 rounded">Adicionar</button>
      </form>
      {erro && <div className="text-destructive text-center">{erro}</div>}
      {sucesso && <div className="text-green-600 text-center">{sucesso}</div>}
      {loading ? (
        <div className="text-center text-muted-foreground">Carregando usuários...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-left">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">Nome</th>
                <th className="px-4 py-2 border-b">E-mail</th>
                <th className="px-4 py-2 border-b">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-2 border-b">{u.id}</td>
                  <td className="px-4 py-2 border-b">
                    {editando === u.id ? (
                      <input value={editNome} onChange={e => setEditNome(e.target.value)} className="border rounded px-2 py-1" />
                    ) : u.nome}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {editando === u.id ? (
                      <input value={editEmail} onChange={e => setEditEmail(e.target.value)} className="border rounded px-2 py-1" />
                    ) : u.email}
                  </td>
                  <td className="px-4 py-2 border-b flex gap-2">
                    {editando === u.id ? (
                      <>
                        <button onClick={() => handleSalvarEdicao(u.id)} className="bg-green-600 text-white px-2 py-1 rounded">Salvar</button>
                        <button onClick={() => setEditando(null)} className="bg-gray-400 text-white px-2 py-1 rounded">Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditar(u)} className="bg-blue-600 text-white px-2 py-1 rounded">Editar</button>
                        <button onClick={() => handleExcluir(u.id)} className="bg-red-600 text-white px-2 py-1 rounded">Excluir</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Usuarios; 