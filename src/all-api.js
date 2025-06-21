const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

// 中间件
app.use(cors());
app.use(express.json());

// 创建数据库连接
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',     // 替换为你的 MySQL 用户名
    password: '123456', // 替换为你的 MySQL 密码
    database: 'bin'
});

// 测试数据库连接
db.connect((err) => {
    if (err) {
        console.error('数据库连接失败：', err);
    } else {
        console.log('成功连接到数据库');
    }
});

// 获取所有垃圾数据
app.get('/api/trash', (req, res) => {
    const sql = 'SELECT * FROM trash';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 根据 ID 获取单个垃圾信息
app.get('/api/trash/:id', (req, res) => {
    const sql = 'SELECT * FROM trash WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: '未找到该垃圾' });
        res.json(result[0]);
    });
});

// 添加垃圾
app.post('/api/trash', (req, res) => {
    const { img, typeid, name, description } = req.body;
    const sql = 'INSERT INTO trash (img, typeid, name, description) VALUES (?, ?, ?, ?)';
    db.query(sql, [img, typeid, name, description], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, message: '添加成功' });
    });
});

// 修改垃圾
app.put('/api/trash/:id', (req, res) => {
    const { img, typeid, name, description } = req.body;
    const sql = 'UPDATE trash SET img = ?, typeid = ?, name = ?, description = ? WHERE id = ?';
    db.query(sql, [img, typeid, name, description, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: '更新成功' });
    });
});

// 删除垃圾
app.delete('/api/trash/:id', (req, res) => {
    const sql = 'DELETE FROM trash WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: '删除成功' });
    });
});

// 启动服务器
app.listen(port, () => {
    console.log(`数据库运行在 http://localhost:${port}`);
});
