import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import Proptypes from 'prop-types';

import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  state = {
    stars: [],
    loading: true,
    page: 1,
    refreshing: false,
  };

  async componentDidMount() {
    this.loadPage();
  }

  loadPage = async (page = 1) => {
    const { navigation } = this.props;
    const { stars } = this.state;
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page,
      },
    });

    this.setState({
      stars: page >= 2 ? [...stars, ...response.data] : response.data,
      loading: false,
      page,
      refreshing: false,
    });
  };

  loadMore = () => {
    const { page } = this.state;
    const nextPage = page + 1;
    this.loadPage(nextPage);
  };

  refreshList = () => {
    this.setState({ refreshing: true, stars: [] }, this.loadPage);
  };

  handleNavigate = repository => {
    const { navigation } = this.props;
    navigation.navigate('Repository', { repository });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, refreshing } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <ActivityIndicator size="large" color="#7159c1" />
        ) : (
          <Stars
            onEndReached={this.loadMore}
            onEndReachedThreshold={0.2}
            onRefresh={this.refreshList}
            refreshing={refreshing}
            data={stars}
            keyExtractor={star => String(star.id)}
            loading={loading}
            renderItem={({ item }) => (
              <Starred onPress={() => this.handleNavigate(item)}>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}

User.propTypes = {
  navigation: Proptypes.shape({
    getParam: Proptypes.func,
    navigate: Proptypes.func,
  }).isRequired,
};
