import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const KpiCard = ({ title, value, icon: Icon, color, isLoading, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="w-full"
    >
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 glassmorphism">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">{title}</CardTitle>
          {Icon && <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${color}`} />}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-6 sm:h-7 w-1/2 bg-muted animate-pulse rounded-md"></div>
          ) : (
            <div className="text-lg sm:text-2xl font-bold">{value}</div>
          )}
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            {/* Placeholder for comparison text or additional info */}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default KpiCard;
