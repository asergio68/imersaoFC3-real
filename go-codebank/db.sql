CREATE TABLE credit_cards (
    id uuid NOT NULL,
    name VARCHAR NOT NULL,
    number VARCHAR NOT NULL,
    expiration_month VARCHAR NOT NULL,
    expiration_year VARCHAR,
	CVV VARCHAR NOT NULL,
	balance float not null,
	balance_limit float not null,
    PRIMARY KEY (id)
);

CREATE TABLE transactions (
    id uuid NOT NULL,
	credit_card_id uuid NOT NULL references credit_cards(id),
    amount float NOT NULL,
    status VARCHAR NOT NULL,
    description VARCHAR,
	store VARCHAR NOT NULL,
	created_at timestamp not null,
    PRIMARY KEY (id)
);

insert into credit_cards values (
    "010c1bff-70eb-4509-8539-304b3013d87c",
    "Sergio Ribeiro",
    "1234567890123456",
    "09", "2029", "123",
    0, 28000
)