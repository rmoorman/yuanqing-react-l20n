import {PropTypes} from 'react';

const {bool, object, objectOf, shape, string} = PropTypes;

export const activeLocaleShape = string.isRequired;

export const localesShape = objectOf(shape({
  date: string.isRequired,
  messages: object.isRequired,
  money: shape({
    currency: string.isRequired,
    withFractionalPart: bool.isRequired
  }).isRequired
}).isRequired).isRequired;
