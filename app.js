import React, {Component} from 'react';
import {render} from 'react-dom';
import moment from 'moment';

import {localize, LocalizationProvider} from './src';

require('moment/locale/zh-tw');

const locales = {
  en: {
    date: 'LL',
    messages: {
      hello: 'Hello!',
      pay: 'Please pay {amount}.',
      today: 'Today is {date}.'
    },
    money: {
      currency: '$',
      withFractionalPart: true
    }
  },
  'zh-tw': {
    date: 'LL',
    messages: {
      hello: '你好！',
      pay: '請支付{amount}。',
      today: '今天是{date}。',
    },
    money: {
      currency: 'NT',
      withFractionalPart: false
    }
  }
};

@localize()
class Foo extends Component {
  render() {
    const {formatDate, formatMessage, formatMoney} = this.props;
    return (
      <ul>
        <li>{formatMessage('hello')}</li>
        <li>{formatMessage('today', {date: formatDate(moment())})}</li>
        <li>{formatMessage('pay', {amount: formatMoney(42, {locale: 'zh-tw'})})}</li>
      </ul>
    );
  }
}

class App extends Component {
  state = {
    activeLocale: 'en'
  };

  setActiveLocale = (locale) => {
    this.setState({
      activeLocale: locale
    });
  };

  render() {
    return (
      <LocalizationProvider locales={locales} activeLocale={this.state.activeLocale}>
        <div>
          <button onClick={this.setActiveLocale.bind(null, 'en')} disabled={this.state.activeLocale === 'en'}>English</button>
          <button onClick={this.setActiveLocale.bind(null, 'zh-tw')} disabled={this.state.activeLocale === 'zh-tw'}>繁體中文</button>
          <hr />
          <Foo />
        </div>
      </LocalizationProvider>
    );
  }
}

render(<App />, document.querySelector('.app'));
