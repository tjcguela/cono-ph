import { sql } from "../config/db.js";

export const getFunctionalityItems = async (req, res) => {
    try {
        const functionalityItems = await sql`
            SELECT * FROM functionality_item
            ORDER BY number ASC;
        `;

        console.log("Succesfully retrieved all FUNCTIONALITY ITEMS!");

        res.status(200).json({
            success: true,
            data: functionalityItems,
            message: "Succesfully fetched data.",
        });
    } catch (error) {
        console.log("getFunctionalityItems Error");
        res.status(500).json({
            success: false,
            message: "SERVER ERROR: failed to retrieve FUNCTIONALITY ITEMS" + error.message,
        });
    }
};

export const createFunctionalityItem = async (req, res) => {
    const {title, description} = req.body;

    if (!title || !description) 
        {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

    try {
        const newFunctionalityItem = await sql`
            
        INSERT INTO functionality_item 
            (
                title,
                description
            )
        VALUES 
            (
                ${title},
                ${description}
            )
        RETURNING *
        `;

        console.log(
            "Succesfully created new FUNCTIONALITY ITEM: " +
                JSON.stringify(newFunctionalityItem[0].title)
        );

        res.status(201).json({
            success: true,
            data: newFunctionalityItem[0], // json is returned wrapped in a list so need to access via index
            message: "New FUNCTIONALITY ITEM created",
        });
    } catch (error) {
        console.log("createFunctionalityItem error", error);
        res.status(500).json({
            success: false,
            message: "SERVER ERROR: " + error.message,
        });
    }
};

export const getFunctionalityItem = async (req, res) => {
    const { id } = req.params;

    try {
        const fetchedFunctionalityItem = await sql`
            SELECT * FROM functionality_item where number=${id}
        `;

        res.status(200).json({
            success: true,
            data: fetchedFunctionalityItem[0],
            message: `Succesfully retrieved FUNCTIONALITY ITEM: ${fetchedFunctionalityItem[0].title}`,
        });
    } catch (error) {
        console.log("getFunctionalityItem Error", error);
        res.status(500).json({
            success: false,
            message: "SERVER ERROR: failed to retrieve FUNCTIONALITY ITEM",
        });
    }
};

export const updateFunctionalityItem = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.params;

    try {
        const updatedFunctionalityItem = await sql`
            UPDATE functionality_item
            SET title=${title}, description=${description}
            WHERE number=${id}
            RETURNING *
        `;

        if (updatedFunctionalityItem.length === 0) {
            return res.status(404).json({
                success: false,
                message: "FUNCTIONALITY ITEM not found.",
            });
        }

        console.log("Succesfully updated FUNCTIONALITY ITEM");
        res.status(200).json({
            success: true,
            data: updatedFunctionalityItem[0],
            message: "Succesfully updated FUNCTIONALITY ITEM",
        });
    } catch (error) {
        console.log("updateFunctionalityItem error", error);
        res.status(500).json({
            success: false,
            message: "SERVER ERROR: " + error.message,
        });
    }
};

export const deleteFunctionalityItem = async (req, res) => {
    const { number } = req.params;

    try {
        const deletedFunctionalityItem = await sql`
            DELETE FROM functionality_item WHERE number=${number}
            RETURNING *
        `;

        if (deletedFunctionalityItem.length === 0) {
            return res.status(404).json({
                success: false,
                message: "FUNCTIONALITY ITEM not found.",
            });
        }

        res.status(200).json({
            success: true,
            data: deletedFunctionalityItem[0],
            message: "Succesfully deleted FUNCTIONALITY ITEM",
        });
    } catch (error) {
        console.log("Error in deleteFunctionalityItem", error);
        res.status(500).json({
            success: false,
            message: "SERVER ERROR: " + error.message,
        });
    }
};