export const queries = {
  createProduct: `insert into products (title, description, price)
                    values ($1, $2, $3)
                    returning id`,
  getProducts: `select p.id, p.price, p.title, p.description, s.count
                  from products as p
                           join stocks as s on p.id = s.product_id`,
  getProductById: `select p.id, p.price, p.title, p.description, s.count
                     from products as p
                              join stocks as s on p.id = s.product_id
                     where p.id = $1`,
  createStockNote: `insert into stocks (count, product_id)
                      values ($1, $2)`,
};
