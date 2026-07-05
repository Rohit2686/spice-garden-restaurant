/*
# Fix SECURITY DEFINER function execution permissions

Revoke EXECUTE permissions from anon and authenticated roles
for SECURITY DEFINER functions to prevent unauthorized execution.

1. is_admin_request() - Should not be directly callable via REST API
2. update_updated_at_column() - Trigger function, should only be executed by trigger
*/

-- Revoke execute permissions on is_admin_request from public roles
REVOKE EXECUTE ON FUNCTION is_admin_request() FROM anon, authenticated;

-- Revoke execute permissions on update_updated_at_column from public roles
REVOKE EXECUTE ON FUNCTION update_updated_at_column() FROM anon, authenticated;

-- Optionally, revoke from public (all roles)
REVOKE EXECUTE ON FUNCTION is_admin_request() FROM public;
REVOKE EXECUTE ON FUNCTION update_updated_at_column() FROM public;

-- Drop is_admin_request function as it's not being used
DROP FUNCTION IF EXISTS is_admin_request();
