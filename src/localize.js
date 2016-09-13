import hoistNonReactStatics from 'hoist-non-react-statics';
import {Component, createElement} from 'react';
import {activeLocaleShape, localesShape} from './types';

const mapLengthToSuffix = ['00', '0', ''];

function parseMoney(value) {
  const [integerPart, fractionalPart] = `${value}`.split('.');
  const trimmedFractionalPart = fractionalPart ? fractionalPart.substring(0, 2) : '';
  return {
    integerPart,
    fractionalPart: `${trimmedFractionalPart}${mapLengthToSuffix[trimmedFractionalPart.length]}`
  };
}

export default function localize() {
  return function (WrappedComponent) {
    class LocalizedComponent extends Component {
      static contextTypes = {
        activeLocale: activeLocaleShape,
        locales: localesShape
      };

      getLocale = (locale) => {
        return this.context.locales[locale || this.context.activeLocale];
      };

      formatDate = (moment, {locale} = {}) => {
        const {date} = this.getLocale(locale);
        return moment.clone().locale(locale || this.context.activeLocale).format(date);
      };

      formatMessage = (key, data = {}) => {
        const {messages} = this.getLocale(data.locale);
        const value = messages[key];
        if (typeof value === 'function') {
          return value(data);
        }
        return value == null ? key : value;
      };

      formatMoney = (value, {locale, withFractionalPart} = {}) => {
        const {money} = this.getLocale(locale);
        const {integerPart, fractionalPart} = parseMoney(value);
        const result = `${money.currency}${integerPart}`;
        return money.withFractionalPart && withFractionalPart !== false
          ? `${result}.${fractionalPart}`
          : result;
      };

      render() {
        const {locales} = this.context;
        const props = {
          ...this.props,
          formatDate: this.formatDate,
          formatMessage: this.formatMessage,
          formatMoney: this.formatMoney,
          locales
        };
        return createElement(WrappedComponent, props);
      }
    };

    return hoistNonReactStatics(LocalizedComponent, WrappedComponent);
  };
}
