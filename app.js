const mysql = require('mysql');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const XLSX = require('xlsx');
const port = 3000;

// mySQL連線
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'mydb'
});
connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

// 設定views資料夾路徑
app.set('views', path.join(__dirname, 'views'));

// 設定使用的模板引擎
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);

const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 10000000 // 限制上傳檔案大小為 1 MB
    }
});

// 新增body-parser中介軟體
app.use(bodyParser.urlencoded({ extended: true }));

// 靜態檔案資料夾必須在其他中介軟體之前
app.use(express.static(path.join(__dirname, 'assets')));


// to_db路由
app.post('/add_database_to_db', upload.single('input'), function (req, res) {
    try {
        const file = req.file;
        if (!file) {
            throw new Error('No file uploaded');
        }
        const db_name = req.body.db_name;
        const workbook = XLSX.readFile(file.path);
        const sheet_name_list = workbook.SheetNames;
        const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        const header = Object.keys(xlData[0]).map(columnName => `${columnName} VARCHAR(255)`).join(',');
        const columns = Object.keys(xlData[0]).join(',');
        let values = [];
        for (const row of xlData) {
            let rowValues = [];
            for (const i in row) {
                rowValues.push(`'${row[i]}'`);
            }
            values.push(`(${rowValues.join(',')})`);
        }
        const sql = `CREATE TABLE ${db_name} (${header})`;
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            console.log(`Table ${db_name} created`);
            const insert_sql = `INSERT INTO ${db_name} (${columns}) VALUES ${values.join(',')}`;
            connection.query(insert_sql, function (error, results, fields) {
                if (error) throw error;
                console.log(`Data inserted into table ${db_name}`);
                res.redirect('/');
            });
        });
    } catch (error) {
        console.error('Error processing file upload: ' + error.stack);
        res.status(500).send('Error processing file upload: ' + error.message);
    }
});


app.post('/article_to_db', upload.single('image'), function (req, res) {
    const author = req.body.author;
    const title = req.body.title;
    const content = req.body.content;
    const created_at = new Date();
    console.log(author, title, content, created_at);

    // 執行資料庫查詢
    connection.query(
        'INSERT INTO articles SET ?',
        {
            author: author,
            title: title,
            content: content,
            created_at: created_at
        },
        (error, results) => {
            if (error) {
                console.error('Error inserting article: ' + error.stack);
                return res.status(500).send('Error inserting article.');
            }
            console.log('Article added to database.');
            res.redirect('/');
        }
    );
});

// 一般路由

app.get('/', function (req, res) {
    res.render('index.ejs');
});

app.get('/article', function (req, res) {
    connection.query('SELECT id, author, title, content, created_at FROM articles', (error, results) => {
        if (error) throw error;

        if (results.length === 0) {
            res.status(404).send('No articles found');
        } else {
            const articles = results.map(result => {
                return {
                    id: result.id,
                    author: result.author,
                    title: result.title,
                    content: result.content,
                    created_at: result.created_at
                }
            });
            res.render('article', { articles: articles });
        }
    });
});

app.get('/edit_article/:id', function (req, res) {
    const articleId = req.params.id; // 從路由中提取文章的 ID

    connection.query('SELECT id, author, title, content FROM articles WHERE id = ?', [articleId], (error, results) => {
        if (error) throw error;

        if (results.length === 0) {
            res.status(404).send('Article not found');
        } else {
            const article = {
                id: results[0].id,
                author: results[0].author,
                title: results[0].title,
                content: results[0].content
            };
            res.render('edit_article.ejs', { article: article });
        }
    });
});

app.post('/update_article', function (req, res) {
    const articleId = req.body.id;
    const author = req.body.author;
    const title = req.body.title;
    const content = req.body.content;
    const created_at = new Date();
    console.log(articleId, author, title, content, created_at);

    connection.query('UPDATE articles SET author = ?, title = ?, content = ?, created_at = ? WHERE id = ?', [author, title, content, created_at, articleId], (error, results) => {
        if (error) throw error;

        res.redirect('/article');
    });
});

app.get('/database', function (req, res) {
    // 建立空陣列，用於存放資料表名稱、header和行
    const tables = [];

    // 使用SHOW TABLES語句獲取mydb中的所有資料表名稱
    connection.query('SHOW TABLES', function (error, results, fields) {
        if (error) throw error;

        // 過濾掉指定的資料表
        const filteredResults = results.filter(function (result) {
            return result['Tables_in_mydb'] !== 'articles';
        });

        // 對於每個資料表，使用DESCRIBE語句獲取header
        filteredResults.forEach(function (result) {
            const table = result['Tables_in_mydb'];
            connection.query('DESCRIBE ' + table, function (error, results, fields) {
                if (error) throw error;

                // 將header存放到陣列中
                const headers = [];
                results.forEach(function (result) {
                    headers.push(result['Field']);
                });

                // 使用SELECT語句獲取每個資料表中的所有行
                connection.query('SELECT * FROM ' + table, function (error, results, fields) {
                    if (error) throw error;

                    // 將每個行存放到陣列中
                    const rows = [];
                    results.forEach(function (result) {
                        rows.push(result);
                    });

                    // 將資料表名稱、header和rows存放到tables陣列中
                    tables.push({
                        name: table,
                        headers: headers,
                        rows: rows
                    });

                    // 如果tables陣列中已經存放了所有資料表，就渲染database.ejs模板
                    if (tables.length === filteredResults.length) {
                        res.render('database.ejs', {
                            tables: tables
                        });
                    }
                });
            });
        });
    });
});

app.get('/login', function (req, res) {
    res.render('login.ejs');
});

app.get('/post_article', function (req, res) {
    res.render('post_article.ejs');
});

app.get('/add_database', function (req, res) {
    res.render('add_database.ejs');
});

// 監聽port
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
