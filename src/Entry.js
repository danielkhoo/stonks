import React from 'react';

function Entry(props) {
  const { ticker, price, qty, fx, cost } = props.data;
  const value = Math.round(price * qty * fx);
  const profit = Math.round(price * qty * fx - cost);

  const onDelete = () => props.onDelete(props.index);
  return (
    <div className='entry-row'>
      <div className='entry-btn-col'>
        <button className='entry-btn' onClick={onDelete}>
          -
        </button>
      </div>
      <div className='entry-col'>
        <input
          className='entry-input'
          onChange={event => props.onEdit(props.index, { ...props.data, ticker: event.target.value })}
          value={ticker}
        />
      </div>

      <div className='entry-col'>
        <input
          className='entry-input bold'
          onChange={event => props.onEdit(props.index, { ...props.data, price: event.target.value })}
          value={price}
        />
      </div>
      <div className='entry-col'>
        <input
          className='entry-input'
          onChange={event => props.onEdit(props.index, { ...props.data, qty: event.target.value })}
          value={qty}
        />
      </div>
      <div className='entry-col'>
        <input
          className='entry-input'
          onChange={event => props.onEdit(props.index, { ...props.data, fx: event.target.value })}
          value={fx}
        />
      </div>
      <div className='entry-col'>{value}</div>
      <div className='entry-col'>
        <input
          className='entry-input'
          onChange={event => props.onEdit(props.index, { ...props.data, cost: event.target.value })}
          value={cost}
        />
      </div>
      <div className={profit < 0 ? 'entry-col-2 loss' : 'entry-col-2 gain'}>
        {profit + '(' + ((profit * 100) / cost).toFixed(2) + '%)'}
      </div>
    </div>
  );
}

export default Entry;
