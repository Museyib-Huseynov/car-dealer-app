'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [makes, setMakes] = useState([]);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function getMakes() {
      const response = await fetch(
        'https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json'
      );
      const data = await response.json();
      setMakes(data.Results);
    }

    getMakes();
  }, []);

  const goToResultPage = () => {
    if (selectedMake && selectedYear) {
      router.push(`/result/${selectedMake}/${selectedYear}`);
    }
  };

  return (
    <div>
      <h1>Car Dealer App</h1>
      <div>
        <label>
          Vehicle Make:
          <select
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
          >
            <option value=''>Select</option>
            {makes.map((make) => (
              <option key={make.Make_ID} value={make.Make_ID}>
                {make.Make_Name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Model Year:
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value=''>Select</option>
            {Array.from(
              { length: new Date().getFullYear() - 2014 },
              (_, i) => 2015 + i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>

        <button
          disabled={!selectedMake || !selectedYear}
          onClick={goToResultPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}
