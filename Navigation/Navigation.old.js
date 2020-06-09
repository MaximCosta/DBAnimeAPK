import { NavigationContainer, DrawerActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  useIsDrawerOpen,
} from "@react-navigation/drawer";

import Search from "../Components/Search";
import AnimeDetail from "../Components/AnimeDetail";
import Favorit from "../Components/Favorit";
import MyDrawer from "../Components/Drawer";

import { Appbar } from "react-native-paper";
import React from "react";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function SearchView() {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="Search">
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="AnimeDetail" component={AnimeDetail} />
    </Stack.Navigator>
  );
}

function FavoritView() {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="Favorit">
      <Stack.Screen name="Favorit" component={Favorit} />
      <Stack.Screen name="FavoritDetail" component={AnimeDetail} />
    </Stack.Navigator>
  );
}

function DrawerView() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <MyDrawer {...props} />}
      headerMode="float"
    >
      <Drawer.Screen name="Search" component={SearchView} />
      <Drawer.Screen name="Favorit" component={FavoritView} />
    </Drawer.Navigator>
  );
}

const Header = ({ scene, navigation }) => {
  const { options } = scene.descriptor;

  return (
    <Appbar.Header style={{ backgroundColor: "white" }}>
      <Appbar.Action
        icon={"menu"}
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      />

      <Appbar.Content
        title="test" /*{navigation.getParam("appBar", { title: "error" }).title}*/
      />
    </Appbar.Header>
  );
};

function HomeView() {
  return (
    <Stack.Navigator
      headerMode="screen"
      screenOptions={{
        header: ({ scene, navigation }) => (
          <Header scene={scene} navigation={navigation} />
        ),
      }}
    >
      <Stack.Screen name="home" component={DrawerView} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <HomeView />
    </NavigationContainer>
  );
}
