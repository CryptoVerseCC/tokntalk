import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';
import find from 'lodash/fp/find';
import isEqual from 'lodash/isEqual';
import produce from 'immer';
import { isAddress } from 'web3-utils';

import Context from './Context';
import IndexPage from './IndexPage';
import ShowPage from './ShowPage';
import {
  getMyEntities,
  getWeb3State,
  sendMessage,
  reply,
  react,
  label,
  writeTo,
  writeAbout,
  getLabels,
  getEntityTokens,
  getBoosts,
  boost,
  getFeedItem,
  getFeedItems,
} from './api';
import { getEntityData } from './entityApi';
import Header from './Header';
import { PositionedFooter } from './Footer';
import FAQPage from './FAQPage';
import { Thread, ModalThread } from './Thread';
import Discover from './Discover';
import NotFound from './NotFound';
import { getEntityInfoForAddress } from './utils';

const {
  REACT_APP_NAME: APP_NAME,
  REACT_APP_INTERFACE_BOOST_NETWORK: INTERFACE_BOOST_NETWORK,
  REACT_APP_DEFAULT_TOKEN_ID: DEFAULT_TOKEN_ID,
} = process.env;

const Storage = (storage = localStorage) => ({
  getItem(key) {
    return storage.getItem(`${APP_NAME}_${key}`);
  },
  setItem(key, value) {
    return storage.setItem(`${APP_NAME}_${key}`, value);
  },
});

export const produceEntities = (myEntities, previousActiveEntity) => {
  const firstEntity = myEntities[0];
  const refreshedPreviousActiveEntity = myEntities.find(
    ({ id }) =>
      !!previousActiveEntity && typeof previousActiveEntity === 'object' ? id === previousActiveEntity.id : false,
  );

  return { myEntities, activeEntity: refreshedPreviousActiveEntity ? refreshedPreviousActiveEntity : firstEntity };
};

export default class App extends Component {
  entityInfoRequests = {};
  entityLabelRequests = {};
  entityTokensRequests = {};
  storage = Storage();

  state = {
    activeEntity: undefined,
    myEntities: [],
    entityInfo: JSON.parse(this.storage.getItem('entityInfo') || '{}'),
    entityLabels: {},
    entityTokens: {},
    feedItem: null,
    feedItemLoading: false,
    feedItems: [],
    shownFeedItemsCount: 10,
    feedVersion: undefined,
    lastFeedItemId: undefined,
    feedLoading: false,
    feedLoadingMore: false,
    feedId: undefined,
    temporaryFeedItems: [],
    temporaryReplies: {},
    temporaryReactions: {},
    boosts: {},
    from: undefined,
    provider: undefined,
    networkName: undefined,
    http: this.storage.getItem('http') || true,
  };

