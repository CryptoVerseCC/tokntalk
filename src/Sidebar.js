import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { NavLink, withRouter } from 'react-router-dom';

import { A } from './Link';
import Intercom from './Intercom';
import { H4 } from './Components';
import { IfActiveEntity, EntityClubs } from './Entity';
import { DiscoverIcon } from './Icons';
import { TokenImage } from './clubs';
import { UnreadedCount } from './UnreadedMessages';
import { niceScroll } from './cssUtils';
import menuIcon from './img/menu.png';
import { mobileOrTablet } from './utils';
import AppContext from './Context';
import { ExportWalletButton } from './ExportWalletButton';
import { MintTokensButton } from './MintTokensButton';

const SidebarContext = React.createContext();

class SidebarProviderCmp extends Component {
  state = { open: !this.props.overlay && !mobileOrTablet() };

  componentWillReceiveProps(newProps) {
    if (newProps.location.pathname !== this.props.location.pathname && this.props.overlay && mobileOrTablet()) {
      this.setState({ open: false });
    }
  }

  toggle = () => this.setState(({ open }) => ({ open: !open }));

  render() {
    const { children, overlay } = this.props;
    const { open } = this.state;

    return <SidebarContext.Provider value={{ open, overlay, toggle: this.toggle }}>{children}</SidebarContext.Provider>;
  }
}

export const SidebarProvider = withRouter(SidebarProviderCmp);

export const SidebarToggler = () => (
  <SidebarContext.Consumer>
    {({ toggle, open }) => <Burger onClick={toggle} open={open} style={{ marginRight: '15px' }} />}
  </SidebarContext.Consumer>
);

export const SidebarContainer = styled.div`
  display: flex;
  position: relative;
`;

export const SidebarLeft = () => (
  <SidebarContext.Consumer>
    {({ open, overlay }) => (
      <SidebarLeftContainer open={open} overlay={overlay}>
        <LinkItem to="/" icon={<img src={menuIcon} />}>
          Feed
        </LinkItem>
        <LinkItem to="/clubs" icon={<DiscoverIcon />}>
          Clubs
        </LinkItem>
        <IfActiveEntity>
          {(entityId) => (
            <React.Fragment>
              <H4 style={{ padding: '30px 10px' }}>Your Clubs</H4>
              <ClubContainer>
                <EntityClubs id={entityId}>
                  {(clubs) => clubs.map((club) => <Club key={club.address} token={club} />)}
                </EntityClubs>
              </ClubContainer>
            </React.Fragment>
          )}
        </IfActiveEntity>
        <AppContext>
          {({ web3Store: { provider } }) => (provider === 'ToknTalkEmbedded' ? <ExportWalletButton /> : null)}
        </AppContext>
        {/* <AppContext>{({ web3Store: { from } }) => (from ? <MintTokensButton /> : null)}</AppContext> */}
        <SidebarFooter />
      </SidebarLeftContainer>
    )}
  </SidebarContext.Consumer>
);

export const SidebarRight = ({ children }) => (
  <SidebarContext.Consumer>
    {({ open, overlay, toggle }) => (
      <SidebarRightContainer open={open} overlay={overlay}>
        <div className="inner">{children}</div>
        {overlay && open && <div className="overlay" onClick={toggle} />}
      </SidebarRightContainer>
    )}
  </SidebarContext.Consumer>
);

const SidebarRightContainer = styled.div`
  flex: 1;
  position: relative;
  padding-left: 1.5rem;
  padding-top: 30px;

  .inner {
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
  }

  .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 770px) {
    padding-left: unset;

    .inner {
      width: 100vw;
    }
  }
`;

const StyledUnreadedMessages = styled(UnreadedCount)`
  color: #1b2437;
  background: white;
`;

const ClubContainer = styled.div`
  overflow-y: scroll;
  ${niceScroll};
`;

