// Declarando as variaveis para conexão com o Banco de Dados
const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');

const app = express();
const porta = 8081;

require('dotenv').config()

//Definindo a configuração passando as variaveis de ambientes
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    options: {
        encrypt: false,
        enableArithAbort: true
    }
};

app.use(bodyParser.json());

//Montando a API para conexão e consulta no Banco
app.get('/api/data/:op', async (req, res) => {

    const  op  = req.params.op;
    console.log(op)

    try {
        await sql.connect(dbConfig);
        console.log('Conexão Estabelecida!');
        
        const resultado = await sql.query(`
            SELECT F2_CHVNFE,B1_COD,B1_DESC,D2_PEDIDO,P12_POPID,P12_NUMOP,P12_IDICLI, F2_DOC, D2_ITEM
            FROM SF2010
            LEFT JOIN SD2010 ON
            F2_FILIAL = D2_FILIAL
            AND
            F2_DOC = D2_DOC
            AND
            F2_CLIENTE = D2_CLIENTE
            AND
            F2_LOJA = D2_LOJA
            LEFT JOIN SB1010 ON
            B1_COD = D2_COD
            LEFT JOIN P12010 ON
            D2_PEDIDO = P12_NUMPV
            WHERE
            SF2010.D_E_L_E_T_ =''
            AND
            SD2010.D_E_L_E_T_ =''
            AND
            SB1010.D_E_L_E_T_ =''
            AND
            P12010.D_E_L_E_T_ =''
            AND
            F2_CLIENTE = '004040'
            AND
            P12_NUMOP = '${op}'
        `);
        
        res.json(resultado.recordset);

        if(res){
            console.log("Conexão Estabelecida!");
        }

    } catch (err) {
        console.error('Erro ao conectar ao Banco de Dados:', err);
        res.status(500).send('Erro ao conectar ao Banco de Dados.');
    }
});

app.get('/api/nota/:codigo', async (req, res) => {

    const  codigo  = req.params.codigo;
    console.log(codigo);

    try {
        await sql.connect(dbConfig);
        console.log('Conexão Estabelecida!');
        
        const resultado2 = await sql.query(`
            SELECT F2_CHVNFE,B1_COD,B1_DESC,D2_PEDIDO,P12_POPID,P12_NUMOP,P12_IDICLI, F2_DOC, D2_ITEM
            FROM SF2010
            LEFT JOIN SD2010 ON
            F2_FILIAL = D2_FILIAL
            AND
            F2_DOC = D2_DOC
            AND
            F2_CLIENTE = D2_CLIENTE
            AND
            F2_LOJA = D2_LOJA
            LEFT JOIN SB1010 ON
            B1_COD = D2_COD
            LEFT JOIN P12010 ON
            D2_PEDIDO = P12_NUMPV
            WHERE
            SF2010.D_E_L_E_T_ =''
            AND
            SD2010.D_E_L_E_T_ =''
            AND
            SB1010.D_E_L_E_T_ =''
            AND
            P12010.D_E_L_E_T_ =''
            AND
            F2_CLIENTE = '004040'
            AND
            P12_NUMOP <> ''
            AND
            F2_CHVNFE = '${codigo}'
        `);
        
        res.json(resultado2.recordset);

        if(res){
            console.log("Conexão Estabelecida!");
        }

    } catch (err) {
        console.error('Erro ao conectar ao Banco de Dados:', err);
        res.status(500).send('Erro ao conectar ao Banco de Dados.');
    }
});

app.post('/api/envia-dados', async (req, res) => {
    const {
        ordemProducao, nota, itemNota,
        PopId, cu, desc,
    } = req.body;

    console.log('linha 132', ordemProducao)

    console.log('linha 134', nota)

    console.log('linha 136', itemNota)

    console.log('linha 136', PopId)

    console.log('linha 136', cu)

    console.log('linha 136', desc)

    try{
        await sql.connect(dbConfig);
        const resultInsercao = await sql.query(`
            
            INSERT INTO SZH010 (R_E_C_N_O_,ZH_FILIAL,ZH_DATA,ZH_HORA,ZH_QUANT, ZH_OP, ZH_NOTA, ZH_ITEM, ZH_POPID, ZH_IDICLI, ZH_COD)
			VALUES ((SELECT MAX(R_E_C_N_O_)+1 FROM SZH010),'01',
            CONVERT(varchar(8), GETDATE(), 112), 
            SUBSTRING(CONVERT(varchar(8), GETDATE(), 108),1,2) + 
            SUBSTRING(CONVERT(varchar(8), GETDATE(), 108),4,2) +
            SUBSTRING(CONVERT(varchar(8), GETDATE(), 108),7,2),
            1, '${ordemProducao}01001', '${nota}', '${itemNota}', '${PopId}', '${cu}', '${desc}')
            
        `);
        res.status(200).json({ message: 'OP, nota e Data inserida com sucesso!' });
    } catch (err){
        console.error('Erro ao inserir a OP, nota e data no banco de dados:', err);
        res.status(500).json({ error: 'Erro ao inserir a OP, nota e data no banco de dados.' });
    }
})

