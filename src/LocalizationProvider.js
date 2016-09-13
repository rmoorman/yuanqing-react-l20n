import {Children, Component, PropTypes} from 'react';
import {activeLocaleShape, localesShape} from './types';

const {element} = PropTypes;

const shouldInterpolateRegex = /{([^}]+?)}/;
const interpolateRegex = /{([^}]+?)}/g;

function mapLocales(locales) {
  return Object.keys(locales).reduce((result, localeName) => {
    const locale = locales[localeName];
    const messages = Object.keys(locale.messages).reduce((result, key) => {
      const value = locale.messages[key];
      result[key] = shouldInterpolateRegex.test(value)
        ? new Function('x', 'with(x||{}){return \'' + value.replace(interpolateRegex, '\'+$1+\'') + '\';}')
        : value;
      return result;
    }, {});
    result[localeName] = {
      ...locale,
      messages
    };
    return result;
  }, {});
}

export default class LocalizationProvider extends Component {
  static childContextTypes = {
    activeLocale: activeLocaleShape,
    locales: localesShape
  };

  static propTypes = {
    children: element.isRequired,
  };

  getChildContext() {
    return {
      activeLocale: this.props.activeLocale,
      locales: this.locales
    };
  }

  componentWillMount() {
    this.locales = mapLocales(this.props.locales);
  }

  render() {
    return Children.only(this.props.children);
  }
}
