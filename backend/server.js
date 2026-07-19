// external packages
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { NeonDbError } from "@neondatabase/serverless";

// from directory
import speciesRoutes from "./routes/speciesRoutes.js";
import functionalityItemRoutes from "./routes/functionalityItemRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";

// config
dotenv.config();
const PORT = process.env.PORT || 3333;

const app = express();

app.use(cors()); // avoid cross origins (CORS) error,,, typically arising from kulang authentication
app.use(express.json());
app.use(helmet()); // security middleware that helps protect app by using multiple HTTP headers
app.use(morgan("dev")); // log requests

// Apply Arcjet RATE LIMITING thingy; aka bot detection
// NOTE FROM TIM: Temporarily commenting this out as it always blocks all API calls except for GET all species
// WILL UNCOMMENT as soon as I can figure this out... hopefully, I do

// app.use(async (req, res, next) => {
//     try {
//         const decision = await aj.protect(req, {
//             request: 0, // specify that each request consumes 1 token
//         });

//         if (decision.isDenied()) {
//             if (decision.reason.isRateLimit()) {
//                 res.status(429).json({
//                     error: "Too many requests, please try again",
//                 });
//             } else if (decision.reason.isBot()) {
//                 res.status(403).json({
//                     error: "Bot access denied",
//                 });
//             } else {
//                 res.status(403).json({ error: "Forbidden" });
//             }
//             return;
//         }

//         // check for spoofed bots
//         // isSpoofedBot = decision.results.some(
//         //     (result) => result.reason.isBot() && result.reason.isSpoofed()
//         // );

//         if (
//             decision.results.some(
//                 (result) => result.reason.isBot() && result.reason.isSpoofed()
//             )
//         ) {
//             res.status(403).json({ error: "spoofed bot detected" });
//             return;
//         }

//         // call the next function if not denied
//         next();
//     } catch (error) {
//         console.log("Arcjet Error", error);
//         next(error);
//     }
// });

// API handling
app.use("/api/species", speciesRoutes);
app.use("/api/functionalityItem", functionalityItemRoutes);

