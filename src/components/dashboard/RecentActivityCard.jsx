
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { FileText, HardHat, CheckCircle2 } from 'lucide-react';

const RecentActivityCard = ({ activity, isLoading }) => {
  const renderActivityItem = (item) => {
    const date = new Date(item.created_at).toLocaleDateString();
    if (item.itemType === 'OS') {
      return `Nova OS "${item.work_order_id}" (${item.type}) criada em ${date}: ${item.description.substring(0,50)}...`;
    }
    if (item.itemType === 'Ativo') {
      return `Novo Ativo "${item.name}" (${item.asset_id}) cadastrado em ${date}.`;
    }
    return '';
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
      <Card className="shadow-lg glassmorphism">
        <CardHeader>
          <CardTitle className="text-xl">Atividade Recente</CardTitle>
          <CardDescription>Últimas atualizações no sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-6 bg-muted animate-pulse rounded-md"></div>)}
            </div>
          ) : activity.length > 0 ? (
            <ul className="space-y-3">
              {activity.map((item) => (
                <li key={item.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {item.itemType === 'OS' && (item.status === 'Concluída' ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <FileText className="h-5 w-5 text-primary" />) }
                    {item.itemType === 'Ativo' && <HardHat className="h-5 w-5 text-blue-500" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{renderActivityItem(item)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhuma atividade recente.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecentActivityCard;
  