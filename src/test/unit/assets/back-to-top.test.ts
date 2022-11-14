import sinon from 'sinon';

describe('Testing back to top button', () => {
  afterEach(() => {
    jest.resetModules();
    sinon.restore();
  });

  let interactionObserver;

  beforeAll(() => {
    interactionObserver = class IntersectionObserver {
      constructor() {
        return null;
      }

      observe(): any {
        return null;
      }
    };
  });

  it('always shows floating-back-to-top--fixed if footer is visible', async () => {
    const mockElement = document.createElement('div');
    mockElement.classList.add('floating-back-to-top--fixed');

    const mockFooter = document.createElement('footer');
    mockFooter.classList.add('.govuk-footer');

    const stub = sinon.stub(document, 'querySelector');
    stub.withArgs('#back-to-top-button').returns(mockElement);
    stub.withArgs('.govuk-footer').returns(mockFooter);

    sinon.stub(window, 'innerHeight').value(400);
    sinon.stub(mockFooter, 'getBoundingClientRect').returns({ top: '200' });

    await import('../../../main/bundles/alphabetical');

    expect(mockElement.classList.length).toEqual(1);
  });

  it('should add the floating-back-to-top--fixed if footer is visible, for InteractionObserver disabled browsers', async () => {
    const mockElement = document.createElement('div');

    const mockFooter = document.createElement('footer');
    mockFooter.classList.add('.govuk-footer');

    const stub = sinon.stub(document, 'querySelector');
    stub.withArgs('#back-to-top-button').returns(mockElement);
    stub.withArgs('.govuk-footer').returns(mockFooter);

    sinon.stub(window, 'innerHeight').value(0);
    sinon.stub(mockFooter, 'getBoundingClientRect').returns({ top: '200' });

    await import('../../../main/bundles/alphabetical');

    expect(mockElement.classList.length).toEqual(1);
  });

  it('should call the observe function, when the footer exists and the InteractionObserver is enabled', async () => {
    const mockElement = document.createElement('div');

    const mockFooter = document.createElement('footer');
    mockFooter.classList.add('.govuk-footer');

    (window as any).IntersectionObserver = interactionObserver;

    const stub = sinon.stub(document, 'querySelector');
    stub.withArgs('#back-to-top-button').returns(mockElement);
    stub.withArgs('.govuk-footer').returns(mockFooter);

    const interactionStub = sinon.spy(interactionObserver.prototype, 'observe');

    await import('../../../main/bundles/alphabetical');

    expect(interactionStub.callCount).toEqual(1);
  });

  it('should add the floating back to top element if the footer is not intersecting', async () => {
    const mockElement = document.createElement('div');

    const mockFooter = document.createElement('footer');
    mockFooter.classList.add('.govuk-footer');

    (window as any).IntersectionObserver = interactionObserver;

    const stub = sinon.stub(document, 'querySelector');
    stub.withArgs('#back-to-top-button').returns(mockElement);
    stub.withArgs('.govuk-footer').returns(mockFooter);

    const constructorSpy = sinon.spy(window, 'IntersectionObserver');

    await import('../../../main/bundles/alphabetical');

    const returnedFunction = constructorSpy.getCall(0).args[0];

    const entries = [{ target: mockFooter, isIntersecting: false }];
    returnedFunction(entries);
    expect(mockElement.classList.length).toEqual(1);
    expect(mockElement.classList.item(0)).toEqual('floating-back-to-top--fixed');
  });

  it('should not remove the floating back to top element if the footer is intersecting', async () => {
    const mockElement = document.createElement('div');
    mockElement.classList.add('floating-back-to-top--fixed');

    const mockFooter = document.createElement('footer');
    mockFooter.classList.add('.govuk-footer');

    (window as any).IntersectionObserver = interactionObserver;

    const stub = sinon.stub(document, 'querySelector');
    stub.withArgs('#back-to-top-button').returns(mockElement);
    stub.withArgs('.govuk-footer').returns(mockFooter);

    const constructorSpy = sinon.spy(window, 'IntersectionObserver');

    await import('../../../main/bundles/alphabetical');

    const returnedFunction = constructorSpy.getCall(0).args[0];

    const entries = [{ target: mockFooter, isIntersecting: true }];
    returnedFunction(entries);
    expect(mockElement.classList.length).toEqual(1);
  });
});
