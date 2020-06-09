import React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

import { Divider } from "react-native-elements";

import Autocomplete from "./autocomplete";

import { Button, Searchbar, FAB, Checkbox } from "react-native-paper";

class FilterSearch extends React.Component {
  constructor(props) {
    super(props);
    this.searchedText = "";
    this.state = {
      CompleteLoad: false,
      FABlabel: "",

      GoTop: false,

      studio: [],
      filtre_Studio: "",

      filtre_Type: [],
      type: undefined,

      filtre_Genre: [],
      genre: undefined,

      filtre_Statue: [],
      statue: undefined,

      filtre_Vue: [],
      vue: [
        { id_vue: 1, nom_vue: "Oui" },
        { id_vue: 2, nom_vue: "En cours" },
        { id_vue: 3, nom_vue: "Non" },
      ],
    };
  }

  _sqlRequest() {
    this.props.navigation
      .dangerouslyGetParent()
      .dangerouslyGetParent()
      .state.params.db.transaction((tx) => {
        tx.executeSql(
          "SELECT Genre.id_genre, Genre.nom_genre FROM Genre ORDER BY Genre.id_genre",
          [],
          (_, { rows }) => {
            this.setState({ genre: rows._array });
          },
          (ero, ero1) => console.log("error1", ero1)
        );
        tx.executeSql(
          "SELECT Format.id_format, Format.nom_format FROM Format ORDER BY Format.id_format",
          [],
          (_, { rows }) => {
            this.setState({ type: rows._array });
          },
          (ero, ero1) => console.log("error1", ero1)
        );
        tx.executeSql(
          "SELECT Statue.id_statue , Statue.state_statue FROM Statue ORDER BY Statue.id_statue ",
          [],
          (_, { rows }) => {
            this.setState({ statue: rows._array });
          },
          (ero, ero1) => console.log("error1", ero1)
        );
        tx.executeSql(
          "SELECT Studio.id_studio, Studio.nom_studio FROM Studio ORDER BY Studio.id_studio",
          [],
          (_, { rows }) => {
            this.setState({ studio: rows._array, CompleteLoad: true });
          },
          (ero, ero1) => console.log("error1", ero1)
        );
      });
  }

  componentDidMount() {
    console.log("filter");
    this.props.navigation.addListener("willFocus", () => {
      this._ParamSet();
      if (!this.state.CompleteLoad) {
        this._sqlRequest();
      }
    });
  }

