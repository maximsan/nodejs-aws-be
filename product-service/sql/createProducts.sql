create table products
(
    id  uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    price integer
);

-- insert into products (title, description, price) values
-- ('Guitar 1', 'Guitar 1 description', 1500),
-- ('Guitar 2', 'Guitar 2 description', 1200),
-- ('Guitar 3', 'Guitar 3 description', 2100),
-- ('Guitar 4', 'Guitar 4 description', 700),
-- ('Guitar 5', 'Guitar 5 description', 9900),
-- ('Guitar 6', 'Guitar 6 description', 17100)
