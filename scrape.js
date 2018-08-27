const fs = require("fs");
const axios = require("axios");
const Promise = require("bluebird");
const _ = require("lodash");
const API_BASE =
  "https://www.easports.com/madden-nfl/ratings/service/data?entityType=madden19_player&limit=160&";

let params = ["offset=0", "filter=iteration:1"];
const total = 2367;
const limit = 160;
const pages = Math.round(Math.max(total / limit));
let master = [];

const getRatings = () => {
  let page = 1;
  const ratings = Promise.coroutine(function* getRatings() {
    let results = yield getPage(page);
    master.push(results);
    while (page <= pages && results) {
      results = yield getPage(page);
      master.push(results);
      page += 1;
    }
    return master;
  });
  return ratings().then(r => r);
};

async function getPage(page) {
  params[0] = "offset=" + (page - 1) * limit;
  const res = await axios({
    url: API_BASE + params.join("&"),
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest"
    },
    data: params
  });
  return res.data.docs;
}

getRatings()
  .then(r => {
    fs.writeFile(
      "database/raw/players.json",
      JSON.stringify(
        _.flattenDeep(r).map(p => {
          return {
            first_name: p.firstName,
            last_name: p.lastName,
            position: p.position,
            team_id: p.teamId,
            overall: p.overall,
            height: p.height,
            weight: p.weight,
            age: p.age,
            player_handedness: p.plyrHandedness,
            college: p.college,
            speed: p.speed_rating,
            acceleration: p.acceleration_rating,
            trucking: p.trucking_rating,
            catching: p.catching_rating,
            break_tackle: p.breakTackle_rating,
            jumping: p.jumping_rating,
            bc_vision: p.bCVision_rating,
            stiff_arm: p.stiffArm_rating,
            carrying: p.carrying_rating,
            agility: p.agility_rating,
            juke_move: p.elusiveness_rating,
            elusiveness: p.jukeMove_rating,
            spin_move: p.spinMove_rating,
            awareness: p.awareness_rating,
            throw_power: p.throwPower_rating,
            kick_return: p.kickReturn_rating,
            lead_block: p.leadBlock_rating,
            strength: p.strength_rating,
            play_action: p.playAction_rating,
            pursuit: p.pursuit_rating,
            catch_in_traffic: p.catchInTraffic_rating,
            spectacular_catch: p.spectacularCatch_rating,
            short_route_running: p.shortRouteRunning_rating,
            medium_route_running: p.mediumRouteRunning_rating,
            deep_route_running: p.deepRouteRunning_rating,
            finesse_moves: p.finesseMoves_rating,
            power_moves: p.powerMoves_rating,
            run_block: p.runBlock_rating,
            tackle: p.tackle_rating,
            injury: p.injury_rating,
            short_throw_accuracy: p.throwAccuracyShort_rating,
            mid_throw_accuracy: p.throwAccuracyMid_rating,
            deep_throw_accuracy: p.throwAccuracyDeep_rating,
            throw_under_pressure: p.throwUnderPressure_rating,
            play_recognition: p.playRecognition_rating,
            break_sack: p.breakSack_rating,
            run_block_power: p.runBlockPower_rating,
            toughness: p.toughness_rating,
            throw_on_the_run: p.throwOnTheRun_rating,
            man_coverage: p.manCoverage_rating,
            zone_coverage: p.zoneCoverage_rating,
            release: p.release_rating,
            hit_power: p.hitPower_rating,
            kick_accuracy: p.kickAccuracy_rating,
            pass_block_pwr: p.passBlockPower_rating,
            impact_blocking: p.impactBlocking_rating,
            stamina: p.stamina_rating,
            kick_power: p.kickPower_rating,
            pass_block: p.passBlock_rating,
            press: p.press_rating,
            block_sheddig: p.blockShedding_rating,
            run_block_finesse: p.runBlockFinesse_rating,
            pass_block_finess: p.passBlockFinesse_rating,
            jersey: p.jerseyNum
          };
        })
      ),
      "utf-8",
      (err, data) => {
        console.log("Thus it was written");
      }
    );
  })
  .catch(console.error);
