CREATE DATABASE IF NOT EXISTS  floristeriadb;
USE floristeriadb;

CREATE TABLE IF NOT EXISTS user(
	user_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    person_id VARCHAR(13) UNIQUE,
    birth_date DATE,
    user_name VARCHAR(45) NOT NULL,
    user_lastname VARCHAR(45) NOT NULL,
    phone_number VARCHAR(8),
	address VARCHAR(500),
	email VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(500),
	user_role ENUM('customer', 'employee', 'admin') NOT NULL,
	user_status ENUM('ACT', 'INA') NOT NULL,
	created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS recovery_pin(
	pin_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    pin CHAR(6) NOT NULL,
    created_at DATETIME NOT NULL,
    expiration_date DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE IF NOT EXISTS product(
	product_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    product_name VARCHAR(100) NOT NULL,
	product_img_url VARCHAR(2500) NOT NULL,
	product_description_title VARCHAR(255) NOT NULL,
	product_description VARCHAR(800) NOT NULL,
	price DECIMAL(8,2) NOT NULL,
	status ENUM('ACT', 'INA') NOT NULL,
	discount DECIMAL(4,2),
	discount_expiration_date DATETIME,
	created_at DATETIME NOT NULL,
	updated_at DATETIME NOT NULL,
    total_rating INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS product_rating(
	product_id INT NOT NULL,
    customer_id INT NOT NULL,
    rating INT NOT NULL DEFAULT 1,
    PRIMARY KEY(product_id, customer_id),
    CONSTRAINT rating_ck CHECK (rating IN(1,2,3,4,5)),
    FOREIGN KEY (customer_id) REFERENCES user(user_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

CREATE TABLE IF NOT EXISTS tag(
	tag_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    tag_name VARCHAR(255) NOT NULL,
    tag_description VARCHAR(1500),
	discount DECIMAL(4,2),
	discount_expiration_date DATETIME
);

CREATE TABLE IF NOT EXISTS product_tag(
	product_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (product_id, tag_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id),
    FOREIGN KEY (tag_id) REFERENCES tag(tag_id)
);

CREATE TABLE IF NOT EXISTS cart(
	cart_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    status ENUM('active', 'confirmed', 'canceled'),
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE IF NOT EXISTS cart_detail(
	cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(8,2) NOT NULL,
    PRIMARY KEY(cart_id, product_id),
	FOREIGN KEY (product_id) REFERENCES product(product_id),
	FOREIGN KEY (cart_id) REFERENCES cart(cart_id)
);

CREATE TABLE IF NOT EXISTS bill(
	bill_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    employee_id INT,
    delivery_date DATETIME NOT NULL,
    tax_amount DECIMAL(8,2) NOT NULL,
    destination_person_name VARCHAR(80) NOT NULL,
    destination_person_phone VARCHAR(8) NOT NULL,
	destination_address VARCHAR(500) NOT NULL,
	destination_address_details VARCHAR(500),
	city ENUM('TGU','SPS','DNL','LCE') NOT NULL,
	dedication_msg VARCHAR(1500),
	order_status ENUM('recieved','processing','shipping','completed','canceled') NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (employee_id) REFERENCES user(user_id)
);

CREATE TABLE IF NOT EXISTS bill_detail(
	bill_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(8,2) NOT NULL,
    PRIMARY KEY(bill_id, product_id),
    FOREIGN KEY (bill_id) REFERENCES bill(bill_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);
