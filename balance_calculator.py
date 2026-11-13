# ==========================================
# TRANSACTION-BASED LEDGER SYSTEM
# ENGINE 2 - REUSABLE BALANCE CALCULATOR
# ==========================================

from .transaction_core import validate_transaction_history


# --------------------------------------------------
# FUNCTION 1: CALCULATE CURRENT RESOURCE STATUS
# --------------------------------------------------

def calculate_balance(transactions, domain_config, resource_id):

    # Check transaction history format

    if not isinstance(transactions, list):
        raise ValueError("Invalid transaction history.")

    # Check resource ID

    if resource_id is None:
        raise ValueError("Resource ID is required.")

    # Validate the complete transaction history
    # and calculate the final status

    is_valid, message, current_status, active_rental = (
        validate_transaction_history(
            transactions,
            domain_config,
            resource_id
        )
    )

    # Reject invalid transaction history

    if not is_valid:
        raise ValueError(message)

    # Return the calculated resource status

    return current_status