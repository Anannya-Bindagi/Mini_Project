# ==========================================
# TRANSACTION-BASED LEDGER SYSTEM
# VEHICLE DOMAIN CONFIGURATION
# ==========================================


# ------------------------------------------
# VEHICLE DOMAIN SETTINGS
# ------------------------------------------

VEHICLE_CONFIG = {

    # Initial status of every new vehicle
    "initial_status": "AVAILABLE",


    # --------------------------------------
    # REQUIRED TRANSACTION FIELDS
    # --------------------------------------

    "required_fields": [
        "vehicle_id",
        "customer_id",
        "transaction_type",
        "transaction_date"
    ],


    # --------------------------------------
    # DATABASE FIELD MAPPING
    # --------------------------------------

    "resource_id_field": "vehicle_id",

    "customer_id_field": "customer_id",

    "transaction_id_field": "transaction_id",

    "transaction_type_field": "transaction_type",

    "date_field": "transaction_date",

    "reference_field": "related_transaction_id",


    # --------------------------------------
    # TRANSACTION TYPE DEFINITIONS
    # --------------------------------------

    "rental_type": "RENTAL",

    "return_type": "RETURN",


    # --------------------------------------
    # VEHICLE TRANSACTION RULES
    # --------------------------------------

    "transaction_rules": {

        "RENTAL": {
            "required_status": "AVAILABLE",
            "resulting_status": "RENTED"
        },

        "RETURN": {
            "required_status": "RENTED",
            "resulting_status": "AVAILABLE"
        }

    }

}