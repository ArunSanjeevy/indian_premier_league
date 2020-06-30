'use strict'

const team_name = {
  "sunrisers_hyderabad": "Sunrisers Hyderabad",
  "mumbai_indians": "Mumbai Indians", 
  "gujarat_lions":"Gujarat Lions",
  "pune_warriors": "Pune Warriors",
  "rising_pune_supergiants": "Rising Pune Supergiants",
  "kolkata_knight_riders":"Kolkata Knight Riders",
  "delhi_daredevils":"Delhi Daredevils",
  "chennai_super_kings":"Chennai Super Kings",
  "rajasthan_royals":"Rajasthan Royals",
  "deccan_chargers":"Deccan Chargers",
  "kochi_tuskers_kerala":"Kochi Tuskers Kerala",
  "delhi_capitals":"Delhi Capitals",
  "royal_challengers_bangalore": "Royal Challengers Bangalore",
  "kings_xi_punjab": "Kings XI Punjab"
}

const city = {
  "chennai": "Chennai",
  "mumbai": "Mumbai",
  "chandigarh": "Chandigarh",
  "gujarat": "Gujarat",
  "pune": "Pune",
  "kolkata": "Kolkata",
  "delhi": "Delhi",
  "rajasthan": "Rajasthan",
  "hyderabad": "Hyderabad",
  "kochi": "Kochi",
  "indore": "Indore",
  "raipur":"Raipur",
  "ranchi":"Ranchi",
  "abu_dhabi": "Abu Dhabi",
  "sharjah": "Sharjah",
  "mohali":"Mohali",
  "visakhapatnam":"Visakhapatnam",
  "johannesburg":"Johannesburg",
  "kimberley":"Kimberley",
  "bloemfontein":"Bloemfontein",
  "ahmedabad":"Ahmedabad",
  "cuttack":"Cuttack",
  "nagpur":"Nagpur",
  "dharamsala":"Dharamsala",
  "cape_town":"Cape Town",
  "port_elizabeth":"Port Elizabeth",
  "durban":"Durban",
  "centurion":"Centurion",
  "east_london":"East London",
  "bengaluru": "Bengaluru",
  "rajkot": "Rajkot",
  "kanpur": "Kanpur",
  "jaipur": "Jaipur",
  "punjab": "Punjab"
}  

const team_city =  {
  "sunrisers_hyderabad": city.hyderabad,
  "mumbai_indians": city.mumbai, 
  "gujarat_lions": city.gujarat,
  "kolkata_knight_riders": city.kolkata,
  "delhi_daredevils": city.delhi,
  "chennai_super_kings": city.chennai,
  "rajasthan_royals": city.rajasthan,
  "deccan_chargers": city.hyderabad,
  "kochi_tuskers_kerala": city.kochi,
  "pune_warriors": city.pune,
  "rising_pune_supergiants": city.pune,
  "delhi_capitals": city.delhi,
  "royal_challengers_bangalore": city.bengaluru,
  "kings_xi_punjab": city.punjab
}

const toss_decision = {
  "bat": "bat",
  "field": "field"
}


module.exports = {
  team_name, team_city, toss_decision, city
}