import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle, CalendarDays, ListChecks, Loader2, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";

const MaintenancePlanForm = ({ plan, assets, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    plan || {
      name: '', description: '', frequency: 'Semanal', interval_days: 7, usage_hours_trigger: null,
      condition_trigger: '', next_due_date: '', assigned_to_team: '', asset_id: null
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (plan) {
      setFormData({
        ...plan,
        next_due_date: plan.next_due_date ? plan.next_due_date.split('T')[0] : '',
        asset_id: plan.asset_id || null,
        interval_days: plan.interval_days || null,
        usage_hours_trigger: plan.usage_hours_trigger || null,
      });
    }
  }, [plan]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? null : parseFloat(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const submissionData = { ...formData, updated_at: new Date().toISOString() };
    if (submissionData.asset_id === "null" || submissionData.asset_id === "") {
        submissionData.asset_id = null;
    }
    if (submissionData.interval_days === "") submissionData.interval_days = null;
    if (submissionData.usage_hours_trigger === "") submissionData.usage_hours_trigger = null;


    try {
      let error;
      if (formData.id) {
        const { error: updateError } = await supabase.from('maintenance_plans').update(submissionData).eq('id', formData.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('maintenance_plans').insert(submissionData);
        error = insertError;
      }

      if (error) throw error;
      toast({ title: `Plano ${formData.id ? 'atualizado' : 'criado'} com sucesso!`, description: formData.name });
      onSave();
    } catch (error) {
      console.error(`Error ${formData.id ? 'updating' : 'creating'} plan:`, error);
      toast({ variant: "destructive", title: `Erro ao ${formData.id ? 'atualizar' : 'criar'} plano`, description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome do Plano</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="asset_id">Ativo Associado (Opcional)</Label>
          <select id="asset_id" name="asset_id" value={formData.asset_id || "null"} onChange={handleChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="null">Nenhum</option>
            {assets.map(asset => <option key={asset.id} value={asset.id}>{asset.name} ({asset.asset_id})</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="frequency">Frequência</Label>
          <select id="frequency" name="frequency" value={formData.frequency} onChange={handleChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="Diário">Diário</option>
            <option value="Semanal">Semanal</option>
            <option value="Quinzenal">Quinzenal</option>
            <option value="Mensal">Mensal</option>
            <option value="Trimestral">Trimestral</option>
            <option value="Semestral">Semestral</option>
            <option value="Anual">Anual</option>
            <option value="Horas de Uso">Horas de Uso</option>
            <option value="Condicional">Condicional</option>
          </select>
        </div>
      </div>
      {formData.frequency === 'Horas de Uso' && (
        <div>
          <Label htmlFor="usage_hours_trigger">Gatilho de Horas de Uso</Label>
          <Input id="usage_hours_trigger" name="usage_hours_trigger" type="number" value={formData.usage_hours_trigger || ''} onChange={handleChange} placeholder="Ex: 500" />
        </div>
      )}
      {['Diário', 'Semanal', 'Quinzenal', 'Mensal', 'Trimestral', 'Semestral', 'Anual'].includes(formData.frequency) && (
         <div>
          <Label htmlFor="interval_days">Intervalo em Dias (se aplicável)</Label>
          <Input id="interval_days" name="interval_days" type="number" value={formData.interval_days || ''} onChange={handleChange} placeholder="Ex: 7 para semanal"/>
        </div>
      )}
      {formData.frequency === 'Condicional' && (
        <div>
          <Label htmlFor="condition_trigger">Gatilho Condicional (Descrição)</Label>
          <Input id="condition_trigger" name="condition_trigger" value={formData.condition_trigger} onChange={handleChange} placeholder="Ex: Sensor de vibração > X" />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="next_due_date">Próxima Data de Execução</Label>
          <Input id="next_due_date" name="next_due_date" type="date" value={formData.next_due_date} onChange={handleChange} min={today} />
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
          {formData.id ? 'Salvar Alterações' : 'Criar Plano'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export { MaintenancePlanForm };

const MaintenancePlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPlansAndAssets();
  }, []);

  const fetchPlansAndAssets = async () => {
    setLoading(true);
    try {
      const { data: plansData, error: plansError } = await supabase
        .from('maintenance_plans')
        .select('*, assets (id, name, asset_id)')
        .order('created_at', { ascending: false });
      if (plansError) throw plansError;
      setPlans(plansData || []);

      const { data: assetsData, error: assetsError } = await supabase
        .from('assets')
        .select('id, name, asset_id')
        .order('name', { ascending: true });
      if (assetsError) throw assetsError;
      setAssets(assetsData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ variant: "destructive", title: "Erro ao buscar dados", description: error.message });
      setPlans([]);
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFormSave = () => {
    setIsFormOpen(false);
    setEditingPlan(null);
    fetchPlansAndAssets();
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingPlan(null);
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setIsFormOpen(true);
  };

  const handleDelete = async (planId, planName) => {
    if (window.confirm(`Tem certeza que deseja excluir o plano "${planName}"?`)) {
      try {
        const { error } = await supabase.from('maintenance_plans').delete().eq('id', planId);
        if (error) throw error;
        toast({ title: "Plano excluído com sucesso!", description: planName });
        fetchPlansAndAssets();
      } catch (error) {
        console.error('Error deleting plan:', error);
        toast({ variant: "destructive", title: "Erro ao excluir plano", description: error.message });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Planos de Manutenção</h2>
          <p className="text-muted-foreground">Crie e gerencie planos de manutenção preventiva e preditiva.</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if(!isOpen) setEditingPlan(null);}}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingPlan(null); setIsFormOpen(true); }} className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground shadow-md hover:shadow-lg transition-all">
              <PlusCircle className="mr-2 h-5 w-5" /> Criar Novo Plano
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{editingPlan ? 'Editar Plano de Manutenção' : 'Criar Novo Plano de Manutenção'}</DialogTitle>
              <DialogDescription>
                {editingPlan ? 'Modifique os detalhes do plano abaixo.' : 'Preencha os detalhes do novo plano abaixo.'}
              </DialogDescription>
            </DialogHeader>
            <MaintenancePlanForm plan={editingPlan} assets={assets} onSave={handleFormSave} onCancel={handleFormCancel} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-lg glassmorphism">
        <CardHeader>
          <CardTitle className="text-xl">Planos Ativos</CardTitle>
          <CardDescription>Visualize os planos de manutenção programados.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Carregando planos...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {plans.map(plan => (
                <Card key={plan.id} className="bg-background/70 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2 flex flex-row justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      {plan.assets && <CardDescription className="text-xs">Ativo: {plan.assets.name} ({plan.assets.asset_id})</CardDescription>}
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 whitespace-nowrap">{plan.frequency}</span>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                      <p><CalendarDays className="inline mr-1 h-4 w-4 text-primary" /> Próxima Execução: {plan.next_due_date ? new Date(plan.next_due_date + 'T00:00:00').toLocaleDateString() : 'N/A'}</p>
                      <p><ListChecks className="inline mr-1 h-4 w-4 text-primary" /> Atribuído a: {plan.assigned_to_team || 'N/A'}</p>
                    </div>
                    {plan.description && <p className="text-xs mt-1">Descrição: {plan.description}</p>}
                    <div className="mt-2 text-right space-x-1">
                       <Button variant="ghost" size="icon" onClick={() => handleEdit(plan)} className="hover:text-primary h-7 w-7">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(plan.id, plan.name)} className="hover:text-destructive h-7 w-7">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {!loading && plans.length === 0 && (
            <p className="text-muted-foreground text-center py-8">Nenhum plano de manutenção ativo encontrado.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenancePlansPage;
  