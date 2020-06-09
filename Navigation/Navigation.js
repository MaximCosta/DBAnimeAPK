import { createAppContainer, NavigationEvents } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";

import Search from "../Components/Search";
import FilterSearch from "../Components/FilterSearch";
import AnimeDetail from "../Components/AnimeDetail";
import Favorit from "../Components/Favorit";
import MyDrawer from "../Components/Drawer";

import { Appbar } from "react-native-paper";
import React from "react";

const SearchStackNavigator = createStackNavigator(
  {
    Search: { screen: Search },
    FilterSearch: { screen: FilterSearch },
    AnimeDetail: { screen: AnimeDetail },
  },
  {
    initialRouteName: "Search",
    initialRouteParams: { NextPageTF: false },
    headerMode: null,
  }
);

const FavoritSatckNavigator = createStackNavigator(
  {
    Favorit: { screen: Favorit },
    FavoritDetail: { screen: AnimeDetail },
  },
  {
    initialRouteName: "Favorit",
    headerMode: null,
  }
);

const AnimeDrawerNavigator = createDrawerNavigator(
  {
    Search: {
      screen: SearchStackNavigator,
    },
    Favorit: {
      screen: FavoritSatckNavigator,
    },
    Watch: {
      screen: FavoritSatckNavigator,
    },
    Later: {
      screen: FavoritSatckNavigator,
    },
  },
  {
    contentComponent: (props) => <MyDrawer navigation={props.navigation} />,
  }
);

const AppStack = createStackNavigator(
  {
    drawer: {
      screen: AnimeDrawerNavigator,
    },
  },
  {
    initialRouteParams: { db: null },
    headerMode: "float",
    initialRouteName: "drawer",
    defaultNavigationOptions: ({ navigation }) => ({
      gestureResponseDistance: {
        horizontal: 45,
      },
      header: () => (
        <Appbar.Header style={{ backgroundColor: "white" }}>
          <Appbar.Action
            icon={
              navigation.getParam("appBar", { filter: false }).filter
                ? "arrow-left"
                : navigation.state.isDrawerOpen
                ? "close"
                : "menu"
            }
            onPress={() =>
              navigation.getParam("appBar", { filter: false }).filter
                ? navigation.pop()
                : navigation.state.isDrawerOpen
                ? navigation.closeDrawer()
                : navigation.openDrawer()
            }
          />

          <Appbar.Content
            title={navigation.getParam("appBar", { title: "error" }).title}
          />
          {navigation.getParam("Drawer", { route: "undefined" }).route ===
          "Search" ? (
            <Appbar.Action
              icon="filter-outline"
              onPress={() => navigation.navigate("FilterSearch", {})}
            />
          ) : null}
        </Appbar.Header>
      ),
    }),
  }
);

export default createAppContainer(AppStack);
