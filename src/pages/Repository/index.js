import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import Proptypes from 'prop-types';

export default class Repository extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repository').name,
  });

  render() {
    const { navigation } = this.props;
    const repository = navigation.getParam('repository');
    return (
      <WebView source={{ uri: repository.html_url }} style={{ flex: 1 }} />
    );
  }
}
Repository.propTypes = {
  navigation: Proptypes.shape({
    getParam: Proptypes.func,
    navigate: Proptypes.func,
  }).isRequired,
};
