const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const port = 3001;

// --- CONFIGURAÇÕES DO SERVIDOR ---
app.use(cors({ origin: '*' }));  // Permite qualquer origem (desenvolvimento)
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// --- BANCO DE DADOS (CORREÇÃO PARA AMBIENTE DE PRODUÇÃO) ---

// Lê as variáveis do Render (process.env.DB_HOST, etc.)
// O Render exige que a API use a porta que o processo está ouvindo.
const dbConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    
    // Adiciona a configuração de SSL, OBRIGATÓRIA para o Aiven
    ssl: {
        // 'rejectUnauthorized: false' é frequentemente necessário para ambientes de nuvem
        rejectUnauthorized: false 
    }
});

dbConnection.connect(err => {
    if (err) {
        // O log agora mostra exatamente o que falhou ao tentar conectar com as credenciais da nuvem
        console.error('Erro ao conectar ao MySQL:', err.message);
        return;
    }
    console.log('Conectado ao MySQL da AIVEN com o ID ' + dbConnection.threadId);
});

// --- CONFIGURAÇÃO DE UPLOAD (MULTER) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// --- FUNÇÃO AUXILIAR DE AUDITORIA ---
const registrarAuditoria = (evento, detalhes, usuarioEmail = 'Sistema') => {
    const sql = "INSERT INTO tb_auditoria (evento_tipo, detalhes, usuario_email, ip_origem) VALUES (?, ?, ?, ?)";
    dbConnection.query(sql, [evento, detalhes, usuarioEmail, '127.0.0.1'], (err) => {
        if (err) console.error("Erro ao salvar auditoria:", err);
    });
};

// ==================================================================
//                            ROTAS
// ==================================================================

// --------------------------- LOGIN ---------------------------
app.post('/api/login', (req, res) => {
    const { login, senha } = req.body;
    const sql = `SELECT id, nome_completo, perfil_id FROM usuarios WHERE (matricula = ? OR nome_completo = ?) AND senha = ? AND status = 'Ativo'`;

    dbConnection.query(sql, [login, login, senha], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            const user = results[0];
            registrarAuditoria('LOGIN', `Login realizado: ${user.nome_completo}`);
            res.json({ success: true, user: { id: user.id, nome: user.nome_completo, perfil: user.perfil_id } });
        } else {
            res.status(401).json({ success: false, message: "Credenciais inválidas" });
        }
    });
});

// --------------------------- DASHBOARD ---------------------------

// 1. KPIs / Stats 
app.get('/api/ocorrencias/stats', (req, res) => {
    const { regiao, dataInicio, dataFinal } = req.query;
    
    let sqlQuery = `SELECT status, COUNT(*) as count FROM tb_ocorrencias`;
    const whereClauses = [];
    const params = [];

    if (regiao) { whereClauses.push("regiao = ?"); params.push(regiao); }
    if (dataInicio) { whereClauses.push("data_hora >= ?"); params.push(`${dataInicio} 00:00:00`); }
    if (dataFinal) { whereClauses.push("data_hora <= ?"); params.push(`${dataFinal} 23:59:59`); }

    if (whereClauses.length > 0) sqlQuery += " WHERE " + whereClauses.join(" AND ");
    sqlQuery += " GROUP BY status";

    dbConnection.query(sqlQuery, params, (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
        
        const stats = { Aberto: 0, Pendente: 0, Andamento: 0, Concluído: 0, Cancelado: 0, Total: 0 };
        let somaTotal = 0;

        results.forEach(row => {
            if (stats.hasOwnProperty(row.status)) stats[row.status] = row.count;
            somaTotal += row.count;
        });
        
        stats.Total = somaTotal;
        res.json(stats);
    });
});

