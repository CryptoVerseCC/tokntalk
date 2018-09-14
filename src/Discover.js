import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import styled, { css } from 'styled-components';
import timeago from 'timeago.js';
import { isAddress } from 'web3-utils';
import flow from 'lodash/flowRight';
import uniqBy from 'lodash/fp/uniqBy';
import find from 'lodash/fp/find';
import sortBy from 'lodash/fp/sortBy';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { pageView } from './Analytics';
import Link, { A, defaultLinkCss } from './Link';
import Feed from './Feed';
import Loader from './Loader';
import AppContext from './Context';
import { HeaderSpacer } from './Header';
import { Storage, validateParams, rewriteCmp, enhanceCustomClubProp } from './utils';
import clubs, { TokenImage, findClub } from './clubs';
import { ConnectedClubForm, CommentForm } from './CommentForm';
import { hasValidContext, getRanking, isValidFeedItem, enhanceFeedItem } from './api';
import { SwitcherIcon, socialIcons, ExclamationMark } from './Icons';
import { FlatContainer, H1, H2, H3, H4, SocialUsername, ContentContainer } from './Components';
import {
  LinkedEntityAvatar,
  IfActiveEntity,
  IfActiveEntityIs,
  IsActiveEntityFromFamily,
  LinkedActiveEntityAvatar,
  ActiveEntityName,
  IfActiveEntityHasToken,
  DoesActiveEntityHasToken,
} from './Entity';
import { getEntityTokens } from './api';
import exportIcon from './img/export.svg';
import { FEED_VERSION_KEY } from './UnreadedMessages';
import FeedTypeSwitcher, { FeedTypeButton } from './FeedTypeSwitcher';
import { PromotionBox } from './promotion/PromotionBox';
import ProfileBox from './ProfileBox';
import { TokenTile, SmallTokenTile } from './TokenTile';
import { Intercom } from './Intercom';
import { StyledButton } from './SendTokens';

const WarningContainerColored = styled.div`
  background: ${({ primaryColor }) => primaryColor};
  color: ${({ secondaryColor }) => secondaryColor};
  display: flex;
  align-items: center;
  font-weight: 600;
  border-radius: 12px;
  padding: 30px;
  @media (max-width: 770px) {
    width: 96%;
    margin-left: 2%;
  }
`;

const WelcomeMessage = styled.div`
  border-radius: 12px;
  padding: 30px;
  background-color: #ecf1f9;
  display: flex;
  align-items: center;
  @media (max-width: 770px) {
    width: 96%;
    margin-left: 2%;
  }
`;

const DisoveryTab = FeedTypeButton;

const DiscoveryContext = React.createContext();

export default class Discover extends Component {
  componentDidMount() {
    pageView();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      pageView();
    }
  }

  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route exact path={`${match.url}/`} component={IndexWithActiveEntity} />
        <Route path={`${match.url}/byToken/:token`} component={rewriteCmp('/byToken', '')} />
        <Route path={`${match.url}/:token`} component={decoratedByTokenIndex} />
      </Switch>
    );
  }
}

const IndexWithActiveEntity = ({ ...props }) => <Index {...props} />;

class Index extends Component {
  static TAB = {
    MOST_ACTIVE: 1,
    NEWEST: 2,
  };

  state = {
    currentTab: Index.TAB.MOST_ACTIVE,
  };

  render() {
    return (
      <ContentContainer>
        <HeaderSpacer style={{ marginBottom: '30px' }} />
        <div className="columns">
          <div className="column is-5">
            <H3 style={{ marginBottom: '0.8rem' }}>Token Clubs</H3>
            <p>Everything to keep up what’s happening around your tokens and to explore new opportunities.</p>
          </div>
          <div className="column is-5">
            <H4>Custom club</H4>
            <H4 style={{ fontSize: '0.8rem' }}>Paste ERC20 contract address</H4>
            <GenerateClub style={{ marginTop: '10px', height: '64px' }} />
          </div>
          <div className="column is-2">
            <H4>Add a club</H4>
            <H4 style={{ fontSize: '0.8rem' }}>Make it visible on Tok'n'Talk</H4>
            <Intercom>
              <AddToken style={{ marginTop: '10px', height: '64px' }}>Add a club</AddToken>
            </Intercom>
          </div>
        </div>
        <div style={{ margin: '15px 0' }}>
          <DisoveryTab
            selected={this.state.currentTab === Index.TAB.MOST_ACTIVE}
            onClick={() => this.setState({ currentTab: Index.TAB.MOST_ACTIVE })}
          >
            Most active
          </DisoveryTab>
          <DisoveryTab
            selected={this.state.currentTab === Index.TAB.NEWEST}
            onClick={() => this.setState({ currentTab: Index.TAB.NEWEST })}
          >
            Newest
          </DisoveryTab>
        </div>
        <div className="columns">
          <div className="column is-12">
            <DiscoveryTabContent
              {...this.props}
              getSortedClubs={discoveryMostActive}
              isActive={this.state.currentTab === Index.TAB.MOST_ACTIVE}
            />
            <DiscoveryTabContent
              {...this.props}
              getSortedClubs={discoveryNewest}
              isActive={this.state.currentTab === Index.TAB.NEWEST}
            />
          </div>
          <div className="column is-3 is-offset-1" />
        </div>
      </ContentContainer>
    );
  }
}