const Club = ({ token }) => (
  <LinkItem
    to={token.isCustom ? `/clubs/${token.network}:${token.address}` : `/clubs/${token.symbol}`}
    icon={<TokenImage token={token} />}
  >
    {token.name}
    <StyledUnreadedMessages token={token} />
  </LinkItem>
);

const SidebarFooter = styled(({ className }) => (
  <div className={className}>
    <div>
      <A href="https://t.me/userfeeds" style={{ marginRight: '8px' }}>
        Telegram
      </A>
      <A href="https://twitter.com/tokntalkclub">Twitter</A>
    </div>
    <Intercom />
  </div>
))`
  margin-top: auto;
  padding: 10px;
`;

const LinkItem = styled(({ children, icon, ...props }) => (
  <NavLink {...props} exact activeClassName="selected">
    <IconContainer>{icon}</IconContainer>
    {children}
  </NavLink>
))`
  display: block;
  flex-shrink: 0;
  padding: 8px 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #1b2437;
  border-radius: 6px;
  &.selected {
    background: #f5f8fd;
  }

  :hover {
    background: #fefffd;
  }

  & img,
  & svg {
    width: 22px;
    height: auto;
    max-height: 22px;
  }
`;

const IconContainer = styled.div`
  margin-right: 10px;
  width: 34px;
  height: 34px;
  background-color: white;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

const SidebarLeftContainer = styled.div`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  position: ${({ overlay }) => (overlay ? 'fixed' : 'sticky')};
  padding: 30px 10px;
  flex-direction: column;
  background-color: #edf1f8;
  top: 60px;
  z-index: 999;
  min-width: 240px;
  height: calc(100vh - 60px);

  @media (max-width: 770px) {
    position: fixed;
    width: 100vw;
  }
`;

const BurgerBarWidth = '20px';
const BurgerBarHeight = '2px';
const BurgerBarSpacing = '6px';

const activeBurgerCss = css`
  .hamburger-menu {
    background: rgba(0, 0, 0, 0);

    &:after {
      top: 0;
      transform: rotate(45deg);
      transition: top 300ms cubic-bezier(0.23, 1, 0.32, 1), transform 300ms 300ms cubic-bezier(0.23, 1, 0.32, 1);
    }

    &:before {
      bottom: 0;
      transform: rotate(-45deg);
      transition: bottom 300ms cubic-bezier(0.23, 1, 0.32, 1), transform 300ms 300ms cubic-bezier(0.23, 1, 0.32, 1);
    }
  }
`;

const Burger = styled((props) => (
  <div {...props}>
    <div className="hamburger-menu" />
  </div>
))`
  & {
    width: ${BurgerBarWidth};
    height: calc(${BurgerBarHeight} + ${BurgerBarSpacing} * 2);
    cursor: pointer;
  }

  .hamburger-menu,
  .hamburger-menu:after,
  .hamburger-menu:before {
    width: ${BurgerBarWidth};
    height: ${BurgerBarHeight};
  }

  .hamburger-menu {
    position: relative;
    transform: translateY(${BurgerBarSpacing});
    background: rgba(0, 0, 0, 1);
    transition: all 0ms 300ms;
  }

  .hamburger-menu:before {
    content: '';
    position: absolute;
    left: 0;
    bottom: ${BurgerBarSpacing};
    background: rgba(0, 0, 0, 1);
    transition: bottom 300ms 300ms cubic-bezier(0.23, 1, 0.32, 1), transform 300ms cubic-bezier(0.23, 1, 0.32, 1);
  }

  .hamburger-menu:after {
    content: '';
    position: absolute;
    left: 0;
    top: ${BurgerBarSpacing};
    background: rgba(0, 0, 0, 1);
    transition: top 300ms 300ms cubic-bezier(0.23, 1, 0.32, 1), transform 300ms cubic-bezier(0.23, 1, 0.32, 1);
  }

  ${({ open }) => open && activeBurgerCss};
`;
