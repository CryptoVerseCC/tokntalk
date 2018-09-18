import React from 'react';
import find from 'lodash/fp/find';

import cryptokitties from './img/tokens/cryptokitties-icon.svg';
import cryptokittiesCover from './img/tokens/cryptokitties.png';

import zerouniverse from './img/tokens/0xuniverse-icon.png';
import zerouniverseCover from './img/tokens/0xuniverse.jpg';

import axie from './img/tokens/axie-icon.png';
import axieCover from './img/tokens/axie.png';

import bbsc from './img/tokens/bbsc-icon.png';
import bbscCover from './img/tokens/bbsc.png';

import dasabi from './img/tokens/dasabi-icon.svg';
import dasabiCover from './img/tokens/dasabi.png';

import cryptobaseball from './img/tokens/cryptobaseball-icon.png';
import cryptobaseballCover from './img/tokens/cryptobaseball.png';

import hyperdragons from './img/tokens/hyperdragons-icon.png';
import hyperdragonsCover from './img/tokens/hyperdragons.png';

import playertokens from './img/tokens/playertoken-icon.svg';
import playertokensCover from './img/tokens/playertoken.png';

import domraider from './img/tokens/domraider-icon.svg';
import domraiderCover from './img/tokens/domraider.png';

import dummy from './img/tokens/dummy-icon.png';
import dummyCover from './img/tokens/dummy.png';

import cryptobots from './img/tokens/cryptobots-icon.svg';
import cryptobotsCover from './img/tokens/cryptobots.png';

import nfty from './img/tokens/nfty-icon.png';
import nftyCover from './img/tokens/nfty.png';

import coinbase from './img/tokens/coinbasewalletcryptoswag-icon.svg';
import coinbaseCover from './img/tokens/coinbasewalletcryptoswag.png';

import tokenville from './img/tokens/tokenville-icon.svg';
import tokenvilleCover from './img/tokens/tokenville.jpg';

import ethmoji from './img/tokens/ethmoji-icon.png';
import ethmojiCover from './img/tokens/ethmoji.jpg';

import dac from './img/tokens/dac-icon.svg';
import dacCover from './img/tokens/dac.jpg';

import bat from './img/tokens/bat-icon.svg';
import batCover from './img/tokens/bat.png';

import godsunchained from './img/tokens/godsunchained-icon.png';
import godsunchainedCover from './img/tokens/godsunchained.jpg';

import cryptogirls from './img/tokens/cryptogirls-icon.png';
import cryptogirlsCover from './img/tokens/cryptogirls.png';

import ben from './img/tokens/bentyn-icon.png';
import benCover from './img/tokens/bentyn.jpg';

import ddgt from './img/tokens/okimaki-icon.png';
import ddgtCover from './img/tokens/okimaki.png';

import joy from './img/tokens/joy-icon.png';
import joyCover from './img/tokens/joy.png';

import gnt from './img/tokens/golem-icon.svg';
import gntCover from './img/tokens/golem.png';

import snt from './img/tokens/status-icon.svg';
import sntCover from './img/tokens/status.png';

import mkr from './img/tokens/maker-icon.svg';
import mkrCover from './img/tokens/maker.png';

import mana from './img/tokens/decentraland-icon.png';
import manaCover from './img/tokens/decentraland.png';

import unicorn from './img/tokens/unicorn-icon.png';
import unicornCover from './img/tokens/unicorn.png';

import zrx from './img/tokens/zrx-icon.svg';
import zrxCover from './img/tokens/zrx.png';

import omg from './img/tokens/omisego-icon.svg';
import omgCover from './img/tokens/omisego.png';

import avocado from './img/tokens/avocado-icon.png';
import avocadoCover from './img/tokens/avocado.png';

import knownorigin from './img/tokens/knownorigin-icon.svg';
import knownoriginCover from './img/tokens/knownorigin.jpg';

import cryptostrikers from './img/tokens/cryptostrikers-icon.png';
import cryptostrikersCover from './img/tokens/cryptostrikers.png';

import ethtown from './img/tokens/ethtown-icon.png';
import ethtownCover from './img/tokens/ethtown.png';

import cryptosaga from './img/tokens/cryptosaga-icon.png';
import cryptosagaCover from './img/tokens/cryptosaga.png';

import chibi from './img/tokens/chibi-icon.png';
import chibiCover from './img/tokens/chibi.png';

