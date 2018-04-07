import getWeb3 from './web3';
import { contractAddressesForNetworkId, contractAbi, networkNameForNetworkId } from './contract';
export const downloadCats = async () => {
  try {
    const web3 = await getWeb3();
    const [from] = await web3.eth.getAccounts();
    if (!from) return;
    const response = await fetch(
      `https://api-dev.userfeeds.io/ranking/tokens;identity=${from.toLowerCase()};asset=ethereum:0x06012c8cf97bead5deae237070f9587f8e7a266d/`
    );
    const { items: myCats } = await response.json();
    return myCats;
  } catch (e) {
    return [];
  }
};

export const downloadWeb3State = async () => {
  try {
    const web3 = await getWeb3();
    const [[from], isListening, networkId] = await Promise.all([
      web3.eth.getAccounts(),
      web3.eth.net.isListening(),
      web3.eth.net.getId()
    ]);
    return { from, isListening, networkId };
  } catch (e) {
    return { from: undefined, isListening: false, networkId: undefined };
  }
};

export const getCatData = async catId => {
  try {
    const res = await fetch(`https://api.cryptokitties.co/kitties/${catId}`);
    const data = await res.json();
    return data;
  } catch (e) {
    return undefined;
  }
};

export const getCatLabels = async catId => {
  try {
    const res = await fetch(
      `https://api-dev.userfeeds.io/ranking/labels721;context=ethereum:0x06012c8cf97bead5deae237070f9587f8e7a266d:${catId};labels=github;labels=facebook;labels=twitter;labels=instagram/`
    );
    const { items: catLabels } = await res.json();
    return catLabels;
  } catch (e) {
    return [];
  }
};

const getCreditsData = () => [{ type: 'interface', value: 'cryptopurr.co' }];

export const sendMessage = async (token, message) => {
  const web3 = await getWeb3();
  const { from, networkId } = await downloadWeb3State();
  const contractAddress = contractAddressesForNetworkId[networkId];
  const networkName = networkNameForNetworkId[networkId];
  const contract = new web3.eth.Contract(contractAbi, contractAddress);
  contract.setProvider(web3.currentProvider);
  const data = {
    claim: {
      target: message
    },
    context: `ethereum:0x06012c8cf97bead5deae237070f9587f8e7a266d:${token}`,
    credits: getCreditsData()
  };
  return new Promise((resolve, reject) => {
    contract.methods
      .post(JSON.stringify(data))
      .send({ from })
      .on('transactionHash', async transactionHash => {
        resolve({
          about: null,
          abouted: [],
          author: from,
          context: `ethereum:0x06012c8cf97bead5deae237070f9587f8e7a266d:${token}`,
          created_at: new Date().getTime(),
          family: networkName,
          id: `claim:${transactionHash}:0`,
          sequence: (await web3.eth.getBlockNumber()) + 1,
          target: { id: message },
          targeted: [],
          type: 'regular'
        });
      })
      .on('error', error => {
        reject(error);
      });
  });
};

export const reply = async (token, message, about) => {
  const web3 = await getWeb3();
  const { from, networkId } = await downloadWeb3State();
  const contractAddress = contractAddressesForNetworkId[networkId];
  const networkName = networkNameForNetworkId[networkId];
  const contract = new web3.eth.Contract(contractAbi, contractAddress);
  contract.setProvider(web3.currentProvider);
  const data = {
    type: ['about'],
    claim: {
      target: message,
      about
    },
    context: `ethereum:0x06012c8cf97bead5deae237070f9587f8e7a266d:${token}`,
    credits: getCreditsData()
  };
  return new Promise((resolve, reject) => {
    contract.methods
      .post(JSON.stringify(data))
      .send({ from })
      .on('transactionHash', async transactionHash => {
        resolve({
          author: from,
          context: `ethereum:0x06012c8cf97bead5deae237070f9587f8e7a266d:${token}`,
          created_at: new Date().getTime(),
          family: networkName,
          id: `claim:${transactionHash}:0`,
          target: {
            id: message
          },
          sequence: (await web3.eth.getBlockNumber()) + 1
        });
      })
      .on('error', error => {
        reject(error);
      });
  });
};

export const react = async (token, to) => {
  const web3 = await getWeb3();
  const { from, networkId } = await downloadWeb3State();
  const contractAddress = contractAddressesForNetworkId[networkId];
  const networkName = networkNameForNetworkId[networkId];
  const contract = new web3.eth.Contract(contractAbi, contractAddress);
  contract.setProvider(web3.currentProvider);
  const data = {
    type: ['labels'],
    claim: {
      target: to,
      labels: ['like']
    },
    context: `ethereum:0x06012c8cf97bead5deae237070f9587f8e7a266d:${token}`,
    credits: getCreditsData()
  };
  return new Promise((resolve, reject) => {
    contract.methods
      .post(JSON.stringify(data))
      .send({ from })
      .on('transactionHash', async transactionHash => {
        resolve({
          author: from,
          context: `ethereum:0x06012c8cf97bead5deae237070f9587f8e7a266d:${token}`,
          created_at: new Date().getTime(),
          family: networkName,
          id: `claim:${transactionHash}:0`,
          target: {
            id: to
          },
          sequence: (await web3.eth.getBlockNumber()) + 1
        });
      })
      .on('error', error => {
        reject(error);
      });
  });
};

export const label = async (token, message, labelType) => {
  const web3 = await getWeb3();
  const { from, networkId } = await downloadWeb3State();
  const contractAddress = contractAddressesForNetworkId[networkId];
  const networkName = networkNameForNetworkId[networkId];
  const contract = new web3.eth.Contract(contractAbi, contractAddress);
  contract.setProvider(web3.currentProvider);
  const data = {
    type: ['labels'],
    claim: {
      target: message,
      labels: [labelType]
    },
    context: `ethereum:0x06012c8cf97bead5deae237070f9587f8e7a266d:${token}`,
    credits: getCreditsData()
  };
  return new Promise((resolve, reject) => {
    contract.methods
      .post(JSON.stringify(data))
      .send({ from })
      .on('transactionHash', async transactionHash => {
        resolve({
          author: from,
          created_at: new Date().getTime(),
          family: networkName,
          id: `claim:${transactionHash}:0`,
          label: labelType,
          sequence: (await web3.eth.getBlockNumber()) + 1,
          target: message
        });
      })
      .on('error', error => {
        reject(error);
      });
  });
};
