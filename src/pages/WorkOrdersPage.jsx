import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter, FileText, Loader2, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";

const WorkOrderForm = ({ workOrder, assets, maintenancePlans, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    workOrder || {
      work_order_id: '', asset_id: null, maintenance_plan_id: null, type: 'Corretiva',
      status: 'Aberta', priority: 'Média', description: '', reported_by: '', assigned_to_team: ''
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (workOrder) {
      setFormData({
        ...workOrder,
        asset_id: workOrder.asset_id || null,
        maintenance_plan_id: workOrder.maintenance_plan_id || null,
      });
    } else {
      const prefix = "OS";
      const year = new Date().getFullYear();
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      setFormData(prev => ({ ...prev, work_order_id: `${prefix}-${year}-${randomNum}`}));
    }
  }, [workOrder]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const submissionData = { ...formData, updated_at: new Date().toISOString() };
    if (submissionData.asset_id === "null" || submissionData.asset_id === "") submissionData.asset_id = null;
    if (submissionData.maintenance_plan_id === "null" || submissionData.maintenance_plan_id === "") submissionData.maintenance_plan_id = null;

    try {
      let error;
      if (formData.id) {
        const { error: updateError } = await supabase.from('work_orders').update(submissionData).eq('id', formData.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('work_orders').insert(submissionData);
        error = insertError;
      }

      if (error) throw error;
      toast({ title: `Ordem de Serviço ${formData.id ? 'atualizada' : 'criada'} com sucesso!`, description: formData.work_order_id });
      onSave();
    } catch (error) {
      console.error(`Error ${formData.id ? 'updating' : 'creating'} work order:`, error);
      toast({ variant: "destructive", title: `Erro ao ${formData.id ? 'atualizar' : 'criar'} OS`, description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="work_order_id">ID da OS</Label>
          <Input id="work_order_id" name="work_order_id" value={formData.work_order_id} onChange={handleChange} required readOnly={formData.id ? true : false} />
        </div>
        <div>
          <Label htmlFor="asset_id">Ativo Associado (Opcional)</Label>
          <select id="asset_id" name="asset_id" value={formData.asset_id || "null"} onChange={handleChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="null">Nenhum</option>
            {assets.map(asset => <option key={asset.id} value={asset.id}>{asset.name} ({asset.asset_id})</option>)}
          </select>
        </div>
      </div>
      <div>
        <Label htmlFor="maintenance_plan_id">Plano de Manutenção (Opcional)</Label>
        <select id="maintenance_plan_id" name="maintenance_plan_id" value={formData.maintenance_plan_id || "null"} onChange={handleChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="null">Nenhum</option>
          {maintenancePlans.map(plan => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Tipo de OS</Label>
          <select id="type" name="type" value={formData.type} onChange={handleChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="Corretiva">Corretiva</option>
            <option value="Preventiva">Preventiva</option>
            <option value="Preditiva">Preditiva</option>
            <option value="Inspeção">Inspeção</option>
            <option value="Melhoria">Melhoria</option>
          </select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="Aberta">Aberta</option>
            <option value="Em Execução">Em Execução</option>
            <option value="Pendente">Pendente</option>
            <option value="Concluída">Concluída</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>
      </div>
      <div>
        <Label htmlFor="priority">Prioridade</Label>
        <select id="priority" name="priority" value={formData.priority} onChange={handleChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="Baixa">Baixa</option>
          <option value="Média">Média</option>
          <option value="Alta">Alta</option>
          <option value="Urgente">Urgente</option>
        </select>
      </div>
      <div>
        <Label htmlFor="description">Descrição do Problema/Serviço</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="reported_by">Reportado Por</Label>
          <Input id="reported_by" name="reported_by" value={formData.reported_by} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="assigned_to_team">Equipe/Técnico Responsável</Label>
          <Input id="assigned_to_team" name="assigned_to_team" value={formData.assigned_to_team} onChange={handleChange} />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
        <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {formData.id ? 'Salvar Alterações' : 'Criar OS'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export { WorkOrderForm };

const WorkOrdersPage = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const [assets, setAssets] = useState([]);
  const [maintenancePlans, setMaintenancePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWorkOrder, setEditingWorkOrder] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const { data: woData, error: woError } = await supabase
        .from('work_orders')
        .select('*, assets (id, name, asset_id), maintenance_plans (id, name)')
        .order('created_at', { ascending: false });
      if (woError) throw woError;
      setWorkOrders(woData || []);

      const { data: assetsData, error: assetsError } = await supabase
        .from('assets')
        .select('id, name, asset_id')
        .order('name', { ascending: true });
      if (assetsError) throw assetsError;
      setAssets(assetsData || []);

      const { data: plansData, error: plansError } = await supabase
        .from('maintenance_plans')
        .select('id, name')
        .order('name', { ascending: true });
      if (plansError) throw plansError;
      setMaintenancePlans(plansData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ variant: "destructive", title: "Erro ao buscar dados", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSave = () => {
    setIsFormOpen(false);
    setEditingWorkOrder(null);
    fetchInitialData();
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingWorkOrder(null);
  };

  const handleEdit = (workOrder) => {
    setEditingWorkOrder(workOrder);
    setIsFormOpen(true);
  };

  const handleDelete = async (workOrderId, workOrderName) => {
    if (window.confirm(`Tem certeza que deseja excluir a OS "${workOrderName}"?`)) {
      try {
        const { error } = await supabase.from('work_orders').delete().eq('id', workOrderId);
        if (error) throw error;
        toast({ title: "Ordem de Serviço excluída com sucesso!", description: workOrderName });
        fetchInitialData();
      } catch (error) {
        console.error('Error deleting work order:', error);
        toast({ variant: "destructive", title: "Erro ao excluir OS", description: error.message });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Ordens de Serviço (OS)</h2>
          <p className="text-muted-foreground">Gerencie todas as ordens de serviço, desde a criação até a conclusão.</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if(!isOpen) setEditingWorkOrder(null);}}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingWorkOrder(null); setIsFormOpen(true); }} className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground shadow-md hover:shadow-lg transition-all">
              <PlusCircle className="mr-2 h-5 w-5" /> Criar Nova OS
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{editingWorkOrder ? 'Editar Ordem de Serviço' : 'Criar Nova Ordem de Serviço'}</DialogTitle>
              <DialogDescription>
                {editingWorkOrder ? 'Modifique os detalhes da OS abaixo.' : 'Preencha os detalhes da nova OS abaixo.'}
              </DialogDescription>
            </DialogHeader>
            <WorkOrderForm workOrder={editingWorkOrder} assets={assets} maintenancePlans={maintenancePlans} onSave={handleFormSave} onCancel={handleFormCancel} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-lg glassmorphism">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-xl">Lista de Ordens de Serviço</CardTitle>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filtrar OS
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Carregando Ordens de Serviço...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {workOrders.map(os => (
                <Card key={os.id} className="bg-background/70 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{os.work_order_id} - {os.assets?.name || 'Ativo não especificado'}</CardTitle>
                        <CardDescription className="text-sm">{os.type} {os.maintenance_plans ? `(Plano: ${os.maintenance_plans.name})` : ''}</CardDescription>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        os.priority === 'Alta' || os.priority === 'Urgente' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400' :
                        os.priority === 'Média' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-400'
                      }`}>{os.priority}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p className="mb-2">{os.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <p>Status: <span className={`font-medium ${
                        os.status === 'Aberta' ? 'text-red-500' :
                        os.status === 'Em Execução' ? 'text-yellow-500' :
                        os.status === 'Pendente' ? 'text-orange-500' :
                        os.status === 'Concluída' ? 'text-green-500' :
                        'text-gray-500' 
                      }`}>{os.status}</span></p>
                      <p>Criada em: {new Date(os.created_at).toLocaleDateString()}</p>
                      <p>Responsável: {os.assigned_to_team || 'N/A'}</p>
                    </div>
                    <div className="mt-2 text-right space-x-1">
                       <Button variant="ghost" size="icon" onClick={() => handleEdit(os)} className="hover:text-primary h-7 w-7">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(os.id, os.work_order_id)} className="hover:text-destructive h-7 w-7">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {!loading && workOrders.length === 0 && (
            <p className="text-muted-foreground text-center py-8">Nenhuma ordem de serviço encontrada.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkOrdersPage;
  