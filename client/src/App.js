import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

//contract address 0x5FbDB2315678afecb367f032d93F642f64180aa3

function App() {
  const [greet, setGreet] = useState('');
  const [balance, setBalance] = useState('');
  const [greetingValue, setGreetingValue] = useState('');
  const [depositValue, setDepositValue] = useState('');

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  const ABI = [
    {
      inputs: [
        {
          internalType: 'string',
          name: '_greeting',
          type: 'string',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      inputs: [],
      name: 'deposit',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'greet',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: '_greeting',
          type: 'string',
        },
      ],
      name: 'setGreeting',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ];
  const contract = new ethers.Contract(contractAddress, ABI, signer);

  const connectWallet = async () => {
    await provider.send('eth_requestAccounts', []);
  };

  const getBallance = async () => {
    //баланс на контракте
    const balance = await provider.getBalance(contractAddress);
    const balanceFormatted = ethers.utils.formatEther(balance);
    setBalance(balanceFormatted);
  };

  const getGreeting = async () => {
    const greet = await contract.greet();
    setGreet(greet);
  };

  useEffect(() => {
    connectWallet();
    getBallance();
    getGreeting();
  });

  const handleDepositChange = (e) => {
    // await contract.deposit()
    setDepositValue(e.target.value);
  };

  const handleGreetingChange = (e) => {
    setGreetingValue(e.target.value);
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    const depositUpdate = await contract.deposit({
      value: ethers.utils.parseEther(depositValue),
    });
    await depositUpdate.wait();
    setDepositValue(0);
    setBalance(depositValue);
  };

  const handleGreetingSubmit = async (e) => {
    e.preventDefault();
    const greetingUpdate = await contract.setGreeting(greetingValue);
    await greetingUpdate.wait();
    setGreetingValue('');
    setGreet(greetingValue);
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col">
            <h3>Greeting: {greet}</h3>
            <div>Contract balance: {balance}</div>
          </div>
          <form className="mb-3" onSubmit={handleDepositSubmit}>
            <div className="col">
              <input
                type="number"
                placeholder="0"
                onChange={handleDepositChange}
                value={depositValue}
                className="form-control"
              />
            </div>
            <div>
              <button type="submit" className="btn btn-primary">
                Deposit
              </button>
            </div>
          </form>
          <form onSubmit={handleGreetingSubmit}>
            <div className="col">
              <input
                onChange={handleGreetingChange}
                value={greetingValue}
                type="text"
                placeholder="Your greeting"
                className="form-control"
              />
            </div>
            <div>
              <button type="submit" className="btn btn-primary">
                Change
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
