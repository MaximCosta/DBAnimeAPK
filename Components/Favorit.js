import React from "react";
import { StyleSheet, View, Text, ActivityIndicator, Image } from "react-native";
import { ScrollView, FlatList } from "react-native-gesture-handler";

import AnimeItem from "./AnimeItem";

import * as SQLite from "expo-sqlite";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.searchedText = "";
    this.state = {
      anime: [],
      isLoading: undefined,
      name: [],
      start: true,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener("willFocus", () => {
      this.setState({ start: false }, () => {
        this.props.navigation
          .dangerouslyGetParent()
          .dangerouslyGetParent()
          .state.params.db.transaction((tx) => {
            tx.executeSql(
              "select Anime.*,Format.nom_format from Anime,Format where Anime.favorit_anime = '1' and format_id_format = Format.id_format ORDER BY Anime.id_anime",
              [],
              (_, { rows }) => {
                this.setState({ anime: rows, isLoading: false });
              },
              (ero, ero1) => console.log("error1", ero1)
            );
          });
      });
      console.log("read");
      this.props.navigation
        .dangerouslyGetParent()
        .dangerouslyGetParent()
        .setParams({
          appBar: {
            title: "Favorit",
            filter: false,
          },
          Drawer: {
            route: "Favorit",
          },
        });
    });
  }

  _displayLoading() {
    if (this.state.isLoading || this.state.start) {
      return (
        <ActivityIndicator
          size="large"
          style={{
            //position: "absolute",
            top: 50,
            flex: 1,
            right: 0,
            left: 0,
            bottom: 0,
            height: 600,
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      );
    }
  }

  _displayDetailForAnime = (idAnime) => {
    this.props.navigation.navigate("FavoritDetail", {
      idAnime: idAnime,
      source: "FavoritDetail",
    });
  };

  _noAnime() {
    if (
      this.state.anime.length === 0 &&
      !this.state.isLoading &&
      this.state.isLoading != undefined
    ) {
      return (
        <View style={styles.loading_container}>
          <Text style={styles.text_notfind}>no anime in favorit</Text>
          <Image
            style={styles.image}
            source={{ uri: "https://i.ibb.co/4dH94Z3/NotFind.png" }}
          />
        </View>
      );
    }
  }

  _display() {
    if (!this.state.start) {
      return (
        <ScrollView style={styles.main_container}>
          <FlatList
            data={this.state.anime._array}
            keyExtractor={(item) => item.id_anime.toString()}
            renderItem={({ item }) => (
              <AnimeItem
                Anime={item}
                displayDetailForAnime={this._displayDetailForAnime}
              />
            )}
          />
          {this._noAnime()}
          {this._displayLoading()}
        </ScrollView>
      );
    }
  }

  render() {
    return <>{this._display()}</>;
  }
}

const styles = StyleSheet.create({
  main_container: {
    marginTop: 6,
    flex: 1,
  },
  textinput: {
    marginLeft: 3,
    marginRight: 3,
    marginBottom: 5,
    height: 50,

    borderRadius: 10,
    paddingLeft: 5,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    justifyContent: "space-around",
  },
  filtreinput: {},
  searchinput: {},
  filtreText: {
    padding: 7,
  },
  loading_container: {
    //position: "absolute",
    flex: 1,
    left: 0,
    right: 0,
    top: 50,
    bottom: 0,
    //width: 250,
    height: 600,
    alignItems: "center",
    justifyContent: "center",
  },
  text_notfind: {
    fontSize: 35,
    margin: 20,
  },
  image: {
    width: 244,
    height: 408,
    //backgroundColor: "gray",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 5,
    flex: 1,
  },
  chip: {
    backgroundColor: "#2096F3",
    margin: 4,
  },
  chip_selected: {
    backgroundColor: "green",
    margin: 4,
  },
  chipText: {
    color: "#ffffff",
  },

  autocompleteContainer: {
    padding: 5,
    maxHeight: 500,
  },
  autocompleteContainer_Result: {
    padding: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 10,
  },
  StudioFilter: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "black",
    //borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  StudioFilter_selected: {
    padding: 10,
    borderTopColor: "black",
    borderRadius: 10,
    backgroundColor: "#bababa",
  },
});

export default Search;
