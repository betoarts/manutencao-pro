import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PackagePlus, AlertCircle, Loader2, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";

const InventoryItemForm = ({ item, onSave, onCancel }) => {
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

export { InventoryItemForm };

const InventoryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast({ variant: "destructive", title: "Erro ao buscar itens do inventário", description: error.message });
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSave = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    fetchItems();
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (itemId, itemName) => {
    if (window.confirm(`Tem certeza que deseja excluir o item "${itemName}" do inventário?`)) {
      try {
        const { error } = await supabase.from('inventory_items').delete().eq('id', itemId);
        if (error) throw error;
        toast({ title: "Item excluído com sucesso!", description: itemName });
        fetchItems();
      } catch (error) {
        console.error('Error deleting item:', error);
        toast({ variant: "destructive", title: "Erro ao excluir item", description: error.message });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Inventário de Peças</h2>
          <p className="text-muted-foreground">Controle o estoque de peças de reposição e consumíveis.</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if(!isOpen) setEditingItem(null);}}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingItem(null); setIsFormOpen(true); }} className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground shadow-md hover:shadow-lg transition-all">
              <PackagePlus className="mr-2 h-5 w-5" /> Adicionar Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Editar Item do Inventário' : 'Adicionar Novo Item ao Inventário'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Modifique os detalhes do item abaixo.' : 'Preencha os detalhes do novo item abaixo.'}
              </DialogDescription>
            </DialogHeader>
            <InventoryItemForm item={editingItem} onSave={handleFormSave} onCancel={handleFormCancel} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-lg glassmorphism">
        <CardHeader>
          <CardTitle className="text-xl">Itens em Estoque</CardTitle>
          <CardDescription>Visualize e gerencie os itens do seu inventário.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Carregando itens...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <Card key={item.id} className={`bg-background/70 hover:shadow-md transition-shadow ${item.quantity < item.min_stock_level ? 'border-l-4 border-destructive' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{item.name} <span className="text-sm text-muted-foreground">({item.item_id})</span></CardTitle>
                      {item.quantity < item.min_stock_level && <AlertCircle className="h-5 w-5 text-destructive" title="Estoque baixo!" />}
                    </div>
                    <CardDescription className="text-xs">{item.category || 'Sem categoria'}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                        <p>Quantidade: <span className="font-medium text-foreground">{item.quantity}</span></p>
                        <p>Estoque Mínimo: {item.min_stock_level}</p>
                        <p>Localização: {item.location || 'N/A'}</p>
                     </div>
                     {item.description && <p className="text-xs mt-1">Descrição: {item.description}</p>}
                     <div className="mt-2 text-right space-x-1">
                       <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="hover:text-primary h-7 w-7">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id, item.name)} className="hover:text-destructive h-7 w-7">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {!loading && items.length === 0 && (
            <p className="text-muted-foreground text-center py-8">Nenhum item no inventário.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryPage;
  