import mysql.connector
from config import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME


def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )

        return connection

    except mysql.connector.Error as error:
        print("Database connection failed:", error)
        return None
    
    # Test database connection
if __name__ == "__main__":
    connection = get_db_connection()

    if connection and connection.is_connected():
        print("Database connected successfully!")

        connection.close()
        print("Database connection closed.")

    else:
        print("Unable to connect to database.")