app.get('/api/dashboard/recentes', (req, res) => {
    // Adicionado 'icone_classe' para mostrar o ícone real (fogo, carro, etc)
    const sql = `
        SELECT id, tipo_ocorrencia, localizacao, status, data_hora, icone_classe 
        FROM tb_ocorrencias 
        ORDER BY data_hora DESC 
        LIMIT 3
    `;
    dbConnection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2. Ocorrências Recentes (Lista Lateral)
app.get('/api/dashboard/recentes', (req, res) => {
    const sql = `SELECT id, tipo_ocorrencia, localizacao, status, data_hora FROM tb_ocorrencias ORDER BY data_hora DESC LIMIT 3`;
    dbConnection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 3. Tipos de Ocorrência (Gráfico Donut)
app.get('/api/dashboard/tipos', (req, res) => {
    const sql = `SELECT tipo_ocorrencia, COUNT(*) as total FROM tb_ocorrencias GROUP BY tipo_ocorrencia`;
    dbConnection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// --------------------------- OCORRÊNCIAS (CRUD) ---------------------------

// Listar (Tabela Principal)
app.get('/api/ocorrencias', (req, res) => {
    const { status, regiao, dataInicio, dataFinal } = req.query;
    let sqlQuery = "SELECT id, tipo_ocorrencia, icone_classe, status, localizacao, data_hora FROM tb_ocorrencias";
    const whereClauses = [];
    const params = []; 

    if (status) { whereClauses.push("status = ?"); params.push(status); }
    if (regiao) { whereClauses.push("regiao = ?"); params.push(regiao); }
    if (dataInicio) { whereClauses.push("data_hora >= ?"); params.push(`${dataInicio} 00:00:00`); }
    if (dataFinal) { whereClauses.push("data_hora <= ?"); params.push(`${dataFinal} 23:59:59`); }

    if (whereClauses.length > 0) sqlQuery += " WHERE " + whereClauses.join(" AND ");
    sqlQuery += " ORDER BY data_hora DESC";

    dbConnection.query(sqlQuery, params, (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar ocorrências' });
        res.json(results);
    });
});

// Buscar Ocorrência Específica (GET Detalhes)
app.get('/api/ocorrencias/:id', (req, res) => {
    const { id } = req.params;
    const sqlOcorrencia = `SELECT * FROM tb_ocorrencias WHERE id = ?`;
    const sqlHistorico = `SELECT data_hora, detalhes FROM tb_auditoria WHERE ocorrencia_id_relacionada = ? ORDER BY data_hora DESC`;

    dbConnection.query(sqlOcorrencia, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Ocorrência não encontrada" });

        const ocorrencia = results[0];
        dbConnection.query(sqlHistorico, [id], (errHist, resultsHist) => {
            res.json({ ...ocorrencia, historico: resultsHist || [] });
        });
    });
});

// Atualizar Ocorrência (PUT Edição)
app.put('/api/ocorrencias/:id', (req, res) => {
    const { id } = req.params;
    const { tipo_ocorrencia, status, regiao, localizacao } = req.body;
    const sql = `UPDATE tb_ocorrencias SET tipo_ocorrencia = ?, status = ?, regiao = ?, localizacao = ? WHERE id = ?`;

    dbConnection.query(sql, [tipo_ocorrencia, status, regiao, localizacao, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        registrarAuditoria('EDIÇÃO_OCORRÊNCIA', `Ocorrência #${id} atualizada para status: ${status}`, 'Sistema');
        res.json({ message: "Ocorrência atualizada com sucesso!" });
    });
});

// Upload de Mídia (CORRIGIDO: 'tipo_midia')
app.post('/api/ocorrencias/:id/upload', upload.single('arquivo'), (req, res) => {
    const ocorrenciaId = req.params.id;
    const tipo = req.body.tipo; // Recebe do front
    if (!req.file) return res.status(400).send("Nenhum arquivo enviado.");
    
    // ATENÇÃO: Se estiver em produção, este URL deve usar a URL do Render (process.env.RENDER_EXTERNAL_URL) em vez de localhost
    const urlArquivo = `http://localhost:3001/uploads/${req.file.filename}`;
    
    // Correção aqui: coluna do banco é 'tipo_midia', não 'tipo'
    const sql = "INSERT INTO ocorrencia_midias (ocorrencia_id, tipo_midia, nome_arquivo, url_arquivo) VALUES (?, ?, ?, ?)";
    
    dbConnection.query(sql, [ocorrenciaId, tipo, req.file.originalname, urlArquivo], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Upload realizado!", novaMidia: { id: result.insertId, tipo, name: req.file.originalname, src: urlArquivo } });
    });
});

// Listar Mídias
app.get('/api/ocorrencias/:id/midias', (req, res) => {
    const sql = "SELECT id, tipo_midia as tipo, nome_arquivo as name, url_arquivo as src FROM ocorrencia_midias WHERE ocorrencia_id = ?";
    dbConnection.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Excluir Mídia
app.delete('/api/midias/:id', (req, res) => {
    const midiaId = req.params.id;
    dbConnection.query("SELECT url_arquivo FROM ocorrencia_midias WHERE id = ?", [midiaId], (err, results) => {
        if (results.length > 0) {
            const nomeArquivo = results[0].url_arquivo.split('/').pop();
            try { fs.unlinkSync(path.join(__dirname, 'uploads', nomeArquivo)); } catch(e) {}
        }
        dbConnection.query("DELETE FROM ocorrencia_midias WHERE id = ?", [midiaId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Mídia excluída." });
        });
    });
});

// --------------------------- USUÁRIOS (CRUD) ---------------------------
app.get('/api/usuarios', (req, res) => {
    const { perfil, unidade, status, posto, page } = req.query;
    const limit = 10;
    const pageNum = parseInt(page) || 1;
    const offset = (pageNum - 1) * limit;

    let sqlQuery = `
        SELECT u.id, u.nome_completo, u.matricula, u.posto_graduacao, u.status, u.perfil_id, u.unidade_id, p.nome_perfil, un.nome_unidade
        FROM usuarios u
        LEFT JOIN perfis p ON u.perfil_id = p.id
        LEFT JOIN unidades un ON u.unidade_id = un.id
    `;
    
    const whereClauses = [];
    const params = [];

    if (perfil) { whereClauses.push("u.perfil_id = ?"); params.push(perfil); }
    if (unidade) { whereClauses.push("u.unidade_id = ?"); params.push(unidade); }
    if (status) { whereClauses.push("u.status = ?"); params.push(status); }
    if (posto) { whereClauses.push("u.posto_graduacao = ?"); params.push(posto); }

    if (whereClauses.length > 0) sqlQuery += " WHERE " + whereClauses.join(" AND ");
    const countQuery = `SELECT COUNT(*) as total FROM usuarios u ${whereClauses.length > 0 ? " WHERE " + whereClauses.join(" AND ") : ""}`;

    dbConnection.query(countQuery, params, (err, countResult) => {
        if (err) return res.status(500).json({ error: err.message });
        const totalCount = countResult[0].total;
        const totalPages = Math.ceil(totalCount / limit);

        sqlQuery += " ORDER BY u.nome_completo ASC LIMIT ? OFFSET ?";
        dbConnection.query(sqlQuery, [...params, limit, offset], (err, dataResults) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ data: dataResults, pagination: { page: pageNum, totalPages, totalCount } });
        });
    });
});

app.post('/api/usuarios', (req, res) => {
    const { nome, matricula, posto, status, perfil_id, unidade_id } = req.body;
    const sql = "INSERT INTO usuarios (nome_completo, matricula, posto_graduacao, status, perfil_id, unidade_id, senha) VALUES (?, ?, ?, ?, ?, ?, '123456')";
    dbConnection.query(sql, [nome, matricula, posto, status, perfil_id, unidade_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        registrarAuditoria('CRIAR_USUARIO', `Usuário criado: ${nome} (${matricula})`);
        res.json({ message: "Usuário criado com sucesso!", id: result.insertId });
    });
});

app.put('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nome, matricula, posto, status, perfil_id, unidade_id } = req.body;
    const sql = "UPDATE usuarios SET nome_completo=?, matricula=?, posto_graduacao=?, status=?, perfil_id=?, unidade_id=? WHERE id=?";
    dbConnection.query(sql, [nome, matricula, posto, status, perfil_id, unidade_id, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        registrarAuditoria('EDITAR_USUARIO', `Usuário editado ID: ${id}`);
        res.json({ message: "Usuário atualizado com sucesso!" });
    });
});

app.delete('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
    dbConnection.query("DELETE FROM usuarios WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        registrarAuditoria('EXCLUIR_USUARIO', `Usuário excluído ID: ${id}`);
        res.json({ message: "Usuário excluído com sucesso!" });
    });
});

