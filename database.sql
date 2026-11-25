
-- =====================================================
-- 1. DATABASE CREATION
-- =====================================================

CREATE DATABASE IF NOT EXISTS transaction_ledger_db;

USE transaction_ledger_db;


-- =====================================================
-- 2. VEHICLE TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS VEHICLE_TABLE (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    registration_number VARCHAR(20) NOT NULL UNIQUE,
    model VARCHAR(100) NOT NULL,
    rental_price DECIMAL(10,2) NOT NULL
);


-- =====================================================
-- 3. CUSTOMER TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS CUSTOMER_TABLE (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) NOT NULL
);


-- =====================================================
-- 4. LEDGER TRANSACTION TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS LEDGER_TRANSACTION_TABLE (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    customer_id INT NULL,
    transaction_type ENUM('RENTAL', 'RETURN') NOT NULL,
    transaction_date DATETIME NOT NULL,
    related_transaction_id INT NULL,
    description TEXT,

    CONSTRAINT fk_transaction_vehicle
        FOREIGN KEY (vehicle_id)
        REFERENCES VEHICLE_TABLE(vehicle_id),

    CONSTRAINT fk_transaction_customer
        FOREIGN KEY (customer_id)
        REFERENCES CUSTOMER_TABLE(customer_id),

    CONSTRAINT fk_related_transaction
        FOREIGN KEY (related_transaction_id)
        REFERENCES LEDGER_TRANSACTION_TABLE(transaction_id),

    CONSTRAINT unique_return_reference
        UNIQUE (related_transaction_id),

    CONSTRAINT chk_transaction_reference
        CHECK (
            (transaction_type = 'RENTAL'
                AND related_transaction_id IS NULL)
            OR
            (transaction_type = 'RETURN'
                AND related_transaction_id IS NOT NULL)
        )
);


-- =====================================================
-- 5. ENSURE TRANSACTION DATE STORES DATE AND TIME
-- =====================================================

ALTER TABLE LEDGER_TRANSACTION_TABLE
MODIFY transaction_date DATETIME NOT NULL;


-- =====================================================
-- 6. INSERT SAMPLE VEHICLE RECORDS
-- =====================================================

INSERT IGNORE INTO VEHICLE_TABLE
(registration_number, model, rental_price)
VALUES
('KA01AB1234', 'Maruti Swift', 1500.00),
('KA03CD5678', 'Hyundai i20', 1800.00),
('KA05EF9012', 'Tata Nexon', 2200.00),
('KA02GH3456', 'Honda City', 2500.00),
('KA04IJ7890', 'Toyota Innova', 3000.00);

-- =====================================================
-- DAY 3 - ADDITIONAL VEHICLE DATA
-- =====================================================

INSERT INTO VEHICLE_TABLE
(registration_number, model, rental_price)
VALUES
('KA06KL1234', 'Mahindra XUV300', 2300.00),
('KA07MN5678', 'Kia Seltos', 2500.00),
('KA08PQ9012', 'Hyundai Creta', 2800.00),
('KA09RS3456', 'Maruti Brezza', 2000.00),
('KA10TU7890', 'Toyota Urban Cruiser', 2700.00);

SELECT
    vehicle_id,
    registration_number,
    model,
    rental_price
FROM VEHICLE_TABLE
ORDER BY vehicle_id;

SELECT
    registration_number,
    COUNT(*) AS registration_count
FROM VEHICLE_TABLE
GROUP BY registration_number
HAVING COUNT(*) > 1;


-- =====================================================
-- 7. INSERT SAMPLE CUSTOMER RECORDS
-- =====================================================

INSERT INTO CUSTOMER_TABLE
(customer_name, phone_number)
SELECT 'Rahul Sharma', '9876543210'
WHERE NOT EXISTS (
    SELECT 1 FROM CUSTOMER_TABLE
    WHERE customer_name = 'Rahul Sharma'
    AND phone_number = '9876543210'
);

INSERT INTO CUSTOMER_TABLE
(customer_name, phone_number)
SELECT 'Priya Patel', '9876501234'
WHERE NOT EXISTS (
    SELECT 1 FROM CUSTOMER_TABLE
    WHERE customer_name = 'Priya Patel'
    AND phone_number = '9876501234'
);

INSERT INTO CUSTOMER_TABLE
(customer_name, phone_number)
SELECT 'Amit Kumar', '9845012345'
WHERE NOT EXISTS (
    SELECT 1 FROM CUSTOMER_TABLE
    WHERE customer_name = 'Amit Kumar'
    AND phone_number = '9845012345'
);

INSERT INTO CUSTOMER_TABLE
(customer_name, phone_number)
SELECT 'Sneha Rao', '9900123456'
WHERE NOT EXISTS (
    SELECT 1 FROM CUSTOMER_TABLE
    WHERE customer_name = 'Sneha Rao'
    AND phone_number = '9900123456'
);

