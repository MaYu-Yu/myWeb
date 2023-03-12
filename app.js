const mysql = require('mysql');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const XLSX = require('xlsx');
const port = 3000;
const filter_tables = ['articles', 'users'];
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
        const db_name = req.body.db_name.toUpperCase();
        let sql = `SELECT * FROM information_schema.tables WHERE table_name = '${db_name}' LIMIT 1`;
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                // 資料表已經存在
                console.log(`Table '${db_name}' already exist.`);
                res.redirect('/add_database?error="exist"');
            } else {
                // 資料表不存在
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
                // 加上 ID
                sql = `CREATE TABLE ${db_name} (id INT AUTO_INCREMENT PRIMARY KEY, ${header})`;
                connection.query(sql, function (error, results, fields) {
                    if (error) throw error;
                    console.log(`Table ${db_name} created`);
                    const insert_sql = `INSERT INTO ${db_name} (${columns}) VALUES ${values.join(',')}`;
                    connection.query(insert_sql, function (error, results, fields) {
                        if (error) throw error;
                        console.log(`Data inserted into table ${db_name}`);
                        res.redirect('/database');
                    });
                });
            }
        });
    } catch (error) {
        console.error('上傳檔案錯誤: ' + error.stack);
        res.status(500).send('上傳檔案錯誤: ' + error.message);
    }
});




app.post('/add_article_to_db', upload.single('image'), function (req, res) {
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
            res.redirect('/article');
        }
    );
});

app.post('/edit_article_to_db', function (req, res) {
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

app.post('/edit_database_to_db', function (req, res) {
    const table_name = req.body.table_name;
    const headers = req.body.headers.slice(1, -1);
    const data = req.body.data; // 取得傳送的 row data
    console.log(table_name, headers, data);
    // 以 primary key 為條件更新該 row 的資料
    connection.query(`UPDATE ${table_name} SET ${headers.map((header, index) => `${header} = '${data[index + 1]}'`).join(', ')} WHERE id = '${data[0]}'`, (error, results) => {
        if (error) throw error;
        res.redirect(`/database/${table_name}`);
    });
});


//首頁路由
app.get('/', function (req, res) {
    Promise.all([
        new Promise((resolve, reject) => {
            connection.query('SELECT id, author, title, created_at FROM articles', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    const articles = results.map(result => {
                        return {
                            id: result.id,
                            author: result.author,
                            title: result.title,
                            created_at: result.created_at
                        };
                    });
                    resolve(articles);
                }
            });
        }),
        new Promise((resolve, reject) => {
            connection.query('SHOW TABLES', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    const tables = results.filter(result => {
                        return !filter_tables.includes(result['Tables_in_mydb']);
                    }).map(result => {
                        return result['Tables_in_mydb'];
                    });
                    resolve(tables);
                }
            });
        })
    ])
        .then(([articles, tables]) => {
            res.render('index.ejs', { articles: articles, tables: tables });
        })
        .catch(error => {
            throw error;
        });
});

//文章路由
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

app.get('/article/:id', function (req, res) {
    const articleId = req.params.id; // 從路由中提取文章的 ID

    connection.query('SELECT id, author, title, content, created_at FROM articles WHERE id = ?', [articleId], (error, results) => {
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

app.get('/database', function (req, res) {
    // 建立空陣列，用於存放資料表名稱、header和行
    const tables = [];

    // 使用SHOW TABLES語句獲取mydb中的所有資料表名稱
    connection.query('SHOW TABLES', function (error, results, fields) {
        if (error) throw error;
        
        // 過濾掉指定的資料表
        const filteredResults = results.filter(function (result) {
            return !filter_tables.includes(result['Tables_in_mydb']);
        });

        if (filteredResults.length === 0) {
            // 如果沒有資料表，就直接渲染空的tables陣列
            res.render('database.ejs', {
                tables: tables
            });
            return;
        }

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

app.get('/database/:table_name', function (req, res) {
    const table_name = req.params.table_name; // 从路由中提取表名

    // 使用DESCRIBE和SELECT语句查询指定的表
    connection.query(`DESCRIBE ${table_name}`, function (error, results, fields) {
        if (error) throw error;
        // 将header存放到数组中
        const headers = results.map(result => result.Field);

        connection.query(`SELECT * FROM ${table_name}`, function (error, results, fields) {
            if (error) throw error;
            // 将每个行存放到数组中
            const rows = results.map(result => Object.values(result));

            res.render('edit_database.ejs', {
                name: table_name,
                headers: headers,
                rows: rows
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
    if (req.query.error === 'exist') {
        // 顯示資料表已經存在的錯誤訊息
        res.render('add_database.ejs', { error: req.query.error });
    } else {
        res.render('add_database.ejs');
    }
});

// 監聽port
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
