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
                source_percent_similarity VARCHAR(20), 
                expression_value REAL,
                doi TEXT,
                len_precursor_sequence SMALLINT,
                len_mature_conopeptide SMALLINT,
                num_cysteine_residues SMALLINT,
                cysteine_pattern VARCHAR(20),
                cysteine_framework VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
                publication_doi TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // create publication table
        await sql`
            CREATE TABLE IF NOT EXISTS publication (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                author VARCHAR(255) NOT NULL,
                year_published SMALLINT NOT NULL,
                journal VARCHAR(255),
                doi TEXT NOT NULL,
                species_reported VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
                species VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
            INSERT INTO conopeptide
            (
                id, 
                species_id, 
                scientific_name, 
                precursor_sequence, 
                remark_sequence, 
                signal_peptide, 
                propeptide_sequence, 
                mature_peptide_sequence, 
                post_peptide_sequence, 
                gene_superfamily, 
                matched_toxin, 
                percent_similarity, 
                source_percent_similarity,  
                expression_value, 
                doi, 
                len_precursor_sequence, 
                len_mature_conopeptide, 
                num_cysteine_residues, 
                cysteine_pattern, 
                cysteine_framework
            )
            
            VALUES
            (
                '215429_CM1_10',
                'Conus magus',
                '215429_CM1',
                'MMFRLTTVSCFLLVIVLLNLVVLTDAMMFRLTTVSCFLLVIVLLNLVVLTDACYYDVGDPCSSNKECCISECCDGICLPWCTWPVYKRCYYDVGDPCSSNKECCISECCDGICLPWCTWPVYKR',
                'Full-Length',
                'MMFRLTTVSCFLLVIVLLNLVVLTDA',
                'MMFRLTTVSCFLLVIVLLNLVVLTDACYYDVGDPCSSNKECCISECCDGICLPWCTWPVYKR',
                'CYYDVGDPCSSNKECCISECCDGICLPWCTWPVY',
                'KR',
                'I2',
                'Unidentified',
                0.00,
                'Unavailable',
                5.01,
                'Unpublished',
                124,
                34,
                8,
                'C-C-CC-CC-C-C',
                'XI'
            ),
            (
                '215429_CM1_11',
                'Conus magus',
                '215429_CM1',
                'MKLTCALIITVLFLSITAMKLTCALIITVLFLSITADDSRGKQRYSALKSIAGMLKSKTVRECRQQSEGCTNSSPPCCPGLSCRGQSQGGVCTVRECRQQSEGCTNSSPPCCPGLSCRGQSQGGVC',
                'Partial',
                'MKLTCALIITVLFLSITA',
                'MKLTCALIITVLFLSITADDSRGKQRYSALKSIAGMLKSKTVRECRQQSEGCTNSSPPCCPGLSCRGQSQGGVC',
                'TVRECRQQSEGCTNSSPPCCPGLSCRGQSQGGVC',
                'Unavailable',
                'O1',
                'Unidentified',
                0.00,
                'Unavailable',
                46.33,
                'Unpublished',
                126,
                34,
                6,
                'C-C-CC-C-C',
                'VI/VII'
            ),
            (
                '215429_CM1_12',
                'Conus magus',
                '215429_CM1',
                'MKLTCALIITVLFLSITAMKLTCALIITVLFLSITADDSRGKQGYRALKSIAGMLNSKTVRECREQSQGCTNTSPPCCSGLRCSGQSQGGVCISNTVRECREQSQGCTNTSPPCCSGLRCSGQSQGGVCISN',
                'Partial',
                'MKLTCALIITVLFLSITA',
                'MKLTCALIITVLFLSITADDSRGKQGYRALKSIAGMLNSKTVRECREQSQGCTNTSPPCCSGLRCSGQSQGGVCISN',
                'TVRECREQSQGCTNTSPPCCSGLRCSGQSQGGVCISN',
                'Unavailable',
                'O1',
                'Unidentified',
                0.00,
                'Unavailable',
                31.19,
                'Unpublished',
                132,
                37,
                6,
                'C-C-CC-C-C',
                'VI/VII'
            ),
            (
                '215429_CM1_13',
                'Conus magus',
                '215429_CM1',
                'MMTLKHVLLFTLLLLPLATIRAMMTLKHVLLFTLLLLPLATIRAEVYACTYWTSPGWAVKRCQTHSDCVPYCGTHFRCRCQPGANLCPGGAGCFEVYACTYWTSPGWAVKRCQTHSDCVPYCGTHFRCRCQPGANLCPGGAGCF',
                'Partial',
                'MMTLKHVLLFTLLLLPLATIRA',
                'MMTLKHVLLFTLLLLPLATIRAEVYACTYWTSPGWAVKRCQTHSDCVPYCGTHFRCRCQPGANLCPGGAGCF',
                'EVYACTYWTSPGWAVKRCQTHSDCVPYCGTHFRCRCQPGANLCPGGAGCF',
                'Unavailable',
                'Unidentified',
                'Unidentified',
                0.00,
                'Unavailable',
                1.93,
                'Unpublished',
                144,
                50,
                8,
                'C-C-C-C-C-C-C-C',
                'XXII'
            ),
            (
                '215429_CM1_14',
                'Conus magus',
                '215429_CM1',
                'MNTAGRLLLLCLALGLVFESLGMNTAGRLLLLCLALGLVFESLGIPVADDVKADRDTDPDDEDPRGLDLWEPIQTMCGDKLCDFGCCFTVFGVRKCKPFHCPGLDLWEPIQTMCGDKLCDFGCCFTVFGVRKCKPFHCP',
                'Partial',
                'MNTAGRLLLLCLALGLVFESLG',
                'MNTAGRLLLLCLALGLVFESLGIPVADDVKADRDTDPDDEDPRGLDLWEPIQTMCGDKLCDFGCCFTVFGVRKCKPFHCP',
                'GLDLWEPIQTMCGDKLCDFGCCFTVFGVRKCKPFHCP',
                'Unavailable',
                'H',
                'Unidentified',
                0.00,
                'Unavailable',
                17.09,
                'Unpublished',
                139,
                37,
                6,
                'C-C-CC-C-C',
                'VI/VII'
            ),
            (
                '215429_CM1_15',
                'Conus magus',
                '215429_CM1',
                'MNCLPLFFIVLLLIAHSMNCLPLFFIVLLLIAHSSQVVEHSKLKRTKMLRRSTTRDDDEEALELCCAAGSTFCCAARWHFSTTRDDDEEALELCCAAGSTFCCAARWHF',
                'Partial',
                'MNCLPLFFIVLLLIAHS',
                'MNCLPLFFIVLLLIAHSSQVVEHSKLKRTKMLRRSTTRDDDEEALELCCAAGSTFCCAARWHF',
                'STTRDDDEEALELCCAAGSTFCCAARWHF',
                'Unavailable',
                'T',
                'Unidentified',
                0.00,
                'Unavailable',
                4.4,
                'Unpublished',
                109,
                29,
                4,
                'CC-CC',
                'V'
            ),
            (
                '215429_CM1_16',
                'Conus magus',
                '215429_CM1',
                'MNCLPLFFIVLLLIAHSMNCLPLFFIVLLLIAHSSQVVEHSKLKRTKMLRRSTARVASEEKFEECCLEDAVFCCAARAEELSTARVASEEKFEECCLEDAVFCCAARAEEL',
                'Partial',
                'MNCLPLFFIVLLLIAHS',
                'MNCLPLFFIVLLLIAHSSQVVEHSKLKRTKMLRRSTARVASEEKFEECCLEDAVFCCAARAEEL',
                'STARVASEEKFEECCLEDAVFCCAARAEEL',
                'Unavailable',
                'T',
                'Unidentified',
                0.00,
                'Unavailable',
                0.65,
                'Unpublished',
                111,
                30,
                4,
                'CC-CC',
                'V'
            ),
            (
                '215429_CM1_17',
                'Conus magus',
                '215429_CM1',
                'MLRLIIAAAVLLSACLAMLRLIIAAAVLLSACLAYPQRREGAPADAANLQSFDPALMPMQGMQGGQMTGMAGGQFLPFNPNLQMGYKRDFDENLEKRKQHSQFNADENKAPFDSEENFMNFLHNEKGDKHPFANVDSAATDLGQFDPSAENEDGKFRFFDKEQYPQRREGAPADAANLQSFDPALMPMQGMQGGQMTGMAGGQFLPFNPNLQMGYKRDFDENLEKRKQHSQFNADENKAPFDSEENFMNFLHNEKGDKHPFANVDSAATDLGQFDPSAENEDGKFRFFDKEQ',
                'Partial',
                'MLRLIIAAAVLLSACLA',
                'MLRLIIAAAVLLSACLAYPQRREGAPADAANLQSFDPALMPMQGMQGGQMTGMAGGQFLPFNPNLQMGYKRDFDENLEKRKQHSQFNADENKAPFDSEENFMNFLHNEKGDKHPFANVDSAATDLGQFDPSAENEDGKFRFFDKEQ',
                'YPQRREGAPADAANLQSFDPALMPMQGMQGGQMTGMAGGQFLPFNPNLQMGYKRDFDENLEKRKQHSQFNADENKAPFDSEENFMNFLHNEKGDKHPFANVDSAATDLGQFDPSAENEDGKFRFFDKEQ',
                'Unavailable',
                'B2',
                'Unidentified',
                0.00,
                'Unavailable',
                354.82,
                'Unpublished',
                292,
                129,
                0,
                'Cysteine-Free',
                'Unidentifiable'
            ),
            (
                '215429_CM1_18',
                'Conus magus',
                '215429_CM1',
                'LLWSDMVKYMTPKWGVFTVLPVWLIYSPCQTLLWSDMVKYMTPKWGVFTVLPVWLIYSPCQTLMPALPSPLAPRFWGYLPHASLNELMPALPSPLAPRFWGYLPHASLNE',
                'Partial',
                'LLWSDMVKYMTPKWGVFTVLPVWLIYSPCQT',
                'LLWSDMVKYMTPKWGVFTVLPVWLIYSPCQTLMPALPSPLAPRFWGYLPHASLNE',
                'LMPALPSPLAPRFWGYLPHASLNE',
                'Unavailable',
                'Z',
                'Unidentified',
                0.00,
                'Unavailable',
                1.53,
                'Unpublished',
                110,
                24,
                0,
                'Cysteine-Free',
                'Unidentifiable'
            ),
            (
                '215429_CM1_19',
                'Conus magus',
                '215429_CM1',
                'MGMRTMFTVFLLVVLATTVVSMGMRTMFTVFLLVVLATTVVSDRASNRENRRASNWNTRIAYIGCCDIPDCYNKNREQCLDESSASNWNTRIAYIGCCDIPDCYNKNREQCLDESS',
                'Partial',
                'MGMRTMFTVFLLVVLATTVVS',
                'MGMRTMFTVFLLVVLATTVVSDRASNRENRRASNWNTRIAYIGCCDIPDCYNKNREQCLDESS',
                'ASNWNTRIAYIGCCDIPDCYNKNREQCLDESS',
                'Unavailable',
                'A',
                'Im1.95',
                100,
                'Unavailable',
                0,
                'Unpublished',
                116,
                32,
                4,
                'CC-C-C',
                'I'
            ),
            (
                '215429_CM1_20',
                'Conus magus',
                '215429_CM1',
                'MSGLGIMLLALLLLVSLETSLPGGGEGMSGLGIMLLALLLLVSLETSLPGGGEGQAMSREKNPQGSRKILLRRALQKLRKPPRGTKKSASHDFPLTAFVAQAMSREKNPQGSRKILLRRALQKLRKPPRGTKKSASHDFPLTAFVA',
                'Partial',
                'MSGLGIMLLALLLLVSLETSLPGGGEG',
                'MSGLGIMLLALLLLVSLETSLPGGGEGQAMSREKNPQGSRKILLRRALQKLRKPPRGTKKSASHDFPLTAFVA',
                'QAMSREKNPQGSRKILLRRALQKLRKPPRGTKKSASHDFPLTAFVA',
                'Unavailable',
                'O3',
                'Unidentified',
                0.00,
                'Unavailable',
                2.08,
                'Unpublished',
                146,
                46,
                0,
                'Cysteine-Free',
                'Unidentifiable'
            ),
            (
                '215429_CM1_21',
                'Conus magus',
                '215429_CM1',
                'MSTPRMMPLVLLLLLSLATHCGDGMSTPRMMPLVLLLLLSLATHCGDGQAIQGDRRLSARLLRGYKERGLSIKTCGTCNGARCCGLCPCSPGEKNCSCLPFTCGTCNGARCCGLCPCSPGEKNCSCLPF',
                'Partial',
                'MSTPRMMPLVLLLLLSLATHCGDG',
                'MSTPRMMPLVLLLLLSLATHCGDGQAIQGDRRLSARLLRGYKERGLSIKTCGTCNGARCCGLCPCSPGEKNCSCLPF',
                'TCGTCNGARCCGLCPCSPGEKNCSCLPF',
                'Unavailable',
                'V',
                'Unidentified',
                0.00,
                'Unavailable',
                0,
                'Unpublished',
                129,
                28,
                8,
                'C-C-CC-C-C-C-C',
                'XV'
            ),
            (
                '215429_CM1_22',
                'Conus magus',
                '215429_CM1',
                'MKLTCVLIVAVLFLTACHLMKLTCVLIVAVLFLTACHLITTDDSTGKQRYQAWKLRSKMQNSVLSRLSKRCDEEGTGCSSDSECCSGRCTPEGLFEFCECDEEGTGCSSDSECCSGRCTPEGLFEFCE',
                'Partial',
                'MKLTCVLIVAVLFLTACHL',
                'MKLTCVLIVAVLFLTACHLITTDDSTGKQRYQAWKLRSKMQNSVLSRLSKRCDEEGTGCSSDSECCSGRCTPEGLFEFCE',
                'CDEEGTGCSSDSECCSGRCTPEGLFEFCE',
                'Unavailable',
                'O1',
                'Conotoxin-1',
                100,
                'Unavailable',
                7.52,
                'Unpublished',
                128,
                29,
                6,
                'C-C-CC-C-C',
                'VI/VII'
            ),
            (
                '215429_CM1_23',
                'Conus magus',
                '215429_CM1',
                'MKLTYALIVAMLFLTACQLMKLTYALIVAMLFLTACQLITTHDSRGRQEYRAANARTKMQNYKIFRLTKGCVAPGGRCTLRHINCCSKVCKLKKNGNPVCVLTKGCVAPGGRCTLRHINCCSKVCKLKKNGNPVCV',
                'Partial',
                'MKLTYALIVAMLFLTACQL',
                'MKLTYALIVAMLFLTACQLITTHDSRGRQEYRAANARTKMQNYKIFRLTKGCVAPGGRCTLRHINCCSKVCKLKKNGNPVCV',
                'LTKGCVAPGGRCTLRHINCCSKVCKLKKNGNPVCV',
                'Unavailable',
                'O1',
                'Unidentified',
                0.00,
                'Unavailable',
                0.73,
                'Unpublished',
                136,
                35,
                6,
                'C-C-CC-C-C',
                'VI/VII'
            ),
            (
                '215429_CM1_24',
                'Conus magus',
                '215429_CM1',
                'MVISISISSPCLGLLLASVRVTGMVISISISSPCLGLLLASVRVTGVGVTGVGNFKGAVLGQTQWRPPEGGLAVAGSVTKQLRSSVGDSAAGFLHVLDVGVTGVGNFKGAVLGQTQWRPPEGGLAVAGSVTKQLRSSVGDSAAGFLHVLD',
                'Partial',
                'MVISISISSPCLGLLLASVRVTG',
                'MVISISISSPCLGLLLASVRVTGVGVTGVGNFKGAVLGQTQWRPPEGGLAVAGSVTKQLRSSVGDSAAGFLHVLD',
                'VGVTGVGNFKGAVLGQTQWRPPEGGLAVAGSVTKQLRSSVGDSAAGFLHVLD',
                'Unavailable',
                'W',
                'Unidentified',
                0.00,
                'Unavailable',
                0.79,
                'Unpublished',
                150,
                52,
                0,
                'Cysteine-Free',
                'Unidentifiable'
            )
            ON CONFLICT (id) DO NOTHING;
        `;

        // seed BARCODE table
        await sql`
            INSERT INTO barcode
            (
                species_name,
                specimen_id,
                gene_marker,
                length_sequence,
                sequence,
                source_method,
                collection_province,
                collection_site,
                platform_sequence,
                db_sequence,
                accession_external,
                validation_status,
                publication_doi
            )
            
            VALUES
            ('Conus eburneus','856252_CE1','Unavailable',0,'Unavailable','Unavailable','Cebu','Caw-oy','Novaseq6000','Unavailable','Unavailable','Unavailable','https://doi.org/10.3389/fmars.2025.1616692'),
            ('Conus imperialis','853932_CI1','COI',598,'TATTAAAATTCCGATCAGTTAGAAGCATAGTAATAGCTCCAGCCAAGACAGGCAAAGACAGAAGAAGTAAAATAGCTGTGATTTTTACTGACCACACAAAAAGAGAAAGCCGTTCAAATTTTATTCCCTGTCACCGCATATTAATGATTGTAGTAATAAAATTTACCGCTCCTAAAATAGAAGAAACACCTGCAAGGTGTAGAGAAAAAATTGCTAAATCTACAGAACCGCCGGCATGCGCCAAGTTTCCCGCTAAAGGTGGATACACAGTTCATCCTGTTCCTACCCCCCTCTCTACGGCAGCTGAAGATAGAAGAAGCAATAATGCAGGAGGAAGTAACCAGAAACTTATATTATTCAATCGTGGAAATACCATATCCGGGGCCCCTAACATTAAAGGCACCAATCAGTTTCCAAACCCTCCAATCATTATCGGTATAACTAAAAAAAAAATTATTACAAACGCATGTGCTGTTACAATCACGTTGTATAGCTGGTCATCCCCAAGTAAGGCACCAGGTTGCCCTAATTCCGCACGGATTAGAAGCCTTAAAGCGGTCCCAACCAGCCCTGATCATATACCAAATAAAATATACAA','Transcriptome-derived','Cebu','Caw-oy','NextSeq500','In-house database','Unavailable','Putative','Under Review'),
            ('Conus tessulatus','856256_CT1','Unavailable',0,'Unavailable','Unavailable','Cebu','Caw-oy','HiSeq 2000','Unavailable','Unavailable','Unavailable','https://doi.org/10.3389/fmars.2025.1616692'),
            ('Conus mustelinus','852344_CM1','Unavailable',0,'Unavailable','Unavailable','Cebu','Caw-oy','HiSeq 2000','Unavailable','Unavailable','Unavailable','https://doi.org/10.3390/md23070266'),
            ('Conus miles', '852343 _CM1','Unavailable',0,'Unavailable','Transcriptome-derived','Marinduque','Buenavista','HiSeq 2000','Unavailable','Unavailable','Putative','https://doi.org/10.3390/md23070266'),
            ('Conus capitaneus','852340_CC1','Unavailable',0,'Unavailable','Transcriptome-derived','Cebu','Caw-oy','HiSeq 2000','Unavailable','Unavailable','Putative','https://doi.org/10.3390/md23070266')
            ON CONFLICT (specimen_id) DO NOTHING;
        `;

        // seed PUBLICATION table
        await sql`
            INSERT INTO publication
            (
                id,
                title,
                author, 
                year_published, 
                journal,
                doi,
                species_reported 
            )
            VALUES 
            (
                1,
                'Analysis of venom gland transcriptomes from two Tesseliconus species, Conus eburneus and Conus tessulatus, reveals inter- and intra-specific variations in conopeptide diversity and expression as well as putative novel gene superfamilies and disulfide-poor venom components',
                'Francis A. Tablizo, Dan Jethro M. Masacupan, Arturo O. Lluisma',
                2025,
                'Frontiers in Marine Science',
                'https://doi.org/10.3389/fmars.2025.1616692',
                '856252_CE1, 856256_CT1'
            ),
            (   
                2,
                'Identification of Conomarphin Variants in the Conus eburneus Venom and the Effect of Sequence and PTM Variations on Conomarphin Conformations',
                'Corazon Ericka Mae M. Itang, Jokent T. Gaza, Dan Jethro M. Masacupan, Dessa Camille R. Batoctoy, Yu-Ju Chen, Ricky B. Nellas, Eizadora T. Yu',
                2020,
                'Marine Drugs',
                'https://doi.org/10.3390/md18100503',
                '856252_CE2'
            ),
            (   
                3,
                'Conomarphins cause paralysis in mollusk: Critical and tunable structural elements for bioactivity',
                'Charmaine B. Mendoza, Dan Jethro M. Masacupan, Dessa Camille R. Batoctoy, Eizadora T. Yu, Arturo O. Lluisma, Lilibeth A. Salvador-Reyes',
                2019,
                'Journal of Peptide Science',
                'https://doi.org/10.1002/psc.3179',
                '856252_CE2'
            ),
            (   
                4,
                'Diversity and Novelty of Venom Peptides in Vermivorous Cone Snails, Subgenus Rhizoconus (Gastropoda: Mollusca)',
                'Christine Marie C. Florece, Quentin Kaas, Neda Barghi, Arturo O. Lluisma',
                2025,
                'Marine Drugs',
                'https://doi.org/10.3390/md23070266',
                '852344_CM1, 852343_CM1, 852340_CC1'
            ),
            (   
                5,
                'Diversity and novelty of venom peptides from Conus (Asprella) rolani revealed by analysis of its venom duct transcriptome',
                'Ryoichi S. Taguchi, Dan Jethro M. Masacupan, Arturo O. Lluisma',
                2024,
                'SciEnggJ',
                'https://doi.org/10.54645/202417SupQCH-42',
                '843072_CR1'
            ),
            (   
                6,
                'Prey Shifts Drive Venom Evolution in Cone Snails',
                'Thomas Lund Koch, Samuel D Robinson, Paula Flórez Salcedo, Kevin Chase, Jason Biggs, Alexander E Fedosov, Mark Yandell, Baldomero M Olivera, Helena Safavi-Hemami',
                2024,
                'Molecular Biology and Evolution',
                'https://doi.org/10.1093/molbev/msae120',
                '853645_CT1'
            ),
            (   
                7,
                'Comparison of the Venom Peptides and Their Expression in Closely Related Conus Species: Insights into Adaptive Post-speciation Evolution of Conus Exogenomes',
                'Neda Barghi, Gisela P. Concepcion, Baldomero M. Olivera, Arturo O. Lluisma',
                2015,
                'Genome Biology and Evolution',
                'https://doi.org/10.1093/gbe/evv109',
                '853642_CL1, 853645_CT2'
            ),
            (   
                8,
                'The Venom Repertoire of Conus gloriamaris (Chemnitz, 1777), the Glory of the Sea',
                'Samuel D. Robinson, Qing Li, Aiping Lu, Pradip K. Bandyopadhyay, Mark Yandell, Baldomero M. Olivera, Helena Safavi-Hemami',
                2017,
                'Marine Drugs',
                'https://doi.org/10.3390/md15050145',
                '843253_CG1'
            )
            ON CONFLICT (id) DO NOTHING;
        `;
        // seed TAXONOMIC table
        await sql `
            INSERT INTO taxonomic 
            (
                id,
                domain, 
                kingdom, 
                phylum,
                class,
                taxonomy_order, 
                family,
                genus,
                subgenus, 
                species 
            )
            VALUES
            ('856252_CE1','Eukaryota','Metazoa','Mollusca','Gastropoda','Neogastropoda','Conida','Conus','Tesseliconus','Conus eburneus'),
            ('856252_CE2','Eukaryota','Metazoa','Mollusca','Gastropoda','Neogastropoda','Conida','Conus','Tesseliconus','Conus eburneus'),
            ('853932_CI1','Eukaryota','Metazoa','Mollusca','Gastropoda','Neogastropoda','Conida','Conus','Stephanoconus','Conus imperialis'),
            ('856256_CT1','Eukaryota','Metazoa','Mollusca','Gastropoda','Neogastropoda','Conida','Conus','Tesseliconus','Conus tessulatus'),
            ('852344_CM1','Eukaryota','Metazoa','Mollusca','Gastropoda','Neogastropoda','Conida','Conus','Rhizoconus','Conus mustelinus'),
            ('852343_CM1','Eukaryota','Metazoa','Mollusca','Gastropoda','Neogastropoda','Conida','Conus','Rhizoconus','Conus miles'),
            ('852340_CC1','Eukaryota','Metazoa','Mollusca','Gastropoda','Neogastropoda','Conida','Conus','Rhizoconus','Conus capitaneus'),
            ('215429_CM1','Eukaryota','Metazoa','Mollusca','Gastropoda','Neogastropoda','Conida','Conus','Pionoconus','Conus magus'),
            ('428368_CS1','Eukaryota','Metazoa','Mollusca','Gastropoda','Neogastropoda','Conida','Conus','Pionoconus','Conus striolatus'),
            ('428363_CS1','Eukaryota','Metazoa','Mollusca','Gastropoda','Neogastropoda','Conida','Conus','Pionoconus','Conus stercusmuscarum'),
            ('843072_CR1','Eukaryota','Metazoa','Mollusca','Gastropoda','Neogastropoda','Conida','Conus','Asprella','Conus rolani'),
            ('853645_CT1','Eukaryota','Metazoa','Mollusca','Gastropoda','Neogastropoda','Conida','Conus','Splinoconus','Conus tribblei'),
            ('853642_CL1','Eukaryota','Metazoa','Mollusca','Gastropoda','Neogastropoda','Conida','Conus','Splinoconus','Conus lenavati'),
            ('853645_CT2','Eukaryota','Metazoa','Mollusca','Gastropoda','Neogastropoda','Conida','Conus','Splinoconus','Conus tribblei'),
            ('845894_CG1','Eukaryota','Metazoa','Mollusca','Gastropoda','Neogastropoda','Conida','Conus','Gastridium','Conus geographus'),
            ('843253_CG1','Eukaryota','Metazoa','Mollusca','Gastropoda','Neogastropoda','Conida','Conus','Cylinder','Conus gloriamaris'),
            ('836797_CB1','Eukaryota','Metazoa','Mollusca','Gastropoda','Neogastropoda','Conida','Conus','Conus','Conus bandanus'),
            ('428363_CS2','Eukaryota','Metazoa','Mollusca','Gastropoda','Neogastropoda','Conida','Conus','Pionoconus','Conus stercusmuscarum'),
            ('848247_CF1','Eukaryota','Metazoa','Mollusca','Gastropoda','Neogastropoda','Conida','Conus','Phasmoconus','Conus flavus')
            ON CONFLICT (id) DO NOTHING;
        `;



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
