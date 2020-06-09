import { Drawer, Avatar, Divider, Button } from "react-native-paper";
import React from "react";
import { ScrollView, StyleSheet, ImageBackground } from "react-native";
import { SafeAreaView, NavigationActions } from "react-navigation";

class MyDrawer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { navigation } = this.props;
    const route = navigation.getParam("Drawer", { route: "undefined" }).route;
    const navigateActionFavorit = NavigationActions.navigate({
      routeName: "Favorit",
      params: {},
      action: NavigationActions.navigate({ routeName: "Favorit" }),
    });
    const navigateActionSearch = NavigationActions.navigate({
      routeName: "Search",
      params: {},
      action: NavigationActions.navigate({ routeName: "Search" }),
    });
    return (
      <>
        <ScrollView>
          <SafeAreaView forceInset={{ top: 0, horizontal: "never" }}>
            <ImageBackground
              style={{ height: 200 }}
              source={{ uri: "https://i.ibb.co/B3VrgLN/Drawer-Header.jpg" }}
            />
            <Avatar.Text
              size={75}
              label="XD"
              style={{
                alignContent: "center",
                position: "absolute",
                top: 160,
                right: 100,
              }}
            />
            <Divider
              style={{
                height: 2,
                marginTop: 50,
                marginBottom: 10,
                marginLeft: 5,
                marginRight: 5,
              }}
            />

            <Drawer.Item
              label="Search"
              icon="magnify"
              active={route === "Search" || route === "AnimeDetail"}
              onPress={() => {
                this.props.navigation.dispatch(navigateActionSearch);
              }}
            />
            <Drawer.Item
              label="Favorit"
              icon="heart-outline"
              active={route === "Favorit" || route === "FavoritDetail"}
              onPress={() => {
                this.props.navigation.dispatch(navigateActionFavorit);
              }}
            />
            <Drawer.Item
              label="In progress"
              icon="play-circle-outline"
              active={route === "Watch"}
              onPress={() => {
                console.log("Watch");
              }}
            />
            <Drawer.Item
              label="For later"
              icon="timer"
              active={route === "Later"}
              onPress={() => {
                console.log("Later");
              }}
            />

            <Divider
              style={{
                height: 2,
                marginTop: 10,
                marginBottom: 10,
                marginLeft: 5,
                marginRight: 5,
              }}
            />
          </SafeAreaView>
        </ScrollView>
        <Button
          icon="wifi-off"
          mode="contained"
          style={{ margin: 12 }}
          onPress={() => console.log("download")}
          color={"#00a6ff"}
        >
          Offline Mode
        </Button>
      </>
    );
  }
}

const styles = StyleSheet.create({
  filtreinput: {},
});
export default MyDrawer;