async function initializeDB() {
    try {
         // create FUNCTIONALITY_ITEMS table
        await sql `
            CREATE TABLE IF NOT EXISTS functionality_item (
                number SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // create SPECIES table
        await sql`
            CREATE TABLE IF NOT EXISTS species(
                id VARCHAR(20) PRIMARY KEY,
                scientific_name VARCHAR(255) NOT NULL,
                common_name VARCHAR(255) NOT NULL,
                subgenus VARCHAR(255) NOT NULL,
                diet_type VARCHAR(255) NOT NULL,
                region VARCHAR(255),   
                province VARCHAR(255),
                municipality VARCHAR(255),
                shell_image TEXT,
                tissue_source TEXT,
                num_coi SMALLINT,
                num_conopeptides SMALLINT,
                doi VARCHAR(255),
                species_depository TEXT, 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // create conopeptide table
        await sql`
            CREATE TABLE IF NOT EXISTS conopeptide(
                id VARCHAR(20) PRIMARY KEY,
                species_id VARCHAR(20) NOT NULL,
                scientific_name VARCHAR(255) NOT NULL,
                precursor_sequence TEXT NOT NULL,
                remark_sequence TEXT,
                signal_peptide TEXT NOT NULL,
                propeptide_sequence TEXT, 
                mature_peptide_sequence TEXT NOT NULL,
                post_peptide_sequence TEXT, 
                gene_superfamily VARCHAR(255), 
                matched_toxin VARCHAR(50),
                percent_similarity REAL,
                source_percent_similarity VARCHAR(5), 
                expression_value REAL,
                doi TEXT,
                len_precursor_sequence SMALLINT,
                len_mature_conopeptide SMALLINT,
                num_cysteine_residues SMALLINT,
                cysteine_pattern VARCHAR(10),
                cysteine_framework VARCHAR(10)
            );
        `;

        // create barcode table
        await sql`
            CREATE TABLE IF NOT EXISTS barcode(
                specimen_id VARCHAR(20) PRIMARY KEY,
                species_name VARCHAR(255) NOT NULL,
                gene_marker VARCHAR(255) NOT NULL,
                length_sequence SMALLINT NOT NULL,
                sequence TEXT ,
                source_method VARCHAR(255),
                collection_province VARCHAR(255),
                collection_site VARCHAR(255),
                platform_sequence VARCHAR(255),
                db_sequence VARCHAR(255),
                accession_external VARCHAR(50),
                validation_status VARCHAR(255),
                publication_doi TEXT
            );
        `;

        // create publication table
        await sql`
            CREATE TABLE IF NOT EXISTS publication (
                id VARCHAR(20) PRIMARY KEY,
                author VARCHAR(255) NOT NULL,
                year_published VARCHAR(4) NOT NULL,
                journal VARCHAR(255),
                doi TEXT NOT NULL,
                species_reported VARCHAR(255)
            );
        `;

        // create taxonomic table
        await sql`
            CREATE TABLE IF NOT EXISTS taxonomic (
                id VARCHAR(20) PRIMARY KEY,
                domain VARCHAR(255), 
                kingdom VARCHAR(255),
                phylum VARCHAR(255),
                class VARCHAR(255),
                taxonomy_order VARCHAR(255),
                family VARCHAR(255),
                genus VARCHAR(255),
                subgenus VARCHAR(255),
                species VARCHAR(255) NOT NULL
            )
        `;

        console.log("Database initialized successfully!");
    } catch (error) {
        console.log("ERROR initializing DB from function initializeDB", error);
    }
}

async function seedDB(){
    try {

        // seed FUNCTIONALITY_ITEM table
        await sql`
            INSERT INTO functionality_item (number, title, description)
            VALUES 
                (1, 'Species Taxonomy', 'Classification and species records'),
                (2, 'Collection Metadata', 'Location, specimen, collection info'),
                (3, 'Molecular Data', 'Transcriptomes and conopeptides'),
                (4, 'Visualization & Search', 'Interactive exploration and filtering')
            
            ON CONFLICT (number) DO NOTHING; 
        `;

        // seed SPECIES table
        await sql`
                INSERT INTO species (
                    id, 
                    scientific_name, 
                    common_name, 
                    subgenus,
                    diet_type,
                    region,
                    province,
                    municipality,
                    shell_image,
                    tissue_source,
                    num_coi,
                    num_conopeptides,
                    doi,
                    species_depository
                )
                
                VALUES (
                    '856252_CE1',
                    'Conus eburneus',
                    'Ivory cone',
                    'Tesseliconus',
                    'Vermivorous',
                    '0700000000',
                    'Cebu',
                    'Caw-oy',
                    '/species-images/eburneus.jpg',
                    'Venom gland tissues',
                    0,
                    260,
                    'https://doi.org/10.3389/fmars.2025.1616692',
                    'The Marine Science Institute (MSI)'
                ),
                (
                    '856252_CE2',
                    'Conus eburneus',
                    'Ivory cone',
                    'Tesseliconus',
                    'Vermivorous',
                    '0700000000',
                    'Cebu',
                    'Caw-oy',
                    '/species-images/eburneus.jpg',
                    'Venom gland tissues',
                    0,
                    149,
                    'https://doi.org/10.3390/md18100503, https://doi.org/10.1002/psc.3179',
                    'The Marine Science Institute (MSI)'
                ),
                (
                    '853932_CI1',
                    'Conus imperialis',
                    'Imperial cone',
                    'Stephanoconus',
                    'Vermivorous',
                    '0700000000',
                    'Cebu',
                    'Caw-oy',
                    '/species-images/imperialis.jpg',
                    'Venom gland tissues',
                    1,
                    150,
                    'Under Review',
                    'The Marine Science Institute (MSI)'
                ),
                (
                    '856256_CT1',
                    'Conus tessulatus',
                    'Tesselate cone',
                    'Tesseliconus',
                    'Vermivorous',
                    '0700000000',
                    'Cebu',
                    'Caw-oy',
                    '/species-images/tessulatus.jpg',
                    'Venom gland tissues',
                    0,
                    339,
                    'https://doi.org/10.3389/fmars.2025.1616692',
                    'The Marine Science Institute (MSI)'
                ),
                (
                    '852344_CM1',
                    'Conus mustelinus',
                    'Weasel cone',
                    'Rhizoconus',
                    'Vermivorous',
                    '0700000000',
                    'Cebu',
                    'Caw-oy',
                    '/species-images/mustelinus.jpg',
                    'Venom gland tissues',
                    0,
                    168,
                    'https://doi.org/10.3390/md23070266',
                    'The Marine Science Institute (MSI)'
                ),
                (
                    '852343_CM1',
                    'Conus miles',
                    'Soldier cone',
                    'Rhizoconus',
                    'Vermivorous',
                    '1700000000',
                    'Marinduque',
                    'Buenavista',
                    '/species-images/mustelinus.jpg',
                    'Venom gland tissues',
                    0,
                    121,
                    'https://doi.org/10.3390/md23070266',
                    'The Marine Science Institute (MSI)'
                ),
                (
                    '852340_CC1',
                    'Conus capitaneus',
                    'Captain cone',
                    'Rhizoconus',
                    'Vermivorous',
                    '0700000000',
                    'Cebu',
                    'Caw-oy',
                    '/species-images/capitaneus.jpg',
                    'Venom gland tissues',
                    0,
                    225,
                    'https://doi.org/10.3390/md23070266',
                    'The Marine Science Institute (MSI)'
                ),
                (
                    '215429_CM1',
                    'Conus magus',
                    'Magician cone',
                    'Pionoconus',
                    'Piscivorous',
                    '1700000000',
                    'Marinduque',
                    'Buenavista',
                    '/species-images/magus.jpg',
                    'Venom gland tissues',
                    0,
                    90,
                    'Unpublished',
                    'The Marine Science Institute (MSI)'
                ),
                (
                    '428368_CS1',
                    'Conus striolatus',
                    'Striolate cone',
                    'Pionoconus',
                    'Piscivorous',
                    '1700000000',
                    'Marinduque',
                    'Buenavista',
                    '/species-images/striolatus.jpg',
                    'Venom gland tissues',
                    0,
                    56,
                    'Unpublished',
                    'The Marine Science Institute (MSI)'
                ),
                (
                    '428363_CS1',
                    'Conus stercusmuscarum',
                    'Fly-specked cone',
                    'Pionoconus',
                    'Piscivorous',
                    '1700000000',
                    'Marinduque',
                    'Buenavista',
                    '/species-images/stercusmuscarum.jpg',
                    'Venom gland tissues',
                    0,
                    42,
                    'Unpublished',
                    'The Marine Science Institute (MSI)'
                ),
                (
                    '843072_CR1',
                    'Conus rolani',
                    'Rolan cone',
                    'Asprella',
                    'Piscivorous',
                    '0700000000',
                    'Cebu',
                    'Sogod',
                    '/species-images/rolani.jpg',
                    'Venom gland tissues',
                    0,
                    70,
                    'https://doi.org/10.54645/202417SupQCH-42',
                    'The Marine Science Institute (MSI)'
                ),
                (
                    '853645_CT1',
                    'Conus tribblei',
                    'Tribble cone',
                    'Splinoconus',
                    'Vermivorous',
                    '0700000000',
                    'Cebu',
                    'Sogod',
                    '/species-images/tribblei.jpg',
                    'Venom gland tissues',
                    0,
                    69,
                    'https://doi.org/10.1093/molbev/msae120',
                    'The Marine Science Institute (MSI)'
                ),
                (
                    '853642_CL1',
                    'Conus lenavati',
                    'Unavailable',
                    'Splinoconus',
                    'Vermivorous',
                    '0700000000',
                    'Cebu',
                    'Sogod',
                    '/species-images/lenavati.png',
                    'Venom gland tissues',
                    3,
                    132,
                    'https://doi.org/10.1093/gbe/evv109',
                    'The Marine Science Institute (MSI)'
                ),
                (
                    '853645_CT2',
                    'Conus tribblei',
                    'Tribble cone',
                    'Splinoconus',
                    'Vermivorous',
                    '0700000000',
                    'Cebu',
                    'Sogod',
                    '/species-images/tribblei.jpg',
                    'Venom gland tissues',
                    3,
                    100,
                    'https://doi.org/10.1093/gbe/evv109',
                    'The Marine Science Institute (MSI)'
                ),
                (
                    '845894_CG1',
                    'Conus geographus',
                    'Geographer cone',
                    'Gastridium',
                    'Piscivorous',
                    '0700000000',
                    'Cebu',
                    'Caw-oy',
                    '/species-images/geographus.jpeg',
                    'Venom gland tissues',
                    0,
                    69,
                    'https://doi.org/10.1093/molbev/msae120',
                    'University of Utah'
                ),
                (
                    '843253_CG1',
                    'Conus gloriamaris',
                    'Glory of the Sea cone',
                    'Cylinder',
                    'Molluscivorous',
                    '0700000000',
                    'Bohol',
                    'Panglao',
                    '/species-images/gloriamaris.jpg',
                    'Venom gland tissues',
                    0,
                    109,
                    'https://doi.org/10.3390/md15050145',
                    'University of Utah'
                ),
                (
                    '836797_CB1',
                    'Conus bandanus',
                    'Banded Marble cone',
                    'Conus',
                    'Molluscivorous',
                    '0700000000',
                    'Cebu',
                    'Caw-oy',
                    '/species-images/bandanus.jpg',
                    'Venom gland tissues',
                    1,
                    173,
                    'Unpublished',
                    'The Marine Science Institute (MSI)'
                ),
                (
                    '428363_CS2',
                    'Conus stercusmuscarum',
                    'Fly-specked cone',
                    'Pionoconus',
                    'Piscivorous',
                    '0700000000',
                    'Cebu',
                    'Caw-oy',
                    '/species-images/stercusmuscarum.jpg',
                    'Venom gland tissues',
                    1,
                    139,
                    'Unpublished',
                    'The Marine Science Institute (MSI)'
                ),
                (
                    '848247_CF1',
                    'Conus flavus',
                    'Unavailable',
                    'Phasmoconus',
                    'Piscivorous',
                    '1700000000',
                    'Marinduque',
                    'Buenavista',
                    '/species-images/flavus.png',
                    'Venom gland tissues',
                    1,
                    226,
                    'Unpublished',
                    'The Marine Science Institute (MSI)'
                )
                ON CONFLICT (id) DO NOTHING;
        `;

        // seed CONOPEPTIDE table
        await sql`
        
        `;
        // seed BARCODE table
        // seed PUBLICATION table
        // seed TAXONOMIC table



        console.log("Database seeded succesfully");
    } 
    catch (error) {
        if (error instanceof NeonDbError){
            console.log("Invalid syntax from function seedDB", error)
        }
        else {
            console.log("ERROR seeding DB from function seedDB", error);
        }
    }
}

initializeDB().then(seedDB()).then(() => {
    // listen to port
    app.listen(PORT, () => {
        console.log("Server is listening at: " + String(PORT));
    });
});
