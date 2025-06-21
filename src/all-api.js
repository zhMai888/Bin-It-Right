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

// 获取所有用户的 username 和 bestScore
app.get('/api/user/all', (req, res) => {
    const sql = 'SELECT id, username, bestScore FROM user ORDER BY bestScore DESC LIMIT 5';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('查询用户列表出错:', err);
            return res.status(500).json({ message: '获取用户列表失败' });
        }
        res.json(results);
    });
});

// 登录账户
app.post('/api/user/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: '用户名和密码不能为空' });
    }

    const sql = 'SELECT id, username, bestScore FROM user WHERE username = ? AND password = ? LIMIT 1';
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error('查询出错:', err);
            return res.status(500).json({ message: '数据库查询失败' });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: '用户名或密码错误' });
        }

        const user = results[0];

        // ✅ 用反引号包裹 rank 避免语法错误
        const rankSql = 'SELECT COUNT(*) AS `rank` FROM user WHERE bestScore > ?';
        db.query(rankSql, [user.bestScore], (err2, rankResult) => {
            if (err2) {
                console.error('查询排名出错:', err2);
                return res.status(500).json({ message: '获取用户排名失败' });
            }

            const rank = rankResult[0].rank + 1;

            return res.json({
                message: '登录成功',
                user: {
                    id: user.id,
                    username: user.username,
                    bestScore: user.bestScore,
                    rank: rank
                }
            });
        });
    });
});



// 注册接口
app.post('/api/user/register', (req, res) => {
    const { username, password, email, bestScore } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: '用户名和密码不能为空' });
    }

    // 先查有没有同名用户
    const checkSql = 'SELECT * FROM user WHERE username = ? LIMIT 1';
    db.query(checkSql, [username], (err, results) => {
        if (err) {
            console.error('查询出错:', err);
            return res.status(500).json({ message: '数据库查询失败' });
        }

        if (results.length > 0) {
            // 用户名已存在
            return res.status(409).json({ message: '用户名已存在，无法注册' });
        }

        // ✅ 定义插入语句在这里
        const insertSql = 'INSERT INTO user (username, password, email, bestScore) VALUES (?, ?, ?, ?)';
        db.query(insertSql, [username, password, email, bestScore || 0], (err, result) => {
            if (err) {
                console.error('插入出错:', err);
                return res.status(500).json({ message: '注册失败' });
            }

            return res.json({ message: '注册成功', userId: result.insertId });
        });
    });
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

// 启动服务器
app.listen(port, () => {
    console.log(`数据库运行在 http://localhost:${port}`);
});