class DiscoveryTabContent extends Component {
  state = {
    loading: true,
    initialized: false,
    score: [],
  };

  async componentDidMount() {
    await this.updateItems(this.props.entity);
  }

  async componentWillReceiveProps(newProps) {
    const entityHasChanged = this.props.entity !== newProps.entity;
    if ((!this.state.initialized || entityHasChanged) && newProps.isActive) {
      await this.updateItems(newProps.entity);
    }
  }

  updateItems = async (entity) => {
    try {
      const items = await this.props.getSortedClubs(entity);
      this.setState({ loading: false, score: items, initialized: true });
    } catch (e) {
      console.warn(e);
      this.setState({ loading: false });
    }
  };

  render() {
    return this.props.isActive ? (
      this.state.loading ? (
        <Loader />
      ) : (
        <div className="columns is-multiline is-mobile">
          {this.renderTiles(this.state.loading ? [] : this.state.score)}
        </div>
      )
    ) : null;
  }

  renderTiles = (tokens) => {
    const { match } = this.props;
    return (
      <React.Fragment>
        {tokens.map((token, index) => (
          <EnhancedTokenTile club={token} index={index} match={match} key={token.address} />
        ))}
      </React.Fragment>
    );
  };
}

const EnhancedTokenTile = enhanceCustomClubProp('club', 'club')(
  ({ club, index, match }) =>
    index < 4 ? (
      <TokenTile
        linkTo={club.isCustom ? `${match.url}/${club.network}:${club.address}` : `${match.url}/${club.symbol}`}
        token={club}
        className="column is-one-quarter-tablet is-12-mobile"
      />
    ) : (
      <SmallTokenTile
        linkTo={club.isCustom ? `${match.url}/${club.network}:${club.address}` : `${match.url}/${club.symbol}`}
        token={club}
        className="column is-one-fifth-tablet is-half-mobile"
      />
    ),
);

const discoveryMostActive = async () => {
  let assets = clubs.map((club) => club.asset);
  const { items } = await getRanking([
    {
      algorithm: 'cryptoverse_clubs_sorted',
      params: { clubs: assets },
    },
  ]);
  return sortByScore(items);
};

const discoveryNewest = async () => {
  let assets = clubs.map((club) => club.asset);
  const { items } = await getRanking([
    {
      algorithm: 'cryptoverse_clubs_sorted_newest',
      params: { clubs: assets },
    },
  ]);
  return sortByScore(items);
};

const sortByScore = (score) => {
  return score.map((item) => findClub(item.id.split(':')[0], item.id.split(':')[1]));
};

class ByTokenIndex extends Component {
  state = {
    loading: false,
    data: {
      latest: [],
      twitter: [],
      facebook: [],
      instagram: [],
      github: [],
    },
  };

  componentDidMount() {
    this.fetchRanking();
  }

  fetchRanking = async () => {
    const { token } = this.props;
    this.setState({ loading: true });
    try {
      const data = await fetch(
        `https://api.userfeeds.io/api/cache-cryptoverse-discovery?asset=${token.network}:${token.address}`,
      ).then((res) => res.json());
      this.setState({ data, loading: false });
    } catch (e) {
      this.setState({ loading: false });
    }
  };

