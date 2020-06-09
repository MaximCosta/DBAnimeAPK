import React from "react";
import {
  StyleSheet,
  View,
  Button,
  Text,
  ActivityIndicator,
  Image,
} from "react-native";
import {
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native-gesture-handler";

import {
  Chip,
  Searchbar,
  FAB,
  IconButton,
  Button as PaperButton,
} from "react-native-paper";

import AnimeItem from "./AnimeItem";

import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.searchedText = "";

    this.state = {
      anime: [],
      isLoading: undefined,
      name: [],
      start: true,
      filtreText: "pas de filtre",
      GoTop: false,
      totalPage: 0,
      totalPageArr: [],
      totalAnime: 0,
      currentPage: 0,

      studio: [],
      filtre_Studio: "",
      isHidden_Studio: false,

      isHidden_Type: false,
      filtre_Type: [],
      type: undefined,

      isHidden_Genre: false,
      filtre_Genre: [],
      genre: undefined,

      isHidden_Statue: false,
      filtre_Statue: [],
      statue: undefined,

      isHidden_Vue: false,
      filtre_Vue: [],
      vue: [
        { id_vue: 1, nom_vue: "Oui" },
        { id_vue: 2, nom_vue: "En cours" },
        { id_vue: 3, nom_vue: "Non" },
      ],
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener("willFocus", () => {
      if (
        this.props.navigation.dangerouslyGetParent().dangerouslyGetParent()
          .state.params.db === null
      ) {
        FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite").then(
          (info) => {
            if (!info.exists) {
              FileSystem.makeDirectoryAsync(
                FileSystem.documentDirectory + "SQLite/"
              );
              this._downloadStart();
            } else {
              FileSystem.getInfoAsync(
                FileSystem.documentDirectory + "SQLite/mabase4.db"
              ).then((info) => {
                if (!info.exists) {
                  this._downloadStart();
                } else {
                  this._finishStart();
                }
              });
            }
          }
        );
      } else {
        this._ParamSet();
      }
    });
  }

  _downloadStart() {
    console.log("download");
    this._downloadSet();
    this._download();
  }

  _downloadSet() {
    this.props.navigation
      .dangerouslyGetParent()
      .dangerouslyGetParent()
      .setParams({
        appBar: {
          title: "Download File",
          filter: false,
        },
        Drawer: {
          route: "Search",
        },
      });
  }

  _finishStart() {
    this.props.navigation
      .dangerouslyGetParent()
      .dangerouslyGetParent().state.params.db = SQLite.openDatabase(
      "mabase4.db"
    );
    this.setState({ start: false });
    this._ParamSet();
  }

  _ParamSet() {
    this.setState({ start: false });
    this.props.navigation
      .dangerouslyGetParent()
      .dangerouslyGetParent()
      .setParams({
        appBar: {
          title: "Search",
          filter: false,
        },
        Drawer: {
          route: "Search",
        },
      });
  }

  _download() {
    FileSystem.downloadAsync(
      "http://77.147.76.28:5000/return-files/",
      FileSystem.documentDirectory + "SQLite/mabase4.db"
    )
      .then(({ uri }) => {
        console.log("Finished downloading to ", uri);
        this._finishStart();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _loadAnimes() {
    if (this.searchedText.length > 0) {
      this.setState({ isLoading: true });
      this._update(this.searchedText);
    }
  }

  //TODO: change methode
  _update(text) {
    this.props.navigation
      .dangerouslyGetParent()
      .dangerouslyGetParent()
      .state.params.db.transaction((tx) => {
        tx.executeSql(
          "select count(Anime.id_anime) as animeRows from Anime where nom_anime LIKE '%" +
            text +
            "%' ",
          [],
          (_, { rows }) => {
            this.setState({
              totalPage: Math.ceil(parseInt(rows._array[0].animeRows) / 20),
              totalAnime: parseInt(rows._array[0].animeRows),
              totalPageArr: [
                ...Array(
                  Math.ceil(parseInt(rows._array[0].animeRows) / 20)
                ).keys(),
              ],
            });
            this._requestSQLITE(text, 0);
          },
          (ero, ero1) => console.log("error1", ero1)
        );
      });
  }

  _requestSQLITE(text, offset) {
    this.props.navigation
      .dangerouslyGetParent()
      .dangerouslyGetParent()
      .state.params.db.transaction((tx) => {
        tx.executeSql(
          "select Anime.*,Format.nom_format from Anime,Format where nom_anime LIKE '%" +
            text +
            "%' and format_id_format = Format.id_format ORDER BY Anime.id_anime LIMIT 20 OFFSET " +
            offset,
          [],
          (_, { rows }) => {
            this.setState({
              anime: rows._array,
              isLoading: false,
            });
            this.props.navigation
              .dangerouslyGetParent()
              .dangerouslyGetParent()
              .setParams({
                appBar: {
                  title: "Search",
                  filter: false,
                  page:
                    (this.state.currentPage + 1).toString() +
                    "/" +
                    this.state.totalPage,
                },
              });
          },
          (ero, ero1) => console.log("error1", ero1)
        );
      });
  }

  _searchAnimes() {
    this.setState(
      {
        anime: [],
      },
      () => {
        this._loadAnimes();
      }
    );
  }

  _searchTextInputChanged(text) {
    this.searchedText = text;
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
    this.props.navigation.navigate("AnimeDetail", {
      idAnime: idAnime,
      source: "AnimeDetail",
    });
  };

  _displayNextPage(NextPage) {
    this.setState(
      {
        currentPage: NextPage,
      },
      () => {
        this._requestSQLITE(
          this.searchedText,
          parseInt(this.state.currentPage * 20)
        );
        this._topFlatList.scrollTo({ x: 0, y: 0, Animated: true });
      }
    );
  }

  _noAnime() {
    if (
      this.state.anime.length === 0 &&
      !this.state.isLoading &&
      this.state.isLoading != undefined
    ) {
      return (
        <View style={styles.loading_container}>
          <Text style={styles.text_notfind}>Anime not find</Text>
          <Image style={styles.image} source={require("../img/NotFind.png")} />
        </View>
      );
    }
  }

  _display() {
    if (!this.state.start) {
      return (
        <>
          <ScrollView
            onScroll={(event) => {
              this._handleScroll(event);
            }}
            style={styles.main_container}
            ref={(ref) => {
              this._topFlatList = ref;
            }}
          >
            <View style={styles.searche}>
              <Searchbar
                style={styles.textinput}
                placeholder="Titre de l'anime"
                onChangeText={(text) => this._searchTextInputChanged(text)}
                onSubmitEditing={() => this._searchAnimes()}
                defaultValue={this.searchedText}
              />

              <IconButton
                icon="magnify"
                color="white"
                size={29}
                onPress={() => this._searchAnimes()}
                style={{
                  //alignItems: "flex-end",
                  backgroundColor: "#40b7f7",
                }}
              />
            </View>

            {this._totalPages()}

            <FlatList
              data={this.state.anime}
              keyExtractor={(item) => item.id_anime.toString()}
              renderItem={({ item }) => (
                <AnimeItem
                  Anime={item}
                  displayDetailForAnime={this._displayDetailForAnime}
                />
              )}
            />
            {this._totalPages()}
            {this._noAnime()}
            {this._displayLoading()}
          </ScrollView>
          {this._displayFAB()}
        </>
      );
    }
  }

  /*

   {this.state.anime.length ? (
              <Text>Résulats : {this.state.totalAnime}</Text>
            ) : null}

  */

  _totalPages() {
    const { totalPageArr, currentPage } = this.state;
    return (
      <>
        {this.state.anime.length && this.state.totalPage > 1 ? (
          <View
            style={{
              justifyContent: "center",
              flexDirection: "row",
              padding: 10,
            }}
          >
            {[
              ...new Set([
                ...totalPageArr.slice(
                  currentPage < 2 ? 0 : currentPage - 2,
                  currentPage
                ),
                ...totalPageArr.slice(currentPage, currentPage + 3),
              ]),
            ].map((v) => {
              return (
                <TouchableOpacity
                  style={
                    currentPage === v
                      ? styles.SwitchPageCurrent
                      : styles.SwitchPage
                  }
                  key={v.toString()}
                  onPress={
                    currentPage === v
                      ? null
                      : this._displayNextPage.bind(this, v)
                  }
                >
                  <Text>{v + 1}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
      </>
    );
  }

  _handleScroll(event) {
    if (event.nativeEvent.contentOffset.y >= 160 && !this.state.GoTop) {
      this.setState({ GoTop: true });
    } else if (event.nativeEvent.contentOffset.y < 160 && this.state.GoTop) {
      this.setState({ GoTop: false });
    }
  }

  _displayFAB() {
    if (this.state.GoTop)
      return (
        <FAB
          style={styles.fab}
          icon="arrow-up"
          onPress={() =>
            this._topFlatList.scrollTo({ x: 0, y: 0, Animated: true })
          }
        />
      );
  }

  _downloadLoading() {
    if (this.state.start) {
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

  render() {
    return (
      <>
        {this._downloadLoading()}
        {this._display()}
      </>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    marginTop: 6,
    flex: 1,
    backgroundColor: "white",
  },
  SwitchPage: {
    margin: 5,
    width: 28,
    height: 30,
    backgroundColor: "#dedede",
    borderWidth: 1,
    borderRadius: 2,
    //borderColor: "Black",
    fontSize: 30,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  SwitchPageCurrent: {
    marginTop: 3,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    width: 30,
    height: 34,
    backgroundColor: "#00ffc8",
    borderWidth: 1,
    borderRadius: 2,
    //borderColor: "Black",
    fontSize: 30,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  textinput: {
    marginLeft: 3,
    marginRight: 3,
    marginBottom: 5,
    height: 50,
    borderRadius: 10,
    paddingLeft: 5,
    flex: 1,
  },
  textinputStudio: {
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
  searche: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
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