INSERT INTO CUSTOMER_TABLE
(customer_name, phone_number)
SELECT 'Arjun Singh', '9988776655'
WHERE NOT EXISTS (
    SELECT 1 FROM CUSTOMER_TABLE
    WHERE customer_name = 'Arjun Singh'
    AND phone_number = '9988776655'
);


INSERT INTO CUSTOMER_TABLE
(customer_name, phone_number)
VALUES
('Kiran Desai', '9876123450'),
('Neha Kulkarni', '9845123670'),
('Rohan Mehta', '9900456781'),
('Ananya Rao', '9987654321'),
('Vikram Joshi', '9845987654');



SELECT *
FROM CUSTOMER_TABLE
ORDER BY customer_id;


-- =====================================================
-- 8. INSERT SAMPLE RENTAL TRANSACTION
-- =====================================================

-- Rahul Sharma rents Maruti Swift.
-- Avoid inserting the same sample rental again.

INSERT INTO LEDGER_TRANSACTION_TABLE
(
    vehicle_id,
    customer_id,
    transaction_type,
    transaction_date,
    related_transaction_id,
    description
)
SELECT
    v.vehicle_id,
    c.customer_id,
    'RENTAL',
    CURRENT_TIMESTAMP,
    NULL,
    'Vehicle rented to Rahul Sharma'

FROM VEHICLE_TABLE v

JOIN CUSTOMER_TABLE c
    ON c.customer_name = 'Rahul Sharma'
    AND c.phone_number = '9876543210'

WHERE v.registration_number = 'KA01AB1234'

AND NOT EXISTS (
    SELECT 1
    FROM LEDGER_TRANSACTION_TABLE r
    WHERE r.vehicle_id = v.vehicle_id
      AND r.customer_id = c.customer_id
      AND r.transaction_type = 'RENTAL'
);


-- =====================================================
-- 9. INSERT SAMPLE RETURN TRANSACTION
-- =====================================================

-- Rahul Sharma returns Maruti Swift.
-- The return references the original rental.
-- Avoid inserting the same sample return again.

INSERT INTO LEDGER_TRANSACTION_TABLE
(
    vehicle_id,
    customer_id,
    transaction_type,
    transaction_date,
    related_transaction_id,
    description
)
SELECT
    r.vehicle_id,
    r.customer_id,
    'RETURN',
    CURRENT_TIMESTAMP,
    r.transaction_id,
    'Vehicle returned by Rahul Sharma'

FROM LEDGER_TRANSACTION_TABLE r

JOIN VEHICLE_TABLE v
    ON v.vehicle_id = r.vehicle_id

JOIN CUSTOMER_TABLE c
    ON c.customer_id = r.customer_id

WHERE v.registration_number = 'KA01AB1234'
  AND c.customer_name = 'Rahul Sharma'
  AND c.phone_number = '9876543210'
  AND r.transaction_type = 'RENTAL'

  AND NOT EXISTS (
      SELECT 1
      FROM LEDGER_TRANSACTION_TABLE ret
      WHERE ret.related_transaction_id = r.transaction_id
        AND ret.transaction_type = 'RETURN'
  )

ORDER BY r.transaction_date, r.transaction_id
LIMIT 1;


-- =====================================================
-- 10. VERIFY VEHICLE RECORDS
-- =====================================================

SELECT * FROM VEHICLE_TABLE;


-- =====================================================
-- 11. VERIFY CUSTOMER RECORDS
-- =====================================================

SELECT * FROM CUSTOMER_TABLE;


-- =====================================================
-- 12. VERIFY LEDGER TRANSACTION HISTORY
-- =====================================================

SELECT *
FROM LEDGER_TRANSACTION_TABLE
ORDER BY transaction_date, transaction_id;


-- =====================================================
-- 13. DERIVE VEHICLE AVAILABILITY
-- =====================================================

SELECT
    v.vehicle_id,
    v.registration_number,
    v.model,

    CASE
        WHEN EXISTS (
            SELECT 1
            FROM LEDGER_TRANSACTION_TABLE r

            WHERE r.vehicle_id = v.vehicle_id
              AND r.transaction_type = 'RENTAL'

              AND NOT EXISTS (
                  SELECT 1
                  FROM LEDGER_TRANSACTION_TABLE ret

                  WHERE ret.related_transaction_id = r.transaction_id
                    AND ret.transaction_type = 'RETURN'
              )
        )
        THEN 'RENTED'

        ELSE 'AVAILABLE'

    END AS vehicle_status

FROM VEHICLE_TABLE v;


-- =====================================================
-- END OF DATABASE SETUP
-- =====================================================