import cryptofighters from './img/tokens/cryptofighters-icon.svg';
import cryptofightersCover from './img/tokens/cryptofighters.png';

import etheremon from './img/tokens/etheremon-icon.png';
import etheremonCover from './img/tokens/etheremon.png';

import mythereum from './img/tokens/mythereum-icon.png';
import mythereumCover from './img/tokens/mythereum.png';

import pandaearth from './img/tokens/pandaearth-icon.png';
import pandaearthCover from './img/tokens/pandaearth.png';

import sanmaricoin from './img/tokens/sanmaricoin-icon.png';
import sanmaricoinCover from './img/tokens/sanmaricoin.png';

import kiyosalo from './img/tokens/kst-icon.png';
import kiyosaloCover from './img/tokens/kst.png';

import percent from './img/tokens/percent-icon.svg';
import percentCover from './img/tokens/percent.png';

import x from './img/tokens/x.svg';
import xCover from './img/tokens/tokenX.png';

import cows from './img/tokens/cryptocows-icon.png';
import cowsCover from './img/tokens/cryptocows.png';

import cryptovoxel from './img/tokens/cryptovoxels-icon.svg';
import cryptovoxelCover from './img/tokens/cryptovoxels.png';

import cryptocrystal from './img/tokens/cryptocrystals-icon.png';
import cryptocrystalCover from './img/tokens/cryptocrystals.png';

import digix from './img/tokens/digix-icon.svg';
import digixCover from './img/tokens/digix.png';

import warriders from './img/tokens/warriders-icon.png';
import warridersCover from './img/tokens/warriders.png';

import blockchaincuties from './img/tokens/blockchaincuties-icon.svg';
import blockchaincutiesCover from './img/tokens/blockchaincuties.png';

import snookarma from './img/tokens/snookarma-icon.svg';
import snookarmaCover from './img/tokens/snookarma.png';

import cryptoarte from './img/tokens/cryptoarte-icon.svg';
import cryptoarteCover from './img/tokens/cryptoarte.png';

import unknowClub from './img/tokens/unknown-icon.svg';
import unknowClubCover from './img/tokens/unknown.png';

import * as mapping from 'contract-mapping/mapping.json';

class Token {
  constructor(options) {
    Object.assign(this, options);
  }

  get asset() {
    return `${this.network}:${this.address}`;
  }

  extend(by) {
    return new Token({
      ...this,
      ...Object.entries(by)
        .filter(([, v]) => !!v)
        .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}),
    });
  }
}

