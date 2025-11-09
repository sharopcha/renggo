# Payments System Implementation

This document describes the implementation of the payments, rentals, and payouts system for the Renggo fleet management platform.

## Database Schema

### Tables Created

1. **rentals** - Stores rental bookings
   - Links vehicles to customers
   - Tracks rental status (upcoming, active, completed, cancelled)
   - Stores pickup/return locations and pricing details
   - Calculates total price including deposit, insurance, and extras

2. **payments** - Stores all payment transactions
   - Supports multiple payment types: charge, refund, payout, fee
   - Tracks payment status: pending, succeeded, failed, cancelled
   - Records processor and platform fees
   - Links to rentals and customers
   - Stores payment method details and transaction IDs

3. **payouts** - Manages organization payouts
   - Scheduled and completed payouts to fleet owners
   - Tracks payout periods and amounts
   - Records bank account and transaction details

### Enums Created

- `rental_status`: upcoming, active, completed, cancelled
- `payment_type`: charge, refund, payout, fee
- `payment_status`: pending, succeeded, failed, cancelled
- `payment_method`: card, bank_transfer, cash, platform_fee, other

## Files Created/Modified

### Database Migrations

- `supabase/migrations/20250109000001_create_rentals_and_payments.sql`
  - Creates all tables, indexes, and foreign key relationships
  - Sets up proper permissions for authenticated users
  - Adds triggers for automatic timestamp updates

### Backend Logic

- `lib/supabase/payments.ts`
  - API functions for fetching payments, payouts, and summaries
  - Type definitions for Payment, Payout, Rental entities
  - Filtering and search functionality
  - Summary calculations (revenue, refunds, fees, VAT)

### Frontend Components

- `components/payments/payments-content.tsx`
  - Main payments dashboard UI
  - Three tabs: All Transactions, Payouts, Fees & Taxes
  - Real-time data from Supabase
  - Search and filter functionality
  - Summary cards showing key metrics

### Seed Data

- `supabase/seed.sql` - Updated with sample data
  - 10 sample rentals (completed, active, upcoming, cancelled)
  - 20+ payment transactions including charges, refunds, and fees
  - 2 payout records (completed and scheduled)
  - Realistic amounts and relationships

## Features Implemented

### Payments Dashboard

1. **Summary Cards**
   - Total Revenue - from successful charges
   - Total Refunds - refunded to customers
   - Total Payouts - paid to fleet owners
   - Failure Rate - percentage of failed transactions

2. **All Transactions Tab**
   - Searchable table of all payments
   - Filter by type (charge, refund, payout, fee)
   - Filter by status (succeeded, failed, pending)
   - Shows transaction ID, date, type, rental, customer, amount, method, and status
   - Links to related rental and customer data

3. **Payouts Tab**
   - Next scheduled payout with amount and date
   - Last completed payout information
   - Full payout history with status badges
   - Bank transfer details

4. **Fees & Taxes Tab**
   - Platform fees collected
   - Payment processor fees (2.9% + €0.30)
   - VAT collected (20% on services)
   - Summary calculations

### Relationships

- **Payments → Rentals** - Each payment can be linked to a rental
- **Payments → Customers** - Direct customer link for non-rental payments
- **Rentals → Vehicles** - Each rental is for a specific vehicle
- **Rentals → Customers** - Each rental is for a specific customer
- **All → Organizations** - Everything is scoped to an organization

## API Functions

### `fetchPayments(organizationId)`
Fetches all payments with related rental, vehicle, and customer data.

### `fetchPaymentSummary(organizationId)`
Calculates summary statistics:
- Total revenue, refunds, payouts, fees
- Platform and processor fees
- VAT collected
- Failure rate

### `fetchPayouts(organizationId)`
Gets all payout records for an organization.

### `fetchFilteredPayments(organizationId, filters)`
Filters payments by type, status, and search query.

### `fetchNextPayout(organizationId)`
Returns the next scheduled payout.

### `fetchLastPayout(organizationId)`
Returns the most recent completed payout.

## How to Use

### 1. Run Migrations

Apply the database migration to create the tables:

```bash
# If using Supabase local development
supabase db reset

# Or apply specific migration
supabase migration up
```

### 2. Seed the Database

The seed.sql file contains sample data for testing:
- Organizations, vehicles, customers
- Rentals with various statuses
- Payments with different types and statuses
- Payout records

### 3. Access the Payments Page

Navigate to `/backoffice/payments` to see the payments dashboard.

The page will:
- Load all payments for the current organization
- Calculate summary statistics
- Display transactions in a searchable, filterable table
- Show payout schedule and history
- Display fees and taxes breakdown

### 4. Integration with Other Pages

The payments system is closely integrated with:

- **Vehicles Page** - Each rental references a vehicle
- **Customers Page** - Each payment/rental references a customer
- **Rentals Page** - Payments are linked to rental bookings

## Future Enhancements

1. **Payment Processing Integration**
   - Integrate with Stripe for real payment processing
   - Handle webhooks for payment status updates
   - Automated refund processing

2. **Automated Payouts**
   - Schedule automatic payouts on a defined cadence
   - Calculate payout amounts based on completed rentals
   - Send payout notifications

3. **Reporting & Analytics**
   - Export transactions to CSV/PDF
   - Revenue charts and trends
   - Tax reporting
   - Reconciliation reports

4. **Advanced Filtering**
   - Date range filters
   - Amount range filters
   - Multi-select filters
   - Saved filter presets

5. **Dispute Management**
   - Link payments to disputes
   - Track dispute resolution
   - Handle chargebacks

## Security Considerations

- All queries are scoped to the authenticated user's organization
- Row-level security (RLS) should be added to tables
- Sensitive payment data (full card numbers, bank accounts) should be encrypted
- API keys and secrets must be stored securely in environment variables

## Testing

Sample test scenarios with the seed data:

1. **View all transactions** - Should show ~20+ payment records
2. **Filter by type** - Test charge, refund, payout, fee filters
3. **Filter by status** - Test succeeded, failed, pending filters
4. **Search** - Search by transaction ID, rental ID, payment method
5. **View payouts** - Check next scheduled and last completed payout
6. **View fees** - Verify platform fees, processor fees, and VAT calculations

## Notes

- Organization ID is currently hardcoded in the component (`1baaf78c-3719-45bc-9cf8-d3b3b3059006`)
- This should be replaced with the actual authenticated user's organization ID from the auth context
- TypeScript types need to be regenerated after running migrations
- Consider adding pagination for large transaction lists
