const express = require("express");
const router = express.Router();

const {
  disableMultipleBatchmates,
  enableMultipleBatchmates
} = require("../controllers/userDisableController");

router.put("/disable-many", disableMultipleBatchmates);
router.put("/enable-many", enableMultipleBatchmates);

module.exports = router;
