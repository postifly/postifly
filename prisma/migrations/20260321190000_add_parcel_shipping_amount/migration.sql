-- shippingAmount was in schema but missing from migration history (drift fix)
ALTER TABLE "parcels" ADD COLUMN IF NOT EXISTS "shippingAmount" DOUBLE PRECISION;
