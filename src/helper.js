const helper = {
  userRelations(myUser, relations) {
    let friendsMod = []

    relations.map((raw) => {
      let friend = {}

      friend.godkann = raw.godkann
      friend.id = raw.id
      friend.ny_fraga = raw.ny_fraga

      console.log("RAW", raw)

      if (raw.anvandare1 === myUser) {
        friend.username = raw.anvandare2
        friend.fornamn = raw.fnamn2
        friend.efternamn = raw.enamn2
        friend.email = raw.email2
        friend.hemligt = raw.hemligt2
      } else {
        friend.username = raw.anvandare1
        friend.fornamn = raw.fnamn1
        friend.efternamn = raw.enamn1
        friend.email = raw.email1
        friend.hemligt = raw.hemligt1
      }
      console.log("One iteration..")
      friendsMod.push(friend)
    })
    console.log("All iterations done")
    console.log("friensMod from helper method", friendsMod)

    return friendsMod
  }
}

export default helper
