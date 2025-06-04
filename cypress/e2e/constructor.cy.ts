import * as orderFixture from '../fixtures/order.json';

const testURL = 'http://localhost:4000';
const dataCyBun = '[data-cy="bun"]';
const dataCyBunFirst = '[data-cy="bun"]:first-of-type';
const dataCyMain = '[data-cy="main"]';
const dataCySauce = '[data-cy="sauce"]';
const dataCyOrder = '[data-cy-order]';
const constructorList = '[data-cy="constructor-list"]';
const modals = '#modals';

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
        const bunName = $bun.find('p').text();
        $bun.click();

        cy.get(modals).children().should('have.length', 2);
        cy.get(`${modals} h2`).should('contain.text', bunName);

        cy.get(`${modals} button:first-of-type`).click();
        cy.get(modals).children().should('have.length', 0);
      });
    });
  });

  describe('Тест конструктора', () => {
    it('Добавление ингредиента в конструктор и проверка', () => {
      cy.get(dataCyMain).first().then(($main) => {
        const mainName = $main.find('p').text();
        cy.get($main).find('button').click();

        cy.get(constructorList)
          .should('contain.text', mainName);
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

      cy.get(modals).children().should('have.length', 2);
      cy.get(`${modals} h2:first-of-type`).should('have.text', orderFixture.order.number);
      cy.get(dataCyOrder).should('be.disabled');
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  });
});
