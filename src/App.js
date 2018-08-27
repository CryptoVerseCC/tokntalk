import React, { Component } from 'react';
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
  boost,
  getLabels,
  getEntityTokens,
  getBoosts,
  getSupportings,
  getFeedItem,
  getFeedItems,
} from './api';
import { getEntityData } from './entityApi';
import Header from './Header';
import { PositionedFooter } from './Footer';
import { Thread, ModalThread } from './Thread';
import Discover from './Discover';
import { Storage, getEntityInfoForAddress } from './utils';
import { UnreadedMessagesProvider } from './UnreadedMessages';
import WalletModal from './WalletModal';

const {
  REACT_APP_INTERFACE_BOOST_NETWORK: INTERFACE_BOOST_NETWORK,
  REACT_APP_DEFAULT_TOKEN_ID: DEFAULT_TOKEN_ID,
} = process.env;

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
    supportings: {},
    from: undefined,
    provider: undefined,
    waitingForConfirm: 0,
    networkName: undefined,
    http: JSON.parse(this.storage.getItem('http') || 'true'),
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

  saveEntities = () => {
    const toSave = Object.entries(this.state.entityInfo)
      .filter(([, value]) => !value.isAddress)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    this.storage.setItem('entityInfo', JSON.stringify(toSave));
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

    this.setState({ entityInfo: { ...this.state.entityInfo, [entityId]: entityData } }, this.saveEntities);
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
      background_color: undefined,
      id: entityId,
      name: undefined,
      boostValue,
      tokens: entityTokens || [],
      ...entityInfo,
      ...entityLabels,
    };
  };

  getBoosts = async (tokenId, asset) => {
    const boosts = await getBoosts(tokenId, asset);
    // if (this.state.feedId === tokenId || (this.state.feedId === undefined && tokenId === DEFAULT_TOKEN_ID)) {
    this.setState({ boosts });
    // }
  };

  getSupportings = async (tokenId, asset) => {
    const supportings = await getSupportings(tokenId, asset);
    // if (this.state.feedId === tokenId || (this.state.feedId === undefined && tokenId === DEFAULT_TOKEN_ID)) {
    this.setState({ supportings });
    // }
  };

  get isBoostable() {
    return this.state.from && this.state.networkName === INTERFACE_BOOST_NETWORK;
  }

  addWaitingConfirmation = () =>
    this.setState(({ waitingForConfirm }) => ({
      waitingForConfirm: waitingForConfirm + 1,
    }));

  removeConfirmation = () => this.setState(({ waitingForConfirm }) => ({ waitingForConfirm: waitingForConfirm - 1 }));

  sendMessage = async (message) => {
    this.addWaitingConfirmation();
    const { http } = this.state;
    try {
      const temporaryFeedItem = await sendMessage(this.state.activeEntity, message, { http });
      this.setState({
        temporaryFeedItems: [temporaryFeedItem, ...this.state.temporaryFeedItems],
      });
    } catch (e) {}
    this.removeConfirmation();
  };

  reply = async (message, to) => {
    this.addWaitingConfirmation();
    const { http, activeEntity } = this.state;
    try {
      const temporaryReply = await reply(activeEntity, message, to, { http });
      this.setState(
        produce((draft) => {
          draft.temporaryReplies[to] = [...(draft.temporaryReplies[to] || []), temporaryReply];
        }),
      );
    } catch (e) {}
    this.removeConfirmation();
  };

  writeTo = async (message, tokenTo) => {
    this.addWaitingConfirmation();
    const { http, activeEntity } = this.state;
    try {
      const temporaryFeedItem = await writeTo(activeEntity, message, tokenTo, { http });
      this.setState({
        temporaryFeedItems: [temporaryFeedItem, ...this.state.temporaryFeedItems],
      });
    } catch (e) {}
    this.removeConfirmation();
  };

  writeAbout = async (message, club) => {
    this.addWaitingConfirmation();
    const { http, activeEntity } = this.state;
    try {
      const temporaryFeedItem = await writeAbout(activeEntity, message, club, { http });
      this.setState({
        temporaryFeedItems: [temporaryFeedItem, ...this.state.temporaryFeedItems],
      });
    } catch (e) {}
    this.removeConfirmation();
  };

  react = async (to) => {
    this.addWaitingConfirmation();
    const { http, activeEntity } = this.state;
    try {
      const temporaryReaction = await react(activeEntity, to, { http });
      this.setState(
        produce((draft) => {
          draft.temporaryReactions[to] = [...(draft.temporaryReactions[to] || []), temporaryReaction];
        }),
      );
    } catch (e) {}
    this.removeConfirmation();
  };

  label = async (message, labelType) => {
    this.addWaitingConfirmation();
    const { http, activeEntity } = this.state;
    try {
      const temporaryFeedItem = await label(activeEntity, message, labelType, { http });
      this.setState(
        produce((draft) => {
          draft.entityLabels[activeEntity.id][labelType] = temporaryFeedItem.target;
          draft.temporaryFeedItems = [temporaryFeedItem, ...draft.temporaryFeedItems];
        }),
      );
    } catch (e) {}
    this.removeConfirmation();
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
      getFeedItem,
      getFeedItems,
      getMoreFeedItems,
      getNewFeedItems,
      isBoostable,
      getBoosts,
      getSupportings,
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
      supportings,
      http,
      waitingForConfirm,
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
            getFeedItem,
            getFeedItems,
            getMoreFeedItems,
            getNewFeedItems,
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
            supportings,
            getSupportings,
          },
          web3Store: {
            provider,
            from,
            networkName,
            waitingForConfirm,
          },
        }}
      >
        <WalletModal />
        <UnreadedMessagesProvider>{this.props.children}</UnreadedMessagesProvider>
      </Context.Provider>
    );
  }

  static ShowPage = (props) => (
    <React.Fragment>
      <Header />
      <Context.Consumer>
        {({ feedStore, entityStore }) => (
          <ShowPage
            {...props}
            getFeedItems={feedStore.getFeedItems}
            getNewFeedItems={feedStore.getNewFeedItems}
            getEntityInfo={entityStore.getEntityInfo}
          />
        )}
      </Context.Consumer>
      <PositionedFooter />
    </React.Fragment>
  );

  static Discover = (props) => (
    <React.Fragment>
      <Header />
      <Discover {...props} />
      <PositionedFooter />
    </React.Fragment>
  );

  static Index = (props) => (
    <React.Fragment>
      <Header />
      <Context.Consumer>
        {({ feedStore }) => (
          <IndexPage {...props} getFeedItems={feedStore.getFeedItems} getNewFeedItems={feedStore.getNewFeedItems} />
        )}
      </Context.Consumer>
      <PositionedFooter />
    </React.Fragment>
  );

  static Thread = (props) => (
    <React.Fragment>
      <Header />
      <Context.Consumer>
        {({ feedStore }) => <Thread {...props} getFeedItem={feedStore.getFeedItem} />}
      </Context.Consumer>
      <PositionedFooter />
    </React.Fragment>
  );

  static ModalThread = (props) => (
    <Context.Consumer>
      {({ feedStore }) => <ModalThread {...props} getFeedItem={feedStore.getFeedItem} />}
    </Context.Consumer>
  );
}
