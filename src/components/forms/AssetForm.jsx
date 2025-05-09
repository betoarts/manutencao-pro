
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from "@/components/ui/dialog";
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';

export const AssetForm = ({ asset, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    asset || {
      asset_id: '', name: '', type: '', location: '', status: 'Operacional',
      brand: '', model: '', serial_number: '', purchase_date: '', warranty_expiry_date: '', notes: ''
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (asset) {
      setFormData({
        ...asset,
        purchase_date: asset.purchase_date ? asset.purchase_date.split('T')[0] : '',
        warranty_expiry_date: asset.warranty_expiry_date ? asset.warranty_expiry_date.split('T')[0] : '',
      });
    } else {
      setFormData({
        asset_id: '', name: '', type: '', location: '', status: 'Operacional',
        brand: '', model: '', serial_number: '', purchase_date: '', warranty_expiry_date: '', notes: ''
      });
    }
  }, [asset]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let error;
      const submissionData = { ...formData, updated_at: new Date().toISOString() };
      if (formData.id) { 
        const { error: updateError } = await supabase.from('assets').update(submissionData).eq('id', formData.id);
        error = updateError;
      } else { 
        const { error: insertError } = await supabase.from('assets').insert(submissionData);
        error = insertError;
      }

      if (error) throw error;
      toast({ title: `Ativo ${formData.id ? 'atualizado' : 'criado'} com sucesso!`, description: formData.name });
      onSave();
    } catch (error) {
      console.error(`Error ${formData.id ? 'updating' : 'creating'} asset:`, error);
      toast({ variant: "destructive", title: `Erro ao ${formData.id ? 'atualizar' : 'criar'} ativo`, description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="asset_id">ID do Ativo (Ex: EQP-001)</Label>
          <Input id="asset_id" name="asset_id" value={formData.asset_id} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="name">Nome do Ativo</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Tipo</Label>
          <Input id="type" name="type" value={formData.type} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="location">Localização</Label>
          <Input id="location" name="location" value={formData.location} onChange={handleChange} />
        </div>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="Operacional">Operacional</option>
          <option value="Em Manutenção">Em Manutenção</option>
          <option value="Aguardando Peça">Aguardando Peça</option>
          <option value="Desativado">Desativado</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="brand">Marca</Label>
          <Input id="brand" name="brand" value={formData.brand} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="model">Modelo</Label>
          <Input id="model" name="model" value={formData.model} onChange={handleChange} />
        </div>
      </div>
      <div>
        <Label htmlFor="serial_number">Número de Série</Label>
        <Input id="serial_number" name="serial_number" value={formData.serial_number} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="purchase_date">Data de Aquisição</Label>
          <Input id="purchase_date" name="purchase_date" type="date" value={formData.purchase_date} onChange={handleChange} max={today} />
        </div>
        <div>
          <Label htmlFor="warranty_expiry_date">Fim da Garantia</Label>
          <Input id="warranty_expiry_date" name="warranty_expiry_date" type="date" value={formData.warranty_expiry_date} onChange={handleChange} />
        </div>
      </div>
      <div>
        <Label htmlFor="notes">Observações</Label>
        <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
        <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {formData.id ? 'Salvar Alterações' : 'Criar Ativo'}
        </Button>
      </DialogFooter>
    </form>
  );
};
  