app.get('/api/verifica-nota/:nota', async (req, res) => {

    const nota = req.params.nota;
    console.log('linha 170', nota)

    try{
        await sql.connect(dbConfig);
        const result = await sql.query(`
            SELECT ZH_NOTA
			FROM SZH010
			WHERE
			D_E_L_E_T_ = ''
			AND
			ZH_NOTA ='${nota}'
        `)

        if (result.recordset.length > 0) {
            res.json({ 
                existe: true, 
                descricao: result.recordset[0].ZH_NOTA, 
            });
        }

    } catch (err){
        console.error('Erro ao verificar a nota:', err);
        res.status(500).json({ error: 'Erro ao verificar a nota.' });
    }
})

/*Criando uma outra API para receber o valor da variaveis op, codigo, popid e popidexterno
e verificando se o código digitado pelo usuario é correto*/
app.post('/api/verifica-codigo', async (req, res) => {
    const { op } = req.body;
    const {codigo} = req.body;
    const {popidRes} = req.body;
    const {popidexterno} = req.body;

    try {
        await sql.connect(dbConfig);
        const resultado = await sql.query`
            
            SELECT F2_CHVNFE
            FROM SF2010
            WHERE F2_CHVNFE = ${codigo}
        `;
            
        const resultadoOP = await sql.query(`
            
            SELECT F2_CHVNFE,B1_COD,B1_DESC,D2_PEDIDO,P12_POPID,P12_NUMOP,P12_IDICLI
            FROM SF2010
            LEFT JOIN SD2010 ON
            F2_FILIAL = D2_FILIAL
            AND
            F2_DOC = D2_DOC
            AND
            F2_CLIENTE = D2_CLIENTE
            AND
            F2_LOJA = D2_LOJA
            LEFT JOIN SB1010 ON
            B1_COD = D2_COD
            LEFT JOIN P12010 ON
            D2_PEDIDO = P12_NUMPV
            WHERE
            SF2010.D_E_L_E_T_ =''
            AND
            SD2010.D_E_L_E_T_ =''
            AND
            SB1010.D_E_L_E_T_ =''
            AND
            P12010.D_E_L_E_T_ =''
            AND
            F2_CLIENTE = '004040'
            AND
            P12_NUMOP = '${op}'
        `);

        const resultadoPOPID = await sql.query(`
            
            SELECT C2_XPOPID 
            FROM SC2010 
            WHERE C2_XPOPID = '${popidRes}' 
            
        `);

        const resultadoPOPIDEXTERNO = await sql.query(`
            
            SELECT C2_XPOPID
            FROM SC2010
            WHERE C2_XPOPID = '${popidexterno}'
            
        `);
        
        if (resultado.recordset.length > 0) {
            res.json({ 
                existe: true, 
                descricao: resultado.recordset[0].F2_CHVNFE, 
            });
        } else if(resultadoOP.recordset.length > 0){
            res.json({
                existe: true,
                op: resultadoOP.recordset[0].B1_DESC,//Aqui é o que vai retornar 
                quantidade: resultadoOP.recordset[0].C2_QUJE
            });
        } else if(resultadoPOPID.recordset.length > 0 || resultadoPOPIDEXTERNO.recordset.length > 0){
            res.json({
                existe: true,
                popid: resultadoPOPID.recordset[0].C2_XPOPID
            });
        } else {
            res.json({ existe: false });
        }
    } catch (err) {
        console.error('Erro ao verificar o código no Banco de Dados:', err);
        res.status(500).send('Erro ao verificar o código.');
    }
});

//Mostrando em que porta o servidor está rodando
app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});
