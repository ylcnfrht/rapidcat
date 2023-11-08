const rapidcat = require('../lib/rapidcat');
const { prevMiddleware, nextMiddleware } = require('./middlewares');

const app = rapidcat();

const products = [
  {
    id: 1,
    name: "product-1",
  },
  {
    id: 2,
    name: "product-2",
  },
];

app.get('/products/:id', (req, res, next) => {
  const productId = parseInt(req.params.id);
  const product = products.find((p) => p.id === productId);

  if (!product) return res.json({ error: 'Product not found' });

  return res.json(product);
});

app.get("/products", prevMiddleware, (req, res, next) => {
  return res.json(products);
}, nextMiddleware);

app.post('/products', (req, res, next) => {
  const newProduct = req.body;

  const maxId = Math.max(...products.map((p) => p.id));
  newProduct.id = maxId + 1;

  products.push(newProduct);

  return res.json(newProduct);
});

app.put('/products/:id', (req, res, next) => {
  const productId = parseInt(req.params.id);
  const updatedProduct = req.body;

  const index = products.findIndex((p) => p.id === productId);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products[index] = { ...products[index], ...updatedProduct };
  return res.json(products[index]);
});

app.delete('/products/:id', (req, res, next) => {
  const productId = parseInt(req.params.id);

  const index = products.findIndex((p) => p.id === productId);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products.splice(index, 1);
  return res.json({ message: 'Product deleted' });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
})
