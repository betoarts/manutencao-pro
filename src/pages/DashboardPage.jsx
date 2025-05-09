import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Cog,
  FileText,
  HardHat,
  PackageSearch,
  AlertTriangle,
  Wrench,
  ListChecks,
} from 'lucide-react';

import { AssetForm } from '@/components/forms/AssetForm';
import { MaintenancePlanForm as MaintenancePlanFormImported } from '@/pages/MaintenancePlansPage';
import { WorkOrderForm as WorkOrderFormImported } from '@/pages/WorkOrdersPage';
import { InventoryItemForm as InventoryItemFormImported } from '@/pages/InventoryPage';

import { useDashboardData } from '@/hooks/useDashboardData';
import KpiCard from '@/components/dashboard/KpiCard';
import QuickActionsCard from '@/components/dashboard/QuickActionsCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';
import DonationCard from '@/components/dashboard/DonationCard';

const DashboardPage = () => {
  const { toast } = useToast();
  const { stats, recentActivity, assetsForForms, plansForForms, loading, refreshData } =
    useDashboardData();

  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);

  const quickActionsList = [
    { label: 'Nova OS', icon: FileText, action: () => setIsWorkOrderModalOpen(true) },
    { label: 'Novo Ativo', icon: HardHat, action: () => setIsAssetModalOpen(true) },
    { label: 'Novo Plano', icon: ListChecks, action: () => setIsPlanModalOpen(true) },
    {
      label: 'Novo Item Estoque',
      icon: PackageSearch,
      action: () => setIsInventoryModalOpen(true),
    },
  ];

  const kpiCardsList = [
    {
      title: 'Total de Ativos',
      value: stats.totalAssets,
      icon: Cog,
      color: 'text-blue-500',
      isLoading: loading.stats,
    },
    {
      title: 'OS Ativas',
      value: stats.activeWorkOrders,
      icon: Wrench,
      color: 'text-orange-500',
      isLoading: loading.stats,
    },
    {
      title: 'Manutenções Pendentes',
      value: stats.pendingMaintenance,
      icon: AlertTriangle,
      color: 'text-yellow-500',
      isLoading: loading.stats,
    },
    {
      title: 'Itens com Estoque Baixo',
      value: stats.lowStockItems,
      icon: PackageSearch,
      color: 'text-red-500',
      isLoading: loading.stats,
    },
  ];

  const handleModalSave = modalSetter => {
    modalSetter(false);
    refreshData();
    toast({ title: 'Sucesso!', description: 'Item criado/atualizado.' });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Principal</h1>
        <p className="text-muted-foreground">Visão geral do seu sistema de manutenção.</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCardsList.map((kpi, index) => (
          <KpiCard key={index} {...kpi} index={index} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <QuickActionsCard actions={quickActionsList} />
        <RecentActivityCard activity={recentActivity} isLoading={loading.activity} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <DonationCard />
      </div>

      <Dialog open={isAssetModalOpen} onOpenChange={setIsAssetModalOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Ativo</DialogTitle>
            <DialogDescription>Preencha os detalhes do novo ativo abaixo.</DialogDescription>
          </DialogHeader>
          <AssetForm
            asset={null}
            onSave={() => handleModalSave(setIsAssetModalOpen)}
            onCancel={() => setIsAssetModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Plano de Manutenção</DialogTitle>
            <DialogDescription>Preencha os detalhes do novo plano abaixo.</DialogDescription>
          </DialogHeader>
          <MaintenancePlanFormImported
            plan={null}
            assets={assetsForForms}
            onSave={() => handleModalSave(setIsPlanModalOpen)}
            onCancel={() => setIsPlanModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isWorkOrderModalOpen} onOpenChange={setIsWorkOrderModalOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Criar Nova Ordem de Serviço</DialogTitle>
            <DialogDescription>Preencha os detalhes da nova OS abaixo.</DialogDescription>
          </DialogHeader>
          <WorkOrderFormImported
            workOrder={null}
            assets={assetsForForms}
            maintenancePlans={plansForForms}
            onSave={() => handleModalSave(setIsWorkOrderModalOpen)}
            onCancel={() => setIsWorkOrderModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isInventoryModalOpen} onOpenChange={setIsInventoryModalOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Item ao Inventário</DialogTitle>
            <DialogDescription>Preencha os detalhes do novo item abaixo.</DialogDescription>
          </DialogHeader>
          <InventoryItemFormImported
            item={null}
            onSave={() => handleModalSave(setIsInventoryModalOpen)}
            onCancel={() => setIsInventoryModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardPage;
