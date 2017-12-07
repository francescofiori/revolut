import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setFromCurrency, setFromValue, setToCurrency, setToValue, exchange} from '../../actions';
import {bindActionCreators} from 'redux';

class Form extends Component {
  /*
  componentDidMount() {
    this.fromValueInput.focus();
  }
  */

  handleFromValueChange = event => this.props.setFromValueFunc(event.target.value);

  handleToValueChange = event => this.props.setToValueFunc(event.target.value);

  handleFromCurrency = event => this.props.setFromCurrencyFunc(event.target.value);

  handleToCurrencyChange = event => this.props.setToCurrencyFunc(event.target.value);

  handleExchange = () => this.props.exchangeFunc();

  fixFocus = () => {
    if (this.state.inputOnFocus === 'fromCurrency') {
      this.fromValueInput.focus();
    } else {
      this.toValueInput.focus();
    }
  };

  render() {
    const {rates, active, balance} = this.props;
    const {fromValue, fromCurrency, toValue, toCurrency} = active;

    console.log('balance', balance); //eslint-disable-line

    const renderRates = rates.date && rates.rates[toCurrency] ? (
      <span>RATE: 1{rates.base} = {toCurrency}{rates.rates[toCurrency].toFixed(4)}</span>
    ) : (
      <span>loading...</span>
    );

    return (
      <div>
        <div>
          <select
            name="fromCurrency"
            value={fromCurrency}
            onChange={this.handleFromCurrency}
            disabled={!rates.date}
          >
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
          <input
            name="fromValue"
            type="number"
            value={fromValue}
            onChange={this.handleFromValueChange}
            placeholder={0}
            ref={input => { this.fromValueInput = input; }}
            style={{textAlign: 'right', border: 'none', outline: 'none'}}
            disabled={!rates.date}
          />
          <span>
            balance: {balance[fromCurrency]}
          </span>
        </div>
        <div>
          {renderRates}
        </div>
        <div>
          <select
            name="toCurrency"
            value={toCurrency}
            onChange={this.handleToCurrencyChange}
            disabled={!rates.date}
          >
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
          <input
            name="toValue"
            type="number"
            value={toValue}
            onChange={this.handleToValueChange}
            placeholder={0}
            ref={input => { this.toValueInput = input; }}
            style={{textAlign: 'right', border: 'none', outline: 'none'}}
            disabled={!rates.date}
          />
          <span>
            balance: {balance[toCurrency]}
          </span>
        </div>
        <button
          disabled={balance[fromCurrency] < fromValue || balance[fromCurrency] === 0}
          onClick={this.handleExchange}
        >
          exchange
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  rates: state.rates,
  active: state.active,
  balance: state.balance
});

const mapDispatchToProps = dispatch => {
  return {
    setFromCurrencyFunc: bindActionCreators(setFromCurrency, dispatch),
    setFromValueFunc: bindActionCreators(setFromValue, dispatch),
    setToCurrencyFunc: bindActionCreators(setToCurrency, dispatch),
    setToValueFunc: bindActionCreators(setToValue, dispatch),
    exchangeFunc: bindActionCreators(exchange, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form);
