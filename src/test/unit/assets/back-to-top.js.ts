import sinon from 'sinon';

describe('Testing back to top button', () => {

  afterEach(() => {
    jest.resetModules();
    sinon.restore();
  })

  let interactionObserver;

  beforeAll(() => {
    interactionObserver = class IntersectionObserver {
      constructor() {}

      observe() {
        return null;
      }
    };
  })

  it('should remove the app-back-to-top--hidden property, when the InteractionObserver is not enabled', async () => {

    let mockElement = document.createElement('div');
    mockElement.classList.add('app-back-to-top--hidden')

    sinon.stub(document, 'querySelector').withArgs('#back-to-top-button').returns(mockElement);

    await import('../../../main/assets/js/back-to-top');

    expect(mockElement.classList.length).toEqual(0);
  })

  it('should keep the app-back-to-top--hidden property, when the InteractionObserver is enabled', async () => {

    let mockElement = document.createElement('div');
    mockElement.classList.add('app-back-to-top--hidden');

    (<any> window).IntersectionObserver = () => {};

    const stub = sinon.stub(document, 'querySelector');
    stub.withArgs('#back-to-top-button').returns(mockElement);
    stub.withArgs('.govuk-footer').returns(null);

    let interactionStub = sinon.spy(interactionObserver.prototype, 'observe');

    await import('../../../main/assets/js/back-to-top');

    expect(mockElement.classList.length).toEqual(1);
    expect(interactionStub.callCount).toEqual(0);
  })

  it('should call the observe function, when the footer exists and the InteractionObserver is enabled', async () => {

    let mockElement = document.createElement('div');
    mockElement.classList.add('app-back-to-top--hidden');

    let mockFooter = document.createElement('footer');
    mockFooter.classList.add('.govuk-footer');

    (<any> window).IntersectionObserver = interactionObserver;

    const stub = sinon.stub(document, 'querySelector');
    stub.withArgs('#back-to-top-button').returns(mockElement);
    stub.withArgs('.govuk-footer').returns(mockFooter);

    let interactionStub = sinon.spy(interactionObserver.prototype, 'observe');

    await import('../../../main/assets/js/back-to-top');

    expect(mockElement.classList.length).toEqual(1);
    expect(interactionStub.callCount).toEqual(1);
  })

});
