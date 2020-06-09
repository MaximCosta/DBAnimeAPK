export default function updateFavorit(AnimeID, currentV, db) {
  console.log(AnimeID, currentV);
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE Anime set favorit_anime=? where id_anime=?",
      [currentV ? 0 : 1, AnimeID],
      (tx, results) => {
        console.log("Results", results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log("Success", "Add to favorti");
        } else {
          console.log("Updation Failed");
        }
      },
      (ero, ero1) => console.log("error1", ero1)
    );
  });
}
