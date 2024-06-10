'use client'
import React, { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import "./App.css";


function App() {
  const [cryptoList, setCryptoList] = useState([]);
  const [filteredCryptoList, setFilteredCryptoList] = useState([]);
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [cryptoValue, setCryptoValue] = useState(0);
  const [availableMoney, setAvailableMoney] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchCryptoList();
  }, []);

  useEffect(() => {
    if (selectedCrypto) {
      fetchCryptoValue();
    }
  }, [selectedCrypto]);

  useEffect(() => {
    filterCryptoList();
  }, [searchText, cryptoList]);

  const fetchCryptoList = async () => {
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/list`);
      const data = await response.json();
      setCryptoList(data);
    } catch (error) {
      console.error("Error fetching crypto list:", error);
    }
  };

  const fetchCryptoValue = async () => {
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${selectedCrypto}&vs_currencies=usd`);
      const data = await response.json();
      setCryptoValue(data[selectedCrypto].usd);
    } catch (error) {
      console.error("Error fetching crypto value:", error);
    }
  };
  
  const filterCryptoList = () => {
    const filteredList = cryptoList.filter(crypto =>
      crypto.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredCryptoList(filteredList);
  };

  const handleSelectCrypto = (crypto) => {
    setSelectedCrypto(crypto.id);
    setSearchText(crypto.name);
    setShowDropdown(false);
  };

  const totalValue = (parseFloat(cryptoAmount) || 0) * (parseFloat(cryptoValue) || 0);
  const estimatedCurrentAmount = (parseFloat(availableMoney) || 0) / (parseFloat(cryptoValue) || 0);
  const totalEstimatedAmount = (parseFloat(cryptoAmount) || 0) + estimatedCurrentAmount;
  const totalEstimatedValue = totalEstimatedAmount * (parseFloat(estimatedValue) || 0);
  const totalCurrentValue = totalEstimatedAmount * (parseFloat(cryptoValue) || 0);
  const profit = totalEstimatedValue - totalCurrentValue;

  return (
    <div
      style={{
        backgroundImage: "url(/bgcrypto.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    > 
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-2xl bg-opacity-90">
        <h1 className="mb-4 text-2xl font-bold text-center">Crypto Calculator</h1>
        <div className="relative mb-4">
          <label className="block text-sm font-medium text-gray-700">Pesquisar Criptomoeda</label>
          <input
            type="text"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setShowDropdown(true);
            }}
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {showDropdown && filteredCryptoList.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60">
              {filteredCryptoList.map((crypto) => (
                <li
                  key={crypto.id}
                  onClick={() => handleSelectCrypto(crypto)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {crypto.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Número de Cryptos em posse</label>
          <input
            type="number"
            value={cryptoAmount}
            onChange={(e) => setCryptoAmount(e.target.value)}
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Valor Atual da Crypto</label>
          <input
            type="number"
            value={cryptoValue}
            readOnly
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Valor Disponível (Que pretende investir)</label>
          <input
            type="number"
            value={availableMoney}
            onChange={(e) => setAvailableMoney(e.target.value)}
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Valor Estimado (Que imagina que a crypto passará a custar)</label>
          <input
            type="number"
            value={estimatedValue}
            onChange={(e) => setEstimatedValue(e.target.value)}
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-bold">Resultados</h2>
          <p className="mt-2 font-bold" data-tooltip-id="current-posse-tooltip">Valor Total: {totalValue.toFixed(2)}</p>
          <Tooltip id="current-posse-tooltip" place="top" effect="solid">
            APENAS DAS MOEDAS QUE JÁ ESTÃO EM POSSE.
          </Tooltip>
          <p className="mt-2 font-bold" data-tooltip-id="current-amount-tooltip">Quantidade Estimada Atual: {estimatedCurrentAmount.toFixed(2)}</p>
          <Tooltip id="current-amount-tooltip" place="top" effect="solid">
            Número de moedas que serão adquiridas com o valor disponível que você pretende investir(SE HOUVER).
          </Tooltip>
          <p className="mt-2 font-bold" data-tooltip-id="current-quantity-tooltip">Quantidade Total Estimada: {totalEstimatedAmount.toFixed(2)}</p>
          <Tooltip id="current-quantity-tooltip" place="top" effect="solid">
            Número total de moedas (quantidade em posse + quantidade que será comprada).
          </Tooltip>
          <p className="mt-2 font-bold" data-tooltip-id="current-total-tooltip">Valor total estimado: {totalCurrentValue.toFixed(2)}</p>
          <Tooltip id="current-total-tooltip" place="top" effect="solid">
            Valor total das moedas em posse + o valor das moedas que serão compradas. (No momento da consulta.)
          </Tooltip>
          <p className="mt-2 font-bold">Valor Total Estimado(atual + lucro/prejuízo): {totalEstimatedValue.toFixed(2)}</p>
            <p className="mt-2 font-bold">Lucro/prejuízo: {profit.toFixed(2)}</p>
        </div>
      </div>
    </div>
    </div>
  );
}

export default App;