export const modelMap: Record<string, string> = {
  kei:"/models/kei_vowels_pro/kei_vowels_pro.model3.json",
  mao: "/models/mao_pro/mao_pro.model3.json",
  hiyori: "/models/hiyori_pro_en/hiyori_pro_t11.model3.json",
};

export const MaomotionList: Record<string, string[]> = {
  "Idle": ["mtn_01.motion3"],
  "": ["mtn_02.motion3", "mtn_03.motion3", "mtn_04.motion3", "special_01.motion3", "special_02.motion3", "special_03.motion3"],
}

export const HiyorimotionList: Record<string, string[]> = {
  "Idle": ["hiyori_m01.motion3.json", "hiyori_m02.motion3.json", "hiyori_m05.motion3.json"],
  "Flick": ["hiyori_m03.motion3.json"],
  "FlickDown": ["hiyori_m04.motion3.json"],
  "FlickUp": ["hiyori_m06.motion3.json"],
  "Tap": ["hiyori_m07.motion3.json", "hiyori_m08.motion3.json"],
  "Tap@Body": ["hiyori_m09.motion3.json"],
  "Flick@Body": ["hiyori_m10.motion3.json"],
}
