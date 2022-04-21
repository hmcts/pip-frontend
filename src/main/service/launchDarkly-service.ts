import config from 'config';
import _ from 'lodash';

const LaunchDarkly = require('launchdarkly-node-server-sdk');
const ldKey: string = config.get('secrets.pip-ss-kv.LD_KEY') as string;
const ldClient = LaunchDarkly.init(ldKey);

interface LaunchDarklyIService {
  getVariation: ( flag: string, defaultReturn: boolean) => {};
}
export default class LaunchDarklyService implements LaunchDarklyIService {
  private static instance: LaunchDarklyService;

  public static getInstance(): LaunchDarklyService {
    if (!LaunchDarklyService.instance) {
      LaunchDarklyService.instance = new LaunchDarklyService();
    }
    return LaunchDarklyService.instance;
  }

  constructor() {
    this.init();
  }

  async init() {
    ldClient.on('ready', () => {
      return ldClient;
    });
  }

  async getVariation( flag: string, defaultReturn: boolean) {
    const username = 'pip-user';
    return ldClient.variation(flag, { key: username }, defaultReturn);
  }

  public static close() {
    ldClient.close();
  }
}
