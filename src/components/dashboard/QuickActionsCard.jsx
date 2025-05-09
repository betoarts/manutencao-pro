
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const QuickActionsCard = ({ actions }) => {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
      <Card className="shadow-lg glassmorphism">
        <CardHeader>
          <CardTitle className="text-xl">Ações Rápidas</CardTitle>
          <CardDescription>Inicie tarefas comuns rapidamente.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Button key={index} variant="outline" className="flex flex-col h-auto py-4 items-center justify-center space-y-1 hover:bg-primary/10 group" onClick={action.action}>
              <action.icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-sm text-center">{action.label}</span>
            </Button>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuickActionsCard;
  