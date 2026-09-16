-- Safe to run any number of times.
alter table products add column if not exists deposit_amount numeric;