  _ParamSet() {
    this.setState({ start: false });
    this.props.navigation
      .dangerouslyGetParent()
      .dangerouslyGetParent()
      .setParams({
        appBar: {
          title: "Advanced Search",
          filter: true,
        },
        Drawer: {
          route: "Search",
        },
      });
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

  _GenresArray(id) {
    if (this.state.filtre_Genre.includes(id)) {
      var array = [...this.state.filtre_Genre]; // make a separate copy of the array
      var index = array.indexOf(id);
      array.splice(index, 1);
      this.setState({ filtre_Genre: array });
    } else {
      this.setState({ filtre_Genre: [...this.state.filtre_Genre, id] });
    }
  }

  _TypeArray(id) {
    if (this.state.filtre_Type.includes(id)) {
      var array = [...this.state.filtre_Type]; // make a separate copy of the array
      var index = array.indexOf(id);
      array.splice(index, 1);
      this.setState({ filtre_Type: array });
    } else {
      this.setState({ filtre_Type: [...this.state.filtre_Type, id] });
    }
  }

  _StatueArray(id) {
    if (this.state.filtre_Statue.includes(id)) {
      var array = [...this.state.filtre_Statue]; // make a separate copy of the array
      var index = array.indexOf(id);
      array.splice(index, 1);
      this.setState({ filtre_Statue: array });
    } else {
      this.setState({ filtre_Statue: [...this.state.filtre_Statue, id] });
    }
  }

  _VueArray(id) {
    if (this.state.filtre_Vue.includes(id)) {
      var array = [...this.state.filtre_Vue]; // make a separate copy of the array
      var index = array.indexOf(id);
      array.splice(index, 1);
      this.setState({ filtre_Vue: array });
    } else {
      this.setState({ filtre_Vue: [...this.state.filtre_Vue, id] });
    }
  }

  _displayVue() {
    return (
      <>
        <Text style={styles.titleFilter}>Vue :</Text>
        <View style={styles.row}>
          {this.state.vue.map((v) => {
            return (
              <View style={{ flexDirection: "row", width: 150 }}>
                <Checkbox
                  key={v.id_vue.toString()}
                  onPress={() => this._VueArray(v.id_vue)}
                  status={
                    this.state.filtre_Vue.includes(v.id_vue)
                      ? "checked"
                      : "unchecked"
                  }
                  //selected={this.state.filtre_Genre.includes(v.id_genre)}
                />
                <View style={{ justifyContent: "center" }}>
                  <Text>{v.nom_vue}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </>
    );
  }

  _displayGenre() {
    return (
      <>
        <Text style={styles.titleFilter}>Genre :</Text>
        <View style={styles.row}>
          {this.state.genre.map((v) => {
            return (
              <View style={{ flexDirection: "row", width: 150 }}>
                <Checkbox
                  key={v.id_genre.toString()}
                  onPress={() => this._GenresArray(v.id_genre)}
                  status={
                    this.state.filtre_Genre.includes(v.id_genre)
                      ? "checked"
                      : "unchecked"
                  }
                  //selected={this.state.filtre_Genre.includes(v.id_genre)}
                />
                <View style={{ justifyContent: "center" }}>
                  <Text>{v.nom_genre}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </>
    );
  }

  _displayType() {
    return (
      <>
        <Text style={styles.titleFilter}>Type :</Text>
        <View style={styles.row}>
          {this.state.type.map((v) => {
            return (
              <View style={{ flexDirection: "row", width: 150 }}>
                <Checkbox
                  key={v.id_format.toString()}
                  onPress={() => this._TypeArray(v.id_format)}
                  status={
                    this.state.filtre_Type.includes(v.id_format)
                      ? "checked"
                      : "unchecked"
                  }
                  //selected={this.state.filtre_Genre.includes(v.id_genre)}
                />
                <View style={{ justifyContent: "center" }}>
                  <Text>{v.nom_format}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </>
    );
  }

  _displayStatue() {
    return (
      <>
        <Text style={styles.titleFilter}>Statue :</Text>
        <View style={styles.row}>
          {this.state.statue.map((v) => {
            return (
              <View style={{ flexDirection: "row", width: 150 }}>
                <Checkbox
                  key={v.id_statue.toString()}
                  onPress={() => this._StatueArray(v.id_statue)}
                  status={
                    this.state.filtre_Statue.includes(v.id_statue)
                      ? "checked"
                      : "unchecked"
                  }
                  //selected={this.state.filtre_Genre.includes(v.id_genre)}
                />
                <View style={{ justifyContent: "center" }}>
                  <Text>{v.state_statue}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </>
    );
  }

  _displayStudio() {
    const { filtre_Studio } = this.state;
    const studio = this._findStudio(filtre_Studio);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    return (
      <View style={styles.containerSTD}>
        <Text style={styles.titleFilter}>Studio :</Text>
        <View style={styles.autocompleteContainerSTD}>
          <Autocomplete
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={styles.autocompleteContainerSTD}
            data={
              studio.length === 1 && comp(filtre_Studio, studio[0].nom_studio)
                ? []
                : studio
            }
            defaultValue={filtre_Studio}
            onChangeText={(text) => this.setState({ filtre_Studio: text })}
            placeholder="Enter the Studio Name"
            renderItem={({ item }) => (
              <>
                <TouchableOpacity
                  key={item.id_studio.toString()}
                  onPress={() =>
                    this.setState({ filtre_Studio: item.nom_studio })
                  }
                >
                  <Text style={styles.itemTextSTD}>{item.nom_studio}</Text>
                </TouchableOpacity>
                <Divider />
              </>
            )}
          />
        </View>
      </View>
    );
  }

  _findStudio(filtre_Studio) {
    if (filtre_Studio === "") {
      return [];
    }

    return this.state.studio
      .filter((item) =>
        item.nom_studio.toLowerCase().includes(filtre_Studio.toLowerCase())
      )
      .slice(0, 10);
  }

  _display() {
    if (!this.state.start) {
      return (
        <>
          <ScrollView
            onScroll={({ nativeEvent }) => {
              if (
                this.isCloseToBottom(nativeEvent) &&
                this.state.FABlabel === ""
              ) {
                this.setState({ FABlabel: "Search Advanced Anime" });
              } else if (
                !this.isCloseToBottom(nativeEvent) &&
                this.state.FABlabel === "Search Advanced Anime"
              ) {
                this.setState({ FABlabel: "" });
              }
            }}
            style={styles.main_container}
            ref={(ref) => {
              this._topFlatList = ref;
            }}
          >
            <View style={styles.searche}>
              <Text style={styles.titleFilter}>Title :</Text>
              <Searchbar
                style={styles.textinput}
                placeholder="Titre de l'anime"
                onChangeText={(text) => this._searchTextInputChanged(text)}
                defaultValue={this.searchedText}
              />
            </View>

            <Divider
              style={{
                height: 2,
                marginTop: 10,
                marginBottom: 10,
                marginLeft: 10,
                marginRight: 10,
              }}
            />
            {this._displayStudio()}

            <Divider
              style={{
                height: 2,
                marginTop: 10,
                marginBottom: 10,
                marginLeft: 10,
                marginRight: 10,
              }}
            />
            {this._displayGenre()}

            <Divider
              style={{
                height: 2,
                marginTop: 10,
                marginBottom: 10,
                marginLeft: 10,
                marginRight: 10,
              }}
            />
            {this._displayType()}
            <Divider
              style={{
                height: 2,
                marginTop: 10,
                marginBottom: 10,
                marginLeft: 10,
                marginRight: 10,
              }}
            />
            {this._displayStatue()}
            <Divider
              style={{
                height: 2,
                marginTop: 10,
                marginBottom: 10,
                marginLeft: 10,
                marginRight: 10,
              }}
            />
            {this._displayVue()}
            <View style={{ height: 70 }}></View>
          </ScrollView>
          {this._displayFAB()}
        </>
      );
    }
  }

  isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20
    );
  }

  _displayFAB() {
    return (
      <FAB
        style={styles.fab}
        icon="magnify"
        label={this.state.FABlabel}
        onPress={() => {
          this.props.navigation.pop();
        }}
      />
    );
  }

  _downloadLoading() {
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

  render() {
    return (
      <>
        {!this.state.CompleteLoad ? (
          <>{this._downloadLoading()}</>
        ) : (
          <>{this._display()}</>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  containerSTD: {
    flex: 1,
  },
  autocompleteContainerSTD: {
    padding: 5,
    backgroundColor: "#ffffff",
    borderWidth: 0,
  },
  descriptionContainerSTD: {
    flex: 1,
    justifyContent: "center",
  },
  itemTextSTD: {
    fontSize: 15,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2,
  },
  infoTextSTD: {
    textAlign: "center",
    fontSize: 16,
  },

  main_container: {
    marginTop: 6,
    flex: 1,
    backgroundColor: "white",
  },
  titleFilter: {
    fontWeight: "bold",
    fontSize: 18,
    color: "black",
    //textAlign: "right",
    marginLeft: 10,
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
    backgroundColor: "#40b7f7",
  },
  textinput: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    height: 50,
    borderRadius: 10,
    paddingLeft: 5,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    //justifyContent: "space-between",
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
  searche: { marginTop: 10 },
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

export default FilterSearch;