// --------------------------- AUXILIARES (SELECTS) ---------------------------
app.get('/api/perfis', (req, res) => {
    dbConnection.query("SELECT * FROM perfis", (err, results) => res.json(results));
});
app.get('/api/unidades', (req, res) => {
    dbConnection.query("SELECT * FROM unidades", (err, results) => res.json(results));
});

// --------------------------- AUDITORIA ---------------------------
app.get('/api/auditoria', (req, res) => {
    const limit = 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const { descricao, evento, dataInicio, dataFinal } = req.query;
    
    let whereClauses = []; let params = [];
    if (descricao) { whereClauses.push("detalhes LIKE ?"); params.push(`%${descricao}%`); }
    if (evento) { whereClauses.push("evento_tipo = ?"); params.push(evento); }
    if (dataInicio) { whereClauses.push("data_hora >= ?"); params.push(`${dataInicio} 00:00:00`); }
    if (dataFinal) { whereClauses.push("data_hora <= ?"); params.push(`${dataFinal} 23:59:59`); }

    const whereString = whereClauses.length > 0 ? " WHERE " + whereClauses.join(" AND ") : "";
    
    dbConnection.query(`SELECT COUNT(*) as totalCount FROM tb_auditoria${whereString}`, params, (err, countResult) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar contagem' });
        const totalCount = countResult[0].totalCount;
        const totalPages = Math.ceil(totalCount / limit);
        
        dbConnection.query(`SELECT * FROM tb_auditoria${whereString} ORDER BY data_hora DESC LIMIT ? OFFSET ?`, [...params, limit, offset], (err, dataResults) => {
            if (err) return res.status(500).json({ error: 'Erro ao buscar dados' });
            res.json({ data: dataResults, pagination: { page, totalPages, totalCount } });
        });
    });
});

