import express from "express";

import {
    getFunctionalityItems,
    createFunctionalityItem,
    getFunctionalityItem,
    updateFunctionalityItem,
    deleteFunctionalityItem,
} from "../controllers/functionalityItemControllers.js";

const router = express.Router();

router.get("/", getFunctionalityItems);
router.get("/:id", getFunctionalityItem);
router.post("/", createFunctionalityItem);
router.put("/:id", updateFunctionalityItem);
router.delete("/:id", deleteFunctionalityItem);

export default router;