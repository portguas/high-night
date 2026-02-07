export const TrackEvents = {
  // Page Views
  PAGE_VIEW_HOME: 'page_view_home',
  PAGE_VIEW_CROCODILE: 'page_view_crocodile',
  PAGE_VIEW_DICE: 'page_view_dice',
  PAGE_VIEW_RPS: 'page_view_rps',
  PAGE_VIEW_TRUTH: 'page_view_truth',
  PAGE_VIEW_SETTINGS: 'page_view_settings',

  // Home Interactions
  HOME_CLICK_GAME: 'home_click_game', // param: game_title
  HOME_CLICK_SETTINGS: 'home_click_settings',

  // Crocodile Interactions
  CROCODILE_CLICK_TOOTH: 'crocodile_click_tooth', // param: tooth_id, is_bad
  CROCODILE_CLICK_RESET: 'crocodile_click_reset',
  CROCODILE_GAME_OVER: 'crocodile_game_over',

  // Dice Interactions
  DICE_CLICK_SHAKE: 'dice_click_shake',
  DICE_CLICK_SELECTOR: 'dice_click_selector', // Open dice count selector
  DICE_SELECT_COUNT: 'dice_select_count', // param: count
  DICE_SHAKE_RESULT: 'dice_shake_result', // param: total_points

  // RPS Interactions
  RPS_CLICK_START: 'rps_click_start',
  RPS_CLICK_PUNCH: 'rps_click_punch', // param: role (user/opponent)
  RPS_GAME_RESULT: 'rps_game_result', // param: winner, mode
  RPS_CLICK_NEXT: 'rps_click_next',
  RPS_CHANGE_MODE: 'rps_change_mode', // param: mode

  // Truth Interactions
  TRUTH_CLICK_TRUTH: 'truth_click_truth',
  TRUTH_CLICK_DARE: 'truth_click_dare',
  TRUTH_CHANGE_MODE: 'truth_change_mode', // param: mode

  // Settings Interactions
  SETTINGS_TOGGLE_SOUND: 'settings_toggle_sound', // param: enabled
  SETTINGS_TOGGLE_HAPTIC: 'settings_toggle_haptic', // param: enabled
  SETTINGS_CLEAR_CACHE: 'settings_clear_cache'
} as const;
