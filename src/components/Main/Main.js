import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {setFromCurrency, setFromValue, setToCurrency, setToValue, exchange, showSuccessModal} from '../../actions';
import {convertInputValueToTwoDigitsNumber} from '../../helpers/string.helper';

import SuccessModal from '../SuccessModal/SuccessModal';
import FromComponent from '../ConvertFrom/ConvertFrom';
import ConvertTo from '../ConvertTo/ConvertTo';

import {Container} from './Main.styles';

export class Main extends Component {
  handleFromValueChange = event => this.props.setFromValueFunc(
    convertInputValueToTwoDigitsNumber(event.target.value)
  );

  handleToValueChange = event => this.props.setToValueFunc(
    convertInputValueToTwoDigitsNumber(event.target.value)
  );

  handleFromCurrencyChange = (event, index, value) => this.props.setFromCurrencyFunc(value);

  handleToCurrencyChange = (event, index, value) => this.props.setToCurrencyFunc(value);

  handleExchange = () => this.props.exchangeFunc();

  handleHideModal = () => this.props.showSuccessModalFunc(false);

  render() {
    const {rates, active, balance, modal, errors, loading} = this.props;
    const {fromValue, fromCurrency, toValue, toCurrency} = active;
    const isExchangeButtonDisabled = balance[fromCurrency] < fromValue ||
      balance[fromCurrency] === 0 ||
      fromValue === 0 ||
      fromValue === '';

    const renderSuccessModal = modal.success && (
      <SuccessModal
        handleHideModal={this.handleHideModal}
        lastExchange={balance.lastExchange}
      />
    );

    return (
      <Container>
        {renderSuccessModal}
        <FromComponent
          balance={balance}
          fromCurrency={fromCurrency}
          fromValue={fromValue}
          toCurrency={toCurrency}
          rates={rates}
          handleFromCurrencyChange={this.handleFromCurrencyChange}
          handleFromValueChange={this.handleFromValueChange}
          ratesError={errors.rates}
          ratesLoading={loading.rates}
        />
        <ConvertTo
         toCurrency={toCurrency}
         balance={balance}
         toValue={toValue}
         handleToCurrencyChange={this.handleToCurrencyChange}
         handleToValueChange={this.handleToValueChange}
         isExchangeButtonDisabled={isExchangeButtonDisabled}
         rates={rates}
         handleExchange={this.handleExchange}
        />
      </Container>
    );
  }
}

Main.propTypes = {
  rates: PropTypes.object.isRequired,
  active: PropTypes.object.isRequired,
  balance: PropTypes.object.isRequired,
  modal: PropTypes.object.isRequired,
  setFromCurrencyFunc: PropTypes.func.isRequired,
  setFromValueFunc: PropTypes.func.isRequired,
  setToCurrencyFunc: PropTypes.func.isRequired,
  setToValueFunc: PropTypes.func.isRequired,
  exchangeFunc: PropTypes.func.isRequired,
  showSuccessModalFunc: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  rates: state.rates,
  active: state.active,
  balance: state.balance,
  modal: state.modal,
  errors: state.errors,
  loading: state.loading,
});

const mapDispatchToProps = dispatch => {
  return {
    setFromCurrencyFunc: bindActionCreators(setFromCurrency, dispatch),
    setFromValueFunc: bindActionCreators(setFromValue, dispatch),
    setToCurrencyFunc: bindActionCreators(setToCurrency, dispatch),
    setToValueFunc: bindActionCreators(setToValue, dispatch),
    exchangeFunc: bindActionCreators(exchange, dispatch),
    showSuccessModalFunc: bindActionCreators(showSuccessModal, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
