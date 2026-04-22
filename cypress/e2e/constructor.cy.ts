import * as orderFixture from '../fixtures/order.json';

const testURL = 'http://localhost:4000';
const dataCyBun = '[data-cy="bun"]';
const dataCyBunFirst = '[data-cy="bun"]:first-of-type';
const dataCyMain = '[data-cy="main"]';
const dataCySauce = '[data-cy="sauce"]';
const dataCyOrder = '[data-cy-order]';
const constructorList = '[data-cy="constructor-list"]';
const modal = '[data-cy="modal"]';

describe('Проверка интерфейса приложения', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });
    cy.visit(testURL);
  });

  it('Проверка ингредиентов', () => {
    cy.get(dataCyBun).should('have.length.at.least', 1);
    cy.get(`${dataCyMain}, ${dataCySauce}`).should('have.length.at.least', 1);
  });

  describe('Тест модальных окон', () => {
    it('Открытие и проверка модального окна ингредиента', () => {
      cy.get(dataCyBunFirst).then(($bun) => {
        const bunName = $bun.find('p').text().replace(/^\d+/, '').trim();

        cy.wrap($bun).click();

        cy.get(modal, { timeout: 10000 }).should('exist');
        cy.get(`${modal} h3`, { timeout: 10000 })
          .invoke('text')
          .then((text) => {
            expect(text).to.include(bunName);
          });

        cy.get(`${modal} button`).first().click();
        cy.get(modal).should('not.exist');
      });
    });
  });

  describe('Тест конструктора', () => {
    it('Добавление ингредиента в конструктор и проверка', () => {
      cy.get(dataCyMain).first().then(($main) => {
        const fullText = $main.find('p').text();
        const nameOnly = fullText.replace(/^\d+\s*/, '');

        cy.wrap($main).find('button').click();

        cy.get(constructorList, { timeout: 10000 })
          .should('exist')
          .and('contain.text', nameOnly);
      });
    });
  });

  describe('Оформление заказа', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'EXAMPLE_ACCESS_TOKEN');
      localStorage.setItem('refreshToken', 'EXAMPLE_REFRESH_TOKEN');
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });
      cy.intercept('GET', 'api/auth/user', { fixture: 'user' });
      cy.intercept('POST', 'api/orders', { fixture: 'order' });
      cy.visit(testURL);
    });

    it('Оформление заказа', () => {
      cy.get(dataCyOrder).should('be.disabled');
      cy.get(`${dataCyBunFirst} button`).click();
      cy.get(dataCyOrder).should('be.disabled');
      cy.get(`${dataCyMain}:first-of-type button`).click();
      cy.get(dataCyOrder).should('be.enabled');
      cy.get(dataCyOrder).click();

      cy.get(modal).should('exist');
      cy.get(`${modal} h2:first-of-type`).should('have.text', orderFixture.order.number);
      cy.get(dataCyOrder).should('be.disabled');
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  });
});