  componentDidMount() {
    this.refreshWeb3State();
    setInterval(this.refreshWeb3State, 2000);
    this.refreshMyEntities();
    setInterval(this.refreshMyEntities, 15000);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.state, nextState);
  }

  refreshMyEntities = async () => {
    this.setState(produceEntities(await getMyEntities(), this.previousActiveEntity()), this.saveActiveEntity);
  };

  previousActiveEntity = () => {
    const activeEntity = this.storage.getItem('activeEntity');
    try {
      return JSON.parse(activeEntity) || null;
    } catch (e) {
      return null;
    }
  };

  changeActiveEntityTo = (newActiveEntity) => {
    if (!this.state.myEntities.find(({ id }) => id === newActiveEntity.id)) {
      return;
    }
    this.setState({ activeEntity: newActiveEntity }, this.saveActiveEntity);
  };

  saveActiveEntity = () => {
    const { activeEntity } = this.state;
    if (activeEntity) this.storage.setItem('activeEntity', JSON.stringify(activeEntity));
  };

  refreshWeb3State = async () => {
    const { from, isListening, provider, networkName } = await getWeb3State();
    if (this.state.from !== from) this.refreshMyEntities();
    this.setState({ from, isListening, provider, networkName });
  };

  getEntityLabels = async (entityId) => {
    if (this.entityLabelRequests[entityId]) return;
    const entityLabelRequest = getLabels(entityId);
    this.entityLabelRequests[entityId] = entityLabelRequest;
    const labels = await entityLabelRequest;
    this.setState({
      entityLabels: { ...this.state.entityLabels, [entityId]: labels },
    });
  };

  getEntityTokens = async (entityId) => {
    if (this.entityTokensRequests[entityId]) return;
    const entityTokensRequests = getEntityTokens(entityId);
    this.entityTokensRequests[entityId] = entityTokensRequests;
    const tokens = await entityTokensRequests;
    this.setState({
      entityTokens: { ...this.state.entityTokens, [entityId]: tokens },
    });
  };

  toggleHttpClaims = () => {
    this.setState({ http: !this.state.http }, () => {
      this.storage.setItem('http', this.state.http);
    });
  };

  getEntityInfo = async (entityId) => {
    if (this.entityInfoRequests[entityId]) return;
    let entityData;
    if (isAddress(entityId)) {
      entityData = getEntityInfoForAddress(entityId);
    } else {
      const entityInfoRequest = getEntityData(entityId);
      this.entityInfoRequests[entityId] = entityInfoRequest;
      entityData = await entityInfoRequest;
    }

    this.setState({ entityInfo: { ...this.state.entityInfo, [entityId]: entityData } }, () => {
      this.storage.setItem('entityInfo', JSON.stringify(this.state.entityInfo));
    });
  };

  getEntity = (entityId) => {
    const entityInfo = this.state.entityInfo[entityId];
    if (!entityInfo) this.getEntityInfo(entityId);
    const entityLabels = this.state.entityLabels[entityId];
    if (!entityLabels) this.getEntityLabels(entityId);
    const entityTokens = this.state.entityTokens[entityId];
    if (!entityTokens) this.getEntityTokens(entityId);
    const boost = this.state.boosts[entityId] || { score: 0 };
    const boostValue = boost.score;

    return {
      image_url: undefined,
      color: undefined,
      id: entityId,
      name: undefined,
      boostValue,
      tokens: entityTokens || [],
      ...entityInfo,
      ...entityLabels,
    };
  };

  getBoosts = async (tokenId) => {
    const boosts = await getBoosts(tokenId);
    if (this.state.feedId === tokenId || (this.state.feedId === undefined && tokenId === DEFAULT_TOKEN_ID)) {
      this.setState({ boosts });
    }
  };

  get isBoostable() {
    return this.state.from && this.state.networkName === INTERFACE_BOOST_NETWORK;
  }

  sendMessage = async (message) => {
    const { http } = this.state;
    const temporaryFeedItem = await sendMessage(this.state.activeEntity, message, { http });
    this.setState({
      temporaryFeedItems: [temporaryFeedItem, ...this.state.temporaryFeedItems],
    });
  };

  reply = async (message, to) => {
    const { http, activeEntity } = this.state;
    const temporaryReply = await reply(activeEntity, message, to, { http });
    this.setState(
      produce((draft) => {
        draft.temporaryReplies[to] = [...(draft.temporaryReplies[to] || []), temporaryReply];
      }),
    );
  };

  writeTo = async (message, tokenTo) => {
    const { http, activeEntity } = this.state;
    const temporaryFeedItem = await writeTo(activeEntity, message, tokenTo, { http });
    this.setState({
      temporaryFeedItems: [temporaryFeedItem, ...this.state.temporaryFeedItems],
    });
  };

  writeAbout = async (message, club) => {
    const { http, activeEntity } = this.state;
    const temporaryFeedItem = await writeAbout(activeEntity, message, club, { http });
    this.setState({
      temporaryFeedItems: [temporaryFeedItem, ...this.state.temporaryFeedItems],
    });
  };

  react = async (to) => {
    const { http, activeEntity } = this.state;
    const temporaryReaction = await react(activeEntity, to, { http });
    this.setState(
      produce((draft) => {
        draft.temporaryReactions[to] = [...(draft.temporaryReactions[to] || []), temporaryReaction];
      }),
    );
  };

  label = async (message, labelType) => {
    const { http, activeEntity } = this.state;
    const temporaryFeedItem = await label(activeEntity, message, labelType, { http });
    this.setState(
      produce((draft) => {
        draft.entityLabels[activeEntity][labelType] = temporaryFeedItem.target;
        draft.temporaryFeedItems = [temporaryFeedItem, ...draft.temporaryFeedItems];
      }),
    );
  };

  getFeedItem = async (claimId) => {
    const { feedItems } = this.state;
    try {
      const feedItem = find({ id: claimId })(feedItems);
      this.setState({ feedItemLoading: true, feedItemId: claimId, feedItem }, async () => {
        const feedItem = await getFeedItem({ claimId });
        this.setState({ feedItemLoading: false, feedItem });
      });
    } catch (e) {
      console.warn('Failed to download feedItems');
    }
  };

  getFeedItems = async (entityId) => {
    try {
      this.setState({ feedLoading: true, feedId: entityId }, async () => {
        const { feedItems, total: feedItemsCount, version: feedVersion, lastItemId } = await getFeedItems({
          entityId,
          size: 10,
        });
        if (this.state.feedId !== entityId) return;
        this.setState({ feedLoading: false, feedItems, feedItemsCount, feedVersion, lastFeedItemId: lastItemId });
      });
    } catch (e) {
      console.warn('Failed to download feedItems');
    }
  };

  getNewFeedItems = async (entityId) => {
    try {
      // ToDo
      const { feedVersion: lastVersion, lastFeedItemId } = this.state;

      const { feedItems: newFeedItems, total: feedItemsCount, version: feedVersion } = await getFeedItems({
        entityId,
        lastVersion,
        oldestKnown: lastFeedItemId,
      });

      const addedFeedItems = newFeedItems.map((item) => ({ ...item, added: true }));
      if (this.state.feedId !== entityId) return;

      // ToDo sort by date
      this.setState(({ feedItems }) => ({ feedVersion, feedItems: [...addedFeedItems, ...feedItems], feedItemsCount }));
    } catch (e) {
      console.warn('Failed to download feedItems');
    }
  };

  getMoreFeedItems = async (entityId) => {
    if (this.state.feedLoadingMore || this.state.feedItemsCount <= this.state.feedItems.length) return;
    try {
      this.setState({ feedLoadingMore: true }, async () => {
        const { lastFeedItemId } = this.state;
        const { feedItems: moreFeedItems, total: feedItemsCount, lastItemId } = await getFeedItems({
          entityId,
          size: 30,
          oldestKnown: lastFeedItemId,
        });

        if (this.state.feedId !== entityId) return;

        this.setState(({ feedItems }) => ({
          lastFeedItemId: lastItemId,
          feedLoadingMore: false,
          feedItems: [...feedItems, ...moreFeedItems], // ToDo
          feedItemsCount,
        }));
      });
    } catch (e) {
      console.warn('Failed to download more feedItems');
    }
  };

  render() {
    const {
      changeActiveEntityTo,
      getEntityInfo,
      sendMessage,
      reply,
      writeTo,
      writeAbout,
      react,
      label,
      getEntity,
      getMoreFeedItems,
      isBoostable,
      getBoosts,
      toggleHttpClaims,
    } = this;
    const {
      activeEntity,
      myEntities,
      feedItem,
      feedItemLoading,
      feedItems,
      isGettingMoreFeedItems,
      feedLoading,
      entityInfo,
      temporaryFeedItems,
      temporaryReplies,
      temporaryReactions,
      allowAddingFeedItem,
      provider,
      from,
      networkName,
      boosts,
      http,
    } = this.state;

    return (
      <Context.Provider
        value={{
          appStore: {
            toggleHttpClaims,
            http,
          },
          entityStore: {
            getEntity,
            myEntities,
            changeActiveEntityTo,
            activeEntity,
            entityInfo,
            getEntityInfo,
          },
          feedStore: {
            sendMessage,
            reply,
            writeTo,
            writeAbout,
            react,
            label,
            feedItem,
            feedItemLoading,
            feedItems,
            feedLoading,
            isGettingMoreFeedItems,
            getMoreFeedItems,
            temporaryFeedItems,
            temporaryReplies,
            temporaryReactions,
            allowAddingFeedItem,
          },
          boostStore: {
            boost,
            boosts,
            isBoostable,
            getBoosts,
          },
          web3Store: {
            provider,
            from,
            networkName,
          },
        }}
      >
        <Router>
          <React.Fragment>
            <Header />
            <RoutesWithRouter
              getFeedItem={this.getFeedItem}
              getFeedItems={this.getFeedItems}
              getNewFeedItems={this.getNewFeedItems}
              getEntityInfo={this.getEntityInfo}
            />
            <PositionedFooter />
          </React.Fragment>
        </Router>
      </Context.Provider>
    );
  }
}