  render() {
    const { match, token } = this.props;
    const { loading, data } = this.state;

    return (
      <DiscoveryContext.Provider value={{ loading, ...data }}>
        <Switch>
          <Route exact path={`${match.url}/`} render={(props) => <ByToken token={token} {...props} />} />
          <Route exact path={`${match.url}/recentlyActive`} component={rewriteCmp('/recentlyActive', '')} />
          <Route exact path={`${match.url}/social`} component={rewriteCmp('/social', '')} />
          <Route exact path={`${match.url}/feed`} component={rewriteCmp('/feed', '')} />
        </Switch>
      </DiscoveryContext.Provider>
    );
  }
}

const ByToken = ({ token }) => (
  <React.Fragment>
    <HeaderSpacer style={{ marginBottom: '30px' }} />
    <ContentContainer>
      <div className="columns">
        <div className="column is-3">
          <ProfileBox
            primaryColor={token.primaryColor}
            avatar={<TokenImage token={token} style={{ margin: '5px', width: '44px', height: '44px' }} />}
            coverImage={token.coverImage}
            coverImageStyle={{
              backgroundSize: '50%',
              backgroundPosition: '100% 50%',
            }}
          >
            <H2>{token.name}</H2>
            <ul style={{ fontWeight: '600' }}>
              <li style={{ marginBottom: '7px' }}>
                <a href={`https://etherscan.io/address/${token.address}`}>Etherscan.io</a>
              </li>
              {token.externalLinks.map((entry) => (
                <li key={entry.name} style={{ marginBottom: '7px' }}>
                  <a href={entry.url}>{entry.name}</a>
                </li>
              ))}
            </ul>
          </ProfileBox>
          {token.promotionBox && (
            <FlatContainer style={{ marginTop: '30px' }}>
              <AppContext.Consumer>
                {({ boostStore: { getBoosts, getSupportings } }) => (
                  <PromotionBox
                    getBoosts={getBoosts}
                    getSupportings={getSupportings}
                    asset={token.promotionBox.asset}
                    assetInfo={token.promotionBox.assetInfo}
                    token={token.promotionBox.recipient}
                    showPurrmoter={true}
                  />
                )}
              </AppContext.Consumer>
            </FlatContainer>
          )}
        </div>
        <div className="column is-6">
          {token.isCustom && <CustomClubInfo style={{ marginBottom: '30px' }} />}
          <IfActiveEntityHasToken token={token} other={<NoTokensWarning token={token} />}>
            {token.is721 ? (
              <IfActiveEntityIs
                asset={`${token.network}:${token.address}`}
                other={<ActiveEntityIsNotFromFamily token={token} />}
              >
                <ClubForm token={token} />
              </IfActiveEntityIs>
            ) : (
              <ClubForm token={token} />
            )}
          </IfActiveEntityHasToken>
          <IsActiveEntityFromFamily asset={`${token.network}:${token.address}`}>
            {(isActiveEntityFromFamily) => (
              <DoesActiveEntityHasToken token={token}>
                {(hasToken) => (
                  <FeedForToken
                    disabledInteractions={!hasToken || (token.is721 && !isActiveEntityFromFamily)}
                    className="feed-for-token"
                    token={token}
                  />
                )}
              </DoesActiveEntityHasToken>
            )}
          </IsActiveEntityFromFamily>
        </div>
        <div className="column is-3">
          <FlatContainer>
            <Members token={token} />
          </FlatContainer>
        </div>
      </div>
    </ContentContainer>
  </React.Fragment>
);

const tabCss = css`
  border-bottom: 2px #f0f1f6 solid;
  font-size: 1rem;
  cursor: pointer;
  outline: none;
  font-weight: 600;
  padding-left: 0;
`;

const selectedTabCss = css`
  cursor: unset;
  color: #264dd9;
  border-bottom: 2px #264dd9 solid;
`;

const MembersTab = styled.div`
  ${tabCss};

  .react-tabs__tab--selected > & {
    ${selectedTabCss};
  }
`;

