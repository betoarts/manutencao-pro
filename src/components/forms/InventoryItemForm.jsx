
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from "@/components/ui/dialog";
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';

export const InventoryItemForm = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    item || {
      item_id: '', name: '', description: '', quantity: 0, min_stock_level: 0,
      unit_cost: null, location: '', supplier: '', part_number: '', category: ''
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        quantity: item.quantity || 0,
        min_stock_level: item.min_stock_level || 0,
        unit_cost: item.unit_cost || null,
      });
    } else {
        setFormData({
            item_id: '', name: '', description: '', quantity: 0, min_stock_level: 0,
            unit_cost: null, location: '', supplier: '', part_number: '', category: ''
        });
    }
  }, [item]);

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
    if (submissionData.unit_cost === "") submissionData.unit_cost = null;


    try {
      let error;
      if (formData.id) {
        const { error: updateError } = await supabase.from('inventory_items').update(submissionData).eq('id', formData.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('inventory_items').insert(submissionData);
        error = insertError;
      }

      if (error) throw error;
      toast({ title: `Item ${formData.id ? 'atualizado' : 'adicionado'} com sucesso!`, description: formData.name });
      onSave();
    } catch (error) {
      console.error(`Error ${formData.id ? 'updating' : 'creating'} item:`, error);
      toast({ variant: "destructive", title: `Erro ao ${formData.id ? 'atualizar' : 'adicionar'} item`, description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="item_id">ID do Item (Ex: P001)</Label>
          <Input id="item_id" name="item_id" value={formData.item_id} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="name">Nome do Item</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="quantity">Quantidade</Label>
          <Input id="quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} min="0" required />
        </div>
        <div>
          <Label htmlFor="min_stock_level">Estoque Mínimo</Label>
          <Input id="min_stock_level" name="min_stock_level" type="number" value={formData.min_stock_level} onChange={handleChange} min="0" />
        </div>
        <div>
          <Label htmlFor="unit_cost">Custo Unitário (R$)</Label>
          <Input id="unit_cost" name="unit_cost" type="number" step="0.01" value={formData.unit_cost || ''} onChange={handleChange} placeholder="Ex: 25.50" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Localização</Label>
          <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="Ex: Prateleira A-12" />
        </div>
        <div>
          <Label htmlFor="category">Categoria</Label>
          <Input id="category" name="category" value={formData.category} onChange={handleChange} placeholder="Ex: Rolamento, Filtro" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="supplier">Fornecedor</Label>
          <Input id="supplier" name="supplier" value={formData.supplier} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="part_number">Part Number (Fabricante)</Label>
          <Input id="part_number" name="part_number" value={formData.part_number} onChange={handleChange} />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
        <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {formData.id ? 'Salvar Alterações' : 'Adicionar Item'}
        </Button>
      </DialogFooter>
    </form>
  );
};
  