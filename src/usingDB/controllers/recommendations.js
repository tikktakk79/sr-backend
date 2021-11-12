import db from "../db"

const Rec = {
  async saveRec(req, res) {
    const createQuery = `
      INSERT INTO rekommendationer (tipsare, mottagare, beskrivning, avsnitt)
      VALUES (?, ?, ?, ?)
    `

    const values = [
      req.body.sender,
      req.body.receiver,
      req.body.description,
      req.body.episode
    ]

    try {
      await db.query(createQuery, values)
      return res.status(201).end()
    } catch (error) {
      return res.status(400).send(error)
    }
  },

  async listRecs(req, res) {
    const createQuery = `
    SELECT avsnitt, tipsare FROM rekommendationer
    WHERE
      mottagare LIKE ?
   `

    const values = [req.body.username]

    try {
      const rows = await db.query(createQuery, values)
      return res.status(200).send(rows)
    } catch (error) {
      return res.status(400).send(error)
    }
  },

  async deleteRec(req, res) {
    const createQuery = `
      DELETE FROM rekommendationer
      WHERE
        mottagare = ?
      AND
        tipsare = ?
      AND
        avsnitt = ?
    `

    const values = [req.body.receiver, req.body.sender, req.body.episode]

    try {
      await db.query(createQuery, values)
      return res.status(204).end()
    } catch (error) {
      return res.status(400).send(error)
    }
  }
}

export default Rec
