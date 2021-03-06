import db from "../db"
import Episode from "./episode_list"
import helper from "./helper.js"

const Friend = {
  async addFriend(req, res) {
    const createQuery = `
      CALL ny_van($1, $2);
    `

    const createQuery2 = `
      SELECT * FROM vanner WHERE 
        anvandare1 = LEAST($1, $2)
      AND
        anvandare2 = GREATEST($1, $2)
      ;
    `

    const values = [req.user.username, req.body.receiver]
    try {
      await db.query(createQuery, values)

      const {rows}  = await db.query(createQuery2, values)

      console.log("rows2 from addFriend", rows)

      return res.status(200).send(rows)
    } catch (error) {
      console.log("NE DE gickk inte..")
      return res.status(400).send(error)
    }
  },

  async acceptFriend(req, res) {
    const createQuery = `
      UPDATE vanner
      SET godkann = null,
      ny_fraga = FALSE
      WHERE anvandare1 = $2
        OR anvandare2 = $2
        AND godkann = $1
      RETURNING *
    `

    const values = [req.user.username, req.body.receiver]

    try {
      const { rows, rowCount } = await db.query(createQuery, values)
      let friendsMod = helper.userRelations(req.user.username, rows)
      return res.status(200).send(friendsMod)
    } catch (error) {
      return res.status(400).send(error)
    }
  },

  async waitFriend(req, res) {
    const createQuery = `
      UPDATE vanner
      SET ny_fraga = FALSE
      WHERE anvandare1 = $2
        OR anvandare2 = $2
        AND godkann = $1
      RETURNING *
    `

    const values = [req.user.username, req.body.receiver]

    try {
      const { rows, rowCount } = await db.query(createQuery, values)

      return res.status(200).send(rows)
    } catch (error) {
      return res.status(400).send(error)
    }
  },
  async listFriends(req, res) {
    console.log("Running list friends from backend")
    const createQuery = `
    SELECT
      id, vanner.anvandare1, vanner.anvandare2, vanner.godkann, vanner.ny_fraga, anv1.fornamn AS fnamn1, anv1.efternamn AS enamn1, anv1.email AS email1, anv1.hemligt AS hemligt1, anv2.fornamn AS fnamn2, anv2.efternamn AS enamn2, anv2.email AS email2, anv2.hemligt AS hemligt2
    FROM
      vanner
    JOIN
      anvandare AS anv1
    ON
      anvandare1 = anvandarnamn
    JOIN
      anvandare AS anv2
    ON
      anvandare2 = anv2.anvandarnamn
    WHERE
      anv1.anvandarnamn = $1
    OR
      anv2.anvandarnamn = $1
    ;

    `

    console.log("??nska mig lycka till innan jag f??rs??ker lista v??nnerna!")
    const values = [req.user.username]

    try {
      const { rows, rowCount } = await db.query(createQuery, values)

      console.log("R??UUWS", rows)
      let friendsMod = helper.userRelations(req.user.username, rows)
      return res.status(200).send({ friendsMod, rowCount })
    } catch (error) {
      return res.status(400).send(error)
    }
  },
  async deleteFriend(req, res) {
    console.log("Running delete friend on backend")
    const deleteQuery = `
      DELETE FROM vanner
        WHERE
          anvandare1 LIKE LEAST($1, $2)
        AND
          anvandare2 LIKE GREATEST($1, $2)
        RETURNING *
        ;
      `
    try {
      console.log("Mu uname", req.user.username)
      console.log("Other uname", req.body.receiver)
      const { rows } = await db.query(deleteQuery, [
        req.user.username,
        req.body.receiver
      ])
      if (!rows[0]) {
        return res.status(404).send({ message: "friend relation not found" })
      }
      return res.status(204).send()
    } catch (error) {
      return res.status(400).send(error)
    }
  },

  async setOld(req, res) {
    const createQuery = `
      UPDATE vanner
      SET
        ny_fraga = FALSE
      WHERE
        godkann = $1
      RETURNING *
    `

    const { rows } = await db.query(createQuery, [req.user.username])
    try {
      return res.status(204).send(rows)
    } catch (error) {
      return res.status(400).send(error)
    }
  },
  async getSecret(req, res) {
    const createQuery = `
      SELECT hemligt from anvandare
      WHERE
        anvandarnamn = $1
    `

    const { rows } = await db.query(createQuery, [req.user.username])
    try {
      console.log("Got hemligt from user in db", rows)
      return res.status(200).send(rows)
    } catch (error) {
      return res.status(400).send(error)
    }
  },

  async setSecret(req, res) {
    const createQuery = `UPDATE anvandare
    SET
      hemligt = $2
    WHERE
      anvandarnamn = $1
    RETURNING hemligt
    `

    console.log("SECRET from backend", req.body.secret)

    const { rows } = await db.query(createQuery, [
      req.user.username,
      req.body.secret
    ])
    try {
      console.log("Set hemligt", rows)
      return res.status(200).send(rows)
    } catch (error) {
      return res.status(400).send(error)
    }
  },

  async getTipsMail(req, res) {
    const createQuery = `
      SELECT tips_mail from anvandare
      WHERE
        anvandarnamn = $1
    `

    const { rows } = await db.query(createQuery, [req.user.username])
    try {
      console.log("Got tips_mail from user in db", rows)
      return res.status(200).send(rows)
    } catch (error) {
      return res.status(400).send(error)
    }
  },

  async setTipsMail(req, res) {
    const createQuery = `UPDATE anvandare
    SET
      tips_mail = $2
    WHERE
      anvandarnamn = $1
    RETURNING tips_mail
    `

    console.log("TipsMail from backend", req.body.tips_mail)

    const { rows } = await db.query(createQuery, [
      req.user.username,
      req.body.tips_mail
    ])
    try {
      console.log("Set tipsMail", rows)
      return res.status(200).send(rows)
    } catch (error) {
      return res.status(400).send(error)
    }
  },

  async program(req, res) {
    console.log("req.body", req.body)
    let permission = await helper.permissionFriend(db, req)

    if (!permission ) {
      return res.status(400)
    }

    let request = {...req}

    request.user.username = req.body.username

    console.log("Permission granted to send friend programs");

    Episode.getPrograms(request, res)
  },

  async episode(req, res) {
    console.log("req.body", req.body)
    let permission = await helper.permissionFriend(db, req)

    ;
    if (!permission ) {
      return res.status(400)
    }

    console.log("Permission granted to send friend episodes");

    let request = {...req}

    request.user.username = req.body.username

    Episode.listEpisodes(request, res)
  }
}

export default Friend