// --------------------------- RELATÓRIOS ---------------------------
app.get('/api/reports/resumo-por-tipo', (req, res) => {
    const { status, regiao, tipo, dataInicio, dataFinal } = req.query;
    let sqlQuery = `SELECT tipo_ocorrencia, regiao, COUNT(*) as numero_ocorrencias, AVG(TIMESTAMPDIFF(MINUTE, data_hora, data_conclusao)) as tempo_medio_minutos FROM tb_ocorrencias`;
    const whereClauses = ["data_conclusao IS NOT NULL"];
    const params = [];

    if (status) { whereClauses.push("status = ?"); params.push(status); }
    if (regiao) { whereClauses.push("regiao = ?"); params.push(regiao); }
    if (tipo) { whereClauses.push("tipo_ocorrencia = ?"); params.push(tipo); }
    if (dataInicio) { whereClauses.push("data_hora >= ?"); params.push(`${dataInicio} 00:00:00`); }
    if (dataFinal) { whereClauses.push("data_hora <= ?"); params.push(`${dataFinal} 23:59:59`); }

    sqlQuery += " WHERE " + whereClauses.join(" AND ") + " GROUP BY tipo_ocorrencia, regiao";
    dbConnection.query(sqlQuery, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/reports/export', (req, res) => {
    const { formato, tipo, regiao, status, dataInicio, dataFinal } = req.query;
    let sqlQuery = `SELECT tipo_ocorrencia, regiao, status, data_hora, localizacao FROM tb_ocorrencias`;
    const whereClauses = []; const params = [];

    if (status) { whereClauses.push("status = ?"); params.push(status); }
    if (regiao) { whereClauses.push("regiao = ?"); params.push(regiao); }
    if (tipo) { whereClauses.push("tipo_ocorrencia = ?"); params.push(tipo); }
    if (dataInicio) { whereClauses.push("data_hora >= ?"); params.push(`${dataInicio} 00:00:00`); }
    if (dataFinal) { whereClauses.push("data_hora <= ?"); params.push(`${dataFinal} 23:59:59`); }

    if (whereClauses.length > 0) sqlQuery += " WHERE " + whereClauses.join(" AND ");

    dbConnection.query(sqlQuery, params, (err, results) => {
        if (err) return res.status(500).send("Erro ao buscar dados.");
        if (formato === 'csv') {
            const json2csvParser = new Parser({ fields: ['tipo_ocorrencia', 'regiao', 'status', 'data_hora', 'localizacao'] });
            res.header('Content-Type', 'text/csv'); res.attachment('relatorio.csv');
            return res.send(json2csvParser.parse(results));
        } else if (formato === 'pdf') {
            const doc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf'); res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');
            doc.pipe(res);
            doc.fontSize(20).text('Relatório Guardião 360', { align: 'center' }); doc.moveDown();
            results.forEach((item, index) => {
                doc.fontSize(12).text(`${index + 1}. ${item.tipo_ocorrencia} - ${item.status}`);
                doc.fontSize(10).text(`Local: ${item.localizacao} | Data: ${item.data_hora}`); doc.moveDown(0.5);
            });
            doc.end();
        }
    });
});

// ==================================================================
// INICIAR SERVIDOR
// ==================================================================
app.listen(port, () => {
    console.log(`API do Guardião rodando em http://localhost:${port}`);
});
