# ==================================================
# TRANSACTION-BASED LEDGER SYSTEM
# ENGINE 2 - REUSABLE TRANSACTION PROCESSING ENGINE
# ==================================================

from datetime import datetime, date


# --------------------------------------------------
# FUNCTION 1: CONVERT DATE INTO DATETIME
# --------------------------------------------------

def convert_to_datetime(transaction_date):

    try:

        if isinstance(transaction_date, datetime):
            result = transaction_date

        elif isinstance(transaction_date, date):
            result = datetime.combine(transaction_date, datetime.min.time())

        else:
            result = datetime.fromisoformat(str(transaction_date))

        # MySQL DATETIME uses timezone-naive values.
        # Reject timezone-aware values to avoid incorrect comparisons.

        if result.tzinfo is not None:
            return None

        return result

    except (ValueError, TypeError, OverflowError):

        return None


# --------------------------------------------------
# FUNCTION 2: VALIDATE TRANSACTION DATE
# --------------------------------------------------

def validate_date(transaction_date):

    return convert_to_datetime(transaction_date) is not None


# --------------------------------------------------
# FUNCTION 3: VALIDATE COMPLETE TRANSACTION HISTORY
# --------------------------------------------------

def validate_transaction_history(transactions, domain_config, resource_id):

    if not isinstance(transactions, list):
        return False, "Invalid transaction history.", None, None

    # Read configuration

    resource_field = domain_config["resource_id_field"]
    customer_field = domain_config["customer_id_field"]
    transaction_id_field = domain_config["transaction_id_field"]
    transaction_type_field = domain_config["transaction_type_field"]
    date_field = domain_config["date_field"]
    reference_field = domain_config["reference_field"]

    rental_type = domain_config["rental_type"]
    return_type = domain_config["return_type"]

    transaction_rules = domain_config["transaction_rules"]

    current_status = domain_config["initial_status"]

    active_rental = None
    previous_date = None

    used_transaction_ids = set()

    # Process each transaction in chronological order

    for record in transactions:

        if not isinstance(record, dict):
            return False, "Invalid record in transaction history.", None, None

        # Check required history fields

        required_history_fields = [
            transaction_id_field,
            resource_field,
            customer_field,
            transaction_type_field,
            date_field,
            reference_field
        ]

        for field in required_history_fields:

            if field not in record:
                return False, "Transaction history contains missing fields.", None, None

            if record[field] is None and field != reference_field:
                return False, "Transaction history contains missing values.", None, None

        # Check resource ID

        if record[resource_field] != resource_id:
            return False, "Transaction history contains another resource's record.", None, None

        # Check transaction ID

        transaction_id = record[transaction_id_field]

        if transaction_id in used_transaction_ids:
            return False, "Duplicate transaction ID found in history.", None, None

        used_transaction_ids.add(transaction_id)

        # Validate transaction date

        transaction_date = convert_to_datetime(record[date_field])

        if transaction_date is None:
            return False, "Invalid date found in transaction history.", None, None

        # Check chronological order

        if previous_date is not None and transaction_date < previous_date:
            return False, "Transaction history is not in chronological order.", None, None

        previous_date = transaction_date

        # Validate transaction type

        transaction_type = record[transaction_type_field]

        if transaction_type not in transaction_rules:
            return False, "Invalid transaction type found in history.", None, None

        reference_id = record[reference_field]

        # Process rental

        if transaction_type == rental_type:

            if reference_id is not None:
                return False, "Rental transaction cannot contain a return reference.", None, None

            if current_status != transaction_rules[rental_type]["required_status"]:
                return False, "Invalid rental sequence in transaction history.", None, None

            current_status = transaction_rules[rental_type]["resulting_status"]

            active_rental = record

        # Process return

        elif transaction_type == return_type:

            if reference_id is None:
                return False, "Return transaction has no rental reference.", None, None

            if active_rental is None:
                return False, "Return does not have an active rental.", None, None

            # Check referenced rental ID

            if active_rental[transaction_id_field] != reference_id:
                return False, "Return does not refer to the active rental.", None, None

            # Check customer

            if active_rental[customer_field] != record[customer_field]:
                return False, "Return customer does not match the rental customer.", None, None

            # Check return date

            rental_date = convert_to_datetime(active_rental[date_field])

            if transaction_date < rental_date:
                return False, "Return date cannot be before rental date.", None, None

            if current_status != transaction_rules[return_type]["required_status"]:
                return False, "Invalid return sequence in transaction history.", None, None

            current_status = transaction_rules[return_type]["resulting_status"]

            active_rental = None

    return True, "Transaction history is valid.", current_status, active_rental


# --------------------------------------------------
# FUNCTION 4: VALIDATE NEW TRANSACTION
# --------------------------------------------------

