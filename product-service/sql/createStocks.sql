create table stocks
(
    id uuid primary key,
    count integer,
    product_id uuid,
    foreign key (product_id) references products (id)
);

------------------------

-- insert into stocks (count, product_id) values
-- (5, 'fc51ad38-17fa-413b-9c89-f45c3db06dee'),
-- (2, 'ee8b7186-3548-42a6-b61e-c01642b3a2dc'),
-- (3, '780b4f76-af2e-4779-ac2f-c86c34ed0230'),
-- (1, '11e246b5-f48b-42be-9fce-73e7b90f59bc'),
-- (2, '18176759-e9f5-41d2-9d78-b62b52c9c47e')

