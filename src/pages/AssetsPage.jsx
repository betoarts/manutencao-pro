
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Filter, Loader2, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";
import { AssetForm } from '@/components/forms/AssetForm';

const AssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast({ variant: "destructive", title: "Erro ao buscar ativos", description: error.message });
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSave = () => {
    setIsFormOpen(false);
    setEditingAsset(null);
    fetchAssets();
  };
  
  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingAsset(null);
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setIsFormOpen(true);
  };

  const handleDelete = async (assetId, assetName) => {
    if (window.confirm(`Tem certeza que deseja excluir o ativo "${assetName}"? Esta ação não pode ser desfeita.`)) {
      try {
        const { error } = await supabase.from('assets').delete().eq('id', assetId);
        if (error) throw error;
        toast({ title: "Ativo excluído com sucesso!", description: assetName });
        fetchAssets();
      } catch (error) {
        console.error('Error deleting asset:', error);
        toast({ variant: "destructive", title: "Erro ao excluir ativo", description: error.message });
      }
    }
  };


  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.asset_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (asset.location && asset.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (asset.type && asset.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Gerenciamento de Ativos</h2>
          <p className="text-muted-foreground">Cadastre, visualize e gerencie todos os seus equipamentos e instalações.</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if(!isOpen) setEditingAsset(null);}}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingAsset(null); setIsFormOpen(true); }} className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground shadow-md hover:shadow-lg transition-all">
              <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Novo Ativo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{editingAsset ? 'Editar Ativo' : 'Adicionar Novo Ativo'}</DialogTitle>
              <DialogDescription>
                {editingAsset ? 'Modifique os detalhes do ativo abaixo.' : 'Preencha os detalhes do novo ativo abaixo.'}
              </DialogDescription>
            </DialogHeader>
            <AssetForm asset={editingAsset} onSave={handleFormSave} onCancel={handleFormCancel} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-lg glassmorphism">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-xl">Lista de Ativos</CardTitle>
              <CardDescription>Visualize e filtre seus ativos cadastrados no Supabase.</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Buscar ativos..." 
                  className="pl-8 w-full" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filtrar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Carregando ativos...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID do Ativo</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Manutenção</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.length > 0 ? filteredAssets.map((asset) => (
                  <TableRow key={asset.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{asset.asset_id}</TableCell>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>{asset.type}</TableCell>
                    <TableCell>{asset.location}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                        asset.status === 'Operacional' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' :
                        asset.status === 'Em Manutenção' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400' :
                        asset.status === 'Aguardando Peça' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                      }`}>
                        {asset.status}
                      </span>
                    </TableCell>
                    <TableCell>{asset.last_maintenance ? new Date(asset.last_maintenance).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(asset)} className="hover:text-primary">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(asset.id, asset.name)} className="hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                      Nenhum ativo encontrado {searchTerm ? 'com os critérios de busca.' : 'cadastrado.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetsPage;
  