export const getSummonerSpell = (spellNumber) => {
  switch (spellNumber) {
    case 21:
      return "SummonerBarrier";
    case 1:
      return "SummonerBoost";
    case 14:
      return "SummonerDot";
    case 3:
      return "SummonerExhaust";
    case 4:
      return "SummonerFlash";
    case 6:
      return "SummonerHaste";
    case 7:
      return "SummonerHeal";
    case 13:
      return "SummonerMana";
    case 30:
      return "SummonerPoroRecall";
    case 31:
      return "SummonerPoroThrow";
    case 11:
      return "SummonerSmite";
    case 39:
      return "SummonerSnowURFSnowball_Mark";
    case 32:
      return "SummonerSnowball";
    case 12:
      return "SummonerTeleport";
    case 2202:
      return "SummonerCherryFlash";
    case 2201:
      return "SummonerCherryHold";
    default:
      return "Unknown Spell"; // Jeśli nie znaleziono pasującego numeru
  }
};
