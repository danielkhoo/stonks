import React, { useState, useEffect, useRef } from 'react';
import Entry from './Entry';
import axios from 'axios';

function App() {
  let apiKeyInput = useRef();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    getLatestPrices();
  }, []);

  const getLatestPrices = async () => {
    const getTicker = async ticker => {
      const key = localStorage.getItem('key');
      const res = await axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${key}`
      );
      return +res.data['Global Quote']['05. price'];
    };

    const entriesCopy = JSON.parse(localStorage.getItem('data'));
    const updatedEntries = await Promise.all(
      entriesCopy.map(async entry => {
        const price = await getTicker(entry.ticker).catch(() => entry.price);
        // const price = entry.price;
        return { ...entry, price: price };
      })
    );
    setEntries(updatedEntries);
  };

  const onAdd = () => {
    console.log(entries);
    setEntries([...entries, {}]);
  };

  const onEdit = (index, editedEntry) => {
    const newEntries = [...entries];
    newEntries[index] = editedEntry;
    setEntries(newEntries);
    localStorage.setItem('data', JSON.stringify(newEntries));
  };

  const onDelete = index => {
    const newEntries = [...entries.slice(0, index), ...entries.slice(index + 1)];
    setEntries(newEntries);
    localStorage.setItem('data', JSON.stringify(newEntries));
  };

  const addAPIKey = event => {
    console.log(apiKeyInput.current.value);
    localStorage.setItem('key', apiKeyInput.current.value);
    apiKeyInput.current.value = '';
  };

  const totalVal =
    entries.length > 0
      ? entries.map(entry => Math.round(entry.price * entry.qty * entry.fx)).reduce((acc, cur) => (acc += cur))
      : 0;
  const totalCost = entries.length > 0 ? entries.map(entry => +entry.cost).reduce((acc, cur) => (acc += cur)) : 0;
  const totalProfit =
    entries.length > 0
      ? entries
          .map(entry => Math.round(entry.price * entry.qty * entry.fx - entry.cost))
          .reduce((acc, cur) => (acc += cur))
      : 0;
  return (
    <div className='App'>
      <header className='Header'>
        <h1>STONKS</h1>
        <div>
          <input ref={apiKeyInput} />
          <button onClick={addAPIKey}>Save</button>
        </div>

        <img
          id='meme'
          src={process.env.PUBLIC_URL + `/${totalProfit < 0 ? 'notStonks.jpg' : 'stonks.png'}`}
          width='400px'
        ></img>
      </header>
      <main>
        <div className='entry-row'>
          <div className='entry-btn-col'></div>
          <div className='entry-col'>Ticker</div>
          <div className='entry-col'>Price</div>
          <div className='entry-col'>Qty</div>
          <div className='entry-col'>FX</div>
          <div className='entry-col'>Value</div>
          <div className='entry-col'>Cost</div>
          <div className='entry-col-2'>Profit</div>
        </div>
        {entries.length > 0 &&
          entries.map((data, index) => (
            <Entry index={index} data={data} onEdit={onEdit} onDelete={onDelete} key={index} />
          ))}
        <div className='entry-row'>
          <div className='entry-btn-col'></div>
          <div className='entry-col'></div>
          <div className='entry-col'></div>
          <div className='entry-col'></div>
          <div className='entry-col'>
            <button className='entry-btn' onClick={onAdd}>
              Add ticker
            </button>
          </div>
          <div className='entry-col'></div>
          <div className='entry-col'></div>
          <div className='entry-col-2'></div>
        </div>
        <div className='entry-row'>
          <div className='entry-btn-col'></div>
          <div className='entry-col'></div>
          <div className='entry-col'></div>
          <div className='entry-col'></div>
          <div className='entry-col'></div>
          <div className='entry-col'>{totalVal}</div>
          <div className='entry-col'>{totalCost}</div>
          <div className={totalProfit < 0 ? 'entry-col-2 loss' : 'entry-col-2 gain'}>
            {totalProfit + '(' + ((totalProfit * 100) / totalCost).toFixed(2) + '%)'}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
