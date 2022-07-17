export async function getServerConfig() {
  return {'useWebSocket':false,'startupMode':'public','logging':'dev'};
}

export function getRTCConfiguration() {
  let config = {};
  config.sdpSemantics = 'unified-plan';
  config.iceServers = [{ urls: ['stun:stun.l.google.com:19302'] }];
  return config;
}