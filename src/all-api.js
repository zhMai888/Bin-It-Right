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
        console.error('The database connection failed: ', err);
    } else {
        console.log('Successfully connected to the database');
    }
});

// 获取所有用户的 username 和 bestScore
app.get('/api/user/all', (req, res) => {
    const sql = 'SELECT id, username, bestScore FROM user ORDER BY bestScore DESC LIMIT 5';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('An error occurred querying the list of users:', err);
            return res.status(500).json({ message: 'Failed to get the user list' });
        }
        res.json(results);
    });
});

// 登录账户
app.post('/api/user/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'The username and password cannot be empty' });
    }

    const sql = 'SELECT id, username, bestScore FROM user WHERE username = ? AND password = ? LIMIT 1';
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error('查询出错:', err);
            return res.status(500).json({ message: 'The database query failed' });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Wrong username or password' });
        }

        const user = results[0];

        // ✅ 用反引号包裹 rank 避免语法错误
        const rankSql = 'SELECT COUNT(*) AS `rank` FROM user WHERE bestScore > ?';
        db.query(rankSql, [user.bestScore], (err2, rankResult) => {
            if (err2) {
                console.error('There was an error in the query ranking:', err2);
                return res.status(500).json({ message: 'Failed to get user rankings' });
            }

            const rank = rankResult[0].rank + 1;

            return res.json({
                message: 'Login successful',
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
        return res.status(400).json({ message: 'The username and password cannot be empty' });
    }

    // 先查有没有同名用户
    const checkSql = 'SELECT * FROM user WHERE username = ? LIMIT 1';
    db.query(checkSql, [username], (err, results) => {
        if (err) {
            console.error('查询出错:', err);
            return res.status(500).json({ message: 'The database query failed' });
        }

        if (results.length > 0) {
            // 用户名已存在
            return res.status(409).json({ message: 'The username already exists and cannot be registered' });
        }

        // ✅ 定义插入语句在这里
        const insertSql = 'INSERT INTO user (username, password, email, bestScore) VALUES (?, ?, ?, ?)';
        db.query(insertSql, [username, password, email, bestScore || 0], (err, result) => {
            if (err) {
                console.error('There was an insertion error:', err);
                return res.status(500).json({ message: 'Registration failed' });
            }

            return res.json({ message: 'Registration is successful', userId: result.insertId });
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
        if (result.length === 0) return res.status(404).json({ message: 'The trash was not found' });
        res.json(result[0]);
    });
});


// 更新user的bestScore
app.post('/api/updateBestScore', (req, res) => {
    const { userId, score } = req.body;

    if (!userId || score == null) {
        return res.status(400).json({ message: 'The necessary parameters are missing and the update fails' });
    }

    const sql = 'UPDATE user SET bestScore = ? WHERE id = ?';
    db.query(sql, [score, userId], (err, result) => {
        if (err) {
            console.error('The update failed:', err);
            return res.status(500).json({ message: 'The update failed' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'The user was not found' });
        }
        res.json({ message: 'The update was successful' });
    });
});


// 启动服务器
app.listen(port, () => {
    console.log(`数据库运行在 http://localhost:${port}`);
});
