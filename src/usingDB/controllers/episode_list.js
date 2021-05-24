import db from "../db"

const Episode = {
  async saveEpisode(req, res) {
    const createQuery = `
      INSERT INTO sparade_avsnitt (anvandare, avsnitt, titel, program_namn, program_id, beskrivning, url, lyssningslank, pub_datum_utc, betyg)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `
    let grade = req.body.grade

    console.log("GRADE:", grade)

    grade = parseInt(grade)


    if (!grade) {
      grade = null
    }

    const values = [
      req.user.username,
      req.body.episode_id,
      req.body.title,
      req.body.show_name,
      req.body.show_id,
      req.body.description,
      req.body.url,
      req.body.listen_link,
      req.body.pub_date,
      grade
    ]

    console.log("GRADE", grade)

    try {
      const { rows } = await db.query(createQuery, values)
      return res.status(201).send(rows[0])
    } catch (error) {
      console.log("Error in saveEpisode", error)
      return res.status(400).send(error)
    }
  },

async gradeProgram(req, res) {
    const createQuery = `
      INSERT INTO programbetyg (anvandare, programid, programnamn, betyg)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `
    let grade = req.body.grade

    console.log("GRADE:", grade)

    if (!!grade) {
      grade = parseInt(grade)
    }

    const values = [
      req.user.username,
      req.body.program_id,
      req.body.program_name,
      grade
    ]

    try {
      const rows = await db.query(createQuery, values)
      console.log("Grade program worked and returned rows:",rows)
      return res.status(201).send(rows[0])
    } catch (error) {
      if (error.code === "23505") {
        console.log("Japp en 23505:a duplicate..")
      } else {
        console.log("Nä de va ingen duplicate")
      }
      console.log("Grade program didn't work", error)
      return res.status(400).send(error)
    }
  },

  async updateProgram(req, res){

    const createQuery = 
    `UPDATE programbetyg
     SET betyg = $1
     WHERE anvandare =$2
     AND programid = $3
     RETURNING *  
    `

    let grade = req.body.grade

    if (!!grade) {
      grade = parseInt(grade)
    }

    const values = [
      grade,
      req.user.username,
      req.body.program_id, 
    ]

    try {
      const rows = await db.query(createQuery, values)
      console.log("Update program worked and returned rows:",rows)
      return res.status(201).send(rows[0])
    } catch (error) {
      console.log("Update program didn't work", error)
      return res.status(400).send(error)
    }
  },

  async deleteProgram(req, res){

    const createQuery = 
    ` DELETE  from programbetyg 
      WHERE anvandare 
        LIKE $1
      AND 
        programid LIKE $2
      RETURNING *
    `

    const values = [
      req.user.username,
      req.body.program_id, 
    ]

    try {
      const rows = await db.query(createQuery, values)
      console.log("Delete program worked and returned rows:",rows)
      return res.status(201).send(rows[0])
    } catch (error) {
      console.log("Delete program didn't work", error)
      return res.status(400).send(error)
    }
  },

  async getPrograms(req, res) {
    const createQuery = `
    SELECT * FROM programbetyg
    WHERE
      anvandare LIKE $1
   `
    console.log("USER data:", req.user)
    console.log("RUnning get programs in backend")
    const values = [req.user.username]

    try {
      const { rows } = await db.query(createQuery, values)

      console.log("Rows inside list programs", rows)
      console.log("Next, comparing betyg inside get Programs")

      console.log("Sparade program", rows)
      return res.status(200).send(rows)
    } catch (error) {
      console.log("Fel i get programs", error)
      return res.status(400).send(error)
    }
  },

  async listEpisodes(req, res) {
    const createQuery = `
    SELECT * FROM sparade_avsnitt
    WHERE
      anvandare LIKE $1
   `
    console.log("USER data:", req.user)
    console.log("RUnning get episodes in backend")
    const values = [req.user.username]

    try {
      const { rows } = await db.query(createQuery, values)

      console.log("Rows inside list episodes", rows)
      console.log("Next, comparing betyg inside get Programs")

      console.log("Sparade avsnitt", rows)
      return res.status(200).send(rows)
    } catch (error) {
      console.log("Fel i get episodes", error)
      return res.status(400).send(error)
    }
  },


  async deleteEpisode(req, res) {
    const createQuery = `
      DELETE FROM sparade_avsnitt
      WHERE
        anvandare = $1
      AND
        avsnitt = $2
      RETURNING *
    `

    const values = [req.user.username, req.body.episode_id]

    try {
      const { rows } = await db.query(createQuery, values)
      return res.status(200).send(rows[0])
    } catch (error) {
      return res.status(400).send(error)
    }
  },
  async setGrade(req, res) {
    console.log("Hello from setGrade in backend")

    const createQuery = `
    UPDATE sparade_avsnitt
    SET betyg = $1
    WHERE
      anvandare LIKE $2
    AND
      avsnitt = $3
    RETURNING *
   `
    console.log("Running set grade in backend")
    const values = [req.body.grade, req.user.username, req.body.episode_id]

    console.log("VAlues för grade, username och episode_id", values)
    try {
      const { rows } = await db.query(createQuery, values)
      console.log("Betygsatt", rows)
      return res.status(200).send(rows)
    } catch (error) {
      return res.status(400).send(error)
    }

  }
}

export default Episode
