// Each object is one flight leg.
// type: "pic" for flights you flew, "commercial" for airline flights.

window.flightLegs = [
  // --- PIC / training flights ---
  {
    origin: "KOEO",
    originName: "L O Simenstad Municipal Airport",
    originLat: 45.3086,
    originLng: -92.6903,

    dest: "KEAU",
    destName: "Eau Claire Regional Airport",
    destLat: 44.8658,
    destLng: -91.4843,

    date: "2019-9-14",
    type: "pic",
    notes: "N149AC"
  },
  {
    origin: "KEAU",
    originName: "Eau Claire Regional Airport",
    originLat: 44.8658,
    originLng: -91.4843,

    dest: "KOEO",
    destName: "L O Simenstad Municipal Airport",
    destLat: 45.3086,
    destLng: -92.6903,

    date: "2019-9-14",
    type: "pic"
  },
  {
    origin: "KEAU",
    originName: "Eau Claire Regional Airport",
    originLat: 44.8658,
    originLng: -91.4843,

    dest: "KOEO",
    destName: "L O Simenstad Municipal Airport",
    destLat: 45.3086,
    destLng: -92.6903,

    date: "2019-9-14",
    type: "pic",
    notes: "N149AC"
  },
  {
    origin: "KOEO",
    originName: "L O Simenstad Municipal Airport",
    originLat: 45.3086,
    originLng: -92.6903,

    dest: "KSSQ",
    destName: "Shell Lake Airport",
    destLat: 45.7422,
    destLng: -91.9205,

    date: "2019-10-20",
    type: "pic",
    notes: "N149AC"
  },
  {
    origin: "KSSQ",
    originName: "Shell Lake Airport",
    originLat: 45.7422,
    originLng: -91.9205,

    dest: "KOEO",
    destName: "L O Simenstad Municipal Airport",
    destLat: 45.3086,
    destLng: -92.6903,

    date: "2019-10-20",
    type: "pic",
    notes: "N149AC"
  },
  {
    origin: "KOEO",
    originName: "L O Simenstad Municipal Airport",
    originLat: 45.3086,
    originLng: -92.6903,

    dest: "KSYN",
    destName: "Stanton Airfield",
    destLat: 44.4692,
    destLng: -93.0164,

    date: "2019-11-23",
    type: "pic",
    notes: "N149AC"
  },
  {
    origin: "KSYN",
    originName: "Stanton Airfield",
    originLat: 44.4692,
    originLng: -93.0164,

    dest: "KOEO",
    destName: "L O Simenstad Municipal Airport",
    destLat: 45.3086,
    destLng: -92.6903,

    date: "2019-11-23",
    type: "pic",
    notes: "N149AC"
  },
  {
    origin: "KOEO",
    originLat: 45.3093,
    originLng: -92.6901,

    dest: "KSTC",
    destLat: 45.5466,
    destLng: -94.0599,

    date: "2026-02-13",
    type: "pic",
    notes: "N5601A"
  },
  {
    origin: "KSTC",
    originLat: 45.5466,
    originLng: -94.0599,

    dest: "KOEO",
    destLat: 45.3093,
    destLng: -92.6901,

    date: "2026-02-13",
    type: "pic",
    notes: "N5601A"
  },
  {
    origin: "KOEO",
    originName: "L O Simenstad Municipal Airport",
    originLat: 45.3086,
    originLng: -92.6903,

    dest: "KSTP",
    destName: "St. Peter Regional Airport",
    destLat: 44.2661,
    destLng: -93.4833,

    date: "2026-03-20",
    type: "pic",
    notes: "N5601A"
  },
  {
    origin: "KSTP",
    originName: "St. Peter Regional Airport",
    originLat: 44.2661,
    originLng: -93.4833,

    dest: "KANE",
    destName: "Anoka County-Blaine Airport",
    destLat: 45.2089,
    destLng: -93.2167,

    date: "2026-03-20",
    type: "pic",
    notes: "N5601A"
  },
  {
    origin: "KANE",
    originName: "Anoka County-Blaine Airport",
    originLat: 45.2089,
    originLng: -93.2167,

    dest: "KOEO",
    destName: "L O Simenstad Municipal Airport",
    destLat: 45.3086,
    destLng: -92.6903,

    date: "2026-03-20",
    type: "pic",
    notes: "N5601A"
  },


  // --- Commercial flights ---

  // 23 Aug 2014 – MSP ↔ DCA via ATL / MKE (AirTran)
  {
    origin: "KMSP",
    originName: "Minneapolis–Saint Paul International Airport",
    originLat: 44.8820,
    originLng: -93.2218,

    dest: "KATL",
    destName: "Hartsfield–Jackson Atlanta International Airport",
    destLat: 33.6404,
    destLng: -84.4199,

    date: "2014-08-23",
    type: "commercial",
    notes: "AirTran"
  },
  {
    origin: "KATL",
    originName: "Hartsfield–Jackson Atlanta International Airport",
    originLat: 33.6404,
    originLng: -84.4199,

    dest: "KDCA",
    destName: "Ronald Reagan Washington National Airport",
    destLat: 38.8514,
    destLng: -77.0377,

    date: "2014-08-23",
    type: "commercial",
    notes: "AirTran"
  },
  {
    origin: "KDCA",
    originName: "Ronald Reagan Washington National Airport",
    originLat: 38.8514,
    originLng: -77.0377,

    dest: "KMKE",
    destName: "Milwaukee Mitchell International Airport",
    destLat: 42.9469,
    destLng: -87.9022,

    date: "2014-08-23",
    type: "commercial",
    notes: "AirTran"
  },
  {
    origin: "KMKE",
    originName: "Milwaukee Mitchell International Airport",
    originLat: 42.9469,
    originLng: -87.9022,

    dest: "KMSP",
    destName: "Minneapolis–Saint Paul International Airport",
    destLat: 44.8820,
    destLng: -93.2218,

    date: "2014-08-23",
    type: "commercial",
    notes: "AirTran"
  },

  // Summer 2016 – MSP ↔ SFO
  {
    origin: "KMSP",
    originName: "Minneapolis–Saint Paul International Airport",
    originLat: 44.8820,
    originLng: -93.2218,

    dest: "KSFO",
    destName: "San Francisco International Airport",
    destLat: 37.6188,
    destLng: -122.3754,

    date: "2016-07-10",
    type: "commercial"
  },
  {
    origin: "KSFO",
    originName: "San Francisco International Airport",
    originLat: 37.6188,
    originLng: -122.3754,

    dest: "KMSP",
    destName: "Minneapolis–Saint Paul International Airport",
    destLat: 44.8820,
    destLng: -93.2218,

    date: "2016-07-20",
    type: "commercial"
  },

  // 28 Jun – 7 Jul 2018 – MSP → SAN, SFO → MSP
  {
    origin: "KMSP",
    originName: "Minneapolis–Saint Paul International Airport",
    originLat: 44.8820,
    originLng: -93.2218,

    dest: "KSAN",
    destName: "San Diego International Airport",
    destLat: 32.7336,
    destLng: -117.1897,

    date: "2018-06-28",
    type: "commercial"
  },
  {
    origin: "KSFO",
    originName: "San Francisco International Airport",
    originLat: 37.6188,
    originLng: -122.3754,

    dest: "KMSP",
    destName: "Minneapolis–Saint Paul International Airport",
    destLat: 44.8820,
    destLng: -93.2218,

    date: "2018-07-07",
    type: "commercial"
  },

  // Summer 2019 – MSP ↔ JFK
  {
    origin: "KMSP",
    originName: "Minneapolis–Saint Paul International Airport",
    originLat: 44.8820,
    originLng: -93.2218,

    dest: "KJFK",
    destName: "John F. Kennedy International Airport",
    destLat: 40.6418,
    destLng: -73.7810,

    date: "2019-07-05",
    type: "commercial"
  },
  {
    origin: "KJFK",
    originName: "John F. Kennedy International Airport",
    originLat: 40.6418,
    originLng: -73.7810,

    dest: "KMSP",
    destName: "Minneapolis–Saint Paul International Airport",
    destLat: 44.8820,
    destLng: -93.2218,

    date: "2019-07-15",
    type: "commercial"
  },

  // Nov 2019 – Africa trip
  {
    origin: "KMSP",
    originName: "Minneapolis–Saint Paul International Airport",
    originLat: 44.8820,
    originLng: -93.2218,

    dest: "EHAM",
    destName: "Amsterdam Airport Schiphol",
    destLat: 52.3081,
    destLng: 4.7642,

    date: "2019-11-10",
    type: "commercial"
  },
  {
    origin: "EHAM",
    originName: "Amsterdam Airport Schiphol",
    originLat: 52.3081,
    originLng: 4.7642,

    dest: "KGGL",
    destName: "Kigali International Airport",
    destLat: -1.9686,
    destLng: 30.1395,

    date: "2019-11-10",
    type: "commercial"
  },
  {
    origin: "KGGL",
    originName: "Kigali International Airport",
    originLat: -1.9686,
    originLng: 30.1395,

    dest: "KEBB",
    destName: "Entebbe International Airport",
    destLat: 0.0424,
    destLng: 32.4435,

    date: "2019-11-10",
    type: "commercial"
  },

  // 17 Nov – Entebbe → Nairobi Intl
  {
    origin: "KEBB",
    originName: "Entebbe International Airport",
    originLat: 0.0424,
    originLng: 32.4435,

    dest: "KNBO",
    destName: "Jomo Kenyatta International Airport",
    destLat: -1.3337,
    destLng: 36.9271,

    date: "2019-11-17",
    type: "commercial"
  },

  // 18 & 22 Nov – Wilson ↔ Masai Mara strip
  {
    origin: "KWIL",
    originName: "Nairobi Wilson Airport",
    originLat: -1.3217,
    originLng: 36.8148,

    dest: "KMRE",
    destName: "Masai Mara – Mara Serena Airstrip",
    destLat: -1.4050,
    destLng: 35.0100,

    date: "2019-11-18",
    type: "commercial"
  },
  {
    origin: "KMRE",
    originName: "Masai Mara – Mara Serena Airstrip",
    originLat: -1.4050,
    originLng: 35.0100,

    dest: "KWIL",
    destName: "Nairobi Wilson Airport",
    destLat: -1.3217,
    destLng: 36.8148,

    date: "2019-11-22",
    type: "commercial"
  },

  // 23 Nov – Nairobi Intl → AMS → MSP
  {
    origin: "KNBO",
    originName: "Jomo Kenyatta International Airport",
    originLat: -1.3337,
    originLng: 36.9271,

    dest: "EHAM",
    destName: "Amsterdam Airport Schiphol",
    destLat: 52.3081,
    destLng: 4.7642,

    date: "2019-11-23",
    type: "commercial"
  },
  {
    origin: "EHAM",
    originName: "Amsterdam Airport Schiphol",
    originLat: 52.3081,
    originLng: 4.7642,

    dest: "KMSP",
    destName: "Minneapolis–Saint Paul International Airport",
    destLat: 44.8820,
    destLng: -93.2218,

    date: "2019-11-23",
    type: "commercial"
  },

  // 31 Mar – 4 Apr 2021 – Fort Myers
  {
    origin: "KMSP",
    originName: "Minneapolis–Saint Paul International Airport",
    originLat: 44.8820,
    originLng: -93.2218,

    dest: "KRSW",
    destName: "Southwest Florida International Airport",
    destLat: 26.5362,
    destLng: -81.7552,

    date: "2021-03-31",
    type: "commercial"
  },
  {
    origin: "KRSW",
    originName: "Southwest Florida International Airport",
    originLat: 26.5362,
    originLng: -81.7552,

    dest: "KMSP",
    destName: "Minneapolis–Saint Paul International Airport",
    destLat: 44.8820,
    destLng: -93.2218,

    date: "2021-04-04",
    type: "commercial"
  },

  // 13–20 Apr 2022 – Tampa
  {
    origin: "KMSP",
    originName: "Minneapolis–Saint Paul International Airport",
    originLat: 44.8820,
    originLng: -93.2218,

    dest: "KTPA",
    destName: "Tampa International Airport",
    destLat: 27.9792,
    destLng: -82.5393,

    date: "2022-04-13",
    type: "commercial"
  },
  {
    origin: "KTPA",
    originName: "Tampa International Airport",
    originLat: 27.9792,
    originLng: -82.5393,

    dest: "KMSP",
    destName: "Minneapolis–Saint Paul International Airport",
    destLat: 44.8820,
    destLng: -93.2218,

    date: "2022-04-20",
    type: "commercial"
  },

  // 25–31 Dec 2023 – Cancún
  {
    origin: "KMSP",
    originName: "Minneapolis–Saint Paul International Airport",
    originLat: 44.8820,
    originLng: -93.2218,

    dest: "MMUN",
    destName: "Cancún International Airport",
    destLat: 21.0390,
    destLng: -86.8740,

    date: "2023-12-25",
    type: "commercial"
  },
  {
    origin: "MMUN",
    originName: "Cancún International Airport",
    originLat: 21.0390,
    originLng: -86.8740,

    dest: "KMSP",
    destName: "Minneapolis–Saint Paul International Airport",
    destLat: 44.8820,
    destLng: -93.2218,

    date: "2023-12-31",
    type: "commercial"
  },

  // 6 Mar 2026 – MSP ↔ SFO
  {
    origin: "KMSP",
    originName: "Minneapolis–Saint Paul International Airport",
    originLat: 44.8820,
    originLng: -93.2218,

    dest: "KSFO",
    destName: "San Francisco International Airport",
    destLat: 37.6188,
    destLng: -122.3754,

    date: "2026-03-06",
    type: "commercial"
  },
  {
    origin: "KSFO",
    originName: "San Francisco International Airport",
    originLat: 37.6188,
    originLng: -122.3754,

    dest: "KMSP",
    destName: "Minneapolis–Saint Paul International Airport",
    destLat: 44.8820,
    destLng: -93.2218,

    date: "2026-03-08",
    type: "commercial"
  },

  // 6–10 Mar 2024 – Nashville
  {
    origin: "KMSP",
    originName: "Minneapolis–Saint Paul International Airport",
    originLat: 44.8820,
    originLng: -93.2218,

    dest: "KBNA",
    destName: "Nashville International Airport",
    destLat: 36.1317,
    destLng: -86.6688,

    date: "2024-03-06",
    type: "commercial"
  },
  {
    origin: "KBNA",
    originName: "Nashville International Airport",
    originLat: 36.1317,
    destLng: -86.6688,

    dest: "KMSP",
    destName: "Minneapolis–Saint Paul International Airport",
    destLat: 44.8820,
    destLng: -93.2218,

    date: "2024-03-10",
    type: "commercial"
  },

  // 25–31 Dec 2024 – Cancún
  {
    origin: "KMSP",
    originName: "Minneapolis–Saint Paul International Airport",
    originLat: 44.8820,
    originLng: -93.2218,

    dest: "MMUN",
    destName: "Cancún International Airport",
    destLat: 21.0390,
    destLng: -86.8740,

    date: "2024-12-25",
    type: "commercial"
  },
  {
    origin: "MMUN",
    originName: "Cancún International Airport",
    originLat: 21.0390,
    originLng: -86.8740,

    dest: "KMSP",
    destName: "Minneapolis–Saint Paul International Airport",
    destLat: 44.8820,
    destLng: -93.2218,

    date: "2024-12-31",
    type: "commercial"
  },

  // 5–8 Jun 2025 – Dulles
  {
    origin: "KMSP",
    originName: "Minneapolis–Saint Paul International Airport",
    originLat: 44.8820,
    originLng: -93.2218,

    dest: "KIAD",
    destName: "Washington Dulles International Airport",
    destLat: 38.9519,
    destLng: -77.4481,

    date: "2025-06-05",
    type: "commercial"
  },
  {
    origin: "KIAD",
    originName: "Washington Dulles International Airport",
    originLat: 38.9519,
    originLng: -77.4481,

    dest: "KMSP",
    destName: "Minneapolis–Saint Paul International Airport",
    destLat: 44.8820,
    destLng: -93.2218,

    date: "2025-06-08",
    type: "commercial"
  },

  // 17–29 Jul 2025 – MSP → JFK → MAN, LHR → MSP
  {
    origin: "KMSP",
    originName: "Minneapolis–Saint Paul International Airport",
    originLat: 44.8820,
    originLng: -93.2218,

    dest: "KJFK",
    destName: "John F. Kennedy International Airport",
    destLat: 40.6418,
    destLng: -73.7810,

    date: "2025-07-17",
    type: "commercial"
  },
  {
    origin: "KJFK",
    originName: "John F. Kennedy International Airport",
    originLat: 40.6418,
    originLng: -73.7810,

    dest: "EGCC",
    destName: "Manchester Airport",
    destLat: 53.3494,
    destLng: -2.2795,

    date: "2025-07-17",
    type: "commercial"
  },
  {
    origin: "EGLL",
    originName: "London Heathrow Airport",
    originLat: 51.4700,
    originLng: -0.4543,

    dest: "KMSP",
    destName: "Minneapolis–Saint Paul International Airport",
    destLat: 44.8820,
    destLng: -93.2218,

    date: "2025-07-29",
    type: "commercial"
  },

  // 16–20 Aug 2025 – MSP → PHL → SCE → PHL → MSP
  {
    origin: "KMSP",
    originName: "Minneapolis–Saint Paul International Airport",
    originLat: 44.8820,
    originLng: -93.2218,

    dest: "KPHL",
    destName: "Philadelphia International Airport",
    destLat: 39.8729,
    destLng: -75.2440,

    date: "2025-08-16",
    type: "commercial"
  },
  {
    origin: "KPHL",
    originName: "Philadelphia International Airport",
    originLat: 39.8729,
    originLng: -75.2440,

    dest: "KUNV",
    destName: "University Park Airport",
    destLat: 40.8493,
    destLng: -77.8487,

    date: "2025-08-16",
    type: "commercial"
  },
  {
    origin: "KUNV",
    originName: "University Park Airport",
    originLat: 40.8493,
    originLng: -77.8487,

    dest: "KPHL",
    destName: "Philadelphia International Airport",
    destLat: 39.8729,
    destLng: -75.2440,

    date: "2025-08-20",
    type: "commercial"
  },
  {
    origin: "KPHL",
    originName: "Philadelphia International Airport",
    originLat: 39.8729,
    originLng: -75.2440,

    dest: "KMSP",
    destName: "Minneapolis–Saint Paul International Airport",
    destLat: 44.8820,
    destLng: -93.2218,

    date: "2025-08-20",
    type: "commercial"
  },

  // 28 Aug – 1 Sep 2025 – MSP ↔ LGA
  {
    origin: "KMSP",
    originName: "Minneapolis–Saint Paul International Airport",
    originLat: 44.8820,
    originLng: -93.2218,

    dest: "KLGA",
    destName: "LaGuardia Airport",
    destLat: 40.7772,
    destLng: -73.8726,

    date: "2025-08-28",
    type: "commercial"
  },
  {
    origin: "KLGA",
    originName: "LaGuardia Airport",
    originLat: 40.7772,
    originLng: -73.8726,

    dest: "KMSP",
    destName: "Minneapolis–Saint Paul International Airport",
    destLat: 44.8820,
    destLng: -93.2218,

    date: "2025-09-01",
    type: "commercial"
  },

  // Placeholder routes (undated)
  {
    origin: "KMSP",
    originName: "Minneapolis–Saint Paul International Airport",
    originLat: 44.8820,
    originLng: -93.2218,

    dest: "KDFW",
    destName: "Dallas/Fort Worth International Airport",
    destLat: 32.8998,
    destLng: -97.0403,

    date: "2000-01-01",
    type: "commercial"
  },
  {
    origin: "KSAT",
    originName: "San Antonio International Airport",
    originLat: 29.5337,
    originLng: -98.4698,

    dest: "KMSP",
    destName: "Minneapolis–Saint Paul International Airport",
    destLat: 44.8820,
    destLng: -93.2218,

    date: "2000-01-01",
    type: "commercial"
  },
  {
    origin: "KMSP",
    originName: "Minneapolis–Saint Paul International Airport",
    originLat: 44.8820,
    originLng: -93.2218,

    dest: "KSEA",
    destName: "Seattle–Tacoma International Airport",
    destLat: 47.4502,
    destLng: -122.3088,

    date: "2000-01-01",
    type: "commercial"
  },
  {
    origin: "KSEA",
    originName: "Seattle–Tacoma International Airport",
    originLat: 47.4502,
    originLng: -122.3088,

    dest: "KMSP",
    destName: "Minneapolis–Saint Paul International Airport",
    destLat: 44.8820,
    destLng: -93.2218,

    date: "2000-01-01",
    type: "commercial"
  },
  {
    origin: "KMSP",
    originName: "Minneapolis–Saint Paul International Airport",
    originLat: 44.8820,
    originLng: -93.2218,

    dest: "KRDU",
    destName: "Raleigh–Durham International Airport",
    destLat: 35.8776,
    destLng: -78.7875,

    date: "2000-01-01",
    type: "commercial"
  },
  {
    origin: "KRDU",
    originName: "Raleigh–Durham International Airport",
    originLat: 35.8776,
    originLng: -78.7875,

    dest: "KMSP",
    destName: "Minneapolis–Saint Paul International Airport",
    destLat: 44.8820,
    destLng: -93.2218,

    date: "2000-01-01",
    type: "commercial"
  },
  {
    origin: "KMSP",
    originName: "Minneapolis–Saint Paul International Airport",
    originLat: 44.8820,
    originLng: -93.2218,

    dest: "TJSJ",
    destName: "Luis Muñoz Marín International Airport (San Juan)",
    destLat: 18.4394,
    destLng: -66.0010,

    date: "2000-01-01",
    type: "commercial"
  },
  {
    origin: "TJSJ",
    originName: "Luis Muñoz Marín International Airport (San Juan)",
    originLat: 18.4394,
    originLng: -66.0010,

    dest: "KMSP",
    destName: "Minneapolis–Saint Paul International Airport",
    destLat: 44.8820,
    destLng: -93.2218,

    date: "2000-01-01",
    type: "commercial"
  },
  {
    origin: "KMSP",
    originName: "Minneapolis–Saint Paul International Airport",
    originLat: 44.8820,
    originLng: -93.2218,

    dest: "KDTW",
    destName: "Detroit Metropolitan Wayne County Airport",
    destLat: 42.2162,
    destLng: -83.3554,

    date: "2026-01-01",
    type: "commercial"
  },
  {
    origin: "KDTW",
    originName: "Detroit Metropolitan Wayne County Airport",
    originLat: 42.2162,
    originLng: -83.3554,

    dest: "KRIC",
    destName: "Richmond International Airport",
    destLat: 37.5052,
    destLng: -77.3197,

    date: "2026-01-01",
    type: "commercial"
  }

];
