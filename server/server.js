import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const port = process.env.PORT;
const API_URL = process.env.API_URL;
const CONT_URL = process.env.CONT_URL;
const CLIENT_URL = process.env.CLIENT_URL;
const CLIENT_URL_2 = process.env.CLIENT_URL_2;

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests to API please try again in an hour",
});

app.use(
  cors({
    origin: [CLIENT_URL, CLIENT_URL_2],
    methods: ["POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight requests first
// app.options(/.*/, cors());

// Skip rate limiter for OPTIONS
// app.use((req, res, next) => {
//   if (req.method === "OPTIONS") return next();
//   limiter(req, res, next);
// });

app.use("/", limiter);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let selectedCountry;

const sectors = [
  "buildings",
  "manufacturing",
  "fossil-fuel-operations",
  "agriculture",
  "transportation",
  "forestry-and-land-use",
  "mineral-extraction",
  "power",
];

const countries = [
  {
    alpha3: "ABW",
    alpha2: "AW",
    name: "Aruba",
    continent: "North America",
  },
  {
    alpha3: "AFG",
    alpha2: "AF",
    name: "Afghanistan",
    continent: "Asia",
  },
  { alpha3: "AGO", alpha2: "AO", name: "Angola", continent: "Africa" },
  {
    alpha3: "AIA",
    alpha2: "AI",
    name: "Anguilla",
    continent: "North America",
  },
  {
    alpha3: "ALA",
    alpha2: "AX",
    name: "Åland Islands",
    continent: "Europe",
  },
  { alpha3: "ALB", alpha2: "AL", name: "Albania", continent: "Europe" },
  { alpha3: "AND", alpha2: "AD", name: "Andorra", continent: "Europe" },
  {
    alpha3: "ARE",
    alpha2: "AE",
    name: "United Arab Emirates",
    continent: "Asia",
  },
  {
    alpha3: "ARG",
    alpha2: "AR",
    name: "Argentina",
    continent: "South America",
  },
  { alpha3: "ARM", alpha2: "AM", name: "Armenia", continent: "Asia" },
  {
    alpha3: "ASM",
    alpha2: "AS",
    name: "American Samoa",
    continent: "Oceania",
  },
  {
    alpha3: "ATA",
    alpha2: "AQ",
    name: "Antarctica",
    continent: "Antarctica",
  },
  {
    alpha3: "ATF",
    alpha2: "TF",
    name: "French Southern Territories",
    continent: "Antarctica",
  },
  {
    alpha3: "ATG",
    alpha2: "AG",
    name: "Antigua and Barbuda",
    continent: "North America",
  },
  {
    alpha3: "AUS",
    alpha2: "AU",
    name: "Australia",
    continent: "Oceania",
  },
  { alpha3: "AUT", alpha2: "AT", name: "Austria", continent: "Europe" },
  {
    alpha3: "AZE",
    alpha2: "AZ",
    name: "Azerbaijan",
    continent: "Asia",
  },
  { alpha3: "BDI", alpha2: "BI", name: "Burundi", continent: "Africa" },
  { alpha3: "BEL", alpha2: "BE", name: "Belgium", continent: "Europe" },
  { alpha3: "BEN", alpha2: "BJ", name: "Benin", continent: "Africa" },
  {
    alpha3: "BES",
    alpha2: "BQ",
    name: "Bonaire, Sint Eustatius and Saba",
    continent: "South America",
  },
  {
    alpha3: "BFA",
    alpha2: "BF",
    name: "Burkina Faso",
    continent: "Africa",
  },
  {
    alpha3: "BGD",
    alpha2: "BD",
    name: "Bangladesh",
    continent: "Asia",
  },
  {
    alpha3: "BGR",
    alpha2: "BG",
    name: "Bulgaria",
    continent: "Europe",
  },
  { alpha3: "BHR", alpha2: "BH", name: "Bahrain", continent: "Asia" },
  {
    alpha3: "BHS",
    alpha2: "BS",
    name: "Bahamas",
    continent: "North America",
  },
  {
    alpha3: "BIH",
    alpha2: "BA",
    name: "Bosnia and Herzegovina",
    continent: "Europe",
  },
  {
    alpha3: "BLM",
    alpha2: "BL",
    name: "Saint Barthélemy",
    continent: "North America",
  },
  { alpha3: "BLR", alpha2: "BY", name: "Belarus", continent: "Europe" },
  {
    alpha3: "BLZ",
    alpha2: "BZ",
    name: "Belize",
    continent: "North America",
  },
  {
    alpha3: "BMU",
    alpha2: "BM",
    name: "Bermuda",
    continent: "North America",
  },
  {
    alpha3: "BOL",
    alpha2: "BO",
    name: "Bolivia (Plurinational State of)",
    continent: "South America",
  },
  {
    alpha3: "BRA",
    alpha2: "BR",
    name: "Brazil",
    continent: "South America",
  },
  {
    alpha3: "BRB",
    alpha2: "BB",
    name: "Barbados",
    continent: "North America",
  },
  {
    alpha3: "BRN",
    alpha2: "BN",
    name: "Brunei Darussalam",
    continent: "Asia",
  },
  { alpha3: "BTN", alpha2: "BT", name: "Bhutan", continent: "Asia" },
  {
    alpha3: "BVT",
    alpha2: "BV",
    name: "Bouvet Island",
    continent: "Antarctica",
  },
  {
    alpha3: "BWA",
    alpha2: "BW",
    name: "Botswana",
    continent: "Africa",
  },
  {
    alpha3: "CAF",
    alpha2: "CF",
    name: "Central African Republic",
    continent: "Africa",
  },
  {
    alpha3: "CAN",
    alpha2: "CA",
    name: "Canada",
    continent: "North America",
  },
  {
    alpha3: "CCK",
    alpha2: "CC",
    name: "Cocos (Keeling) Islands",
    continent: "Asia",
  },
  {
    alpha3: "CHE",
    alpha2: "CH",
    name: "Switzerland",
    continent: "Europe",
  },
  {
    alpha3: "CHL",
    alpha2: "CL",
    name: "Chile",
    continent: "South America",
  },
  { alpha3: "CHN", alpha2: "CN", name: "China", continent: "Asia" },
  {
    alpha3: "CIV",
    alpha2: "CI",
    name: "Côte d'Ivoire",
    continent: "Africa",
  },
  {
    alpha3: "CMR",
    alpha2: "CM",
    name: "Cameroon",
    continent: "Africa",
  },
  {
    alpha3: "COD",
    alpha2: "CD",
    name: "Democratic Republic of the Congo",
    continent: "Africa",
  },
  { alpha3: "COG", alpha2: "CG", name: "Congo", continent: "Africa" },
  {
    alpha3: "COK",
    alpha2: "CK",
    name: "Cook Islands",
    continent: "Oceania",
  },
  {
    alpha3: "COL",
    alpha2: "CO",
    name: "Colombia",
    continent: "South America",
  },
  { alpha3: "COM", alpha2: "KM", name: "Comoros", continent: "Africa" },
  {
    alpha3: "CPV",
    alpha2: "CV",
    name: "Cabo Verde",
    continent: "Africa",
  },
  {
    alpha3: "CRI",
    alpha2: "CR",
    name: "Costa Rica",
    continent: "North America",
  },
  {
    alpha3: "CUB",
    alpha2: "CU",
    name: "Cuba",
    continent: "North America",
  },
  {
    alpha3: "CUW",
    alpha2: "CW",
    name: "Curaçao",
    continent: "North America",
  },
  {
    alpha3: "CXR",
    alpha2: "CX",
    name: "Christmas Island",
    continent: "Asia",
  },
  {
    alpha3: "CYM",
    alpha2: "KY",
    name: "Cayman Islands",
    continent: "North America",
  },
  { alpha3: "CYP", alpha2: "CY", name: "Cyprus", continent: "Europe" },
  { alpha3: "CZE", alpha2: "CZ", name: "Czechia", continent: "Europe" },
  { alpha3: "DEU", alpha2: "DE", name: "Germany", continent: "Europe" },
  {
    alpha3: "DJI",
    alpha2: "DJ",
    name: "Djibouti",
    continent: "Africa",
  },
  {
    alpha3: "DMA",
    alpha2: "DM",
    name: "Dominica",
    continent: "North America",
  },
  { alpha3: "DNK", alpha2: "DK", name: "Denmark", continent: "Europe" },
  {
    alpha3: "DOM",
    alpha2: "DO",
    name: "Dominican Republic",
    continent: "North America",
  },
  { alpha3: "DZA", alpha2: "DZ", name: "Algeria", continent: "Africa" },
  {
    alpha3: "ECU",
    alpha2: "EC",
    name: "Ecuador",
    continent: "South America",
  },
  { alpha3: "EGY", alpha2: "EG", name: "Egypt", continent: "Africa" },
  { alpha3: "ERI", alpha2: "ER", name: "Eritrea", continent: "Africa" },
  {
    alpha3: "ESH",
    alpha2: "EH",
    name: "Western Sahara",
    continent: "Africa",
  },
  { alpha3: "ESP", alpha2: "ES", name: "Spain", continent: "Europe" },
  { alpha3: "EST", alpha2: "EE", name: "Estonia", continent: "Europe" },
  {
    alpha3: "ETH",
    alpha2: "ET",
    name: "Ethiopia",
    continent: "Africa",
  },
  { alpha3: "FIN", alpha2: "FI", name: "Finland", continent: "Europe" },
  { alpha3: "FJI", alpha2: "FJ", name: "Fiji", continent: "Oceania" },
  {
    alpha3: "FLK",
    alpha2: "FK",
    name: "Falkland Islands (Malvinas)",
    continent: "South America",
  },
  { alpha3: "FRA", alpha2: "FR", name: "France", continent: "Europe" },
  {
    alpha3: "FRO",
    alpha2: "FO",
    name: "Faroe Islands",
    continent: "Europe",
  },
  {
    alpha3: "FSM",
    alpha2: "FM",
    name: "Micronesia (Federated States of)",
    continent: "Oceania",
  },
  { alpha3: "GAB", alpha2: "GA", name: "Gabon", continent: "Africa" },
  {
    alpha3: "GBR",
    alpha2: "GB",
    name: "United Kingdom of Great Britain and Northern Ireland",
    continent: "Europe",
  },
  { alpha3: "GEO", alpha2: "GE", name: "Georgia", continent: "Asia" },
  {
    alpha3: "GGY",
    alpha2: "GG",
    name: "Guernsey",
    continent: "Europe",
  },
  { alpha3: "GHA", alpha2: "GH", name: "Ghana", continent: "Africa" },
  {
    alpha3: "GIB",
    alpha2: "GI",
    name: "Gibraltar",
    continent: "Europe",
  },
  { alpha3: "GIN", alpha2: "GN", name: "Guinea", continent: "Africa" },
  {
    alpha3: "GLP",
    alpha2: "GP",
    name: "Guadeloupe",
    continent: "North America",
  },
  { alpha3: "GMB", alpha2: "GM", name: "Gambia", continent: "Africa" },
  {
    alpha3: "GNB",
    alpha2: "GW",
    name: "Guinea-Bissau",
    continent: "Africa",
  },
  {
    alpha3: "GNQ",
    alpha2: "GQ",
    name: "Equatorial Guinea",
    continent: "Africa",
  },
  { alpha3: "GRC", alpha2: "GR", name: "Greece", continent: "Europe" },
  {
    alpha3: "GRD",
    alpha2: "GD",
    name: "Grenada",
    continent: "North America",
  },
  {
    alpha3: "GRL",
    alpha2: "GL",
    name: "Greenland",
    continent: "North America",
  },
  {
    alpha3: "GTM",
    alpha2: "GT",
    name: "Guatemala",
    continent: "North America",
  },
  {
    alpha3: "GUF",
    alpha2: "GF",
    name: "French Guiana",
    continent: "South America",
  },
  { alpha3: "GUM", alpha2: "GU", name: "Guam", continent: "Oceania" },
  {
    alpha3: "GUY",
    alpha2: "GY",
    name: "Guyana",
    continent: "South America",
  },
  {
    alpha3: "HKG",
    alpha2: "HK",
    name: "China, Hong Kong Special Administrative Region",
    continent: "Asia",
  },
  {
    alpha3: "HMD",
    alpha2: "HM",
    name: "Heard Island and McDonald Islands",
    continent: "Oceania",
  },
  {
    alpha3: "HND",
    alpha2: "HN",
    name: "Honduras",
    continent: "North America",
  },
  { alpha3: "HRV", alpha2: "HR", name: "Croatia", continent: "Europe" },
  {
    alpha3: "HTI",
    alpha2: "HT",
    name: "Haiti",
    continent: "North America",
  },
  { alpha3: "HUN", alpha2: "HU", name: "Hungary", continent: "Europe" },
  { alpha3: "IDN", alpha2: "ID", name: "Indonesia", continent: "Asia" },
  {
    alpha3: "IMN",
    alpha2: "IM",
    name: "Isle of Man",
    continent: "Europe",
  },
  { alpha3: "IND", alpha2: "IN", name: "India", continent: "Asia" },
  {
    alpha3: "IOT",
    alpha2: "IO",
    name: "British Indian Ocean Territory",
    continent: "Africa",
  },
  { alpha3: "IRL", alpha2: "IE", name: "Ireland", continent: "Europe" },
  {
    alpha3: "IRN",
    alpha2: "IR",
    name: "Iran (Islamic Republic of)",
    continent: "Asia",
  },
  { alpha3: "IRQ", alpha2: "IQ", name: "Iraq", continent: "Asia" },
  { alpha3: "ISL", alpha2: "IS", name: "Iceland", continent: "Europe" },
  { alpha3: "ISR", alpha2: "IL", name: "Israel", continent: "Asia" },
  { alpha3: "ITA", alpha2: "IT", name: "Italy", continent: "Europe" },
  {
    alpha3: "JAM",
    alpha2: "JM",
    name: "Jamaica",
    continent: "North America",
  },
  { alpha3: "JEY", alpha2: "JE", name: "Jersey", continent: "Europe" },
  { alpha3: "JOR", alpha2: "JO", name: "Jordan", continent: "Asia" },
  { alpha3: "JPN", alpha2: "JP", name: "Japan", continent: "Asia" },
  {
    alpha3: "KAZ",
    alpha2: "KZ",
    name: "Kazakhstan",
    continent: "Asia",
  },
  { alpha3: "KEN", alpha2: "KE", name: "Kenya", continent: "Africa" },
  {
    alpha3: "KGZ",
    alpha2: "KG",
    name: "Kyrgyzstan",
    continent: "Asia",
  },
  { alpha3: "KHM", alpha2: "KH", name: "Cambodia", continent: "Asia" },
  {
    alpha3: "KIR",
    alpha2: "KI",
    name: "Kiribati",
    continent: "Oceania",
  },
  {
    alpha3: "KNA",
    alpha2: "KN",
    name: "Saint Kitts and Nevis",
    continent: "North America",
  },
  {
    alpha3: "KOR",
    alpha2: "KR",
    name: "Republic of Korea",
    continent: "Asia",
  },
  { alpha3: "XKX", alpha2: "XK", name: "Kosovo", continent: "Europe" },
  { alpha3: "KWT", alpha2: "KW", name: "Kuwait", continent: "Asia" },
  {
    alpha3: "LAO",
    alpha2: "LA",
    name: "Lao People's Democratic Republic",
    continent: "Asia",
  },
  { alpha3: "LBN", alpha2: "LB", name: "Lebanon", continent: "Asia" },
  { alpha3: "LBR", alpha2: "LR", name: "Liberia", continent: "Africa" },
  { alpha3: "LBY", alpha2: "LY", name: "Libya", continent: "Africa" },
  {
    alpha3: "LCA",
    alpha2: "LC",
    name: "Saint Lucia",
    continent: "North America",
  },
  {
    alpha3: "LIE",
    alpha2: "LI",
    name: "Liechtenstein",
    continent: "Europe",
  },
  { alpha3: "LKA", alpha2: "LK", name: "Sri Lanka", continent: "Asia" },
  { alpha3: "LSO", alpha2: "LS", name: "Lesotho", continent: "Africa" },
  {
    alpha3: "LTU",
    alpha2: "LT",
    name: "Lithuania",
    continent: "Europe",
  },
  {
    alpha3: "LUX",
    alpha2: "LU",
    name: "Luxembourg",
    continent: "Europe",
  },
  { alpha3: "LVA", alpha2: "LV", name: "Latvia", continent: "Europe" },
  {
    alpha3: "MAC",
    alpha2: "MO",
    name: "China, Macao Special Administrative Region",
    continent: "Asia",
  },
  {
    alpha3: "MAF",
    alpha2: "MF",
    name: "Saint Martin (French Part)",
    continent: "North America",
  },
  { alpha3: "MAR", alpha2: "MA", name: "Morocco", continent: "Africa" },
  { alpha3: "MCO", alpha2: "MC", name: "Monaco", continent: "Europe" },
  {
    alpha3: "MDA",
    alpha2: "MD",
    name: "Republic of Moldova",
    continent: "Europe",
  },
  {
    alpha3: "MDG",
    alpha2: "MG",
    name: "Madagascar",
    continent: "Africa",
  },
  { alpha3: "MDV", alpha2: "MV", name: "Maldives", continent: "Asia" },
  {
    alpha3: "MEX",
    alpha2: "MX",
    name: "Mexico",
    continent: "North America",
  },
  {
    alpha3: "MHL",
    alpha2: "MH",
    name: "Marshall Islands",
    continent: "Oceania",
  },
  {
    alpha3: "MKD",
    alpha2: "MK",
    name: "The former Yugoslav Republic of Macedonia",
    continent: "Europe",
  },
  { alpha3: "MLI", alpha2: "ML", name: "Mali", continent: "Africa" },
  { alpha3: "MLT", alpha2: "MT", name: "Malta", continent: "Europe" },
  { alpha3: "MMR", alpha2: "MM", name: "Myanmar", continent: "Asia" },
  {
    alpha3: "MNE",
    alpha2: "ME",
    name: "Montenegro",
    continent: "Europe",
  },
  { alpha3: "MNG", alpha2: "MN", name: "Mongolia", continent: "Asia" },
  {
    alpha3: "MNP",
    alpha2: "MP",
    name: "Northern Mariana Islands",
    continent: "Oceania",
  },
  {
    alpha3: "MOZ",
    alpha2: "MZ",
    name: "Mozambique",
    continent: "Africa",
  },
  {
    alpha3: "MRT",
    alpha2: "MR",
    name: "Mauritania",
    continent: "Africa",
  },
  {
    alpha3: "MSR",
    alpha2: "MS",
    name: "Montserrat",
    continent: "North America",
  },
  {
    alpha3: "MTQ",
    alpha2: "MQ",
    name: "Martinique",
    continent: "North America",
  },
  {
    alpha3: "MUS",
    alpha2: "MU",
    name: "Mauritius",
    continent: "Africa",
  },
  { alpha3: "MWI", alpha2: "MW", name: "Malawi", continent: "Africa" },
  { alpha3: "MYS", alpha2: "MY", name: "Malaysia", continent: "Asia" },
  { alpha3: "MYT", alpha2: "YT", name: "Mayotte", continent: "Africa" },
  { alpha3: "NAM", alpha2: "NA", name: "Namibia", continent: "Africa" },
  {
    alpha3: "NCL",
    alpha2: "NC",
    name: "New Caledonia",
    continent: "Oceania",
  },
  { alpha3: "NER", alpha2: "NE", name: "Niger", continent: "Africa" },
  {
    alpha3: "NFK",
    alpha2: "NF",
    name: "Norfolk Island",
    continent: "Oceania",
  },
  { alpha3: "NGA", alpha2: "NG", name: "Nigeria", continent: "Africa" },
  {
    alpha3: "NIC",
    alpha2: "NI",
    name: "Nicaragua",
    continent: "North America",
  },
  { alpha3: "NIU", alpha2: "NU", name: "Niue", continent: "Oceania" },
  {
    alpha3: "NLD",
    alpha2: "NL",
    name: "Netherlands",
    continent: "Europe",
  },
  { alpha3: "NOR", alpha2: "NO", name: "Norway", continent: "Europe" },
  { alpha3: "NPL", alpha2: "NP", name: "Nepal", continent: "Asia" },
  { alpha3: "NRU", alpha2: "NR", name: "Nauru", continent: "Oceania" },
  {
    alpha3: "NZL",
    alpha2: "NZ",
    name: "New Zealand",
    continent: "Oceania",
  },
  { alpha3: "OMN", alpha2: "OM", name: "Oman", continent: "Asia" },
  { alpha3: "PAK", alpha2: "PK", name: "Pakistan", continent: "Asia" },
  {
    alpha3: "PAN",
    alpha2: "PA",
    name: "Panama",
    continent: "North America",
  },
  {
    alpha3: "PCN",
    alpha2: "PN",
    name: "Pitcairn",
    continent: "Oceania",
  },
  {
    alpha3: "PER",
    alpha2: "PE",
    name: "Peru",
    continent: "South America",
  },
  {
    alpha3: "PHL",
    alpha2: "PH",
    name: "Philippines",
    continent: "Asia",
  },
  { alpha3: "PLW", alpha2: "PW", name: "Palau", continent: "Oceania" },
  {
    alpha3: "PNG",
    alpha2: "PG",
    name: "Papua New Guinea",
    continent: "Oceania",
  },
  { alpha3: "POL", alpha2: "PL", name: "Poland", continent: "Europe" },
  {
    alpha3: "PRI",
    alpha2: "PR",
    name: "Puerto Rico",
    continent: "North America",
  },
  {
    alpha3: "PRK",
    alpha2: "KP",
    name: "Democratic People's Republic of Korea",
    continent: "Asia",
  },
  {
    alpha3: "PRT",
    alpha2: "PT",
    name: "Portugal",
    continent: "Europe",
  },
  {
    alpha3: "PRY",
    alpha2: "PY",
    name: "Paraguay",
    continent: "South America",
  },
  {
    alpha3: "PSE",
    alpha2: "PS",
    name: "State of Palestine",
    continent: "Asia",
  },
  {
    alpha3: "PYF",
    alpha2: "PF",
    name: "French Polynesia",
    continent: "Oceania",
  },
  { alpha3: "QAT", alpha2: "QA", name: "Qatar", continent: "Asia" },
  { alpha3: "REU", alpha2: "RE", name: "Réunion", continent: "Africa" },
  { alpha3: "ROU", alpha2: "RO", name: "Romania", continent: "Europe" },
  {
    alpha3: "RUS",
    alpha2: "RU",
    name: "Russian Federation",
    continent: "Europe",
  },
  { alpha3: "RWA", alpha2: "RW", name: "Rwanda", continent: "Africa" },
  {
    alpha3: "SAU",
    alpha2: "SA",
    name: "Saudi Arabia",
    continent: "Asia",
  },
  { alpha3: "SDN", alpha2: "SD", name: "Sudan", continent: "Africa" },
  { alpha3: "SEN", alpha2: "SN", name: "Senegal", continent: "Africa" },
  { alpha3: "SGP", alpha2: "SG", name: "Singapore", continent: "Asia" },
  {
    alpha3: "SGS",
    alpha2: "GS",
    name: "South Georgia and the South Sandwich Islands",
    continent: "South America",
  },
  {
    alpha3: "SHN",
    alpha2: "SH",
    name: "Saint Helena",
    continent: "Africa",
  },
  {
    alpha3: "SJM",
    alpha2: "SJ",
    name: "Svalbard and Jan Mayen Islands",
    continent: "Europe",
  },
  {
    alpha3: "SLB",
    alpha2: "SB",
    name: "Solomon Islands",
    continent: "Oceania",
  },
  {
    alpha3: "SLE",
    alpha2: "SL",
    name: "Sierra Leone",
    continent: "Africa",
  },
  {
    alpha3: "SLV",
    alpha2: "SV",
    name: "El Salvador",
    continent: "North America",
  },
  {
    alpha3: "SMR",
    alpha2: "SM",
    name: "San Marino",
    continent: "Europe",
  },
  { alpha3: "SOM", alpha2: "SO", name: "Somalia", continent: "Africa" },
  {
    alpha3: "SPM",
    alpha2: "PM",
    name: "Saint Pierre and Miquelon",
    continent: "North America",
  },
  { alpha3: "SRB", alpha2: "RS", name: "Serbia", continent: "Europe" },
  {
    alpha3: "SSD",
    alpha2: "SS",
    name: "South Sudan",
    continent: "Africa",
  },
  {
    alpha3: "STP",
    alpha2: "ST",
    name: "Sao Tome and Principe",
    continent: "Africa",
  },
  {
    alpha3: "SUR",
    alpha2: "SR",
    name: "Suriname",
    continent: "South America",
  },
  {
    alpha3: "SVK",
    alpha2: "SK",
    name: "Slovakia",
    continent: "Europe",
  },
  {
    alpha3: "SVN",
    alpha2: "SI",
    name: "Slovenia",
    continent: "Europe",
  },
  { alpha3: "SWE", alpha2: "SE", name: "Sweden", continent: "Europe" },
  {
    alpha3: "SWZ",
    alpha2: "SZ",
    name: "Eswatini",
    continent: "Africa",
  },
  {
    alpha3: "SXM",
    alpha2: "SX",
    name: "Sint Maarten (Dutch part)",
    continent: "North America",
  },
  {
    alpha3: "SYC",
    alpha2: "SC",
    name: "Seychelles",
    continent: "Africa",
  },
  {
    alpha3: "SYR",
    alpha2: "SY",
    name: "Syrian Arab Republic",
    continent: "Asia",
  },
  {
    alpha3: "TCA",
    alpha2: "TC",
    name: "Turks and Caicos Islands",
    continent: "North America",
  },
  { alpha3: "TCD", alpha2: "TD", name: "Chad", continent: "Africa" },
  { alpha3: "TGO", alpha2: "TG", name: "Togo", continent: "Africa" },
  { alpha3: "THA", alpha2: "TH", name: "Thailand", continent: "Asia" },
  {
    alpha3: "TJK",
    alpha2: "TJ",
    name: "Tajikistan",
    continent: "Asia",
  },
  {
    alpha3: "TKL",
    alpha2: "TK",
    name: "Tokelau",
    continent: "Oceania",
  },
  {
    alpha3: "TKM",
    alpha2: "TM",
    name: "Turkmenistan",
    continent: "Asia",
  },
  {
    alpha3: "TLS",
    alpha2: "TL",
    name: "Timor-Leste",
    continent: "Asia",
  },
  { alpha3: "TON", alpha2: "TO", name: "Tonga", continent: "Oceania" },
  {
    alpha3: "TTO",
    alpha2: "TT",
    name: "Trinidad and Tobago",
    continent: "North America",
  },
  { alpha3: "TUN", alpha2: "TN", name: "Tunisia", continent: "Africa" },
  { alpha3: "TUR", alpha2: "TR", name: "Turkey", continent: "Asia" },
  { alpha3: "TUV", alpha2: "TV", name: "Tuvalu", continent: "Oceania" },
  { alpha3: "TWN", alpha2: "TW", name: "Taiwan", continent: "Asia" },
  {
    alpha3: "TZA",
    alpha2: "TZ",
    name: "United Republic of Tanzania",
    continent: "Africa",
  },
  { alpha3: "UGA", alpha2: "UG", name: "Uganda", continent: "Africa" },
  { alpha3: "UKR", alpha2: "UA", name: "Ukraine", continent: "Europe" },
  {
    alpha3: "UMI",
    alpha2: "UM",
    name: "United States Minor Outlying Islands",
    continent: "Oceania",
  },
  {
    alpha3: "URY",
    alpha2: "UY",
    name: "Uruguay",
    continent: "South America",
  },
  {
    alpha3: "USA",
    alpha2: "US",
    name: "United States of America",
    continent: "North America",
  },
  {
    alpha3: "UZB",
    alpha2: "UZ",
    name: "Uzbekistan",
    continent: "Asia",
  },
  {
    alpha3: "VAT",
    alpha2: "VA",
    name: "Holy See",
    continent: "Europe",
  },
  {
    alpha3: "VCT",
    alpha2: "VC",
    name: "Saint Vincent and the Grenadines",
    continent: "North America",
  },
  {
    alpha3: "VEN",
    alpha2: "VE",
    name: "Venezuela (Bolivarian Republic of)",
    continent: "South America",
  },
  {
    alpha3: "VGB",
    alpha2: "VG",
    name: "British Virgin Islands",
    continent: "North America",
  },
  {
    alpha3: "VIR",
    alpha2: "VI",
    name: "United States Virgin Islands",
    continent: "North America",
  },
  { alpha3: "VNM", alpha2: "VN", name: "Viet Nam", continent: "Asia" },
  {
    alpha3: "VUT",
    alpha2: "VU",
    name: "Vanuatu",
    continent: "Oceania",
  },
  {
    alpha3: "WLF",
    alpha2: "WF",
    name: "Wallis and Futuna Islands",
    continent: "Oceania",
  },
  { alpha3: "WSM", alpha2: "WS", name: "Samoa", continent: "Oceania" },
  { alpha3: "YEM", alpha2: "YE", name: "Yemen", continent: "Asia" },
  {
    alpha3: "ZAF",
    alpha2: "ZA",
    name: "South Africa",
    continent: "Africa",
  },
  { alpha3: "ZMB", alpha2: "ZM", name: "Zambia", continent: "Africa" },
  {
    alpha3: "ZNC",
    alpha2: "ZN",
    name: "Turkish Republic of Northern Cyprus",
    continent: "Europe",
  },
  {
    alpha3: "ZWE",
    alpha2: "ZW",
    name: "Zimbabwe",
    continent: "Africa",
  },
  { alpha3: "UNK", alpha2: "UN", name: "Unknown", continent: "Unknown" },
];

function calculateWorldPercentage(data) {
  const countryCo2Percentage =
    (data[0].emissions.co2 / data[0].worldEmissions.co2) * 100;
  const countryCh4Percentage =
    (data[0].emissions.ch4 / data[0].worldEmissions.ch4) * 100;
  return {
    countryCo2Percentage,
    restOfWorldCo2Percentage: 100 - countryCo2Percentage,
    countryCh4Percentage,
    restOfWorldCh4Percentage: 100 - countryCh4Percentage,
  };
}

function calculateContinentPercentage(countryData, continentData) {
  const countryCo2Percentage =
    (countryData[0].emissions.co2 / continentData[0].emissions.co2) * 100;
  const countryCh4Percentage =
    (countryData[0].emissions.ch4 / continentData[0].emissions.ch4) * 100;

  return {
    countryCo2Percentage,
    restOfContinentCo2Percentage: 100 - countryCo2Percentage,
    countryCh4Percentage,
    restOfContinentCh4Percentage: 100 - countryCh4Percentage,
  };
}

app.post("/", async (req, res) => {
  try {
    const alpha2Code = req.body.countryCode;
    selectedCountry = countries.find(
      (country) => country.alpha2 === alpha2Code
    );
    const response = await axios.get(API_URL + selectedCountry.alpha3);
    const continentResponse = await axios.get(
      CONT_URL + selectedCountry.continent
    );
    const data = response.data;
    const continentData = continentResponse.data;

    const worldPercentages = calculateWorldPercentage(data);
    const continentPercentages = calculateContinentPercentage(
      data,
      continentData
    );

    const sendData = {
      country: selectedCountry.name,
      rank: data[0].rank,

      // absolute world values
      co2: data[0].emissions.co2,
      worldCo2: data[0].worldEmissions.co2,
      ch4: data[0].emissions.ch4,
      worldCh4: data[0].worldEmissions.ch4,

      // world percentages
      countryCo2Percentage: worldPercentages.countryCo2Percentage,
      restOfWorldCo2Percentage: worldPercentages.restOfWorldCo2Percentage,
      countryCh4Percentage: worldPercentages.countryCh4Percentage,
      restOfWorldCh4Percentage: worldPercentages.restOfWorldCh4Percentage,

      // continent values
      continent: continentData[0].continent,
      continentRank: continentData[0].rank,
      continentCo2: continentData[0].emissions.co2,
      continentCh4: continentData[0].emissions.ch4,

      // continent percentages
      countryToContinentCo2Percentage:
        continentPercentages.countryCo2Percentage,
      restOfContinentCo2Percentage:
        continentPercentages.restOfContinentCo2Percentage,
      countryToContinentCh4Percentage:
        continentPercentages.countryCh4Percentage,
      restOfContinentCh4Percentage:
        continentPercentages.restOfContinentCh4Percentage,
    };
    res.json(sendData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/sectors", async (req, res) => {
  try {
    let sectorData = [];
    for (const sector of sectors) {
      const sectorResponse = await axios.get(
        API_URL + selectedCountry.alpha3 + "&sectors=" + sector
      );
      sectorData.push({
        [sector]: sectorResponse.data[0].emissions,
      });
    }
    res.json(sectorData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
