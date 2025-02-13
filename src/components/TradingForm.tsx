import React, { useState } from 'react';
import { useOrderStore } from '../store/orderStore';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';

interface TradingFormProps {
  cryptoId: string;
  currentPrice: number;
}

function TradingForm({ cryptoId, currentPrice }: TradingFormProps) {
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [operation, setOperation] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [limitPrice, setLimitPrice] = useState('');

  const { addOrder } = useOrderStore();
  const user = useAuthStore((state) => state.user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Vous devez être connecté pour trader');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Montant invalide');
      return;
    }

    const price = orderType === 'market' ? currentPrice : parseFloat(limitPrice);
    if (orderType === 'limit' && (isNaN(price) || price <= 0)) {
      toast.error('Prix limite invalide');
      return;
    }

    const totalCost = amountNum * price;
    if (operation === 'buy' && totalCost > user.balance) {
      toast.error('Solde insuffisant');
      return;
    }

    if (operation === 'sell') {
      const currentAmount = user.portfolio[cryptoId] || 0;
      if (amountNum > currentAmount) {
        toast.error('Quantité insuffisante dans votre portefeuille');
        return;
      }
    }

    addOrder({
      type: orderType,
      operation,
      cryptoId,
      amount: amountNum,
      price,
    });

    setAmount('');
    setLimitPrice('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => setOperation('buy')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium ${
            operation === 'buy'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Acheter
        </button>
        <button
          type="button"
          onClick={() => setOperation('sell')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium ${
            operation === 'sell'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Vendre
        </button>
      </div>

      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => setOrderType('market')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium ${
            orderType === 'market'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Au marché
        </button>
        <button
          type="button"
          onClick={() => setOrderType('limit')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium ${
            orderType === 'limit'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Limite
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Quantité
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="0.00"
          step="any"
          required
        />
      </div>

      {orderType === 'limit' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Prix limite (€)
          </label>
          <input
            type="number"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="0.00"
            step="any"
            required
          />
        </div>
      )}

      <div className="text-sm text-gray-600">
        Total estimé:{' '}
        {amount && (
          <span className="font-medium">
            {(
              parseFloat(amount) *
              (orderType === 'market' ? currentPrice : parseFloat(limitPrice) || 0)
            ).toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR',
            })}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {operation === 'buy' ? 'Acheter' : 'Vendre'}
      </button>
    </form>
  );
}

export default TradingForm;