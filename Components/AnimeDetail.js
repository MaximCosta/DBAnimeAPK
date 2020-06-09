import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Animated,
  ImageBackground,
} from "react-native";
import { Dimensions } from "react-native";

import { ScrollView } from "react-native-gesture-handler";
import { Divider } from "react-native-elements";
import AnimeItem from "./AnimeItem";
import { FAB, Provider, Portal, Chip } from "react-native-paper";
import DoubleTap from "./DoubleTap";

class AnimeDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Anime: undefined,
      isLoading: true,
      checked: false,
      relation: undefined,
      Favorit: 0,
      visible: false,
    };
  }

  animatedValue = new Animated.Value(0);

  toggleLike = () => {
    if (!this.state.Favorit) {
      Animated.sequence([
        Animated.spring(this.animatedValue, { toValue: 1 }),
        Animated.spring(this.animatedValue, { toValue: 0 }),
      ]).start();
    }
  };

  renderOverlay = () => {
    const imageStyles = [
      styles.overlayHeart,
      {
        opacity: this.animatedValue,
        transform: [
          {
            scale: this.animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.7, 1.5],
            }),
          },
        ],
      },
    ];

    return (
      <View style={styles.overlay}>
        <Animated.Image
          source={require("../img/heart.png")}
          style={imageStyles}
        />
      </View>
    );
  };

  _displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  }

  updateFavorit() {
    this.props.navigation
      .dangerouslyGetParent()
      .dangerouslyGetParent()
      .state.params.db.transaction((tx) => {
        tx.executeSql(
          "UPDATE Anime set favorit_anime=? where id_anime=?",
          [this.state.Favorit ? "0" : "1", this.state.Anime.id_anime],
          (tx, results) => {
            console.log("Results", results.rowsAffected);
            if (results.rowsAffected > 0) {
              console.log(
                "Success",
                !this.state.Favorit ? "Add to Favorit" : "Remove from favorit"
              );
              this.toggleLike();
              this.setState({
                Favorit: !this.state.Favorit,
              });
            } else {
              console.log("Updation Failed");
            }
          },
          (ero, ero1) => console.log("error1", ero1)
        );
      });
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener("willFocus", () => {
      let id = this.props.navigation.state.params.idAnime;
      this.props.navigation
        .dangerouslyGetParent()
        .dangerouslyGetParent()
        .state.params.db.transaction((tx) => {
          tx.executeSql(
            "select Anime.*, Format.nom_format, Statue.state_statue, group_concat(Genre.nom_genre) as genres, group_concat(distinct Studio.nom_studio) as studio, relatedTD.flower, relatedTD.id_anim from Anime, Format, Statue, Genre, Genre_has_Anime, Studio, Studio_has_Anime LEFT JOIN (select relation_anime.id_anime_primary as id_anim, group_concat(relation_anime.id_anime_relation) as flower from relation_anime group by relation_anime.id_anime_primary )relatedTD ON Anime.id_anime = relatedTD.id_anim WHERE Anime.id_anime = " +
              id +
              " and Anime.format_id_format = Format.id_format and Anime.statue_id_statue = Statue.id_statue and Genre.id_genre = Genre_has_Anime.genre_id_genre and Anime.id_anime = Genre_has_Anime.Anime_id_anime and Studio.id_studio = Studio_has_Anime.studio_id_studio and Anime.id_anime = Studio_has_Anime.Anime_id_anime group by id_anime;",
            [],
            ({ trans }, { rows }) => {
              this.setState(
                {
                  Anime: rows._array[0],
                  Favorit: parseInt(rows._array[0].favorit_anime)
                    ? true
                    : false,
                  isLoading: false,
                  GetRelation: true,
                },
                () => {
                  this.props.navigation
                    .dangerouslyGetParent()
                    .dangerouslyGetParent()
                    .setParams({
                      appBar: {
                        title: this.state.Anime.nom_anime,
                        filter: false,
                      },
                      Drawer: {
                        route: this.props.navigation.state.params.source,
                      },
                    });
                }
              );
            },
            (ero, ero1) => console.log("error1", ero1)
          );
        });
    });
  }

  _displayDetailForAnime = (idAnime) => {
    this.props.navigation.replace(this.props.navigation.state.params.source, {
      idAnime: idAnime,
      source: this.props.navigation.state.params.source,
    });
  };

  _displaySearch = () => {
    this.props.navigation.popToTop();
  };

  _onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    });
  }

  _loveAnime() {
    this.setState({ checked: !this.state.checked });
  }

  _relationGet(listId) {
    this.props.navigation
      .dangerouslyGetParent()
      .dangerouslyGetParent()
      .state.params.db.transaction(
        (tx) => {
          tx.executeSql(
            "select Anime.*,Format.nom_format from Anime,Format where Anime.id_anime IN (" +
              listId.join(",") +
              ") and format_id_format = Format.id_format ORDER BY Anime.id_anime",
            [],
            (_, { rows }) => {
              this.setState({ relation: rows._array, GetRelation: false });
            }
          );
        },
        (ero, ero1) => console.log("error1", ero1)
      );
  }

  _logprint = (idAnime) => {
    console.log(idAnime);
  };

  _relationPrint() {
    return [...new Set(this.state.relation)].map((item) => {
      return (
        <AnimeItem
          key={item.id_anime.toString()}
          Anime={item}
          displayDetailForAnime={this._displayDetailForAnime}
        />
      );
    });
  }

  _displayDrawer() {
    this.props.navigation.openDrawer();
  }

  _displayAnime() {
    const Anime = this.state.Anime;
    if (Anime != undefined) {
      let syn = undefined;
      if (Anime.alternative_titles_synonyms_anime != "") {
        syn = Anime.alternative_titles_synonyms_anime
          .split(";")
          .map(function (ti, index) {
            return { title: ti, id: index };
          });
      }
      if (Anime.flower != null && this.state.GetRelation) {
        this._relationGet(Anime.flower.split(","));
      }
      return (
        <>
          <View style={styles.info_container}>
            <DoubleTap
              onDoubleTap={() => {
                this.updateFavorit();
              }}
            >
              <View
                style={{
                  height: 320,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ImageBackground
                  style={styles.image}
                  source={{ uri: Anime.url_img_anime }}
                  resizeMode="cover"
                  blurRadius={1}
                />
                <Image
                  style={styles.imageOver}
                  source={{ uri: Anime.url_img_anime }}
                  resizeMode="contain"
                />
                {this.renderOverlay()}
              </View>
            </DoubleTap>
          </View>

          <Divider style={{ height: 2 }} />
          <View style={styles.info_title}>
            <Text style={styles.fle}>Titre : </Text>
            <Text style={styles.value_info}>original : {Anime.nom_anime}</Text>
            {Anime.alternative_titles_en_anime ? (
              <Text style={styles.value_info}>
                en : {Anime.alternative_titles_en_anime}
              </Text>
            ) : null}
            {Anime.alternative_titles_ja_anime ? (
              <Text style={styles.value_info}>
                ja : {Anime.alternative_titles_ja_anime}
              </Text>
            ) : null}
            {syn ? (
              <>
                <Text style={styles.fle}>Synonyms : </Text>
                {syn.map((item, index) => {
                  return (
                    <Text key={item.title.toString()} style={styles.value_info}>
                      {item.title}
                    </Text>
                  );
                })}
              </>
            ) : null}
            <Text style={styles.fle}>Genres : </Text>
            <View style={styles.row}>
              {[...new Set(Anime.genres.split(","))].map((v, index) => {
                return (
                  <Chip key={v.toString()} style={styles.chip}>
                    <Text style={styles.chipText}>{v}</Text>
                  </Chip>
                );
              })}
            </View>
            <Text style={styles.fle}>type : </Text>
            <Text style={styles.value_info}>{Anime.nom_format}</Text>

            <Text style={styles.fle}>nombre d'episode : </Text>
            <Text style={styles.value_info}>{Anime.nbepisode_anime}</Text>

            <Text style={styles.fle}>Status : </Text>
            <Text style={styles.value_info}>{Anime.state_statue}</Text>

            <Text style={styles.fle}>Studio : </Text>
            <Text style={styles.value_info}>{Anime.studio}</Text>

            <Text style={styles.fle}>Vue : </Text>
            <Text style={styles.value_info}>{Anime.vue_anime}</Text>
          </View>
          <Divider style={{ height: 2 }} />
          <View>
            <Text>Description : </Text>
            <Text style={styles.desc}>{Anime.desc_anime}</Text>
          </View>
          <Divider style={{ height: 2 }} />
          <View>{!this.state.GetRelation ? this._relationPrint() : null}</View>
        </>
      );
    }
  }

  _onStateChange = ({ open }) => this.setState({ open });

  _displayFAB() {
    if (this.state.Anime != undefined) {
      const { open } = this.state;

      return (
        <Provider>
          <Portal>
            <FAB.Group
              open={open}
              icon={open ? "close" : "plus"}
              fabStyle={styles.fab}
              actions={[
                {
                  icon: "play-outline",
                  style: { backgroundColor: "#43e312" },
                  label: "Add to Watch now",

                  onPress: () => console.log("Add to Watch now"),
                },
                {
                  icon: "timer",
                  style: { backgroundColor: "#0073ff" },
                  label: "Add to Watch later",
                  onPress: () => console.log("Add to Watch later"),
                },
                {
                  icon: this.state.Favorit ? "heart" : "heart-outline",
                  style: { backgroundColor: "red" },
                  label: this.state.Favorit
                    ? "Remove from Favorites"
                    : "Add to Favorite",
                  onPress: () => this.updateFavorit(),
                },
              ]}
              onStateChange={this._onStateChange}
              onPress={() => {
                if (open) {
                  // do something if the speed dial is open
                }
              }}
            />
          </Portal>
        </Provider>
      );
    }
  }

  render() {
    return (
      <>
        <ScrollView style={styles.main_container}>
          {this._displayAnime()}
          {this._displayLoading()}
        </ScrollView>
        {this._displayFAB()}
      </>
    );
  }
}
const screenWidth = Math.round(Dimensions.get("window").width);
const styles = StyleSheet.create({
  header: {
    backgroundColor: "white",
  },
  overlay: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  overlayHeart: {
    tintColor: "#fff",
  },
  fab: {
    backgroundColor: "#347be3",
  },
  main_container: {
    flexDirection: "column",
    backgroundColor: "white",
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
  info_container: {
    flexDirection: "row",
  },
  image: {
    width: screenWidth,
    height: 320,
    //margin: 2,
    //backgroundColor: "gray",
  },
  imageOver: {
    position: "absolute",

    height: 321,
    width: 225,
  },
  header_container: {
    flex: 3,
    flexDirection: "column",
  },
  title_text: {
    fontWeight: "bold",
    fontSize: 26,
    flex: 1,
    flexWrap: "wrap",
    paddingRight: 5,
    textAlign: "center",
  },
  fle: {
    marginLeft: 3,
  },
  value_info: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#666666",
    //textAlign: "right",
    flex: 1,
    marginLeft: 50,
    marginBottom: 5,
  },
  desc: {
    margin: 5,
    fontStyle: "italic",
    color: "#666666",
  },
  title: {
    marginLeft: 50,
    marginBottom: 5,
  },
  chip: {
    backgroundColor: "#2096F3",
    margin: 4,
  },
  chipText: {
    color: "#ffffff",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    //justifyContent: "center",
    paddingHorizontal: 12,
    marginLeft: 30,
    marginBottom: 5,
  },
  image_relation: {
    width: 100,
    height: 142,
    margin: 2,
    backgroundColor: "gray",
  },
});

export default AnimeDetail;
