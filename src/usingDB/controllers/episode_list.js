import db from "../db"
import helper from "./helper.js"

const Episode = {
  async saveEpisode(req, res) {
    const createQuery = `
      INSERT INTO sparade_avsnitt (anvandare, avsnitt, titel, program_namn, program_id, beskrivning, url, lyssningslank, pub_datum_utc, betyg)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      grade,
    ]

    console.log("GRADE", grade)

    try {
      await db.query(createQuery, values)
      return res.status(201).end()
    } catch (error) {
      console.log("Error in saveEpisode", error)
      return res.status(400).send(error)
    }
  },

async gradeProgram(req, res) {
    const createQuery = `
      INSERT INTO programbetyg (anvandare, programid, programnamn, betyg)
      VALUES (?, ?, ?, ?)
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
      grade,
    ]

    try {
      await db.query(createQuery, values)
      console.log("Grade program worked")
      return res.status(201).end()
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
     SET betyg = ?
     WHERE anvandare =?
     AND programid = ?
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
      await db.query(createQuery, values)
      console.log("Update program worked")
      return res.status(200).end
    } catch (error) {
      console.log("Update program didn't work", error)
      return res.status(400).send(error)
    }
  },

  async deleteProgram(req, res){

    const createQuery = 
    ` DELETE  from programbetyg 
      WHERE anvandare 
        LIKE ?
      AND 
        programid LIKE ?
    `

    const values = [
      req.user.username,
      req.body.program_id, 
    ]

    try {
      await db.query(createQuery, values)
      console.log("Delete program worked and returned rows:")
      return res.status(200).end()
    } catch (error) {
      console.log("Delete program didn't work", error)
      return res.status(400).send(error)
    }
  },

  async getPrograms(req, res) {
    const createQuery = `
    SELECT * FROM programbetyg
    WHERE
      anvandare LIKE ?
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
      anvandare LIKE ?
    AND 
      tipsare IS null
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
        anvandare = ?
      AND
        avsnitt = ?
    `

    const values = [req.user.username, req.body.episode_id]

    try {
      await db.query(createQuery, values)
      return res.status(200).end()
    } catch (error) {
      return res.status(400).send(error)
    }
  },
  async setGrade(req, res) {
    console.log("Hello from setGrade in backend")

    const createQuery = `
    UPDATE sparade_avsnitt
    SET betyg = ?
    WHERE
      anvandare LIKE ?
    AND
      avsnitt = ?
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
  },

  async addTip(req, res) {
    console.log("req.body.username", req.body.username);
    console.log("req.body.episode_id", req.body.episode_id);
    const createQuery = `
      INSERT INTO sparade_avsnitt (anvandare, avsnitt, titel, program_namn, program_id, beskrivning, url, lyssningslank, pub_datum_utc, tipsare, nytt_tips)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `

    const values = [
      req.body.username,
      req.body.episode_id,
      req.body.title,
      req.body.show_name,
      req.body.show_id,
      req.body.description,
      req.body.url,
      req.body.listen_link,
      req.body.pub_date,
      req.user.username,
      true
    ]

    const createQuery2 = 
    `select 
      EXTRACT(EPOCH FROM (current_timestamp - tipsad)) 
    AS difference, email, tips_mail 
      from anvandare
    WHERE
      anvandarnamn = ?
    `

    const createQuery3 = 
    `update anvandare
      set tipsad = current_timestamp
      where anvandarnamn = ?
    `
    
    const values2 = [req.body.username]

    try {
      const { rows: tips } = await db.query(createQuery, values)
      const { rows: tipTime } = await db.query(createQuery2, values2)

      if (tipTime[0].tips_mail && tipTime[0].email && (!tipTime[0].difference || tipTime[0].difference > 60 * 60 * 6 )) {
        console.log("SENDING EMAIL TIP")
        console.log("tiptime", tipTime);

        const baseUrl = req.protocol + "://" + req.get("host");

        const mailOptions = {
          from: 'administrator@radioskugga.org',
          to: tipTime[0].email,
          subject: 'Nya tips på Radioskugga',
          text: `Du har fått nya lyssningstips!`,
          html: `<h3>Du har fått nya lyssningstips! &nbsp;<strong><a href="www.radioskugga.org">Radioskugga</a></strong></h3>`,
        }
        await db.query(createQuery3, values2)
        await new Promise(resolve => setTimeout(async function() {
          helper.transporter.sendMail(mailOptions, async function(error, info){
            if (error) {
              console.log("Error sending mail", error);
            } else {
              console.log('Email sent: ' + info.response);
              console.log("Running query to set timestamp")

              
              return res.status(200)
            }
          })

          resolve()
        }, 15 * 60 * 1000))

      } else {
        console.log("Tip time difference not big enough", tipTime[0].difference );
      }

      return res.status(201).send(tips[0])
    } catch (error) {
      console.log("Error in addTip", error)
      return res.status(400).send(error)
    } 
  },

  async getTips(req, res) {
    const createQuery1 = `
    SELECT * FROM sparade_avsnitt
    WHERE
      anvandare LIKE ?
    AND 
      tipsare IS NOT null
   `

   const createQuery2 = `
   SELECT * FROM sparade_avsnitt
   WHERE
     tipsare LIKE ?
  `

    console.log("USER data:", req.user)
    console.log("RUnning get tips in backend")
    const values = [req.user.username]

    try {
     const {rows: tipsReceived}  = await db.query(createQuery1, values)
     
     const {rows: tipsSent}  = await db.query(createQuery2, values)

      console.log("tipsSent inside getTips", tipsSent)
      console.log("tipsReceived inside getTips", tipsReceived)

      return res.status(200).send([tipsSent, tipsReceived])
    } catch (error) {
      console.log("Fel i getTips", error)
      return res.status(400).send(error)
    }
  },
  async setOldTips(req, res) {
    const createQuery = `
      UPDATE sparade_avsnitt
      SET
        nytt_tips = FALSE
      WHERE
        anvandare = ?
      RETURNING *
    `

    const { rows } = await db.query(createQuery, [req.user.username])
    try {
      return res.status(204).send(rows)
    } catch (error) {
      return res.status(400).send(error)
    }
  },
  async removeAllTips(req, res) {
    const createQuery = `
      DELETE FROM sparade_avsnitt
      WHERE
        anvandare LIKE ?
      AND
        tipsare IS NOT null
    `
 
    try {
      await db.query(createQuery, [req.user.username])
      return res.status(204).send()
    } catch (error) {
      return res.status(400).send(error)
    }
  },
  async removeOneTip(req, res) {
    console.log("Running removeOneTip")
    console.log("In backend:",req.body.user, req.body.episodeId);
    const createQuery = `
      DELETE FROM sparade_avsnitt
      WHERE
        anvandare = ?
      AND
        tipsare = ?
      AND
        avsnitt = ?
    `
  
    try {
      await db.query(createQuery, [req.user.username, req.body.user, req.body.episodeId])
      return res.status(204).send()
    } catch (error) {
      return res.status(400).send(error)
    }
  }
}

export default Episode
