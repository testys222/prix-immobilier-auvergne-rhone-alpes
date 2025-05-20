import { useState, useEffect } from 'react';
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Données fictives pour 10 années (2015-2024) et 12 villes d'Auvergne-Rhône-Alpes
const generateData = () => {
  const cities = [
    "Lyon", "Grenoble", "Saint-Étienne", "Clermont-Ferrand", 
    "Annecy", "Chambéry", "Valence", "Bourg-en-Bresse",
    "Aurillac", "Le Puy-en-Velay", "Moulins", "Privas"
  ];
  
  const years = Array.from({ length: 10 }, (_, i) => 2015 + i);
  
  // Prix de base différents pour chaque ville (€/m²)
  const basePrice = {
    "Lyon": 3500,
    "Grenoble": 2800,
    "Saint-Étienne": 1200,
    "Clermont-Ferrand": 1800,
    "Annecy": 4200,
    "Chambéry": 2600,
    "Valence": 2000,
    "Bourg-en-Bresse": 1900,
    "Aurillac": 1300,
    "Le Puy-en-Velay": 1400,
    "Moulins": 1100,
    "Privas": 1600
  };
  
  // Générer des variations annuelles différentes pour chaque ville
  const growthFactors = {
    "Lyon": 1.06, // Forte croissance
    "Grenoble": 1.04,
    "Saint-Étienne": 0.99, // Légère baisse
    "Clermont-Ferrand": 1.03,
    "Annecy": 1.08, // Très forte croissance
    "Chambéry": 1.05,
    "Valence": 1.02,
    "Bourg-en-Bresse": 1.01,
    "Aurillac": 0.98, // Baisse modérée
    "Le Puy-en-Velay": 1.00, // Stable
    "Moulins": 0.97, // Forte baisse
    "Privas": 1.01
  };
  
  // Générer les données année par année pour chaque ville
  const data = {};
  const yearlyData = [];
  
  years.forEach(year => {
    const yearData = { year };
    let totalPrice = 0;
    let cityCount = 0;
    
    cities.forEach(city => {
      if (!data[city]) {
        data[city] = [];
      }
      
      // Calculer le prix pour cette année
      let price;
      if (data[city].length === 0) {
        price = basePrice[city];
      } else {
        const lastYearPrice = data[city][data[city].length - 1].price;
        // Ajouter une variation aléatoire de ±2% à la tendance générale
        const randomFactor = 0.98 + Math.random() * 0.04;
        price = lastYearPrice * growthFactors[city] * randomFactor;
      }
      
      price = Math.round(price);
      data[city].push({ year, price });
      yearData[city] = price;
      
      totalPrice += price;
      cityCount++;
    });
    
    // Ajouter le prix moyen pour cette année
    yearData.moyenne = Math.round(totalPrice / cityCount);
    yearlyData.push(yearData);
  });
  
  // Calculer la variation totale sur 10 ans pour chaque ville
  const variations = cities.map(city => {
    const firstPrice = data[city][0].price;
    const lastPrice = data[city][data[city].length - 1].price;
    const variation = ((lastPrice - firstPrice) / firstPrice) * 100;
    return {
      city,
      variation: parseFloat(variation.toFixed(1)),
      firstPrice,
      lastPrice
    };
  });
  
  // Trier les variations pour identifier les plus fortes hausses et baisses
  const sortedVariations = [...variations].sort((a, b) => b.variation - a.variation);
  
  return { cityData: data, yearlyData, variations: sortedVariations };
};

export default function App() {
  const [data, setData] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showTopIncreases, setShowTopIncreases] = useState(true);
  
  useEffect(() => {
    const generatedData = generateData();
    setData(generatedData);
    // Par défaut, sélectionner la ville avec la plus forte hausse
    setSelectedCity(generatedData.variations[0].city);
  }, []);
  
  if (!data) return <div className="flex items-center justify-center h-screen">Chargement des données...</div>;
  
  // Sélectionner les 5 villes avec la plus forte hausse/baisse
  const topCities = showTopIncreases
    ? data.variations.slice(0, 5)
    : data.variations.slice(-5).reverse();
  
  // Préparer les données pour le graphique en barres
  const barData = topCities.map(item => ({
    city: item.city,
    variation: item.variation,
    fill: item.variation >= 0 ? '#4CAF50' : '#F44336'
  }));
  
  // Données pour le graphique de la ville sélectionnée
  const selectedCityData = selectedCity ? data.cityData[selectedCity] : [];
  
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">
        Évolution des prix immobiliers en Auvergne-Rhône-Alpes (2015-2024)
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Prix moyen au m² par année</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} €/m²`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="moyenne" 
                  stroke="#8884d8" 
                  name="Prix moyen" 
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {showTopIncreases ? 'Top 5 des plus fortes hausses' : 'Top 5 des plus fortes baisses'}
            </h2>
            <button 
              onClick={() => setShowTopIncreases(!showTopIncreases)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Voir {showTopIncreases ? 'les baisses' : 'les hausses'}
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="city" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="variation" name="Variation sur 10 ans" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Évolution détaillée par ville</h2>
          <select
            value={selectedCity || ''}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="p-2 border rounded"
          >
            {data.variations.map(item => (
              <option key={item.city} value={item.city}>
                {item.city} ({item.variation}%)
              </option>
            ))}
          </select>
        </div>
        {selectedCity && (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedCityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis domain={['dataMin - 100', 'dataMax + 100']} />
                <Tooltip formatter={(value) => `${value} €/m²`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#ff7300" 
                  name={`Prix à ${selectedCity}`} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Tableau récapitulatif</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left">Ville</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-right">Prix 2015 (€/m²)</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-right">Prix 2024 (€/m²)</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-right">Variation (%)</th>
              </tr>
            </thead>
            <tbody>
              {data.variations.map(item => (
                <tr key={item.city} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b border-gray-200">{item.city}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-right">{item.firstPrice}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-right">{item.lastPrice}</td>
                  <td className={`py-2 px-4 border-b border-gray-200 text-right font-semibold ${
                    item.variation >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.variation > 0 ? '+' : ''}{item.variation}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-600 text-sm">
        <p>Note: Les données présentées sont fictives et générées aléatoirement à des fins de démonstration.</p>
        <p>Dans un contexte réel, utilisez les données officielles de l'INSEE ou des notaires de France.</p>
      </div>
    </div>
  );
}