const clubs = [
  {
    ...mapping.CRYPTOKITTIES,
    entityPrefix: 'CryptoKitty #',
    logo: cryptokitties,
    coverImage: cryptokittiesCover,
    primaryColor: '#FFD9FF',
    secondaryColor: '#C23DA8',
    shadowColor: 'rgba(194,61,168,0.2)',
    externalLinks: [
      { name: 'Project page', url: 'https://www.cryptokitties.co/' },
      { name: 'Marketplace', url: 'https://www.cryptokitties.co/search' },
      { name: 'OpenSea', url: 'https://opensea.io/assets/cryptokitties' },
      { name: 'Reddit', url: 'https://www.reddit.com/r/CryptoKitties/' },
    ],
    avatarSizes: {
      verySmall: { containerSize: '32px', imgSize: '70px', imgTopOffset: '85%', imgLeftOffset: '55%' },
      small: { containerSize: '44px', imgSize: '110px', imgTopOffset: '85%', imgLeftOffset: '55%' },
      medium: { containerSize: '54px', imgSize: '120px', imgTopOffset: '77%', imgLeftOffset: '55%' },
      large: { containerSize: '64px', imgSize: '130px', imgTopOffset: '70%', imgLeftOffset: '55%' },
    },
  },
  {
    ...mapping.AXIES,
    entityPrefix: 'Axie #',
    logo: axie,
    coverImage: axieCover,
    primaryColor: '#2b6a93',
    secondaryColor: '#ffffff',
    shadowColor: 'rgba(43,106,147,0.2)',
    externalLinks: [
      { name: 'Project page', url: 'https://axieinfinity.com/' },
      { name: 'Marketplace', url: 'https://axieinfinity.com/marketplace' },
      { name: 'OpenSea', url: 'https://opensea.io/assets/axie' },
      { name: 'Reddit', url: 'https://www.reddit.com/r/AxieInfinity/' },
    ],
  },
  {
    ...mapping.ZEROXUNIVERSE,
    entityPrefix: 'Planet #',
    logo: zerouniverse,
    coverImage: zerouniverseCover,
    primaryColor: '#040316',
    secondaryColor: '#ff5347',
    shadowColor: 'rgba(4,3,22,0.2)',
    externalLinks: [
      { name: 'Project page', url: 'https://0xuniverse.com/' },
      { name: 'Discord', url: 'https://discord.gg/R8fwEPC' },
      { name: 'Telegram', url: 'https://t.me/OxUniverse' },
    ],
  },
  {
    ...mapping.CRYPTOBOTS,
    entityPrefix: 'CryptoBot #',
    logo: cryptobots,
    coverImage: cryptobotsCover,
    primaryColor: '#EFF7B6',
    secondaryColor: '#1D132D',
    shadowColor: 'rgba(193,205,109,0.3)',
    externalLinks: [
      { name: 'Project page', url: 'http://cryptobots.me/' },
      { name: 'Marketplace', url: 'https://cryptobots.me/auction/1#sale' },
      { name: 'OpenSea', url: 'https://opensea.io/assets/cryptobots' },
      { name: 'Reddit', url: 'https://www.reddit.com/r/cryptobots_game/' },
    ],
  },
  {
    ...mapping.ETH_MOJI,
    entityPrefix: 'Ethmoji #',
    logo: ethmoji,
    coverImage: ethmojiCover,
    primaryColor: '#E051BA',
    secondaryColor: '#FFFFFF',
    shadowColor: 'rgba(224,81,184,0.3)',
    externalLinks: [
      { name: 'Project page', url: 'https://ethmoji.io/' },
      { name: 'Marketplace', url: 'https://ethmoji.io/compose/base' },
      { name: 'OpenSea', url: 'https://opensea.io/assets/ethmoji' },
      { name: 'Reddit', url: 'https://www.reddit.com/r/ethmoji/' },
    ],
  },
  {
    ...mapping.DIGITAL_ART_CHAIN,
    entityPrefix: 'Digital Art ',
    logo: dac,
    coverImage: dacCover,
    primaryColor: '#ffded7',
    secondaryColor: '#F05E40',
    shadowColor: 'rgba(247,165,148,0.3)',
    externalLinks: [
      { name: 'Project page', url: 'http://digitalartchain.com/' },
      { name: 'Marketplace', url: 'http://digitalartchain.com/publish.html' },
      { name: 'OpenSea', url: 'https://opensea.io/assets/digitalartchain' },
    ],
    promotionBox: {
      recipient: 'ethereum:0x323a3e1693e7a0959f65972f3bf2dfcb93239dfe:107', // DAC
    },
  },
  {
    ...mapping.KNOWN_ORIGIN,
    entityPrefix: 'KO Art #',
    logo: knownorigin,
    coverImage: knownoriginCover,
    primaryColor: '#1019cb',
    secondaryColor: '#ffffff',
    shadowColor: 'rgba(200,249,255,0.6)',
    externalLinks: [
      { name: 'Project page', url: 'https://knownorigin.io' },
      { name: 'OpenSea', url: 'https://opensea.io/assets/knownorigin' },
    ],
  },
  {
    ...mapping.CRYPTO_STRIKERS,
    entityPrefix: 'CryptoStriker #',
    logo: cryptostrikers,
    coverImage: cryptostrikersCover,
    primaryColor: '#BEC4CB',
    secondaryColor: '#2D1F18',
    shadowColor: 'rgba(190,196,203,0.4)',
    externalLinks: [
      { name: 'Project page', url: 'https://www.cryptostrikers.com/' },
      { name: 'OpenSea', url: 'https://opensea.io/assets/cryptostrikers' },
      { name: 'Reddit', url: 'https://www.reddit.com/r/cryptostrikers/' },
    ],
  },
  {
    ...mapping.ETH_TOWN,
    entityPrefix: 'Hero #',
    logo: ethtown,
    coverImage: ethtownCover,
    primaryColor: '#E8EDFB',
    secondaryColor: '#283861',
    shadowColor: 'rgba(118,103,170,0.26)',
    externalLinks: [
      { name: 'Project page', url: 'https://eth.town/' },
      { name: 'OpenSea', url: 'https://opensea.io/assets/ethtown' },
      { name: 'Reddit', url: 'https://www.reddit.com/r/EtherTown/' },
    ],
  },
  {
    ...mapping.CHIBI_FIGHTERS,
    entityPrefix: 'Fighter #',
    logo: chibi,
    coverImage: chibiCover,
    primaryColor: '#4881ae',
    secondaryColor: '#FCE478',
    shadowColor: 'rgba(52,58,64,0.2)',
    externalLinks: [
      { name: 'Project page', url: 'https://chibifighters.io/' },
      { name: 'OpenSea', url: 'https://opensea.io/assets/chibifighters' },
      { name: 'Reddit', url: 'https://www.reddit.com/r/ChibiFighters/' },
    ],
  },
  {
    ...mapping.CRYPTO_FIGHTERS,
    entityPrefix: 'Fighter #',
    logo: cryptofighters,
    coverImage: cryptofightersCover,
    primaryColor: '#BAD2ED',
    secondaryColor: '#030F23',
    shadowColor: 'rgba(186,210,237,0.3)',
    externalLinks: [
      { name: 'Project page', url: 'https://cryptofighters.io' },
      { name: 'OpenSea', url: 'https://opensea.io/assets/cryptofighters' },
      { name: 'Reddit', url: 'https://www.reddit.com/r/CryptoFighters/' },
    ],
  },
  {
    ...mapping.CRYPTO_SAGA,
    entityPrefix: 'Hero #',
    logo: cryptosaga,
    coverImage: cryptosagaCover,
    primaryColor: '#D8CECB',
    secondaryColor: '#382320',
    shadowColor: 'rgba(216,206,203,0.6)',
    externalLinks: [
      { name: 'Project page', url: 'https://cryptosaga.io/' },
      { name: 'OpenSea', url: 'https://opensea.io/assets/cryptosaga' },
    ],
  },
  {
    ...mapping.ETHEREMON,
    entityPrefix: 'Etheremon #',
    logo: etheremon,
    coverImage: etheremonCover,
    primaryColor: '#010206',
    secondaryColor: '#ffffff',
    shadowColor: 'rgba(1,2,6,0.2)',
    externalLinks: [
      { name: 'Project page', url: 'https://www.etheremon.com/' },
      { name: 'OpenSea', url: 'https://opensea.io/assets/etheremon' },
      { name: 'Reddit', url: 'https://www.reddit.com/r/etheremon/' },
    ],
  },
  {
    ...mapping.MYTHEREUM,
    entityPrefix: 'Card #',
    logo: mythereum,
    coverImage: mythereumCover,
    primaryColor: '#4B1E06',
    secondaryColor: '#F7DC8D',
    shadowColor: 'rgba(75,30,6,0.4)',
    externalLinks: [
      { name: 'Project page', url: 'https://www.mythereum.io/' },
      { name: 'OpenSea', url: 'https://opensea.io/assets/mythereum' },
      { name: 'Reddit', url: 'https://www.reddit.com/r/mythereum/' },
    ],
  },
  {
    ...mapping.PANDA_EARTH,
    entityPrefix: 'Panda #',
    logo: pandaearth,
    coverImage: pandaearthCover,
    primaryColor: '#EEEEEE',
    secondaryColor: '#332f2c',
    shadowColor: 'rgba(51,47,44,0.1)',
    externalLinks: [
      { name: 'Project page', url: 'https://panda.earth' },
      { name: 'OpenSea', url: 'https://opensea.io/assets/pandaearth' },
    ],
  },
  {
    ...mapping.CRYPTO_COWS,
    entityPrefix: 'Cow #',
    logo: cows,
    coverImage: cowsCover,
    primaryColor: '#f5cd4a',
    secondaryColor: '#221f20',
    shadowColor: 'rgba(245,205,74,0.4)',
    externalLinks: [{ name: 'Project page', url: 'https://www.cryptotoons.io/toons/cryptocows' }],
  },
  {
    ...mapping.CRYPTO_VOXELS,
    entityPrefix: 'Voxel #',
    logo: cryptovoxel,
    coverImage: cryptovoxelCover,
    primaryColor: '#D8D8D8',
    secondaryColor: '#2C2C2C',
    shadowColor: 'rgba(44,44,44,0.3)',
    externalLinks: [
      { name: 'Project page', url: 'https://www.cryptovoxels.com/' },
      { name: 'OpenSea', url: 'https://opensea.io/assets/cryptovoxels' },
    ],
    promotionBox: {
      recipient: `${mapping.CRYPTO_VOXELS.network}:${mapping.CRYPTO_VOXELS.address}:2`,
    },
  },
  {
    ...mapping.AVOCADO,
    decimals: 18,
    logo: avocado,
    coverImage: avocadoCover,
    primaryColor: '#CDFA7F',
    secondaryColor: '#3D5000',
    shadowColor: 'rgba(61,80,0,0.2)',
    externalLinks: [{ name: 'Project page', url: 'https://tokntalk.club' }],
  },
  {
    ...mapping.BASIC_ATTENTION_TOKEN,
    decimals: 18,
    logo: bat,
    coverImage: batCover,
    primaryColor: '#818181',
    secondaryColor: '#ffffff',
    shadowColor: 'rgba(75,75,75,0.4)',
    externalLinks: [{ name: 'Project page', url: 'https://???.??' }],
  },
  {
    ...mapping.BENTYN,
    decimals: 4,
    logo: ben,
    coverImage: benCover,
    primaryColor: '#BEC4CB',
    secondaryColor: '#2D1F18',
    shadowColor: 'rgba(88,66,54,0.25)',
    externalLinks: [
      { name: 'Project page', url: 'https://www.youtube.com/channel/UCcMCMdVFhU25uCpC4kJAo3A' },
      { name: 'Exchange - Coinbe.net', url: 'https://coinbe.net/market' },
      { name: 'YouTube', url: 'https://www.youtube.com/c/SzczepanBentyn' },
    ],
  },
  {
    ...mapping.DECENTRALAND_MANA,
    decimals: 18,
    logo: mana,
    coverImage: manaCover,
    primaryColor: '#353535',
    secondaryColor: '#30D7A9',
    shadowColor: 'rgba(31,24,38,0.3)',
    externalLinks: [
      { name: 'Project page', url: 'https://decentraland.org/' },
      { name: 'Reddit', url: 'https://www.reddit.com/r/decentraland/' },
    ],
  },
  {
    ...mapping.MAKER,
    decimals: 18,
    logo: mkr,
    coverImage: mkrCover,
    primaryColor: '#C6FFF4',
    secondaryColor: '#276C5E',
    shadowColor: 'rgba(82,211,185,0.3)',
    externalLinks: [
      { name: 'Project page', url: 'https://makerdao.com/' },
      { name: 'Reddit', url: 'https://www.reddit.com/r/MakerDAO/' },
    ],
  },
  {
    ...mapping.GOLEM,
    decimals: 18,
    logo: gnt,
    coverImage: gntCover,
    primaryColor: '#68625d',
    secondaryColor: '#ffffff',
    shadowColor: 'rgba(104,98,93,0.25)',
    externalLinks: [{ name: 'Project page', url: 'https://golem.network/' }],
  },
  {
    ...mapping.OMNISE_GO,
    decimals: 18,
    logo: omg,
    coverImage: omgCover,
    primaryColor: '#1A52EF',
    secondaryColor: '#ffffff',
    shadowColor: 'rgba(26,82,239,0.3)',
    externalLinks: [
      { name: 'Project page', url: 'https://omisego.network/' },
      { name: 'Reddit', url: 'https://www.reddit.com/r/omise_go/' },
    ],
  },
  {
    ...mapping.UNICORN,
    decimals: 0,
    logo: unicorn,
    coverImage: unicornCover,
    primaryColor: '#C8F9FF',
    secondaryColor: '#5B3D9D',
    shadowColor: 'rgba(200,249,255,0.6)',
    externalLinks: [
      { name: 'Project page', url: 'https://www.ethereum.org/' },
      { name: 'Donations', url: 'https://www.ethereum.org/donate' },
    ],
  },
  {
    ...mapping.STATUS,
    decimals: 18,
    logo: snt,
    coverImage: sntCover,
    primaryColor: '#5B6CEE',
    secondaryColor: '#ffffff',
    shadowColor: 'rgba(91,108,238,0.5)',
    externalLinks: [{ name: 'Project page', url: 'https://status.im' }],
  },
  {
    ...mapping.ZRX,
    decimals: 18,
    logo: zrx,
    coverImage: zrxCover,
    primaryColor: '#3C3C3C',
    secondaryColor: '#ffffff',
    shadowColor: 'rgba(60,60,60,0.25)',
    externalLinks: [{ name: 'Project page', url: 'https://0xproject.com' }],
  },
  {
    ...mapping.SANMARICOIN,
    decimals: 18,
    logo: sanmaricoin,
    coverImage: sanmaricoinCover,
    primaryColor: '#C8D5FF',
    secondaryColor: '#1639AA',
    shadowColor: 'rgba(22,57,170,0.2)',
    externalLinks: [{ name: 'Project page', url: 'https://twitter.com/sanmaricoin' }],
    promotionBox: {
      recipient: 'ethereum:0x06012c8cf97bead5deae237070f9587f8e7a266d:839415', // Sanmari CK
    },
  },
  {
    ...mapping.KIYOSALO,
    decimals: 18,
    logo: kiyosalo,
    coverImage: kiyosaloCover,
    primaryColor: '#bcdbff',
    secondaryColor: '#3267a5',
    shadowColor: 'rgba(50,103,165,0.2)',
    externalLinks: [{ name: 'Project page', url: 'https://???.??' }],
  },
  {
    ...mapping.DDGT,
    decimals: 18,
    logo: ddgt,
    coverImage: ddgtCover,
    primaryColor: '#122d4b',
    secondaryColor: '#65d9ff',
    shadowColor: 'rgba(18,45,75,0.25)',
    externalLinks: [{ name: 'Project page', url: 'https://???.??' }],
  },
  {
    ...mapping.TOKEN_X,
    decimals: 2,
    logo: x,
    coverImage: xCover,
    primaryColor: '#03FFFF',
    secondaryColor: '#5E22AE',
    shadowColor: 'rgba(3,255,255,0.5)',
    externalLinks: [
      { name: 'Project page', url: 'https://???.??' },
      { name: 'ForkDelta', url: 'https://forkdelta.app/#!/trade/0xb7fc08177bcba924255132f361084d7994eafcf0-ETH' },
    ],
  },
  {
    ...mapping.CRYPTO_CRYSTALS,
    entityPrefix: 'Crystal #',
    logo: cryptocrystal,
    coverImage: cryptocrystalCover,
    primaryColor: '#F0EAF6',
    secondaryColor: '#67616E',
    shadowColor: 'rgba(188,175,202,0.3)',
    externalLinks: [{ name: 'Project page', url: 'https://cryptocrystal.io/' }],
  },
  {
    ...mapping.BAOBOSHICOIN,
    decimals: 18,
    logo: bbsc,
    coverImage: bbscCover,
    primaryColor: '#e60300',
    secondaryColor: '#ffffff',
    shadowColor: 'rgba(230,3,0,0.3)',
    externalLinks: [
      { name: 'Project page', url: 'http://bbsc.rocks/' },
      { name: 'Exchange', url: 'http://bbsc.rocks/' },
    ],
  },
  {
    ...mapping.TOKENVILLE,
    decimals: 18,
    logo: tokenville,
    coverImage: tokenvilleCover,
    primaryColor: '#fef0d4',
    secondaryColor: '#4d3733',
    shadowColor: 'rgba(77,55,51,0.25)',
    externalLinks: [
      { name: 'Project page', url: 'https://tokenville.tv/' },
      { name: 'Exchange', url: 'https://tokenville.tv/token' },
    ],
  },
  {
    ...mapping.CRYPTOBASEBALL,
    logo: cryptobaseball,
    coverImage: cryptobaseballCover,
    primaryColor: '#010d21',
    secondaryColor: '#f3f3f7',
    shadowColor: 'rgba(1,13,33,0.3)',
    externalLinks: [{ name: 'Project page', url: 'https://www.mlbcryptobaseball.com/' }],
  },
  {
    ...mapping.PLAYERTOKENS,
    logo: playertokens,
    coverImage: playertokensCover,
    primaryColor: '#111111',
    secondaryColor: '#ffb41f',
    shadowColor: 'rgba(17,17,17,0.3)',
    externalLinks: [{ name: 'Project page', url: 'https://playertokens.co/' }],
  },
  {
    ...mapping.DOMRAIDER,
    decimals: 8,
    logo: domraider,
    coverImage: domraiderCover,
    primaryColor: '#212a4b',
    secondaryColor: '#f4ca55',
    shadowColor: 'rgba(33,42,75,0.3)',
    externalLinks: [{ name: 'Project page', url: 'https://www.domraider.com/' }],
  },
  {
    ...mapping.HYPERDRAGONS,
    entityPrefix: 'HyperDragons #',
    logo: hyperdragons,
    coverImage: hyperdragonsCover,
    primaryColor: '#303caf',
    secondaryColor: '#ffffff',
    shadowColor: 'rgba(48,60,175,0.3)',
    externalLinks: [
      { name: 'Project page', url: 'https://hyperdragons.alfakingdom.com/' },
      { name: 'Discord', url: 'https://discord.gg/MxrBAD5' },
      { name: 'Telegram', url: 'https://t.me/HyperDragons' },
    ],
  },
  {
    ...mapping.DASABI,
    decimals: 18,
    logo: dasabi,
    coverImage: dasabiCover,
    primaryColor: '#762124',
    secondaryColor: '#ffffff',
    shadowColor: 'rgba(118,33,36,0.3)',
    externalLinks: [
      { name: 'Project page', url: 'https://www.facebook.com/DSB-%E5%A4%A7%E7%81%91%E5%B9%A3-144522902894187/' },
    ],
  },
  {
    ...mapping.GODS_UNCHAINED,
    logo: godsunchained,
    coverImage: godsunchainedCover,
    primaryColor: '#1a1840',
    secondaryColor: '#82e0ff',
    shadowColor: 'rgba(26,24,64,0.3)',
    externalLinks: [
      { name: 'Project page', url: 'https://godsunchained.com/' },
      { name: 'Exchange', url: 'https://opensea.io/assets/godsunchained' },
      { name: 'Discord', url: 'https://discord.gg/DKGr2pW' },
    ],
  },
  {
    ...mapping.CRYPTOGIRLS,
    logo: cryptogirls,
    coverImage: cryptogirlsCover,
    primaryColor: '#746eff',
    secondaryColor: '#58f9eb',
    shadowColor: 'rgba(116,110,255,0.3)',
    externalLinks: [
      { name: 'Project page', url: 'https://cryptogirl.game' },
      { name: 'Discord', url: 'https://discordapp.com/invite/PNZF7Fq' },
    ],
  },
  {
    ...mapping.BLOCKCHAIN_CUTIES,
    entityPrefix: 'Cuties #',
    logo: blockchaincuties,
    coverImage: blockchaincutiesCover,
    primaryColor: '#525079',
    secondaryColor: '#F1B9AA',
    shadowColor: 'rgba(82,80,121,0.2)',
    externalLinks: [
      { name: 'Project page', url: 'https://blockchaincuties.com/' },
      { name: 'OpenSea', url: 'https://opensea.io/category/blockchaincuties' },
      { name: 'Reddit', url: 'https://www.reddit.com/r/blockchaincuties/' },
    ],
  },
  {
    ...mapping.CRYPTO_ARTE,
    logo: cryptoarte,
    coverImage: cryptoarteCover,
    primaryColor: '#CFFFFA',
    secondaryColor: '#157F75',
    shadowColor: 'rgba(21,127,117,0.4)',
    externalLinks: [
      { name: 'Project page', url: 'https://www.cryptoarte.io/' },
      { name: 'OpenSea', url: 'https://opensea.io/category/cryptoarte' },
    ],
  },
  {
    ...mapping.SNOOKARMA,
    decimals: 2,
    logo: snookarma,
    coverImage: snookarmaCover,
    primaryColor: '#3F51B5',
    secondaryColor: '#FFA002',
    shadowColor: 'rgba(61,81,181,0.4)',
    externalLinks: [{ name: 'Project page', url: 'https://www.snookarma.com/' }],
  },
  {
    ...mapping.WAR_RIDERS,
    logo: warriders,
    coverImage: warridersCover,
    primaryColor: '#0b0d23',
    secondaryColor: '#ffffff',
    shadowColor: 'rgba(11,13,35,0.3)',
    externalLinks: [{ name: 'Project page', url: 'https://warriders.com/' }],
  },
  {
    ...mapping.DIGIX_GLOBAL,
    decimals: 9,
    logo: digix,
    coverImage: digixCover,
    primaryColor: '#273144',
    secondaryColor: '#e0d46e',
    shadowColor: 'rgba(39,49,68,0.3)',
    externalLinks: [{ name: 'Project page', url: 'https://digix.global/dgd/' }],
  },
  {
    ...mapping.DUMMY_COIN,
    decimals: 8,
    logo: dummy,
    coverImage: dummyCover,
    primaryColor: '#ffff00',
    secondaryColor: '#000000',
    shadowColor: 'rgba(255,255,0,0.4)',
    externalLinks: [{ name: 'Project page', url: 'http://dummycoin.lol/' }],
  },
  {
    ...mapping.NFTY_TOKEN,
    decimals: 3,
    logo: nfty,
    coverImage: nftyCover,
    primaryColor: '#f1e2ff',
    secondaryColor: '#9b51e0',
    shadowColor: 'rgba(155,81,224,0.3)',
    externalLinks: [{ name: 'Project page', url: 'https://medium.com/nfty-news' }],
    promotionBox: {
      recipient: 'ethereum:0xa6d954d08877f8ce1224f6bfb83484c7d3abf8e9:497', // Flynn
      asset: `${mapping.NFTY_TOKEN.network}:${mapping.NFTY_TOKEN.address}`,
      assetInfo: {
        symbol: 'NFTY',
        decimals: 3,
      },
    },
  },
  {
    ...mapping.JOHN_ORION_YOUNG,
    logo: joy,
    coverImage: joyCover,
    primaryColor: '#F9E957',
    secondaryColor: '#EC2121',
    shadowColor: 'rgba(249,233,87,0.3)',
    externalLinks: [
      { name: 'Project page', url: 'https://johnorionyoung.com/' },
      { name: 'OpenSea', url: 'https://opensea.io/assets/johnorionyoung' },
    ],
    promotionBox: {
      recipient: 'ethereum:0x96313f2c374f901e3831ea6de67b1165c4f39a54:0', // Original Joy
    },
  },
  {
    ...mapping.COINBASE_WALLET_CRYPTO_SWAG,
    logo: coinbase,
    coverImage: coinbaseCover,
    primaryColor: '#0443c2',
    secondaryColor: '#ffffff',
    shadowColor: 'rgba(0,80,255,0.3)',
    externalLinks: [
      { name: 'Project page', url: 'https://wallet.coinbase.com/' },
      { name: 'OpenSea', url: 'https://opensea.io/assets/coinbasewalletcryptoswag' },
    ],
  },
  {
    ...mapping.PERCENT,
    decimals: 1,
    logo: percent,
    coverImage: percentCover,
    primaryColor: '#C8F9FF',
    secondaryColor: '#5B3D9D',
    shadowColor: 'rgba(200,249,255,0.6)',
    externalLinks: [{ name: 'Project page', url: 'https://???.??' }],
    promotionBox: {
      recipient: 'ethereum:0x06012c8cf97bead5deae237070f9587f8e7a266d:134330', // Barbossa
      asset: `${mapping.PERCENT.network}:${mapping.PERCENT.address}`,
      assetInfo: {
        symbol: '％',
        decimals: 1,
      },
    },
  },
]
  .map(({ address, ...rest }) => ({ ...rest, address: address.toLowerCase() }))
  .map((token) => new Token(token));

const sizes = {
  verySmall: { width: '24px', height: '24px' },
  small: { width: '44px', height: '44px' },
  medium: { width: '54px', height: '54px' },
};

export const findClub = (network, address) => {
  return find({ network, address })(clubs) || getCustomClub(network, address);
};

// ToDo take only valid options
export const getCustomClub = (network, address, options) => {
  const shortName = `${address.substr(0, 7).toLowerCase()}...${address.substring(37).toLowerCase()}`;
  return new Token({
    symbol: shortName,
    name: shortName,
    primaryColor: '#EDF1F8',
    secondaryColor: '#1b2438',
    shadowColor: 'rgba(27,36,56,0.09)',
    externalLinks: [],
    ...options,
    isCustom: true,
    is721: false,
    network,
    address: address.toLowerCase(),
    logo: unknowClub,
    coverImage: unknowClubCover,
  });
};

export const TokenImage = ({ token, size = 'small', ...restProps }) => {
  if (!token) {
    return null;
  }

  return <img src={token.logo} alt={token.name} {...sizes[size]} {...restProps} />;
};

export default clubs;
