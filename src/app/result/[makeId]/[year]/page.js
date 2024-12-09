'use client';

import { Suspense, useState, useEffect } from 'react';

const ModelsList = ({ makeId, year }) => {
  const [models, setModels] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch(
          `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`
        );
        const data = await response.json();
        setModels(data.Results);
      } catch (err) {
        setError('Failed to fetch models.');
      }
    }

    fetchModels();
  }, [makeId, year]);

  if (error) {
    return <p>{error}</p>;
  }

  if (models.length === 0) {
    return <p>Loading models...</p>;
  }

  return (
    <ul>
      {models.map((model) => (
        <li key={model.Model_ID}>{model.Model_Name}</li>
      ))}
    </ul>
  );
};

export default function ResultPage({ params }) {
  const { makeId, year } = params;

  return (
    <div>
      <h1>Vehicle Models</h1>
      <h2>
        Make: {makeId}, Year: {year}
      </h2>
      <Suspense fallback={<p>Loading models...</p>}>
        <ModelsList makeId={makeId} year={year} />
      </Suspense>
    </div>
  );
}

export async function generateStaticParams() {
  const makeRes = await fetch(
    'https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json'
  );
  const makeData = await makeRes.json();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2014 }, (_, i) => 2015 + i);

  const params = [];

  makeData.Results.slice(0, 5).forEach((make) => {
    years.forEach((year) => {
      params.push({ makeId: make.Make_ID.toString(), year: year.toString() });
    });
  });

  return params;
}
