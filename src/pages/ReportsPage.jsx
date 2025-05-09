
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { BarChartBig, FileDown, CalendarClock } from 'lucide-react';

const ReportsPage = () => {
  const reportTypes = [
    { name: 'MTBF por Ativo', description: 'Tempo Médio Entre Falhas para cada equipamento.', icon: BarChartBig },
    { name: 'MTTR por Tipo de Falha', description: 'Tempo Médio Para Reparo, agrupado por categoria de falha.', icon: CalendarClock },
    { name: 'Custos de Manutenção', description: 'Custo total de manutenção por centro de custo ou ativo.', icon: BarChartBig },
    { name: 'Cumprimento de SLA', description: 'Percentual de planos de manutenção executados no prazo.', icon: CalendarClock },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Relatórios e Indicadores (KPIs)</h2>
        <p className="text-muted-foreground">Analise a performance da manutenção e tome decisões baseadas em dados.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report, index) => (
          <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 glassmorphism">
            <CardHeader>
              <div className="flex items-center gap-3">
                <report.icon className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-xl">{report.name}</CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <FileDown className="mr-2 h-4 w-4" /> Gerar Relatório
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 text-center">
        <img  alt="Gráficos de barras e pizza representando dados de relatórios" className="w-1/2 mx-auto opacity-70" src="https://images.unsplash.com/photo-1516383274235-5f42d6c6426d" />
      </div>
    </div>
  );
};

export default ReportsPage;
  