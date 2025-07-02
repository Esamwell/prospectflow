import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const API_STATUS = 'http://localhost:4000/api/whatsapp/status';
const API_QR = 'http://localhost:4000/api/whatsapp/qr';

const ConexaoWhatsApp = () => {
  const [status, setStatus] = useState('');
  const [qr, setQr] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  // Buscar status e QR periodicamente
  useEffect(() => {
    const fetchStatus = () => {
      fetch(API_STATUS)
        .then(res => res.json())
        .then(data => setStatus(data.status));
      fetch(API_QR)
        .then(res => res.json())
        .then(data => setQr(data.qr))
        .catch(() => setQr(''));
      setLoading(false);
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Conexão WhatsApp</h1>
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
              <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=250x250`} alt="QR Code WhatsApp" />
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