def validate_transaction(
    transaction,
    current_status,
    domain_config,
    transaction_history=None,
    existing_transaction_ids=None,
    resource_exists=True,
    customer_exists=True
):

    if not isinstance(transaction, dict):
        return False, "Invalid transaction details."

    if transaction_history is None:
        transaction_history = []

    if existing_transaction_ids is None:
        existing_transaction_ids = []

    # Read configuration

    required_fields = domain_config["required_fields"]

    resource_field = domain_config["resource_id_field"]
    customer_field = domain_config["customer_id_field"]
    transaction_id_field = domain_config["transaction_id_field"]
    transaction_type_field = domain_config["transaction_type_field"]
    date_field = domain_config["date_field"]
    reference_field = domain_config["reference_field"]

    rental_type = domain_config["rental_type"]
    return_type = domain_config["return_type"]

    transaction_rules = domain_config["transaction_rules"]

    # 1. Check required fields

    for field in required_fields:

        if field not in transaction or transaction[field] is None:
            return False, "Required transaction details are missing."

        if isinstance(transaction[field], str) and not transaction[field].strip():
            return False, "Required transaction details are missing."

    # 2. Check resource existence

    if not resource_exists:
        return False, "Selected resource does not exist."

    # 3. Check customer existence

    if not customer_exists:
        return False, "Selected customer does not exist."

    # 4. Validate transaction date

    transaction_date = convert_to_datetime(transaction[date_field])

    if transaction_date is None:
        return False, "Invalid transaction date."

    # 5. Validate transaction type

    transaction_type = transaction[transaction_type_field]

    if transaction_type not in transaction_rules:
        return False, "Invalid transaction type."

    if transaction_type not in [rental_type, return_type]:
        return False, "Unsupported transaction type."

    # 6. Check duplicate transaction ID

    transaction_id = transaction.get(transaction_id_field)

    if transaction_id is not None:

        if transaction_id in existing_transaction_ids:
            return False, "Duplicate transaction ID."

    # 7. Validate the existing transaction history

    is_history_valid, history_message, calculated_status, active_rental = (
        validate_transaction_history(
            transaction_history,
            domain_config,
            transaction[resource_field]
        )
    )

    if not is_history_valid:
        return False, history_message

    # 8. Check whether supplied status matches history

    if current_status != calculated_status:
        return False, "Current status does not match transaction history."

    # 9. Check transaction date against previous transactions

    if transaction_history:

        last_date = convert_to_datetime(
            transaction_history[-1][date_field]
        )

        if transaction_date < last_date:
            return False, "New transaction date cannot be before the latest transaction."

    # 10. Check required status

    rules = transaction_rules[transaction_type]

    if calculated_status != rules["required_status"]:
        return False, "Transaction is not allowed for the current status."

    reference_id = transaction.get(reference_field)

    # 11. Validate return transaction

    if transaction_type == return_type:

        if reference_id is None:
            return False, "Return must refer to an original rental."

        if active_rental is None:
            return False, "There is no active rental to return."

        # Check rental reference

        if active_rental[transaction_id_field] != reference_id:
            return False, "Return must refer to the active rental."

        # Check customer

        if active_rental[customer_field] != transaction[customer_field]:
            return False, "Return customer does not match the rental customer."

        # Check vehicle/resource

        if active_rental[resource_field] != transaction[resource_field]:
            return False, "Return resource does not match the rental resource."

        # Check return date

        rental_date = convert_to_datetime(active_rental[date_field])

        if transaction_date < rental_date:
            return False, "Return date cannot be before rental date."

    # 12. Validate rental transaction

    elif transaction_type == rental_type:

        if reference_id is not None:
            return False, "Rental transaction cannot contain a return reference."

    return True, "Transaction is valid."


# --------------------------------------------------
# FUNCTION 5: PROCESS TRANSACTION
# --------------------------------------------------

def process_transaction(
    transaction,
    current_status,
    domain_config,
    transaction_history=None,
    existing_transaction_ids=None,
    resource_exists=True,
    customer_exists=True
):

    # Validate transaction

    is_valid, message = validate_transaction(
        transaction,
        current_status,
        domain_config,
        transaction_history,
        existing_transaction_ids,
        resource_exists,
        customer_exists
    )

    # Reject invalid transaction

    if not is_valid:

        return {
            "success": False,
            "message": message,
            "new_status": current_status
        }

    # Get transaction type

    transaction_type = transaction[domain_config["transaction_type_field"]]

    # Get corresponding transaction rule

    rules = domain_config["transaction_rules"][transaction_type]

    # Calculate new status

    new_status = rules["resulting_status"]

    # Return successful result

    return {
        "success": True,
        "message": "Transaction accepted.",
        "new_status": new_status
    }