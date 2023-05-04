import Lean from '../src/components/LinkSDK/Lean';
import {config} from './fixtures/config';

describe('Lean class', () => {
  let lean = null;

  beforeAll(() => {
    lean = new Lean({
      appToken: config.appToken,
      env: 'production',
      country: 'ae',
      language: 'en',
      isSandbox: false,
      showLogs: false,
      version: 'latest',
      customization: null,
    });
  });

  // @TODO: Add complete test paths
  // Basic flow with required params
  // Flow with some extra params
  // Flow with all possible params

  it('returns the correct URL when connect() method is called', () => {
    const expectedUrl =
      'https://cdn.leantech.me/link/loader/prod/ae/latest/lean-sdk.html?implementation=webview-hosted-html&app_token=9fb9e934-9efb-4e7e-a508-de67c0839be0&sandbox=false&language=en&version=latest&country=ae&env=production&method=connect&customer_id=dda80d32-4062-404c-abe7-ba9b9290c873&permissions=identity&permissions=accounts&permissions=balance&permissions=transactions&permissions=payments';

    const initializationURL = lean.connect({
      customer_id: config.customerId,
      permissions: [
        'identity',
        'accounts',
        'balance',
        'transactions',
        'payments',
      ],
    });

    expect(initializationURL).toBe(expectedUrl);
  });
});
