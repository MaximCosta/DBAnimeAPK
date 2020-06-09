import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

class AnimeItem extends React.Component {
  render() {
    const { Anime, displayDetailForAnime } = this.props;
    return (
      <TouchableOpacity
        style={styles.main_container}
        onPress={() => displayDetailForAnime(Anime.id_anime)}
      >
        <Image style={styles.image} source={{ uri: Anime.url_img_anime }} />
        <View style={styles.content_container}>
          <View style={styles.header_container}>
            <Text style={styles.title_text}>{Anime.nom_anime}</Text>
            <Text style={styles.nb_episode}>{Anime.nbepisode_anime}</Text>
          </View>
          <View style={styles.description_container}>
            <Text style={styles.description_text} numberOfLines={6}>
              {Anime.desc_anime}
            </Text>
          </View>
          <View style={styles.tv_container}>
            <Text style={styles.vue_text}>vue : {Anime.vue_anime}</Text>
            <Text style={styles.type_text}>{Anime.nom_format}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    height: 190,
    flexDirection: "row",
    backgroundColor: "white",
    margin: 5,
    borderRadius: 5,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
  },
  image: {
    width: 120,
    height: 180,
    margin: 5,
    backgroundColor: "gray",
  },
  content_container: {
    flex: 1,
    margin: 5,
  },
  header_container: {
    flex: 3,
    flexDirection: "row",
  },
  title_text: {
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
    flexWrap: "wrap",
    paddingRight: 5,
  },
  nb_episode: {
    fontWeight: "bold",
    fontSize: 26,
    color: "#666666",
  },
  description_container: {
    flex: 7,
  },
  description_text: {
    fontStyle: "italic",
    color: "#666666",
  },
  tv_container: {
    flexDirection: "row",
  },
  type_text: {
    textAlign: "right",
    fontSize: 15,
    flex: 1,
  },
  vue_text: {
    fontSize: 15,
    flex: 1,
  },
});

export default AnimeItem;
