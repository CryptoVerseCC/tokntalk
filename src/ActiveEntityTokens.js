import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import Link from './Link';
import { IfActiveEntity, EntityClubs } from './Entity';
import { TokenImage } from './clubs';
import { DiscoverIcon } from './Icons';
import { UnreadedCount } from './UnreadedMessages';

import coinbase from './img/wallets/coinbase.png';
import trust from './img/wallets/trust.svg';
import cipher from './img/wallets/cipher.svg';
import metamask from './img/wallets/metamask.svg';
import tokenpocket from './img/wallets/tokenpocket.png';
import unlockBackground from './img/unlock_bg.png';
import mouse from './img/mouse_click.png';
const { REACT_APP_INTERFACE_VALUE: INTERFACE_VALUE } = process.env;

const ActiveEntityTokens = () => (
  <IfActiveEntity>
    {(activeEntityId) => (
      <EntityClubs id={activeEntityId}>
        {(clubs) => (
          <React.Fragment>
            {clubs.map((club) => (
              <Token key={club.address} token={club} withCounter />
            ))}
            {/* <DiscoverMore>{!clubs.length ? 'Join your first community' : 'Discover more'}</DiscoverMore> */}
          </React.Fragment>
        )}
      </EntityClubs>
    )}
  </IfActiveEntity>
);

export default ActiveEntityTokens;

<<<<<<< HEAD
const YourCommunitiesContainer = styled.div``;

const YourCommunitiesLink = styled(NavLink)`
=======
const YourCommunitiesContainer = styled.div`
  margin-bottom: 1rem;
  background-color: 'transparent';
  padding: 0;
  border-radius: 0;
  background-color: #ecf1f9;
  position: relative;
  padding: 30px;
  border-radius: 12px;
  @media (max-width: 770px) {
    width: 96%;
    margin-left: 2%;
  }
`;

const YourCommunitiesContainerNoActiveEntity = styled.div`
  background: url('./img/unlock_bg.png');
  background-color: #ecf1f9;
  position: relative;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 1rem;
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: bottom center;
  max-height: 260px;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  @media (max-width: 770px) {
    width: 96%;
    max-width: 96%;
    margin-left: 2%;
  }
}}

`;
const YourCommunitiesLink = styled(Link)`
>>>>>>> Prettier
  display: flex;
  align-items: center;
  padding: 7px 0;
  font-size: 1rem;
  color: #1b2437;
  transition: all 0.15s ease;

  :hover {
    color: #264dd9;
    transition: all 0.15s ease;
  }

  &.selected {
    background: #f5f8fd;
  }
`;

const WalletContainer = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #000000;
`;

const WalletIcon = styled.img`
  width: 44px;
  height: 44px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 0.5rem 1rem -0.2rem rgba(27, 36, 55, 0.12);
  margin-bottom: 6px;
  padding: 10px;
`;

const WalletType = styled.span`
  color: #acb7c8;
  font-size: 0.8rem;
  margin-top: -5px;
`;

const NoMetamask = () => (
  <YourCommunitiesContainer style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <p
      style={{
        fontSize: '1.5rem',
        color: '#1B2538',
        fontWeight: 'bold',
      }}
    >
      Get a wallet
    </p>
    <p style={{ marginBottom: '30px' }}>To connect with token owners</p>
    <div className="columns is-multiline is-mobile">
      <div className="column is-one-third ">
        <WalletContainer href="https://metamask.io/">
          <WalletIcon src={metamask} />
          <p>Metamask</p>
          <WalletType>Desktop</WalletType>
        </WalletContainer>
      </div>
      <div className="column is-one-third">
        <WalletContainer href="https://trustwalletapp.com/">
          <WalletIcon src={trust} />
          <p>Trust</p>
          <WalletType>Mobile</WalletType>
        </WalletContainer>
      </div>
      <div className="column is-one-third">
        <WalletContainer href="https://wallet.coinbase.com/">
          <WalletIcon src={coinbase} />
          <p>Coinbase</p>
          <WalletType>Mobile</WalletType>
        </WalletContainer>
      </div>
      <div className="column is-one-third">
        <WalletContainer href="https://www.cipherbrowser.com/">
          <WalletIcon src={cipher} />
          <p>Cipher</p>
          <WalletType>Mobile</WalletType>
        </WalletContainer>
      </div>
      <div className="column is-one-third">
        <WalletContainer href={`https://tokenpocket.github.io/applink?dappUrl=${INTERFACE_VALUE}`}>
          <WalletIcon src={tokenpocket} />
          <p>TokenPocket</p>
          <WalletType>Mobile</WalletType>
        </WalletContainer>
      </div>
    </div>
  </YourCommunitiesContainer>
);

const NoActiveEntity = () => (
  <YourCommunitiesContainerNoActiveEntity>
    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Unlock your wallet</p>
    <span>To connect with token owners alike</span>
    <img style={{ width: '208px', height: 'auto', marginTop: '20px', textAlign: 'center' }} alt="" src={mouse} />
  </YourCommunitiesContainerNoActiveEntity>
);

const DiscoverMore = ({ children, props }) => (
  <div {...props}>
    <Link
      style={{
        display: 'flex',
        alignItems: 'center',
        marginTop: '15px',
        paddingTop: '15px',
        borderTop: '1px solid #dce0eb',
      }}
      to="/clubs"
    >
      <DiscoverIcon
        style={{
          width: '24px',
          height: '24px',
          marginRight: '15px',
        }}
      />
      {children}
    </Link>
  </div>
);

const StyledUnreadedMessages = styled(UnreadedCount)`
  color: #1b2437;
  background: white;
`;

export const Token = ({ token, withCounter = false }) => (
  <YourCommunitiesLink to={token.isCustom ? `/clubs/${token.network}:${token.address}` : `/clubs/${token.symbol}`}>
    <TokenImage token={token} style={{ width: '22px', height: '22px', marginRight: '15px' }} />
    {token.name}
    {withCounter && <StyledUnreadedMessages token={token} />}
  </YourCommunitiesLink>
);
