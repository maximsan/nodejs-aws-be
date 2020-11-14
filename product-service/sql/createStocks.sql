create table stocks
(
    product_id uuid primary key,
    count integer,
    foreign key (product_id) references products (id)
);

------------------------

-- insert into stocks (count, product_id) values
-- (5, 'product_id'),
-- (2, 'product_id'),
-- (3, 'product_id'),
-- (1, 'product_id'),
-- (2, 'product_id'),
-- (2, 'product_id')

