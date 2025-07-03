import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const API_URL = '/api/company';

const CompanyProfiles = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [area, setArea] = useState('');
  const [produtos, setProdutos] = useState('');
  const [diferenciais, setDiferenciais] = useState('');
  const [tom, setTom] = useState('');
  const [representante, setRepresentante] = useState('');
  const [editEmpresa, setEditEmpresa] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [editDescricao, setEditDescricao] = useState('');
  const [editArea, setEditArea] = useState('');
  const [editProdutos, setEditProdutos] = useState('');
  const [editDiferenciais, setEditDiferenciais] = useState('');
  const [editTom, setEditTom] = useState('');
  const [editRepresentante, setEditRepresentante] = useState('');

  const carregarEmpresas = () => {
    setLoading(true);
    fetch(API_URL)
      .then(res => res.json())
      .then(data => { setEmpresas(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setErro('Erro ao carregar perfis'); setLoading(false); });
  };

  useEffect(() => { carregarEmpresas(); }, []);

  const handleCriar = async (e) => {
    e.preventDefault();
    setErro(''); setSucesso('');
    if (!nome) { setErro('Preencha o nome da empresa'); return; }
    if (!representante) { setErro('Preencha o nome do representante'); return; }
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, descricao, area_atuacao: area, produtos_servicos: produtos, diferenciais, tom_voz: tom, representante })
    });
    if (res.ok) {
      setNome(''); setDescricao(''); setArea(''); setProdutos(''); setDiferenciais(''); setTom(''); setRepresentante('');
      setSucesso('Perfil criado!');
      carregarEmpresas();
    } else {
      setErro('Erro ao criar perfil');
    }
  };

  const openEditModal = (empresa) => {
    setEditEmpresa(empresa);
    setEditNome(empresa.nome);
    setEditDescricao(empresa.descricao || '');
    setEditArea(empresa.area_atuacao || '');
    setEditProdutos(empresa.produtos_servicos || '');
    setEditDiferenciais(empresa.diferenciais || '');
    setEditTom(empresa.tom_voz || '');
    setEditRepresentante(empresa.representante || '');
  };
  const closeEditModal = () => {
    setEditEmpresa(null);
    setEditNome(''); setEditDescricao(''); setEditArea(''); setEditProdutos(''); setEditDiferenciais(''); setEditTom(''); setEditRepresentante('');
  };
  const handleEditSave = async () => {
    if (!editEmpresa) return;
    setErro(''); setSucesso('');
    if (!editNome) { setErro('Preencha o nome da empresa'); return; }
    if (!editRepresentante) { setErro('Preencha o nome do representante'); return; }
    const res = await fetch(`${API_URL}/${editEmpresa.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: editNome, descricao: editDescricao, area_atuacao: editArea, produtos_servicos: editProdutos, diferenciais: editDiferenciais, tom_voz: editTom, representante: editRepresentante })
    });
    if (res.ok) {
      closeEditModal();
      setSucesso('Perfil atualizado!');
      carregarEmpresas();
    } else {
      setErro('Erro ao atualizar perfil');
    }
  };
  const handleExcluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este perfil?')) return;
    setErro(''); setSucesso('');
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setSucesso('Perfil removido!');
      carregarEmpresas();
    } else {
      setErro('Erro ao remover perfil');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Perfis de Empresa</h1>
        <p className="text-muted-foreground">Cadastre e gerencie os perfis de empresa para personalizar as campanhas e respostas da IA.</p>
      </div>
      <form onSubmit={handleCriar} className="flex flex-wrap gap-2 items-end">
        <Input placeholder="Nome da empresa" value={nome} onChange={e => setNome(e.target.value)} />
        <Input placeholder="Nome do representante" value={representante} onChange={e => setRepresentante(e.target.value)} />
        <Input placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} />
        <Input placeholder="Área de atuação" value={area} onChange={e => setArea(e.target.value)} />
        <Input placeholder="Produtos/Serviços" value={produtos} onChange={e => setProdutos(e.target.value)} />
        <Input placeholder="Diferenciais" value={diferenciais} onChange={e => setDiferenciais(e.target.value)} />
        <Input placeholder="Tom de voz (ex: formal, descontraído)" value={tom} onChange={e => setTom(e.target.value)} />
        <Button type="submit">Adicionar Perfil</Button>
      </form>
      {erro && <div className="text-destructive text-center">{erro}</div>}
      {sucesso && <div className="text-green-600 text-center">{sucesso}</div>}
      <Card>
        <CardHeader>
          <CardTitle>Perfis de Empresa ({empresas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground">Carregando perfis...</div>
          ) : (
            <table className="min-w-full border text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">ID</th>
                  <th className="px-4 py-2 border-b">Nome</th>
                  <th className="px-4 py-2 border-b">Área</th>
                  <th className="px-4 py-2 border-b">Tom</th>
                  <th className="px-4 py-2 border-b">Ações</th>
                </tr>
              </thead>
              <tbody>
                {empresas.map((e) => (
                  <tr key={e.id}>
                    <td className="px-4 py-2 border-b">{e.id}</td>
                    <td className="px-4 py-2 border-b">{e.nome}</td>
                    <td className="px-4 py-2 border-b">{e.area_atuacao}</td>
                    <td className="px-4 py-2 border-b">{e.tom_voz}</td>
                    <td className="px-4 py-2 border-b">
                      <Button variant="secondary" size="sm" onClick={() => openEditModal(e)}>Editar</Button>{' '}
                      <Button variant="destructive" size="sm" onClick={() => handleExcluir(e.id)}>Excluir</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
      {/* Modal de edição de perfil */}
      <Dialog open={!!editEmpresa} onOpenChange={closeEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Perfil de Empresa</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Input placeholder="Nome da empresa" value={editNome} onChange={e => setEditNome(e.target.value)} />
            <Input placeholder="Nome do representante" value={editRepresentante} onChange={e => setEditRepresentante(e.target.value)} />
            <Input placeholder="Descrição" value={editDescricao} onChange={e => setEditDescricao(e.target.value)} />
            <Input placeholder="Área de atuação" value={editArea} onChange={e => setEditArea(e.target.value)} />
            <Input placeholder="Produtos/Serviços" value={editProdutos} onChange={e => setEditProdutos(e.target.value)} />
            <Input placeholder="Diferenciais" value={editDiferenciais} onChange={e => setEditDiferenciais(e.target.value)} />
            <Input placeholder="Tom de voz" value={editTom} onChange={e => setEditTom(e.target.value)} />
          </div>
          <DialogFooter>
            <Button onClick={handleEditSave}>Salvar</Button>
            <Button variant="outline" onClick={closeEditModal}>Cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyProfiles; 