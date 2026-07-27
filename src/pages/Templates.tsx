import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { MessageSquare, Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export interface Template {
  id: string;
  title: string;
  content: string;
}

const Templates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState<Template | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const loaded = localStorage.getItem('prospectflow_templates');
    if (loaded) {
      try {
        setTemplates(JSON.parse(loaded));
      } catch (e) {}
    } else {
      // Default templates
      const defaultTemplates = [
        { id: '1', title: 'Primeiro Contato (Frio)', content: 'Olá {nome}, tudo bem? Sou da agência ProspectFlow. Vi que sua empresa {empresa} tem grande potencial e gostaria de apresentar nossas soluções.' },
        { id: '2', title: 'Follow-up (Morno)', content: 'Oi {nome}, conseguiste dar uma olhada na nossa proposta? Qualquer dúvida estou à disposição!' }
      ];
      setTemplates(defaultTemplates);
      localStorage.setItem('prospectflow_templates', JSON.stringify(defaultTemplates));
    }
  }, []);

  const saveTemplates = (newTemplates: Template[]) => {
    setTemplates(newTemplates);
    localStorage.setItem('prospectflow_templates', JSON.stringify(newTemplates));
  };

  const handleOpenModal = (template?: Template) => {
    if (template) {
      setEditTemplate(template);
      setTitle(template.title);
      setContent(template.content);
    } else {
      setEditTemplate(null);
      setTitle('');
      setContent('');
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast({ title: 'Erro', description: 'Preencha o título e o conteúdo.', variant: 'destructive' });
      return;
    }

    if (editTemplate) {
      saveTemplates(templates.map(t => t.id === editTemplate.id ? { ...t, title, content } : t));
      toast({ title: 'Sucesso', description: 'Template atualizado.' });
    } else {
      const newTemplate = { id: Date.now().toString(), title, content };
      saveTemplates([...templates, newTemplate]);
      toast({ title: 'Sucesso', description: 'Template criado.' });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Excluir este template?')) {
      saveTemplates(templates.filter(t => t.id !== id));
      toast({ title: 'Sucesso', description: 'Template removido.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Templates de Mensagem</h1>
          <p className="text-muted-foreground">Configure as mensagens padrão para prospecção via WhatsApp</p>
        </div>
        <Button className="bg-[#FF9500] hover:bg-[#FF9500]/90 text-white gap-2" onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4" />
          Novo Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(template => (
          <Card key={template.id} className="bg-[#1c1c1e] border-none text-white shadow-lg relative group">
            <CardHeader>
              <CardTitle className="text-[#FF9500] flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {template.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 whitespace-pre-wrap">{template.content}</p>
              
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={() => handleOpenModal(template)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-500" onClick={() => handleDelete(template.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {templates.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            Nenhum template cadastrado. Crie o seu primeiro template!
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#1c1c1e] text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>{editTemplate ? 'Editar Template' : 'Novo Template'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Título</label>
              <Input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="Ex: Primeiro Contato"
                className="bg-black border-gray-800 focus:border-[#FF9500]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Mensagem</label>
              <Textarea 
                value={content} 
                onChange={e => setContent(e.target.value)} 
                placeholder="Ex: Olá {nome}, tudo bem?"
                rows={6}
                className="bg-black border-gray-800 focus:border-[#FF9500]"
              />
              <p className="text-xs text-gray-500">
                Variáveis disponíveis: {'{nome}'}, {'{empresa}'}, {'{cidade}'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-gray-800 hover:bg-gray-800 text-black" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button className="bg-[#FF9500] hover:bg-[#FF9500]/90 text-white" onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Templates;
