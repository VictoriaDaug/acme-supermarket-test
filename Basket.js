class Basket {
    /**
     * Sample pricingRules:
     * {
     *   bogof: { 'FR1': true }
     *   bulk: { SR1: { discountedPrice: 4.50, discountQuantity: 3 } },
     * }
     */
    constructor(pricingRules = { bulk: {}, bogof: {} }, prices) {
      this.products = {};
      this.pricingRules = pricingRules;
      this.prices = prices || {
          FR1: 3.11,
          SR1: 5.00,
          CF1: 11.23,
      }
    }

    /**
     * Adds the productCode by quantity to project object
     * @param {String} productCode
     * @param {Int?} count
     */
    add(productCode, count = 1) {
      if (!this.prices[productCode]) {
        throw new Error('Product code not recognised.');
      }

      this.products[productCode] = (this.products[productCode] || 0) + count;
    }

    /**
     * Calculates the total price of the products in the products object
     */
    total() {
      let total = 0;

      for (let productCode in this.products) {
        const quantity = this.products[productCode];
        const price = this.getPrice(productCode, quantity);
        total += price;
      }

      // Get rid of floating point javascript error
      return this.round(total, 2);
    }


    getPrice(productCode, quantity) {
      if (this.pricingRules.bogof[productCode]) {
        return this.getBogofPriceTotal(productCode, quantity);
      }

      if (this.pricingRules.bulk[productCode]) {
        return this.getBulkPriceTotal(productCode, quantity);
      }

      return this.prices[productCode] * quantity;
    }

    /**
     * Calculates the total price and applies the bogof price if qualified
     * @param {String} productCode
     * @param {Int} quantity
     * @returns {Float} total price
     */
    getBogofPriceTotal(productCode, quantity) {
      if (!this.pricingRules.bogof[productCode]) {
        throw new Error(`Product ${productCode} does not qualify for bogof`);
      }
      const isOdd = quantity % 2;
      const price = this.prices[productCode];

      if (isOdd) {
        // Apply bogof discount to all products except the odd one
        const bogofQuantity = (quantity - 1) / 2;
        return (bogofQuantity * price) + price
      }

      return (quantity / 2) * price;
    }

    /**
     * Calculates the total price and applies the bulk price if qualified
     * @param {String} productCode
     * @param {Int} quantity
     * @returns {Float} total price
     */
    getBulkPriceTotal(productCode, quantity) {
      let price = this.prices[productCode];
      const { discountQuantity, discountedPrice } = this.pricingRules.bulk[productCode];

      // Use the bulk price discount if the quantity reached the threshold
      if (quantity >= discountQuantity) {
        price = discountedPrice;
      }
      return price * quantity;
    }

    /**
     * Rounds num to the given decimals
     * @param {Float} num
     * @param {Int} decimals
     * @returns {Float}
     * // TODO: add @see link
     */
    round(num, decimals) {
        return parseFloat(parseFloat(num).toFixed(decimals));
    }

}

module.exports = Basket;
