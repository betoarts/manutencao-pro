import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QRCodeSVG } from 'qrcode.react';
import { Heart } from 'lucide-react';

const DonationCard = () => {
  return (
    <Card className="shadow-lg glassmorphism">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Faça uma doação
        </CardTitle>
        <CardDescription>
          Ajude a manter este projeto! Escaneie o QR Code abaixo para fazer uma doação via PIX.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <QRCodeSVG
            value="humbertomoura.neto@gmail.com"
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Chave PIX: humbertomoura.neto@gmail.com
        </p>
      </CardContent>
    </Card>
  );
};

export default DonationCard;