const Members = ({ token }) => (
  <DiscoveryContext>
    {({ loading, latest, facebook, instagram, github, twitter }) => (
      <React.Fragment>
        <H4>Members</H4>
        <IsLoading>
          <Loader />
        </IsLoading>
        <Tabs>
          <TabList className="columns is-mobile is-marginless">
            <Tab className="column is-half is-paddingless">
              <MembersTab>Active</MembersTab>
            </Tab>
            <Tab className="column is-half is-paddingless">
              <MembersTab>In media</MembersTab>
            </Tab>
          </TabList>
          <TabPanel>
            <RecentlyActive asset={`${token.network}:${token.address}`} limit={9} />
            {!loading && !latest.length && <NoActiveMembers />}
          </TabPanel>
          <TabPanel>
            {!loading &&
              !facebook.length &&
              !instagram.length &&
              !github.length &&
              !twitter.length && <NoActiveMembers />}
            <Social asset={`${token.network}:${token.address}`} social="github" limit={2} />
            <Social asset={`${token.network}:${token.address}`} social="twitter" limit={2} />
            <Social asset={`${token.network}:${token.address}`} social="instagram" limit={2} />
            <Social asset={`${token.network}:${token.address}`} social="facebook" limit={2} />
          </TabPanel>
        </Tabs>
      </React.Fragment>
    )}
  </DiscoveryContext>
);

const NoActiveMembers = styled.div.attrs({ children: () => 'No Active Members' })`
  margin-top: 15px;
  font-weight: 600;
`;

const RecentlyActive = ({ limit = Number.MAX_SAFE_INTEGER }) => (
  <div style={{ marginTop: '15px' }}>
    <DiscoveryContext.Consumer>
      {({ latest }) => (
        <div className="columns is-multiline is-mobile">
          {latest
            .filter(hasValidContext)
            .map(enhanceFeedItem)
            .slice(0, limit)
            .map(({ context, context_info, isFromAddress, author, author_info, created_at }) => (
              <EntityContainer
                key={isFromAddress ? author : context}
                to={`/${isFromAddress ? author : context}`}
                className="column is-12"
              >
                <LinkedEntityAvatar
                  id={isFromAddress ? author : context}
                  entityInfo={isFromAddress ? author_info : context_info}
                  size="medium"
                />
                <EntityInfo>
                  <Link
                    to={`/${isFromAddress ? author : context}`}
                    style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {isFromAddress ? author_info.name : context_info.name}
                  </Link>
                  <Timeago style={{ fontSize: '0.8rem' }}>{timeago().format(created_at)}</Timeago>
                </EntityInfo>
              </EntityContainer>
            ))}
        </div>
      )}
    </DiscoveryContext.Consumer>
  </div>
);

const Social = ({ social, limit = Number.MAX_SAFE_INTEGER }) => {
  const Icon = socialIcons[social];

  return (
    <DiscoveryContext.Consumer>
      {(data) => {
        const items = data[social]
          .filter(hasValidContext)
          .map(enhanceFeedItem)
          .slice(0, limit);

        return (
          <React.Fragment>
            {!data.loading && items.length ? (
              <SocialHeader style={{ marginBottom: '15px', marginTop: '15px' }}>
                <Icon style={{ width: '16px', height: '16px', marginRight: '10px', marginBottom: '-2px' }} />
                {social}
              </SocialHeader>
            ) : null}
            <div className="columns is-multiline">
              {items.map(({ context, context_info, target, isFromAddress, author, author_info }) => (
                <EntityContainer key={isFromAddress ? author : context} className="column is-12">
                  <LinkedEntityAvatar
                    id={isFromAddress ? author : context}
                    entityInfo={isFromAddress ? author_info : context_info}
                    size="medium"
                  />
                  <EntityInfo>
                    <Link to={`/${isFromAddress ? author : context}`}>
                      {isFromAddress ? author_info.name : context_info.name}
                    </Link>
                    <a href={target} target="_blank" rel="noopener">
                      <img alt="" src={exportIcon} style={{ marginRight: '5px' }} />
                      <SocialUsername
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          color: '#1b2437',
                        }}
                        link={target}
                      />
                    </a>
                  </EntityInfo>
                </EntityContainer>
              ))}
            </div>
          </React.Fragment>
        );
      }}
    </DiscoveryContext.Consumer>
  );
};

const SocialHeader = styled.p`
  font-size: 1rem;
  text-transform: capitalize;
  font-weight: 600;
`;

const ClubForm = ({ token }) => (
  <IfActiveEntity>
    {(entityId) => (
      <FormContainer>
        <article className="media">
          <div className="media-left">
            <LinkedActiveEntityAvatar size="large" />
          </div>
          <div className="media-content">
            <div className="content">
              <Link
                to={`/${entityId}`}
                style={{
                  fontFamily: 'AvenirNext',
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '20px',
                  marginTop: '10px',
                }}
              >
                <ActiveEntityName />
              </Link>
              <ConnectedClubForm token={token} Form={CommentForm} />
            </div>
          </div>
        </article>
      </FormContainer>
    )}
  </IfActiveEntity>
);

