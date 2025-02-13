import React, { useState } from 'react';

const Transfers: React.FC = () => {
    const [users, setUsers] = useState<string[]>(['Alice', 'Bob', 'Charlie']);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [message, setMessage] = useState<string>('');

    const handleTransfer = () => {
        if (selectedUser && amount > 0) {
            setMessage(`Transfert de ${amount} tokens à ${selectedUser} réussi.`);
        } else {
            setMessage('Veuillez sélectionner un utilisateur et entrer un montant valide.');
        }
    };

    return (
        <div>
            <h2>Virements</h2>
            <select onChange={(e) => setSelectedUser(e.target.value)}>
                <option value="">Sélectionner un utilisateur</option>
                {users.map(user => (
                    <option key={user} value={user}>{user}</option>
                ))}
            </select>
            <input
                type="number"
                placeholder="Montant"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
            <button onClick={handleTransfer}>Effectuer le virement</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Transfers;