class Routes extends Component {
  previousLocation = this.props.location;

  componentWillUpdate(nextProps) {
    const { location } = this.props;
    if (nextProps.history.action !== 'POP' && (!location.state || !location.state.modal)) {
      this.previousLocation = location;
    }
  }

  renderIndexPage = (props) => (
    <IndexPage {...props} getFeedItems={this.props.getFeedItems} getNewFeedItems={this.props.getNewFeedItems} />
  );

  renderFaqPage = (props) => <FAQPage />;

  renderShowPage = (props) => (
    <ShowPage
      {...props}
      getFeedItems={this.props.getFeedItems}
      getNewFeedItems={this.props.getNewFeedItems}
      getEntityInfo={this.props.getEntityInfo}
    />
  );

  renderThread = (props) => <Thread {...props} getFeedItem={this.props.getFeedItem} />;

  renderModalThread = (props) => <ModalThread {...props} getFeedItem={this.props.getFeedItem} />;

  renderDiscover = (props) => <Discover {...props} />;

  render() {
    const { renderModalThread, renderShowPage, renderFaqPage, renderIndexPage, renderThread, renderDiscover } = this;
    const { location } = this.props;
    const isModal = !!(location.state && location.state.modal && this.previousLocation !== location);

    return (
      <React.Fragment>
        <Switch location={isModal ? this.previousLocation : location}>
          <Route exact path="/" component={renderIndexPage} />
          <Route exact path="/faq" component={renderFaqPage} />
          <Route path="/discover" component={renderDiscover} />
          <Route path="/404" component={NotFound} />
          <Route exact path="/:entityId" component={renderShowPage} />
          {!isModal ? <Route exact path="/thread/:claimId" component={renderThread} /> : null}
        </Switch>
        {isModal ? <Route exact path="/thread/:claimId" component={renderModalThread} /> : null}
      </React.Fragment>
    );
  }
}

const RoutesWithRouter = withRouter(Routes);
