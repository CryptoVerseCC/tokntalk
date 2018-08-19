import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import jazzicon from 'jazzicon';

const { REACT_APP_NAME: APP_NAME } = process.env;

export const Storage = (storage = localStorage) => ({
  getItem(key) {
    return storage.getItem(`${APP_NAME}_${key}`);
  },
  setItem(key, value) {
    return storage.setItem(`${APP_NAME}_${key}`, value);
  },
});

export function getCurrentProviderName() {
  try {
    if (window.web3.currentProvider.isMetaMask) return 'metamask';

    if (window.web3.currentProvider.isTrust) return 'trust';

    if (typeof window.SOFA !== 'undefined') return 'toshi';

    if (typeof window.__CIPHER__ !== 'undefined') return 'cipher';

    if (window.web3.currentProvider.constructor.name === 'EthereumProvider') return 'mist';

    if (window.web3.currentProvider.constructor.name === 'Web3FrameProvider') return 'parity';
  } catch (e) {}

  return 'unknown';
}

export const validateParams = (validators, redirectTo) => (Cmp) => {
  return class extends Component {
    static displayName = `validateParams(${Cmp.displayName || Cmp.name})`;

    constructor(props) {
      super(props);
      const { params } = props.match;
      const isParamasValid = Object.entries(validators).reduce(
        (acc, [key, validator]) => acc && validator(params[key]),
        true,
      );
      this.state = { isParamasValid };
    }

    render() {
      return this.state.isParamasValid ? <Cmp {...this.props} /> : <Redirect to={redirectTo} />;
    }
  };
};

const iconCache = {};
export const getAvatarUrlForAddress = (address) => {
  if (!iconCache[address]) {
    const icon = jazzicon(100, parseInt(address.slice(2, 10), 16)).firstChild;
    const serializer = new XMLSerializer();
    const blob = new Blob([serializer.serializeToString(icon)], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    iconCache[address] = url;
  }

  return iconCache[address];
};

export const getEntityInfoForAddress = (address) => ({
  isAddress: true,
  id: address.toLowerCase(),
  external_link: `https://etherscan.io/address/${address}`,
  image_preview_url: getAvatarUrlForAddress(address),
  name: `${address.substr(0, 7).toLowerCase()}...${address.substring(37).toLowerCase()}`,
});

export const createEtherscanUrl = (item) => {
  if (item.family.toLowerCase() === 'http') return undefined;
  const familyPrefix = item.family === 'ethereum' ? '' : `${item.family}.`;
  return `https://${familyPrefix}etherscan.io/tx/${item.id.split(':')[1]}`;
};
