const router = require('express').Router();
const save = require('../db/save');

//loading notes from DB
router.get('/notes', (req, res) => {
    save
      .getNotes()
      .then((notes) => {
        return res.json(notes);
      })
      .catch((err) => res.status(500).json(err));
  });
  
  router.post('/notes', (req, res) => {
    save
      .addNote(req.body)
      .then((note) => res.json(note))
      .catch((err) => res.status(500).json(err));
  });
  
//deleting
  router.delete('/notes/:id', (req, res) => {
    save
      .removeNote(req.params.id)
      .then(() => res.json({ ok: true }))
      .catch((err) => res.status(500).json(err));
  });
  
  module.exports = router;
  