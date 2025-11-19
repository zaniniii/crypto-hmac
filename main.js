const crypto = require('crypto');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/', (req, res) => {
    try {
        const { payload, secret } = req.body;
        
        // Validação de entrada
        if (!payload || !secret) {
            return res.status(400).json({ 
                error: 'Payload e secret são obrigatórios' 
            });
        }

        // Validação de tipo
        if (typeof payload !== 'string' || typeof secret !== 'string') {
            return res.status(400).json({ 
                error: 'Payload e secret devem ser strings' 
            });
        }

        const algorithm = 'sha1'; 
        
        // Criar HMAC
        const hmac = crypto.createHmac(algorithm, secret);
        hmac.update(payload);
        const digest = hmac.digest('hex');
        
        res.json({ digest });
    } catch (error) {
        console.error('Erro ao processar HMAC:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.listen(port, () => console.log(`Server is running on port ${port}`));