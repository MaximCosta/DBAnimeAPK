export function getnimeFromApiWithSearchedText(text) {
  const url = "http://10.0.0.23:5000/api/search?title=" + text;
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

export function getAnimeDetailFromApi(id) {
  const url = "http://10.0.0.23:5000/api/anime?id=" + id;
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

async function _download() {
  FileSystem.downloadAsync(
    "http://10.0.0.2:5000/return-files/",
    FileSystem.documentDirectory + "SQLite/mabase3.db"
  )
    .then(({ uri }) => {
      console.log("Finished downloading to ", uri);
    })
    .catch((error) => {
      console.error(error);
    });
}
async function _GetIfExist() {
  FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite").then(
    (info) => {
      if (!info.exists) {
        FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "SQLite/");
        _download();
      } else {
        FileSystem.getInfoAsync(
          FileSystem.documentDirectory + "SQLite/mabase3.db"
        ).then((info) => {
          if (!info.exists) {
            _download();
          } else {
            console.log("read");
          }
        });
      }
    }
  );
  return true;
}

export function GetDB() {
  _GetIfExist();

  return SQLite.openDatabase("mabase3.db");
}
