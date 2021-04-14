import db from "../db"

const Rec = {
  async saveRec(req, res) {
    const createQuery = `
      INSERT INTO rekommendationer (tipsare, mottagare, beskrivning, avsnitt)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `

    const values = [
      req.body.sender,
      req.body.receiver,
      req.body.description,
      req.body.episode
    ]

    try {
      const { rows } = await db.query(createQuery, values)
      return res.status(201).send(rows[0])
    } catch (error) {
      return res.status(400).send(error)
    }
  },

  async listRecs(req, res) {
    const createQuery = `
    SELECT avsnitt, tipsare FROM rekommendationer
    WHERE
      mottagare LIKE $1
   `

    const values = [req.body.username]

    try {
      const { rows } = await db.query(createQuery, values)
      return res.status(200).send(rows)
    } catch (error) {
      return res.status(400).send(error)
    }
  },

  async deleteRec(req, res) {
    const createQuery = `
      DELETE FROM rekommendationer
      WHERE
        mottagare = $1
      AND
        tipsare = $2
      AND
        avsnitt = $3
      RETURNING *
    `

    const values = [req.body.receiver, req.body.sender, req.body.episode]

    try {
      const { rows } = await db.query(createQuery, values)
      return res.status(204).send()
    } catch (error) {
      return res.status(400).send(error)
    }
  }
}

export default Rec
