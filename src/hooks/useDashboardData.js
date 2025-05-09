
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";

export const useDashboardData = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalAssets: 0,
    activeWorkOrders: 0,
    pendingMaintenance: 0,
    lowStockItems: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [assetsForForms, setAssetsForForms] = useState([]);
  const [plansForForms, setPlansForForms] = useState([]);
  const [loading, setLoading] = useState({
    stats: true,
    activity: true,
    formDependencies: true,
  });

  const fetchAllData = useCallback(async () => {
    setLoading(prev => ({ ...prev, stats: true, activity: true, formDependencies: true }));
    try {
      // Stats
      const { data: assetsData, error: assetsError } = await supabase.from('assets').select('id', { count: 'exact' });
      if (assetsError) throw assetsError;

      const { data: woData, error: woError } = await supabase.from('work_orders').select('id', { count: 'exact' }).in('status', ['Aberta', 'Em Execução', 'Pendente']);
      if (woError) throw woError;
      
      const today = new Date().toISOString().split('T')[0];
      const { data: plansData, error: plansError } = await supabase.from('maintenance_plans').select('id', { count: 'exact' }).or(`next_due_date.lte.${today},next_due_date.is.null`);
      if (plansError) throw plansError;

      const { data: inventoryData, error: inventoryError } = await supabase.rpc('count_low_stock_items');
      if (inventoryError) throw inventoryError;
      
      setStats({
        totalAssets: assetsData?.length || 0,
        activeWorkOrders: woData?.length || 0,
        pendingMaintenance: plansData?.length || 0,
        lowStockItems: inventoryData || 0,
      });
      setLoading(prev => ({ ...prev, stats: false }));

      // Recent Activity
      const { data: recentWo, error: recentWoError } = await supabase
        .from('work_orders')
        .select('id, work_order_id, description, created_at, status, type')
        .order('created_at', { ascending: false })
        .limit(3);
      if (recentWoError) throw recentWoError;

      const { data: recentAssets, error: recentAssetsError } = await supabase
        .from('assets')
        .select('id, asset_id, name, created_at')
        .order('created_at', { ascending: false })
        .limit(2);
      if (recentAssetsError) throw recentAssetsError;

      const formattedActivity = [
        ...recentWo.map(item => ({ ...item, itemType: 'OS' })),
        ...recentAssets.map(item => ({ ...item, itemType: 'Ativo' }))
      ].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0,5);
      setRecentActivity(formattedActivity);
      setLoading(prev => ({ ...prev, activity: false }));

      // Data for forms
      const { data: assetsList, error: assetsListError } = await supabase.from('assets').select('id, name, asset_id').order('name');
      if (assetsListError) throw assetsListError;
      setAssetsForForms(assetsList || []);

      const { data: plansList, error: plansListError } = await supabase.from('maintenance_plans').select('id, name').order('name');
      if (plansListError) throw plansListError;
      setPlansForForms(plansList || []);
      setLoading(prev => ({ ...prev, formDependencies: false }));

    } catch (error) {
      console.error("Error fetching dashboard data: ", error);
      toast({ variant: "destructive", title: "Erro ao carregar dados do dashboard", description: error.message });
      setLoading({ stats: false, activity: false, formDependencies: false });
    }
  }, [toast]);

  useEffect(() => {
    const ensureLowStockFunctionExists = async () => {
        const { error } = await supabase.rpc('create_low_stock_count_function');
        if (error && !error.message.includes('already exists')) {
            console.error('Error creating or ensuring low stock count function exists:', error);
        }
    };

    ensureLowStockFunctionExists().then(() => {
        fetchAllData();
    });
    
    const interval = setInterval(fetchAllData, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [fetchAllData]);

  return { stats, recentActivity, assetsForForms, plansForForms, loading, refreshData: fetchAllData };
};
  