import React, { Component } from 'react';
import 'react-tabs/style/react-tabs.css';
import { Purrmoter } from './Purrmoter';
import Context from '../Context';
import styled from 'styled-components';
import Link from '../Link';
import { EntityAvatar } from '../Entity';
import Catvertised from './Catvertised';
import {
  EntityNameWrapper,
  CatvertisedName,
  CatvertisedScore,
  CatvertisedList,
  CatvertisedItem,
  EntityDescription,
} from './Styles';
import { Tab, Tabs, TabList } from 'react-tabs';

const formatCurrency = (value) => {
  return (value * 10 ** -18).toFixed(3);
};

const CatvertisedItemLink = styled(Link)`
  display: flex;
  align-items: center;
  overflow: hidden;

  @media (max-width: 770px) {
    flex-direction: column;
    align-items: normal;
    text-align: center;
    width: 100%;
  }
`;

const AddAKitty = styled.button`
  margin-top: 30px;
  margin-bottom: 30px;
  align-self: flex-start;
  border: none;
  outline: none;
  background: none;
  color: #264dd9;
  font-size: 1rem;
  padding: 0;
  cursor: pointer;

  @media (max-width: 770px) {
    margin-top: -3px;
    margin-left: 10px;
  }
`;

const PAGE = {
  SUPPORTERS: 0,
  SUPPORTING: 1,
  CATVERTISING: 2,
};

const PromotionTab = (props) => {
  return (
    <p>
      <p>{props.count}</p>
      {props.children}
    </p>
  );
};

export class PromotionBox extends Component {
  state = {
    currentPage: PAGE.SUPPORTERS,
  };

  static Container = styled.div`
    display: flex;
    width: 100%;
    position: relative;
    flex-direction: column;
  `;

  componentDidMount() {
    this.props.getBoosts(this.props.token);
    this.props.getSupportings(this.props.token);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.token !== this.props.token) {
      this.props.getBoosts(nextProps.token);
      this.props.getSupportings(nextProps.token);
    }
  }

  render = () => {
    return (
      <Context.Consumer>
        {({ boostStore: { boosts, supportings } }) => (
          <PromotionBox.Container className={this.props.className}>
            {this.state.currentPage === PAGE.SUPPORTERS &&
              this.renderTabContent(boosts, Object.keys(boosts).length, Object.keys(supportings).length)}
            {this.state.currentPage === PAGE.SUPPORTING &&
              this.renderTabContent(supportings, Object.keys(boosts).length, Object.keys(supportings).length)}
            {this.state.currentPage === PAGE.CATVERTISING && this.renderCatvertising(boosts)}
          </PromotionBox.Container>
        )}
      </Context.Consumer>
    );
  };

  renderTabContent = (items, supportersCount, supportingCount) => {
    return (
      <React.Fragment>
        {this.props.showPurrmoter && <Purrmoter token={this.props.token} />}
        {!this.props.showPurrmoter && this.renderTabs(supportersCount, supportingCount)}
        {this.state.currentPage === PAGE.SUPPORTERS && (
          <AddAKitty onClick={() => this.setState({ currentPage: PAGE.CATVERTISING })}>Promote yourself</AddAKitty>
        )}
        {Object.keys(items).length > 0 && this.renderList(items)}
      </React.Fragment>
    );
  };

  renderList = (items) => {
    return (
      <CatvertisedList>
        {Object.entries(items)
          .sort(([, { score: a }], [, { score: b }]) => b - a)
          .map(([id, { score, context_info: contextInfo }]) => (
            <CatvertisedItem key={id}>
              <CatvertisedItemLink to={`/${id}`}>
                <EntityAvatar size="medium" id={id} entityInfo={contextInfo} />
                <EntityDescription>
                  <CatvertisedName>
                    <EntityNameWrapper>{contextInfo.name}</EntityNameWrapper>
                  </CatvertisedName>
                  <CatvertisedScore>{formatCurrency(score)} ETH</CatvertisedScore>
                </EntityDescription>
              </CatvertisedItemLink>
            </CatvertisedItem>
          ))}
      </CatvertisedList>
    );
  };

  renderTabs = (supportersCount, supportingCount) => {
    return (
      <Tabs selectedIndex={this.state.currentPage} onSelect={(index) => this.setState({ currentPage: index })}>
        <TabList>
          <Tab tabIndex={PAGE.SUPPORTERS}>
            <PromotionTab count={supportersCount}>Supporters</PromotionTab>
          </Tab>
          <Tab tabIndex={PAGE.SUPPORTING}>
            <PromotionTab count={supportingCount}>Supporting</PromotionTab>
          </Tab>
        </TabList>
      </Tabs>
    );
  };

  renderCatvertising = (boosts) => {
    return (
      <Catvertised
        getBoosts={() => boosts}
        token={this.props.token}
        onBackClick={() => this.setState({ currentPage: PAGE.SUPPORTERS })}
      />
    );
  };
}
