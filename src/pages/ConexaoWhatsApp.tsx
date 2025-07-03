import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ConexaoWhatsApp: React.FC = () => {
  const [status, setStatus] = useState('Desconhecido');
  const [qr, setQr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const lastQr = useRef<string | null>(null);

  useEffect(() => {
    fetchStatus();
    fetchQr();
    const interval = setInterval(() => {
      fetchStatus();
      fetchQr();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await axios.get('/api/whatsapp/status-web');
      setStatus(res.data.status);
    } catch {
      setStatus('Erro ao buscar status');
    }
    setLoading(false);
  };

  const fetchQr = async () => {
    try {
      const res = await axios.get('/api/whatsapp/qr-web');
      if (res.data.qr && res.data.qr !== lastQr.current) {
        setQr(res.data.qr);
        lastQr.current = res.data.qr;
      }
    } catch {
      setQr(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Conexão WhatsApp (whatsapp-web.js)</h1>
        <p className="text-muted-foreground">Conecte o sistema ao WhatsApp escaneando o QR Code abaixo.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Status da Conexão</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground">Carregando status...</div>
          ) : (
            <div className="text-center">
              <span className={status === 'conectado' ? 'text-green-600' : 'text-yellow-600'}>
                {status === 'conectado' ? 'WhatsApp conectado!' : 'Aguardando conexão...'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
      {status !== 'conectado' && qr && (
        <Card>
          <CardHeader>
            <CardTitle>Escaneie o QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=200x200`} alt="QR Code WhatsApp" />
            </div>
            <div className="text-center text-muted-foreground mt-2">Abra o WhatsApp no seu celular &gt; Menu &gt; Aparelhos conectados &gt; Conectar novo aparelho</div>
          </CardContent>
        </Card>
      )}
      {/* Estrutura para sessões futuras */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Sessões Conectadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">(Em breve: gerenciamento de múltiplos WhatsApp)</div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default ConexaoWhatsApp; 