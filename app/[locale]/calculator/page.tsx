import React from 'react';
import PublicShippingCalculator from '@/app/Components/PublicShippingCalculator';

export default function CalculatorPage() {
  return (
    <section
      id="calculator"
      className="w-full pt-14 mt-14 mb-16"
    >
      <PublicShippingCalculator />
    </section>
  );
}
