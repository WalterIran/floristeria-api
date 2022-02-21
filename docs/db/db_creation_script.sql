CREATE DATABASE IF NOT EXISTS  FloristeriaDB;
USE FloristeriaDB;

CREATE TABLE IF NOT EXISTS User(
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

CREATE TABLE IF NOT EXISTS Recovery_pin(
	pin_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    pin CHAR(6) NOT NULL,
    created_at DATETIME NOT NULL,
    expiration_date DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE IF NOT EXISTS Product(
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

CREATE TABLE IF NOT EXISTS Product_rating(
	product_id INT NOT NULL,
    customer_id INT NOT NULL,
    rating INT NOT NULL DEFAULT 1,
    PRIMARY KEY(product_id, customer_id),
    CONSTRAINT rating_ck CHECK (rating IN(1,2,3,4,5)),
    FOREIGN KEY (customer_id) REFERENCES User(user_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

CREATE TABLE IF NOT EXISTS Tag(
	tag_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    tag_name VARCHAR(255) NOT NULL,
    tag_description VARCHAR(1500),
	discount DECIMAL(4,2),
	discount_expiration_date DATETIME
);

CREATE TABLE IF NOT EXISTS Product_tag(
	product_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (product_id, tag_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id),
    FOREIGN KEY (tag_id) REFERENCES Tag(tag_id)
);

CREATE TABLE IF NOT EXISTS Cart(
	cart_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    status ENUM('active', 'confirmed', 'canceled'),
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE IF NOT EXISTS Cart_detail(
	cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(8,2) NOT NULL,
    PRIMARY KEY(cart_id, product_id),
	FOREIGN KEY (product_id) REFERENCES Product(product_id),
	FOREIGN KEY (cart_id) REFERENCES Cart(cart_id)
);

CREATE TABLE IF NOT EXISTS Bill(
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
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (employee_id) REFERENCES User(user_id)
);

CREATE TABLE IF NOT EXISTS Bill_detail(
	bill_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(8,2) NOT NULL,
    PRIMARY KEY(bill_id, product_id),
    FOREIGN KEY (bill_id) REFERENCES Bill(bill_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
);
