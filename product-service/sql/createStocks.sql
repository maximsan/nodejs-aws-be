create table stocks
(
    product_id uuid primary key,
    count integer,
    foreign key (product_id) references products (id)
);

------------------------

-- insert into stocks (count, product_id) values
-- (5, '90bcec32-400f-41f7-824e-06aecce29d51'),
-- (2, 'c77e2023-4e5b-43e5-94ae-3e736e8cae33'),
-- (3, '5570870e-2d2e-4d9e-a033-059e3d54a425'),
-- (1, '8f9e17bf-96c2-49e2-92d7-9a3e68224ef7'),
-- (2, '7e43c7bd-cf49-4998-a8a7-1d5414ffcbc0'),
-- (2, '7dff77e5-172c-4027-a708-2f1410de6955')

