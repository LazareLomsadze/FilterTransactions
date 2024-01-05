import React, { useState } from 'react';
import axios from 'axios';

const EthereumTransactions = () => {
    const [ethereumAddress1, setEthereumAddress1] = useState('');
  const [ethereumAddress2, setEthereumAddress2] = useState('');
  const [connectionCount, setConnectionCount] = useState(0);
  const [connectedTransactions, setConnectedTransactions] = useState([]);
  const [apiKey, setApiKey] = useState(API); // Replace with your API key

  const fetchData = async () => {
    const apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${ethereumAddress1}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
    try {
      const response = await axios.get(apiUrl);
      const data = response.data;
      if (data.status === '1') {
        let count = 0;
        let connectedTxs = [];

        data.result.forEach(transaction => {
          const fromAddress = transaction.from.toLowerCase();
          const toAddress = transaction.to.toLowerCase();

          if (isConnected(fromAddress, toAddress, ethereumAddress1.toLowerCase(), ethereumAddress2.toLowerCase())) {
            count++;
            connectedTxs.push(transaction.hash);
          }
        });

        setConnectionCount(count);
        setConnectedTransactions(connectedTxs);
      } else {
        console.error('Error fetching transactions:', data.message);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const isConnected = (from, to, addr1, addr2) => {
    return (from === addr1 && to === addr2) || (from === addr2 && to === addr1);
  };


  const buttonStyle = {
    backgroundColor: '#4CAF50', // Green background
    color: 'white',
    padding: '15px 32px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '40px 20px',
    cursor: 'pointer',
    borderRadius: '8px',
    border: 'none'
  };

  const inputStyle = {
    padding: '10px',
    margin: '10px 0',
    boxSizing: 'border-box',
    borderRadius: '4px',
    border: '2px solid #ccc',
    fontSize: '16px'
  };

  const containerStyle = {
    textAlign: 'center',
    paddingTop: '50px',
    display: 'block'
  };

  const textStyle = {
    color: '#333',
    fontSize: '20px',
    fontWeight: 'bold'
  };

  return (
    <div style={containerStyle}>
      <div>
        <input 
          style={inputStyle}
          type="text" 
          placeholder="address 1" 
          value={ethereumAddress1}
          onChange={(e) => setEthereumAddress1(e.target.value)}
        />
        <input 
          style={inputStyle}
          type="text" 
          placeholder="address 2" 
          value={ethereumAddress2}
          onChange={(e) => setEthereumAddress2(e.target.value)}
        />
        <button style={buttonStyle} onClick={fetchData}>Run Code</button>
      </div>
      <div id="connectionCount" style={textStyle}>
        <h2>Connection: {connectionCount}</h2>
      </div>
      <div id="connectedTransactions" style={textStyle}>
        <h2>Hashes:</h2>
        {connectedTransactions.map(tx => (
          <p key={tx}>{tx}</p>
        ))}
      </div>
    </div>
  );
};

export default EthereumTransactions;
