const Basket = require("./basket");
const expect = require("chai").expect;

describe("Basket", () => {

    const FR1 = 'FR1';
    const SR1 = 'SR1';
    const CF1 = 'CF1';

    // BOGOF Fruit tea & 5 for £4.50 on Strawberries
    const pricingRules = {
        bogof: { 'FR1': true },
        bulk: {
          SR1: { discountedPrice: 4.50, discountQuantity: 3 }
        },
    };

    describe("basket.total", () => {
      it("should apply buy one get one discount on qualified products only", () => {
          let basket = new Basket(pricingRules);
          basket.add(FR1);
          basket.add(SR1);
          basket.add(FR1);
          basket.add(CF1);
          expect(basket.total()).to.be.equal(19.34);
      });

      it("should apply buy one get one discount to qualified products", () => {
          let basket = new Basket(pricingRules);
          basket.add(FR1);
          basket.add(FR1);
          expect(basket.total()).to.be.equal(3.11);
      });

      it("should not apply buy one get one discount to non-paired qualifying product", () => {
          let basket = new Basket(pricingRules);
          basket.add(FR1);
          basket.add(FR1);
          basket.add(FR1);
          expect(basket.total()).to.be.equal(6.22);
      });

      it("should apply bulk discount to qualifying products", () => {
          let basket = new Basket(pricingRules);
          basket.add(SR1);
          basket.add(SR1);
          basket.add(FR1);
          basket.add(SR1);
          expect(basket.total()).to.be.equal(16.61);
      });
    });

    describe("basket.add", () => {
      it("should throw an error if the product code is not recognised", () => {
        let basket = new Basket(pricingRules);
        expect(() => { basket.add('INVALID_PRODUCT_CODE') }).to.throw(/not recognised/);
      });

      it("should add items the number of times specified", () => {
          let basket = new Basket(pricingRules);
          basket.add(CF1, 5);
          expect(basket.total()).to.be.equal(56.15);
      });
    });

})
