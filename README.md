# ChatGPT 輸入表單
npm install pxpress mysql2 multer path fs body-parser ejs
ChatGPT: https://chat.openai.com/chat

content的CKeditor圖片上傳功能無法正常上傳，其餘功能都正常

後端代碼:
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const multer = require('multer'); // 引入multer模組
const fs = require('fs'); // 引入fs模組

const app = express();

// 設定模板引擎為 EJS
app.set('view engine', 'ejs');

// 建立一個 MySQL 連線
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'mydb'
});

// 設定解析表單資料的中介軟體
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 設定其他靜態資源的路徑
app.use(express.static(path.join(__dirname, 'views')));

// 設定圖片上傳的中介軟體
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, 'image')); // 指定圖片的存儲路徑
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname); // 獲取圖片的擴展名
    cb(null, Date.now() + ext); // 以日期和擴展名作為圖片的新檔名
  }
});

const upload = multer({ storage: storage });

// 處理表單提交，將文章內容和圖片存入資料庫
app.post('/to_db', upload.single('image'), (req, res) => {
  const { title, content } = req.body; // 使用解構賦值方式獲取表單欄位的值
  const created_at = new Date();

  // 如果有圖片上傳，將圖片的路徑存入資料庫
  let image_path = null;
  if (req.file) {
    image_path = `/image/${req.file.filename}`;
  }

  // 將文章內容和圖片路徑插入資料庫
  connection.query(
    'INSERT INTO articles SET ?',
    {
      title: title,
      content: content,
      image_path: image_path,
      created_at: created_at
    },
    (error, results) => {
      if (error) throw error;
      res.redirect('/');
    }
  );
});

// 顯示文章列表
app.get('/', (req, res) => {
  connection.query('SELECT * FROM articles ORDER BY created_at DESC', (error, results) => {
    if (error) throw error;
    res.render('post', { articles: results });
  });
});

// 顯示單篇文章
app.get('/article/:id', (req, res) => {
  const id = req.params.id;

  connection.query('SELECT * FROM articles WHERE id = ?', [id], (error, results) => {
    if (error) throw error;
    if (results.length === 0) {
      res.status(404).send('Article not found');
    } else {
      res.render('article', { article: results[0] });
    }
  });
});

// 啟動伺服器
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on localhost:${port}`);
});
前端代碼:
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <title>論壇發表網站</title>
  <!-- jQuery -->
  <script src="/js/jquery-3.3.1.slim.min.js"></script>

  <!-- CKEditor -->
  <script src="/js/ckeditor.js"></script>

  <!-- Bootstrap CSS -->
  <link href="/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>
  <h1>論壇發表網站</h1>
  <form action="/to_db" method="POST" enctype="multipart/form-data">
    <div>
      <label for="title">標題：</label>
      <input type="text" id="title" name="title" required>
    </div>
    <div>
      <label for="content">文章：</label>
      <textarea id="content" name="content"></textarea>
    </div>
    <div>
      <button type="submit">發表文章</button>
    </div>
  </form>

  <hr />
  <h2>文章列表</h2>
  <ul>
    <% articles.forEach(function(article) { %>
      <li>
        <a href="/article/<%= article.id %>">
          <%= article.title %>
        </a>
      </li>
      <% }); %>
  </ul>

  <script>
    ClassicEditor
      .create(document.querySelector('#content'), {
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'imageUpload', 'imageInsert', 'insertTable', 'tableInsert', 'undo', 'redo'],
        language: 'zh-hant',
        table: {
          contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
        },
        heading: {
          options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
          ]
        },
        placeholder: '輸入內容...'
      })
      .then(editor => {
        console.log(Array.from(editor.ui.componentFactory.names()));
      })
      .catch(error => {
        console.error(error);
      });
  </script>
  

</body>

</html>