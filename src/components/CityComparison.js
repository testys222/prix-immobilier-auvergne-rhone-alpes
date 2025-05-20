import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CityComparison({ cityData, variations }) {
  const [city1, setCity1] = useState(variations[0].city);
  const [city2, setCity2] = useState(variations[1].city);
  
  // Fusion des données des deux villes pour le graphique
  const createComparisonData = () => {
    const city1Data = cityData[city1] || [];
    const city2Data = cityData[city2] || [];
    
    return city1Data.map((item, index) => ({
      year: item.year,
      [city1]: item.price,
      [city2]: city2Data[index] ? city2Data[index].price : 0
    }));
  };
  
  const comparisonData = createComparisonData();
  
  // Trouver les variations pour les villes sélectionnées
  const city1Variation = variations.find(v => v.city === city1);
  const city2Variation = variations.find(v => v.city === city2);
  
  // Calculer la différence de variation entre les deux villes
  const variationDiff = city1Variation && city2Variation
    ? (city1Variation.variation - city2Variation.variation).toFixed(1)
    : 0;
  
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-8">
      <h2 className="text-xl font-semibold mb-4">Comparaison directe entre deux villes</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Première ville</label>
          <select
            value={city1}
            onChange={(e) => setCity1(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {variations.map(item => (
              <option key={item.city} value={item.city}>
                {item.city} ({item.variation}%)
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deuxième ville</label>
          <select
            value={city2}
            onChange={(e) => setCity2(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {variations.map(item => (
              <option key={item.city} value={item.city}>
                {item.city} ({item.variation}%)
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(value) => `${value} €/m²`} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={city1} 
              stroke="#8884d8" 
              strokeWidth={2} 
              activeDot={{ r: 8 }}
            />
            <Line 
              type="monotone" 
              dataKey={city2} 
              stroke="#82ca9d" 
              strokeWidth={2} 
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {city1Variation && city2Variation && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded">
          <div className="text-center">
            <h3 className="font-semibold">{city1}</h3>
            <p className={`text-lg font-bold ${city1Variation.variation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {city1Variation.variation > 0 ? '+' : ''}{city1Variation.variation}%
            </p>
            <p className="text-sm text-gray-500">
              {city1Variation.firstPrice} → {city1Variation.lastPrice} €/m²
            </p>
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold">Différence</h3>
            <p className={`text-lg font-bold ${parseFloat(variationDiff) >= 0 ? 'text-blue-600' : 'text-purple-600'}`}>
              {parseFloat(variationDiff) > 0 ? '+' : ''}{variationDiff}%
            </p>
            <p className="text-sm text-gray-500">
              {city1} vs {city2}
            </p>
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold">{city2}</h3>
            <p className={`text-lg font-bold ${city2Variation.variation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {city2Variation.variation > 0 ? '+' : ''}{city2Variation.variation}%
            </p>
            <p className="text-sm text-gray-500">
              {city2Variation.firstPrice} → {city2Variation.lastPrice} €/m²
            </p>
          </div>
        </div>
      )}
    </div>
  );
}