const isTokenValid = (token) => {
  if (!token) {
    return false;
  }

  if (token.indexOf(':') !== -1) {
    const [network, address] = token.split(':');
    return ['ethereum', 'kovan', 'rinkeby', 'ropsten'].indexOf(network) !== -1 && isAddress(address);
  }

  return !!find({ symbol: token })(clubs);
};

const validateTokenParam = validateParams(
  {
    token: isTokenValid,
  },
  '/404',
);

const mapTokenUrlParam = (Cmp) => (props) => {
  const { token } = props.match.params;
  let club;
  if (token.indexOf(':') === -1) {
    club = find({ symbol: token })(clubs);
  } else {
    const [network, address] = token.split(':');
    club = findClub(network, address);
  }

  return <Cmp token={club} {...props} />;
};

const decoratedByTokenIndex = flow(
  validateTokenParam,
  mapTokenUrlParam,
  enhanceCustomClubProp('token', 'token'),
)(ByTokenIndex);

const IsLoading = ({ children }) => (
  <DiscoveryContext.Consumer>{({ loading }) => loading && children}</DiscoveryContext.Consumer>
);

const CustomClubInfo = styled((props) => (
  <WelcomeMessage {...props}>
    <H1 style={{ fontSize: '3rem' }}>🎨</H1>
    <div style={{ marginLeft: '30px' }}>
      <H3>Let’s customize! </H3>
      <p style={{ fontSize: '1rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
        Add an icon, a name and list the project here. We can also help with a custom interface, ranking algorithms and
        anything you’d like!
      </p>
      <p>
        Contact us at{' '}
        <Link to="/thread/claim:0x35df61fa026498b5254b9dcf669b1f7baef9e09767de2f10c347f3e83e910b7869dae53cd906ee6e78b179053b2e9797eb2bc64fe1f1d0841a27aef222ade2681c">
          Tokntalk
        </Link>{' '}
        or on <A href="https://t.me/joinchat/Ff2fyUYwRF7m3Vxew5UxnA">Telegram.</A>
      </p>
    </div>
  </WelcomeMessage>
))``;

const NoTokensWarning = ({ token }) => (
  <WarningContainerColored
    primaryColor={token.primaryColor}
    secondaryColor={token.secondaryColor}
    className="is-flex"
    style={{ alignItems: 'center' }}
  >
    <ExclamationMark style={{ marginRight: '30px', fill: token.secondaryColor }} />
    <div>
      <p style={{ fontSize: '1.5rem', color: token.secondaryColor, lineHeight: '1.2' }}>
        Acquire {token.name} to participate!
      </p>
      <p style={{ fontSize: '1rem', color: token.secondaryColor, opacity: '0.6' }}>
        Then you'll be able to join the conversation.
      </p>
    </div>
  </WarningContainerColored>
);

const ActiveEntityIsNotFromFamily = ({ token }) => (
  <WarningContainerColored
    primaryColor={token.primaryColor}
    secondaryColor={token.secondaryColor}
    className="is-flex"
    style={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}
  >
    <SwitcherIcon style={{ marginRight: '30px', fill: token.secondaryColor }} />
    <div>
      <p style={{ fontSize: '1.5rem', lineHeight: '1.2' }}>Switch your avatar!</p>
      <p style={{ fontSize: '14px' }}>Change your character to {token.name} in the upper right corner</p>
    </div>
  </WarningContainerColored>
);

export class FeedForToken extends Component {
  storage = Storage();
  state = {
    feedType: 'new',
    loading: false,
    feedLoadingMore: false,
    feedItems: [],
    visibleItemsCount: 0,
  };

  componentDidMount() {
    this.fetchFeed();
  }

  setFeedVersion = async (version) => {
    const { token } = this.props;
    const latestVersions = JSON.parse(this.storage.getItem(FEED_VERSION_KEY));

    this.storage.setItem(
      FEED_VERSION_KEY,
      JSON.stringify({
        ...latestVersions,
        [`${token.network}:${token.address}`]: version,
      }),
    );
  };

  fetchFeed = async () => {
    this.setState({ loading: true });
    const { token } = this.props;
    const { feedType } = this.state;
    const asset = `${token.network}:${token.address}`;
    const version = Date.now();

    try {
      const { items } = await getRanking(
        [
          {
            algorithm: feedType === 'popular' ? 'cryptoverse_club_last_week_popular_feed' : 'cryptoverse_club_feed',
            params: { id: asset },
          },
          {
            algorithm: token.is721 ? 'experimental_filter_origin' : 'experimental_author_balance',
            params: { asset },
          },
        ],
        'api/decorate-with-opensea',
      );
      let feedItems = items.filter(isValidFeedItem).map(enhanceFeedItem);
      if (feedType === 'new') {
        feedItems = feedItems.sort((a, b) => b.created_at - a.created_at);
      }

      this.setState({ loading: false, feedItems, visibleItemsCount: feedItems.length > 10 ? 10 : feedItems.length });
      this.setFeedVersion(version);
    } catch (e) {
      console.warn(e);
      this.setState({ loading: false });
    }
  };

  getMoreItems = () => {
    this.setState(({ visibleItemsCount, feedItems }) => ({
      visibleItemsCount: feedItems.length > visibleItemsCount + 30 ? visibleItemsCount + 30 : feedItems.length,
    }));
  };

  changeFeedType = (feedType) => {
    this.setState({ feedType }, this.fetchFeed);
  };

  render() {
    const { className, style, token, disabledInteractions } = this.props;
    const { loading, feedLoadingMore, feedItems, visibleItemsCount, feedType } = this.state;
    const asset = `${token.network}:${token.address}`;

    return (
      <React.Fragment>
        <FeedTypeSwitcher type={feedType} onChange={this.changeFeedType} style={{ margin: '2em 0' }} />
        <AppContext.Consumer>
          {({ feedStore: { temporaryFeedItems, temporaryReplies, temporaryReactions } }) => {
            const filteredTemporaryFeedItems = temporaryFeedItems
              .filter(({ type, about }) => type === 'post_club' && about === asset)
              .map((item) => ({ ...item, type: 'regular' }));

            // ToDo insert temporary between feedItems if needed
            const allFeedItems = uniqBy('id')([
              ...(feedType === 'popular' ? [] : filteredTemporaryFeedItems),
              ...feedItems.slice(0, visibleItemsCount),
            ]);

            return (
              <Feed
                isClubFeed
                disabledInteractions={disabledInteractions}
                className={className}
                style={style}
                feedItems={allFeedItems}
                feedLoading={loading}
                temporaryReplies={temporaryReplies}
                temporaryReactions={temporaryReactions}
                getMoreFeedItems={this.getMoreItems}
                feedLoadingMore={feedLoadingMore}
              />
            );
          }}
        </AppContext.Consumer>
      </React.Fragment>
    );
  }
}

const FormContainer = styled.div`
  box-shadow: rgba(118, 103, 170, 0.12) 0px 2rem 3rem -1.5rem;
  border-radius: 12px;
  display: block;
  padding: 1.25rem;
  background-color: white;
  @media (max-width: 770px) {
    width: 96%;
    margin-left: 2%;
  }
`;

const EntityContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const EntityInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 15px;
  overflow: hidden;
  margin-top: 2px;
  max-width: 250px;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Timeago = styled.p`
  color: rgb(146, 143, 155);
`;

const AddToken = styled.div`
  ${defaultLinkCss};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: #ffffff;
`;

const GenerateContainer = styled.div`
  display: flex;
  border-radius: 8px;
  padding: 5px;
  background-color: #ffffff;
`;

const GenerateInput = styled.input`
  width: 100%;
  height: 100%;
  background: none;
  outline: none;
  border: none;
`;

const GenerateClub = withRouter(
  class extends Component {
    state = { isValid: false, contractAddress: '' };

    onChange = (e) => {
      const contractAddress = e.target.value;
      this.setState({ isValid: isAddress(contractAddress), contractAddress });
    };

    onGenerate = () => {
      this.props.history.push(`/clubs/ethereum:${this.state.contractAddress}`);
    };

    render() {
      const { style } = this.props;
      const { isValid, contractAddress } = this.state;

      return (
        <GenerateContainer style={style}>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <GenerateInput placeholder="0xAddress" value={contractAddress} onChange={this.onChange} />
          </div>
          <StyledButton disabled={!isValid} onClick={this.onGenerate} style={{ width: 'unset', marginTop: 0 }}>
            Generate
          </StyledButton>
        </GenerateContainer>
      );
    }
  },
);
