// import package/library yg dibutuhkan
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-Parser');
const mysql=require('mysql');

const app = express();

//menghubungkan koneksi database
const conn = mysql.createConnection(
	{
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'betaclass',
	}
);

//koneksi ke database
conn.connect((err) => {
	if (err) throw err;
	console.log('mysql terhubung...');
});

//set view file
app.set('views', path.join(__dirname, 'views'));

//set view engine
app.set('view engine', 'hbs');

//body body-Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));

//set public folder
app.use('/assets', express.static(__dirname + '/public'));

// routing

//home & menampilkan data dari database
app.get('/',(req, res) => {
	let sql = " select * from product";
	let query = conn.query(sql,(err, result) => {
		if (err) throw err;
		res.render('product_view', {
			result: result,
		});
	});
});

//mengirim data ke database
app.post('/save',(req, res) => {
	let data = {
		product_name: req.body.product_name,
		product_price: req.body.product_price,
	};
	let sql = "INSERT INTO product SET ?";
	let query = conn.query(sql, data, (err, result) => {
		if (err) throw err;
		res.redirect('/');
	});
});

// mengupdate data pada database
app.post('/UPDATE', (req, res) => {
	let sql = 
		'UPDATE product SET
			product_name="${req.body.product_name}",
			product_price="${req.body.product_price}"
			WHERE product_id=${req.body.id}';
	let query = conn.query(sql, (err, result) => {
		if (err) throw err;
		res.redirect('/');
	});
});

//menghapus data dari database
app.post('/delete', (req, res) => {
	let sql = 
		"DELETE FROM product WHERE product_id="+req.body.product_id+" ";
	let query = conn.query(sql, (err, result) => {
		if (err) throw err;
		res.redirect('/');
	});
});

//server listening port
app.listening(8000, () =>{
	console.log('server sedang berjalan di localhost:8000');
});