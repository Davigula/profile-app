const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const profileController = require('../controller/profile.controller');

// /profile
router.route('/')
  .put(authMiddleware, profileController.update)
  .get(profileController.getAll);
  

// /profile/:username
router.route('/:username')
  .get(profileController.getByUsername)

// /profile/is-public/:username
router.route('/is-public/:username')
  .get(profileController.getIsPublic);



//
// Files Seciton
//
//

// /profile/files
router.route('/files')
  .post(authMiddleware, profileController.upload);

  // /profile/files/:id
router.route('/files/:id')
  .get(profileController.getFile)
  .delete(authMiddleware, profileController.deleteFile);

module.exports = router;