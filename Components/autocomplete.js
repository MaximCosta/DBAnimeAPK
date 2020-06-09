import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewPropTypes as RNViewPropTypes
} from 'react-native';

import {Searchbar} from "react-native-paper";

const ViewPropTypes = RNViewPropTypes || View.propTypes;

class Autocomplete extends Component {
  static propTypes = {
    ...TextInput.propTypes,
    /**
     * These styles will be applied to the container which
     * surrounds the autocomplete component.
     */
    containerStyle: ViewPropTypes.style,
    /**
     * Assign an array of data objects which should be
     * rendered in respect to the entered text.
     */
    data: PropTypes.array,
    /**
     * Set to `true` to hide the suggestion list.
     */
    hideResults: PropTypes.bool,
    /*
     * These styles will be applied to the container which surrounds
     * the textInput component.
     */
    inputContainerStyle: ViewPropTypes.style,
    /*
     * Set `keyboardShouldPersistTaps` to true if RN version is <= 0.39.
     */
    keyboardShouldPersistTaps: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    /*
     * These styles will be applied to the container which surrounds
     * the result list.
     */
    listContainerStyle: ViewPropTypes.style,
    /**
     * These style will be applied to the result list.
     */
    listStyle: ViewPropTypes.style,
    /**
     * `onShowResults` will be called when list is going to
     * show/hide results.
     */
    onShowResults: PropTypes.func,
    /**
     * method for intercepting swipe on ListView. Used for ScrollView support on Android
     */
    onStartShouldSetResponderCapture: PropTypes.func,
    /**
     * `renderItem` will be called to render the data objects
     * which will be displayed in the result view below the
     * text input.
     */
    renderItem: PropTypes.func,
    keyExtractor: PropTypes.func,
    /**
     * `renderSeparator` will be called to render the list separators
     * which will be displayed between the list elements in the result view
     * below the text input.
     */
    renderSeparator: PropTypes.func,
    /**
     * renders custom TextInput. All props passed to this function.
     */
    renderTextInput: PropTypes.func,
    flatListProps: PropTypes.object
  };

  static defaultProps = {
    data: [],
    defaultValue: '',
    keyboardShouldPersistTaps: 'always',
    onStartShouldSetResponderCapture: () => false,
    renderItem: ({ item }) => <Text>{item}</Text>,
    renderSeparator: null,
    renderTextInput: props => <Searchbar {...props} />,
    flatListProps: {}
  };

  constructor(props) {
    super(props);
    this.state = { data: props.data };
    this.resultList = null;
    this.textInput = null;

    this.onRefListView = this.onRefListView.bind(this);
    this.onRefTextInput = this.onRefTextInput.bind(this);
    this.onEndEditing = this.onEndEditing.bind(this);
  }

  componentWillReceiveProps({ data }) {
    this.setState({ data });
  }

  onEndEditing(e) {
    this.props.onEndEditing && this.props.onEndEditing(e);
  }

  onRefListView(resultList) {
    this.resultList = resultList;
  }

  onRefTextInput(textInput) {
    this.textInput = textInput;
  }

  /**
   * Proxy `blur()` to autocomplete's text input.
   */
  blur() {
    const { textInput } = this;
    textInput && textInput.blur();
  }

  /**
   * Proxy `focus()` to autocomplete's text input.
   */
  focus() {
    const { textInput } = this;
    textInput && textInput.focus();
  }

  /**
   * Proxy `isFocused()` to autocomplete's text input.
   */
  isFocused() {
    const { textInput } = this;
    return textInput && textInput.isFocused();
  }

  

  renderResultList() {
    const { data } = this.state;
    const {
      listStyle,
      renderItem,
      keyExtractor,
      renderSeparator,
      keyboardShouldPersistTaps,
      flatListProps,
      onEndReached,
      onEndReachedThreshold
    } = this.props;

    return (
      <FlatList
        ref={this.onRefListView}
        data={data}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        renderSeparator={renderSeparator}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        style={[styles.list, listStyle]}
        {...flatListProps}
      />
    );
  }

  renderTextInput() {
    const { renderTextInput, style } = this.props;
    const props = {
      style: [styles.input, style],
      ref: this.onRefTextInput,
      onEndEditing: this.onEndEditing,
      ...this.props
    };

    return renderTextInput(props);
  }

  render() {
    const { data } = this.state;
    const {
      containerStyle,
      hideResults,
      inputContainerStyle,
      listContainerStyle,
      onShowResults,
      onStartShouldSetResponderCapture
    } = this.props;
    const showResults = data.length > 0;

    // Notify listener if the suggestion will be shown.
    onShowResults && onShowResults(showResults);

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={[styles.inputContainer, inputContainerStyle]}>
          {this.renderTextInput()}
        </View>
        {!hideResults && (
          <View
            style={[listContainerStyle,styles.result_Container]}
            onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}
          >
            {showResults && this.renderResultList()}
          </View>
        )}
      </View>
    );
  }
}

const border = {
  borderColor: '#b9b9b9',
  borderRadius: 1,
  borderWidth: 1
};

const androidStyles = {
  container: {
    flex: 1
  },
  inputContainer: {
    //...border,
    marginBottom: 0
  },
  list: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    backgroundColor: 'white',
    borderTopWidth: 0,
    margin: 10,
    marginTop: 0
  }
};

const iosStyles = {
  container: {
    zIndex: 1
  },
  inputContainer: {
    ...border
  },
  input: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius:10,
    paddingLeft: 5,
  },
  list: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    backgroundColor: 'white',
    borderTopWidth: 0,
    left: 0,
    position: 'absolute',
    right: 0
  }
};

const styles = StyleSheet.create({
  input: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius:10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius:0,
    paddingLeft: 5,
  },
  result_Container:{
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  ...Platform.select({
    android: { ...androidStyles },
    ios: { ...iosStyles }
  })
});

export default Autocomplete;
